<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AIAssistantTest extends TestCase
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

    public function test_chat_requires_authentication(): void
    {
        $this->postJson('/api/ai/chat', ['message' => 'Halo'])->assertUnauthorized();
    }

    public function test_chat_requires_message(): void
    {
        [$user] = $this->userWithBusiness();

        $this->actingAs($user)
            ->postJson('/api/ai/chat', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('message');
    }

    public function test_chat_returns_assistant_reply_grounded_in_data(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create(['name' => 'Sinta']);
        Order::factory()->for($business)->create([
            'customer_id' => $customer->id,
            'order_date' => now()->toDateString(),
            'payment_status' => 'unpaid',
            'total' => 250000,
        ]);

        $response = $this->actingAs($user)
            ->postJson('/api/ai/chat', ['message' => 'Siapa yang belum bayar?'])
            ->assertCreated()
            ->assertJsonPath('data.role', 'assistant');

        // The fallback responder surfaces real business data (no fabricated numbers).
        $content = $response->json('data.content');
        $this->assertStringContainsString('Rina Catering', $content);
        $this->assertStringContainsString('Sinta', $content);

        // Unpaid orders surfaced as actionable data for the UI.
        $this->assertSame('Sinta', $response->json('data.unpaid.0.customer'));
    }

    public function test_chat_persists_user_and_assistant_messages(): void
    {
        [$user, $business] = $this->userWithBusiness();

        $this->actingAs($user)->postJson('/api/ai/chat', ['message' => 'Hari ini gimana?']);

        $this->assertDatabaseHas('ai_messages', [
            'business_id' => $business->id,
            'role' => 'user',
            'content' => 'Hari ini gimana?',
        ]);
        $this->assertDatabaseHas('ai_messages', [
            'business_id' => $business->id,
            'role' => 'assistant',
        ]);
    }

    public function test_messages_history_is_tenant_scoped(): void
    {
        [$userA, $businessA] = $this->userWithBusiness();
        [, $businessB] = $this->userWithBusiness();

        \App\Models\AIMessage::create(['business_id' => $businessA->id, 'role' => 'user', 'content' => 'A says hi']);
        \App\Models\AIMessage::create(['business_id' => $businessB->id, 'role' => 'user', 'content' => 'B says hi']);

        $this->actingAs($userA)
            ->getJson('/api/ai/messages')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.content', 'A says hi');
    }

    public function test_chat_is_rate_limited(): void
    {
        [$user] = $this->userWithBusiness();
        config(['ai.rate_limit_per_hour' => 2]);
        RateLimiter::clear('ai-chat:'.$user->id);

        $this->actingAs($user)->postJson('/api/ai/chat', ['message' => 'satu'])->assertCreated();
        $this->actingAs($user)->postJson('/api/ai/chat', ['message' => 'dua'])->assertCreated();
        $this->actingAs($user)->postJson('/api/ai/chat', ['message' => 'tiga'])->assertStatus(429);
    }

    public function test_chat_does_not_leak_other_business_data(): void
    {
        [$user, $business] = $this->userWithBusiness();
        [, $otherBusiness] = $this->userWithBusiness();
        $otherCustomer = Customer::factory()->for($otherBusiness)->create(['name' => 'Rahasia']);
        Order::factory()->for($otherBusiness)->create([
            'customer_id' => $otherCustomer->id,
            'order_date' => now()->toDateString(),
            'payment_status' => 'unpaid',
            'total' => 999999,
        ]);

        $content = $this->actingAs($user)
            ->postJson('/api/ai/chat', ['message' => 'Siapa belum bayar?'])
            ->json('data.content');

        $this->assertStringNotContainsString('Rahasia', $content);
    }
}
