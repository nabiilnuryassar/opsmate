<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DailyReportTest extends TestCase
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

    private function orderWithItem(Business $business, array $attrs, string $productName, int $qty, float $price): Order
    {
        $order = Order::factory()->for($business)->create(array_merge([
            'customer_id' => Customer::factory()->for($business),
            'order_date' => now()->toDateString(),
            'subtotal' => $price * $qty,
            'total' => $price * $qty,
        ], $attrs));
        $product = Product::factory()->for($business)->create(['name' => $productName, 'price' => $price]);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $productName,
            'quantity' => $qty,
            'price' => $price,
            'total' => $price * $qty,
        ]);

        return $order;
    }

    public function test_daily_requires_authentication(): void
    {
        $this->getJson('/api/reports/daily')->assertUnauthorized();
    }

    public function test_daily_aggregates_todays_data(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $this->orderWithItem($business, ['payment_status' => 'paid', 'status' => 'completed'], 'Paket A', 3, 50000);
        $this->orderWithItem($business, ['payment_status' => 'unpaid', 'status' => 'new'], 'Paket B', 1, 20000);

        $this->actingAs($user)
            ->getJson('/api/reports/daily')
            ->assertOk()
            ->assertJsonPath('data.total_orders', 2)
            ->assertJsonPath('data.total_revenue', 170000)
            ->assertJsonPath('data.total_unpaid', 20000)
            ->assertJsonPath('data.total_completed', 1);
    }

    public function test_daily_ranks_top_products(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $this->orderWithItem($business, [], 'Paket A', 8, 25000);
        $this->orderWithItem($business, [], 'Paket B', 2, 30000);

        $this->actingAs($user)
            ->getJson('/api/reports/daily')
            ->assertOk()
            ->assertJsonPath('data.top_products.0.name', 'Paket A')
            ->assertJsonPath('data.top_products.0.quantity', 8);
    }

    public function test_daily_includes_low_stock(): void
    {
        [$user, $business] = $this->userWithBusiness();
        Product::factory()->for($business)->lowStock()->create(['name' => 'Brownies']);

        $this->actingAs($user)
            ->getJson('/api/reports/daily')
            ->assertOk()
            ->assertJsonPath('data.low_stock.0.name', 'Brownies');
    }

    public function test_daily_provides_fallback_summary(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $this->orderWithItem($business, ['payment_status' => 'paid'], 'Paket A', 5, 40000);

        $summary = $this->actingAs($user)
            ->getJson('/api/reports/daily')
            ->assertOk()
            ->json('data.ai_summary');

        $this->assertNotEmpty($summary);
        $this->assertStringContainsString('Paket A', $summary);
    }

    public function test_report_is_persisted_and_scoped(): void
    {
        [$user, $business] = $this->userWithBusiness();
        [, $otherBusiness] = $this->userWithBusiness();
        $this->orderWithItem($business, [], 'Mine', 1, 10000);
        $this->orderWithItem($otherBusiness, [], 'Theirs', 1, 99999);

        $this->actingAs($user)->getJson('/api/reports/daily')->assertOk()
            ->assertJsonPath('data.total_orders', 1);

        $this->assertDatabaseHas('daily_reports', [
            'business_id' => $business->id,
            'total_orders' => 1,
        ]);
    }

    public function test_specific_date_returns_empty_for_day_with_no_orders(): void
    {
        [$user] = $this->userWithBusiness();

        $this->actingAs($user)
            ->getJson('/api/reports/daily/2020-01-01')
            ->assertOk()
            ->assertJsonPath('data.total_orders', 0)
            ->assertJsonPath('data.report_date', '2020-01-01');
    }

    public function test_invalid_date_is_rejected(): void
    {
        [$user] = $this->userWithBusiness();

        $this->actingAs($user)
            ->getJson('/api/reports/daily/not-a-date')
            ->assertStatus(422);
    }

    public function test_pdf_endpoint_returns_pdf(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $this->orderWithItem($business, ['payment_status' => 'paid'], 'Paket A', 2, 50000);

        $response = $this->actingAs($user)->get('/api/reports/daily/'.now()->toDateString().'/pdf');

        $response->assertOk();
        $this->assertSame('application/pdf', $response->headers->get('Content-Type'));
        $this->assertStringStartsWith('%PDF', $response->getContent());
    }
}
