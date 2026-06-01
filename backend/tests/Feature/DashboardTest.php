<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array{0: User, 1: Business}
     */
    private function userWithBusiness(): array
    {
        $user = User::factory()->create(['name' => 'Rina']);
        $business = Business::create(['owner_id' => $user->id, 'name' => 'Rina Catering']);
        $business->members()->attach($user->id, ['role' => 'owner']);

        return [$user, $business];
    }

    public function test_summary_requires_authentication(): void
    {
        $this->getJson('/api/dashboard/summary')->assertUnauthorized();
    }

    public function test_summary_returns_metrics_for_today(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();

        // Two orders today: one paid 100k, one unpaid 50k.
        Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_date' => now()->toDateString(),
            'payment_status' => 'paid',
            'status' => 'processing',
            'total' => 100000,
        ]);
        Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_date' => now()->toDateString(),
            'payment_status' => 'unpaid',
            'status' => 'new',
            'total' => 50000,
        ]);

        $this->actingAs($user)
            ->getJson('/api/dashboard/summary')
            ->assertOk()
            ->assertJsonPath('business_name', 'Rina Catering')
            ->assertJsonPath('metrics.orders_today', 2)
            ->assertJsonPath('metrics.revenue_today', 150000)
            ->assertJsonPath('metrics.unpaid_total', 50000)
            ->assertJsonPath('metrics.unpaid_count', 1)
            ->assertJsonPath('metrics.processing_count', 1);
    }

    public function test_summary_excludes_other_business_orders(): void
    {
        [$user, $business] = $this->userWithBusiness();
        [, $otherBusiness] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();
        $otherCustomer = Customer::factory()->for($otherBusiness)->create();

        Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_date' => now()->toDateString(),
            'total' => 100000,
        ]);
        Order::factory()->for($otherBusiness)->create([
            'customer_id' => $otherCustomer->id,
            'order_date' => now()->toDateString(),
            'total' => 999999,
        ]);

        $this->actingAs($user)
            ->getJson('/api/dashboard/summary')
            ->assertOk()
            ->assertJsonPath('metrics.orders_today', 1)
            ->assertJsonPath('metrics.revenue_today', 100000);
    }

    public function test_summary_includes_recent_orders_and_low_stock(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();
        Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_date' => now()->toDateString(),
        ]);
        Product::factory()->for($business)->lowStock()->create(['name' => 'Brownies']);
        Product::factory()->for($business)->create(['name' => 'Aman', 'stock' => 99, 'minimum_stock' => 5]);

        $response = $this->actingAs($user)->getJson('/api/dashboard/summary')->assertOk();

        $response->assertJsonCount(1, 'recent_orders')
            ->assertJsonPath('metrics.low_stock_count', 1)
            ->assertJsonCount(1, 'low_stock_products')
            ->assertJsonPath('low_stock_products.0.name', 'Brownies');
    }

    public function test_revenue_excludes_refunded_orders(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();
        Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_date' => now()->toDateString(),
            'payment_status' => 'paid',
            'total' => 100000,
        ]);
        Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_date' => now()->toDateString(),
            'payment_status' => 'refunded',
            'total' => 80000,
        ]);

        $this->actingAs($user)
            ->getJson('/api/dashboard/summary')
            ->assertOk()
            ->assertJsonPath('metrics.revenue_today', 100000);
    }
}
