<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderLifecycleTest extends TestCase
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

    public function test_full_order_lifecycle_end_to_end(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $this->actingAs($user);

        // 1. Create a customer.
        $customerId = $this->postJson('/api/customers', [
            'name' => 'Sinta Permata',
            'phone' => '08123456789',
            'customer_type' => 'regular',
        ])->assertCreated()->json('data.id');

        // 2. Create a stock-tracked product.
        $productId = $this->postJson('/api/products', [
            'name' => 'Nasi Box Ayam',
            'type' => 'product',
            'price' => 25000,
            'cost_price' => 15000,
            'stock' => 20,
            'minimum_stock' => 5,
            'unit' => 'box',
        ])->assertCreated()->json('data.id');

        // 3. Create an order with 4 units (total 100000).
        $orderResponse = $this->postJson('/api/orders', [
            'customer_id' => $customerId,
            'payment_status' => 'unpaid',
            'status' => 'new',
            'items' => [['product_id' => $productId, 'quantity' => 4]],
        ])->assertCreated();

        $orderId = $orderResponse->json('data.id');
        $orderResponse->assertJsonPath('data.total', 100000)
            ->assertJsonPath('data.order_number', 'ORD-0001');

        // 4. Move order through to completed (valid transitions: new → processing → completed).
        $this->patchJson("/api/orders/{$orderId}/status", ['status' => 'processing'])->assertOk();
        $this->patchJson("/api/orders/{$orderId}/status", ['status' => 'completed'])
            ->assertOk()
            ->assertJsonPath('data.status', 'completed');

        // 5. Stock reduced from 20 to 16 on completion.
        $this->assertSame(16, Product::find($productId)->stock);

        // 6. Mark as paid.
        $this->patchJson("/api/orders/{$orderId}/payment-status", ['payment_status' => 'paid'])
            ->assertOk()
            ->assertJsonPath('data.payment_status', 'paid');

        // 7. Generate an invoice from the order.
        $invoiceId = $this->postJson("/api/invoices/from-order/{$orderId}")
            ->assertCreated()
            ->assertJsonPath('data.total', 100000)
            ->assertJsonPath('data.invoice_number', 'INV-0001')
            ->json('data.id');

        // 8. Invoice PDF renders.
        $pdf = $this->get("/api/invoices/{$invoiceId}/pdf");
        $pdf->assertOk();
        $this->assertStringStartsWith('%PDF', $pdf->getContent());

        // 9. Dashboard reflects the completed, paid order.
        $this->getJson('/api/dashboard/summary')
            ->assertOk()
            ->assertJsonPath('metrics.orders_today', 1)
            ->assertJsonPath('metrics.revenue_today', 100000)
            ->assertJsonPath('metrics.unpaid_count', 0);

        // 10. Daily report aggregates the same data.
        $this->getJson('/api/reports/daily')
            ->assertOk()
            ->assertJsonPath('data.total_orders', 1)
            ->assertJsonPath('data.total_completed', 1)
            ->assertJsonPath('data.top_products.0.name', 'Nasi Box Ayam');

        // 11. Order activity log captured the status + payment changes.
        $this->assertDatabaseHas('order_activities', ['order_id' => $orderId, 'action' => 'status_changed', 'to_value' => 'completed']);
        $this->assertDatabaseHas('order_activities', ['order_id' => $orderId, 'action' => 'payment_updated', 'to_value' => 'paid']);
    }
}
