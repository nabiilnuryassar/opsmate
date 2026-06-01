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

class AIFeaturesTest extends TestCase
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

    public function test_dashboard_ai_summary_returns_grounded_text(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();
        Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_date' => now()->toDateString(),
            'payment_status' => 'paid',
            'total' => 150000,
        ]);

        $summary = $this->actingAs($user)
            ->getJson('/api/dashboard/ai-summary')
            ->assertOk()
            ->json('summary');

        $this->assertStringContainsString('1 order', $summary);
    }

    public function test_generate_follow_up_payment_includes_customer_and_total(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create(['name' => 'Sinta']);
        $order = Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_number' => 'ORD-0005',
            'payment_status' => 'unpaid',
            'total' => 250000,
        ]);

        $message = $this->actingAs($user)
            ->postJson('/api/ai/generate-follow-up', [
                'customer_id' => $customer->id,
                'order_id' => $order->id,
                'type' => 'payment',
            ])
            ->assertOk()
            ->json('message');

        $this->assertStringContainsString('Sinta', $message);
        $this->assertStringContainsString('Rina Catering', $message);
        $this->assertStringContainsString('250.000', $message);
    }

    public function test_generate_follow_up_rejects_invalid_type(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();

        $this->actingAs($user)
            ->postJson('/api/ai/generate-follow-up', [
                'customer_id' => $customer->id,
                'type' => 'bogus',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('type');
    }

    public function test_generate_follow_up_cannot_target_other_business_customer(): void
    {
        [$user] = $this->userWithBusiness();
        [, $otherBusiness] = $this->userWithBusiness();
        $foreign = Customer::factory()->for($otherBusiness)->create();

        $this->actingAs($user)
            ->postJson('/api/ai/generate-follow-up', [
                'customer_id' => $foreign->id,
                'type' => 'general',
            ])
            ->assertNotFound();
    }

    public function test_generate_promo_ideas_uses_top_product(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();
        $order = Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_date' => now()->toDateString(),
        ]);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => Product::factory()->for($business)->create(['name' => 'Paket Hemat'])->id,
            'product_name' => 'Paket Hemat',
            'quantity' => 8,
            'price' => 25000,
            'total' => 200000,
        ]);

        $ideas = $this->actingAs($user)
            ->postJson('/api/ai/generate-promo-ideas', ['period' => 'this_week'])
            ->assertOk()
            ->json('ideas');

        $this->assertStringContainsString('Paket Hemat', $ideas);
    }

    public function test_generate_daily_summary_persists_to_report(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();
        Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_date' => now()->toDateString(),
            'payment_status' => 'paid',
            'total' => 90000,
        ]);

        $summary = $this->actingAs($user)
            ->postJson('/api/ai/generate-daily-summary', ['date' => now()->toDateString()])
            ->assertOk()
            ->json('summary');

        $this->assertNotEmpty($summary);
        $this->assertDatabaseHas('daily_reports', [
            'business_id' => $business->id,
            'report_date' => now()->startOfDay(),
        ]);
    }

    public function test_ai_endpoints_require_authentication(): void
    {
        $this->getJson('/api/dashboard/ai-summary')->assertUnauthorized();
        $this->postJson('/api/ai/generate-promo-ideas')->assertUnauthorized();
    }
}
