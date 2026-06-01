<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderStatusTransitionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array{0: User, 1: Order}
     */
    private function orderWith(string $status = 'new', string $payment = 'unpaid'): array
    {
        $user = User::factory()->create();
        $business = Business::create(['owner_id' => $user->id, 'name' => 'Toko A']);
        $business->members()->attach($user->id, ['role' => 'owner']);
        $order = Order::factory()->for($business)->create([
            'customer_id' => Customer::factory()->for($business),
            'status' => $status,
            'payment_status' => $payment,
        ]);

        return [$user, $order];
    }

    public function test_valid_order_transition_is_accepted_and_logged(): void
    {
        [$user, $order] = $this->orderWith('new');

        $this->actingAs($user)
            ->patchJson("/api/orders/{$order->id}/status", ['status' => 'processing'])
            ->assertOk()
            ->assertJsonPath('data.status', 'processing');

        $this->assertDatabaseHas('order_activities', [
            'order_id' => $order->id,
            'action' => 'status_changed',
            'from_value' => 'new',
            'to_value' => 'processing',
        ]);
    }

    public function test_invalid_order_transition_is_rejected_with_message(): void
    {
        [$user, $order] = $this->orderWith('completed');

        $this->actingAs($user)
            ->patchJson("/api/orders/{$order->id}/status", ['status' => 'new'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('status');

        // Status unchanged, no activity logged.
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'completed']);
        $this->assertDatabaseMissing('order_activities', ['order_id' => $order->id]);
    }

    public function test_cancelled_is_reachable_from_processing(): void
    {
        [$user, $order] = $this->orderWith('processing');

        $this->actingAs($user)
            ->patchJson("/api/orders/{$order->id}/status", ['status' => 'cancelled'])
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');
    }

    public function test_delivered_is_terminal(): void
    {
        [$user, $order] = $this->orderWith('delivered');

        $this->actingAs($user)
            ->patchJson("/api/orders/{$order->id}/status", ['status' => 'cancelled'])
            ->assertStatus(422);
    }

    public function test_valid_payment_transition_logged(): void
    {
        [$user, $order] = $this->orderWith('new', 'unpaid');

        $this->actingAs($user)
            ->patchJson("/api/orders/{$order->id}/payment-status", ['payment_status' => 'paid'])
            ->assertOk()
            ->assertJsonPath('data.payment_status', 'paid');

        $this->assertDatabaseHas('order_activities', [
            'order_id' => $order->id,
            'action' => 'payment_updated',
            'from_value' => 'unpaid',
            'to_value' => 'paid',
        ]);
    }

    public function test_invalid_payment_transition_rejected(): void
    {
        [$user, $order] = $this->orderWith('new', 'paid');

        // paid -> unpaid is not allowed.
        $this->actingAs($user)
            ->patchJson("/api/orders/{$order->id}/payment-status", ['payment_status' => 'unpaid'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('payment_status');
    }

    public function test_paid_can_be_refunded(): void
    {
        [$user, $order] = $this->orderWith('new', 'paid');

        $this->actingAs($user)
            ->patchJson("/api/orders/{$order->id}/payment-status", ['payment_status' => 'refunded'])
            ->assertOk()
            ->assertJsonPath('data.payment_status', 'refunded');
    }

    public function test_same_status_is_noop_without_activity(): void
    {
        [$user, $order] = $this->orderWith('processing');

        $this->actingAs($user)
            ->patchJson("/api/orders/{$order->id}/status", ['status' => 'processing'])
            ->assertOk();

        $this->assertDatabaseMissing('order_activities', ['order_id' => $order->id]);
    }
}
