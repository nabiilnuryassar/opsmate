<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Services\Business\StockService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockTest extends TestCase
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

    private function orderWithItem(Business $business, Product $product, int $qty): Order
    {
        $order = Order::factory()->for($business)->create([
            'customer_id' => Customer::factory()->for($business),
            'status' => 'processing',
        ]);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'quantity' => $qty,
            'price' => $product->price,
            'total' => $product->price * $qty,
        ]);

        return $order->load('items');
    }

    public function test_manual_adjustment_in_adds_stock(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $product = Product::factory()->for($business)->create(['stock' => 10]);

        $this->actingAs($user)
            ->postJson("/api/products/{$product->id}/stock-adjustment", [
                'type' => 'in',
                'quantity' => 5,
                'notes' => 'Restock',
            ])
            ->assertOk()
            ->assertJsonPath('data.stock', 15);

        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'type' => 'in',
            'quantity' => 5,
        ]);
    }

    public function test_manual_adjustment_out_subtracts_and_clamps_at_zero(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $product = Product::factory()->for($business)->create(['stock' => 3]);

        $this->actingAs($user)
            ->postJson("/api/products/{$product->id}/stock-adjustment", [
                'type' => 'out',
                'quantity' => 10,
            ])
            ->assertOk()
            ->assertJsonPath('data.stock', 0);
    }

    public function test_adjustment_sets_absolute_value(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $product = Product::factory()->for($business)->create(['stock' => 10]);

        $this->actingAs($user)
            ->postJson("/api/products/{$product->id}/stock-adjustment", [
                'type' => 'adjustment',
                'quantity' => 25,
            ])
            ->assertOk()
            ->assertJsonPath('data.stock', 25);

        // The recorded movement is the delta (+15).
        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'type' => 'adjustment',
            'quantity' => 15,
        ]);
    }

    public function test_cannot_adjust_service_stock(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $service = Product::factory()->for($business)->service()->create();

        $this->actingAs($user)
            ->postJson("/api/products/{$service->id}/stock-adjustment", [
                'type' => 'in',
                'quantity' => 5,
            ])
            ->assertStatus(422);
    }

    public function test_completing_order_reduces_stock(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $product = Product::factory()->for($business)->create(['stock' => 10]);
        $order = $this->orderWithItem($business, $product, 3);

        $this->actingAs($user)
            ->patchJson("/api/orders/{$order->id}/status", ['status' => 'completed'])
            ->assertOk();

        $this->assertSame(7, $product->fresh()->stock);
        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'type' => 'out',
            'quantity' => -3,
            'reference_type' => 'order',
            'reference_id' => $order->id,
        ]);
    }

    public function test_stock_reduction_is_idempotent_across_finished_states(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $product = Product::factory()->for($business)->create(['stock' => 10]);
        $order = $this->orderWithItem($business, $product, 3);

        // completed -> delivered: both are "finished" but stock must only drop once.
        $this->actingAs($user)->patchJson("/api/orders/{$order->id}/status", ['status' => 'completed']);
        $this->actingAs($user)->patchJson("/api/orders/{$order->id}/status", ['status' => 'delivered']);

        $this->assertSame(7, $product->fresh()->stock);
        $this->assertSame(
            1,
            \App\Models\StockMovement::where('product_id', $product->id)->count(),
        );
    }

    public function test_cancelling_a_reduced_order_restores_stock(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $product = Product::factory()->for($business)->create(['stock' => 10]);
        $order = $this->orderWithItem($business, $product, 4);

        // Reduce via service directly, then cancel through the API.
        app(StockService::class)->reduceForOrder($order, $user->id);
        $this->assertSame(6, $product->fresh()->stock);

        $order->update(['status' => 'processing']);
        $this->actingAs($user)->patchJson("/api/orders/{$order->id}/status", ['status' => 'cancelled'])->assertOk();

        $this->assertSame(10, $product->fresh()->stock);
    }

    public function test_movement_history_is_tenant_scoped(): void
    {
        [$userA] = $this->userWithBusiness();
        [, $businessB] = $this->userWithBusiness();
        $productB = Product::factory()->for($businessB)->create();

        $this->actingAs($userA)
            ->getJson("/api/products/{$productB->id}/stock-movements")
            ->assertNotFound();
    }
}
