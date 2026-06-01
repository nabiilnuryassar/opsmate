<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Reminder;
use App\Models\User;
use App\Services\Business\ReminderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReminderTest extends TestCase
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

    public function test_generates_reminder_for_unpaid_past_order(): void
    {
        [, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create(['name' => 'Sinta']);
        Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_date' => now()->subDays(2)->toDateString(),
            'payment_status' => 'unpaid',
            'total' => 250000,
        ]);

        $created = app(ReminderService::class)->generateForBusiness($business->fresh());

        $this->assertSame(1, $created);
        $this->assertDatabaseHas('reminders', [
            'business_id' => $business->id,
            'type' => 'unpaid_order',
            'priority' => 'today',
        ]);
    }

    public function test_unpaid_over_three_days_is_urgent(): void
    {
        [, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();
        Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_date' => now()->subDays(5)->toDateString(),
            'payment_status' => 'unpaid',
            'total' => 100000,
        ]);

        app(ReminderService::class)->generateForBusiness($business->fresh());

        $this->assertDatabaseHas('reminders', ['type' => 'unpaid_order', 'priority' => 'urgent']);
    }

    public function test_generates_low_stock_reminder(): void
    {
        [, $business] = $this->userWithBusiness();
        Product::factory()->for($business)->lowStock()->create(['name' => 'Brownies']);

        app(ReminderService::class)->generateForBusiness($business->fresh());

        $this->assertDatabaseHas('reminders', [
            'type' => 'low_stock',
            'related_type' => 'product',
        ]);
    }

    public function test_generation_is_idempotent(): void
    {
        [, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();
        Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_date' => now()->subDays(2)->toDateString(),
            'payment_status' => 'unpaid',
            'total' => 50000,
        ]);

        $service = app(ReminderService::class);
        $first = $service->generateForBusiness($business->fresh());
        $second = $service->generateForBusiness($business->fresh());

        $this->assertSame(1, $first);
        $this->assertSame(0, $second);
        $this->assertSame(1, Reminder::where('business_id', $business->id)->count());
    }

    public function test_index_orders_by_priority(): void
    {
        [$user, $business] = $this->userWithBusiness();
        Reminder::factory()->for($business)->create(['priority' => 'later', 'title' => 'Later one']);
        Reminder::factory()->for($business)->create(['priority' => 'urgent', 'title' => 'Urgent one']);
        Reminder::factory()->for($business)->create(['priority' => 'today', 'title' => 'Today one']);

        $this->actingAs($user)
            ->getJson('/api/reminders')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'Urgent one')
            ->assertJsonPath('data.1.title', 'Today one')
            ->assertJsonPath('data.2.title', 'Later one');
    }

    public function test_done_marks_complete_and_hides_from_active(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $reminder = Reminder::factory()->for($business)->create(['status' => 'pending']);

        $this->actingAs($user)
            ->patchJson("/api/reminders/{$reminder->id}/done")
            ->assertOk()
            ->assertJsonPath('data.status', 'done');

        $this->actingAs($user)->getJson('/api/reminders')->assertOk()->assertJsonCount(0, 'data');
    }

    public function test_snooze_hides_until_time_passes(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $reminder = Reminder::factory()->for($business)->create(['status' => 'pending']);

        $this->actingAs($user)
            ->patchJson("/api/reminders/{$reminder->id}/snooze", [
                'until' => now()->addDays(2)->toIso8601String(),
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'snoozed');

        // Snoozed into the future -> not in the active list.
        $this->actingAs($user)->getJson('/api/reminders')->assertJsonCount(0, 'data');
    }

    public function test_generate_message_returns_followup_text(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create(['name' => 'Sinta']);
        $order = Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_number' => 'ORD-0009',
            'payment_status' => 'unpaid',
            'total' => 250000,
        ]);
        $reminder = Reminder::factory()->for($business)->create([
            'type' => 'unpaid_order',
            'related_type' => 'order',
            'related_id' => $order->id,
        ]);

        $this->actingAs($user)
            ->postJson("/api/reminders/{$reminder->id}/generate-message")
            ->assertOk()
            ->assertJsonStructure(['message']);

        $message = $this->actingAs($user)
            ->postJson("/api/reminders/{$reminder->id}/generate-message")
            ->json('message');

        $this->assertStringContainsString('Sinta', $message);
        $this->assertStringContainsString('Toko A', $message);
    }

    public function test_tenant_isolation_on_done(): void
    {
        [$userA] = $this->userWithBusiness();
        [, $businessB] = $this->userWithBusiness();
        $reminderB = Reminder::factory()->for($businessB)->create();

        $this->actingAs($userA)
            ->patchJson("/api/reminders/{$reminderB->id}/done")
            ->assertNotFound();
    }
}
