<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
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

    public function test_store_creates_order_with_items_and_computed_total(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();
        $p1 = Product::factory()->for($business)->create(['price' => 25000]);
        $p2 = Product::factory()->for($business)->create(['price' => 10000]);

        $this->actingAs($user)
            ->postJson('/api/orders', [
                'customer_id' => $customer->id,
                'payment_status' => 'unpaid',
                'status' => 'new',
                'discount' => 5000,
                'items' => [
                    ['product_id' => $p1->id, 'quantity' => 2], // 50000
                    ['product_id' => $p2->id, 'quantity' => 1], // 10000
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('data.order_number', 'ORD-0001')
            ->assertJsonPath('data.subtotal', 60000)
            ->assertJsonPath('data.discount', 5000)
            ->assertJsonPath('data.total', 55000)
            ->assertJsonCount(2, 'data.items');

        $this->assertDatabaseHas('orders', ['business_id' => $business->id, 'total' => 55000]);
        $this->assertDatabaseCount('order_items', 2);
    }

    public function test_store_snapshots_product_name_and_price(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();
        $product = Product::factory()->for($business)->create(['name' => 'Kopi Susu', 'price' => 25000]);

        $this->actingAs($user)
            ->postJson('/api/orders', [
                'customer_id' => $customer->id,
                'items' => [['product_id' => $product->id, 'quantity' => 1]],
            ])
            ->assertCreated()
            ->assertJsonPath('data.items.0.product_name', 'Kopi Susu')
            ->assertJsonPath('data.items.0.price', 25000);

        // Renaming the product later must not change the snapshot.
        $product->update(['name' => 'Kopi Susu Baru', 'price' => 30000]);
        $this->assertDatabaseHas('order_items', ['product_name' => 'Kopi Susu', 'price' => 25000]);
    }

    public function test_order_number_increments_per_business(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();
        $product = Product::factory()->for($business)->create();

        foreach (['ORD-0001', 'ORD-0002', 'ORD-0003'] as $expected) {
            $this->actingAs($user)
                ->postJson('/api/orders', [
                    'customer_id' => $customer->id,
                    'items' => [['product_id' => $product->id, 'quantity' => 1]],
                ])
                ->assertCreated()
                ->assertJsonPath('data.order_number', $expected);
        }
    }
    public function test_update_status_endpoint_changes_status(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $order = Order::factory()->for($business)->create([
            'customer_id' => Customer::factory()->for($business),
            'status' => 'new',
        ]);

        $this->actingAs($user)
            ->patchJson("/api/orders/{$order->id}/status", ['status' => 'processing'])
            ->assertOk()
            ->assertJsonPath('data.status', 'processing');

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'processing']);
    }

    public function test_update_payment_status_endpoint_changes_payment_status(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $order = Order::factory()->for($business)->create([
            'customer_id' => Customer::factory()->for($business),
            'payment_status' => 'unpaid',
        ]);

        $this->actingAs($user)
            ->patchJson("/api/orders/{$order->id}/payment-status", ['payment_status' => 'paid'])
            ->assertOk()
            ->assertJsonPath('data.payment_status', 'paid');

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'payment_status' => 'paid']);
    }

    public function test_update_status_rejects_invalid_value(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $order = Order::factory()->for($business)->create([
            'customer_id' => Customer::factory()->for($business),
        ]);

        $this->actingAs($user)
            ->patchJson("/api/orders/{$order->id}/status", ['status' => 'bogus'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('status');
    }

    public function test_store_requires_at_least_one_item(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();

        $this->actingAs($user)
            ->postJson('/api/orders', ['customer_id' => $customer->id, 'items' => []])
            ->assertStatus(422)
            ->assertJsonValidationErrors('items');
    }

    public function test_store_rejects_customer_from_another_business(): void
    {
        [$user, $business] = $this->userWithBusiness();
        [, $otherBusiness] = $this->userWithBusiness();
        $foreignCustomer = Customer::factory()->for($otherBusiness)->create();
        $product = Product::factory()->for($business)->create();

        $this->actingAs($user)
            ->postJson('/api/orders', [
                'customer_id' => $foreignCustomer->id,
                'items' => [['product_id' => $product->id, 'quantity' => 1]],
            ])
            ->assertStatus(422);
    }

    public function test_store_rejects_product_from_another_business(): void
    {
        [$user, $business] = $this->userWithBusiness();
        [, $otherBusiness] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();
        $foreignProduct = Product::factory()->for($otherBusiness)->create();

        $this->actingAs($user)
            ->postJson('/api/orders', [
                'customer_id' => $customer->id,
                'items' => [['product_id' => $foreignProduct->id, 'quantity' => 1]],
            ])
            ->assertStatus(422);
    }

    public function test_tenant_isolation_on_show_and_status_update(): void
    {
        [$userA] = $this->userWithBusiness();
        [, $businessB] = $this->userWithBusiness();
        $orderB = Order::factory()->for($businessB)->create([
            'customer_id' => Customer::factory()->for($businessB),
        ]);

        $this->actingAs($userA)->getJson("/api/orders/{$orderB->id}")->assertNotFound();
        $this->actingAs($userA)
            ->patchJson("/api/orders/{$orderB->id}/status", ['status' => 'completed'])
            ->assertNotFound();
    }

    public function test_index_filters_by_payment_status(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();
        Order::factory()->for($business)->create(['customer_id' => $customer->id, 'payment_status' => 'unpaid']);
        Order::factory()->for($business)->create(['customer_id' => $customer->id, 'payment_status' => 'paid']);

        $this->actingAs($user)
            ->getJson('/api/orders?payment_status=unpaid')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.payment_status', 'unpaid');
    }

    public function test_destroy_soft_deletes_order(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $order = Order::factory()->for($business)->create([
            'customer_id' => Customer::factory()->for($business),
        ]);

        $this->actingAs($user)
            ->deleteJson("/api/orders/{$order->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('orders', ['id' => $order->id]);
    }

}
