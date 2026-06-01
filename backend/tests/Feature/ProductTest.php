<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array{0: User, 1: Business}
     */
    private function userWithBusiness(): array
    {
        $user = User::factory()->create();
        $business = Business::create(['owner_id' => $user->id, 'name' => 'Toko A']);
        $business->members()->attach($user->id, ['role' => 'owner']);

        return [$user, $business];
    }

    public function test_index_lists_only_own_products(): void
    {
        [$userA, $businessA] = $this->userWithBusiness();
        [, $businessB] = $this->userWithBusiness();
        Product::factory()->for($businessA)->create(['name' => 'Produk A']);
        Product::factory()->for($businessB)->create(['name' => 'Produk B']);

        $this->actingAs($userA)
            ->getJson('/api/products')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Produk A');
    }

    public function test_store_creates_product_with_margin(): void
    {
        [$user, $business] = $this->userWithBusiness();

        $this->actingAs($user)
            ->postJson('/api/products', [
                'name' => 'Brownies Coklat',
                'type' => 'product',
                'price' => 45000,
                'cost_price' => 30000,
                'stock' => 10,
                'minimum_stock' => 5,
                'unit' => 'pcs',
            ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Brownies Coklat')
            ->assertJsonPath('data.margin', 15000)
            ->assertJsonPath('data.is_low_stock', false);

        $this->assertDatabaseHas('products', [
            'name' => 'Brownies Coklat',
            'business_id' => $business->id,
        ]);
    }

    public function test_store_service_ignores_stock_fields(): void
    {
        [$user] = $this->userWithBusiness();

        $this->actingAs($user)
            ->postJson('/api/products', [
                'name' => 'Cuci Kiloan',
                'type' => 'service',
                'price' => 7000,
                'stock' => 99,
                'minimum_stock' => 10,
            ])
            ->assertCreated()
            ->assertJsonPath('data.stock', null)
            ->assertJsonPath('data.minimum_stock', null)
            ->assertJsonPath('data.is_low_stock', false);
    }

    public function test_store_requires_name_and_price(): void
    {
        [$user] = $this->userWithBusiness();

        $this->actingAs($user)
            ->postJson('/api/products', ['type' => 'product'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'price']);
    }

    public function test_low_stock_endpoint_returns_products_at_or_below_minimum(): void
    {
        [$user, $business] = $this->userWithBusiness();
        Product::factory()->for($business)->lowStock()->create(['name' => 'Habis']);
        Product::factory()->for($business)->create(['name' => 'Aman', 'stock' => 50, 'minimum_stock' => 5]);
        Product::factory()->for($business)->service()->create(['name' => 'Jasa']);

        $this->actingAs($user)
            ->getJson('/api/products/low-stock')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Habis');
    }

    public function test_low_stock_filter_on_index(): void
    {
        [$user, $business] = $this->userWithBusiness();
        Product::factory()->for($business)->lowStock()->create(['name' => 'Habis']);
        Product::factory()->for($business)->create(['name' => 'Aman', 'stock' => 50, 'minimum_stock' => 5]);

        $this->actingAs($user)
            ->getJson('/api/products?low_stock=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Habis');
    }

    public function test_filter_by_type_service(): void
    {
        [$user, $business] = $this->userWithBusiness();
        Product::factory()->for($business)->create(['name' => 'Barang']);
        Product::factory()->for($business)->service()->create(['name' => 'Jasa']);

        $this->actingAs($user)
            ->getJson('/api/products?type=service')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Jasa');
    }

    public function test_tenant_isolation_on_show_update_destroy(): void
    {
        [$userA] = $this->userWithBusiness();
        [, $businessB] = $this->userWithBusiness();
        $productB = Product::factory()->for($businessB)->create();

        $this->actingAs($userA)->getJson("/api/products/{$productB->id}")->assertNotFound();
        $this->actingAs($userA)
            ->putJson("/api/products/{$productB->id}", ['name' => 'X', 'type' => 'product', 'price' => 1])
            ->assertNotFound();
        $this->actingAs($userA)->deleteJson("/api/products/{$productB->id}")->assertNotFound();
    }

    public function test_destroy_soft_deletes_product(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $product = Product::factory()->for($business)->create();

        $this->actingAs($user)
            ->deleteJson("/api/products/{$product->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('products', ['id' => $product->id]);
    }
}
