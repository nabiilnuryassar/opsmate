<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerTest extends TestCase
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

    public function test_index_lists_only_own_business_customers(): void
    {
        [$userA, $businessA] = $this->userWithBusiness();
        [$userB, $businessB] = $this->userWithBusiness();

        Customer::factory()->for($businessA)->create(['name' => 'Customer A']);
        Customer::factory()->for($businessB)->create(['name' => 'Customer B']);

        $this->actingAs($userA)
            ->getJson('/api/customers')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Customer A');
    }

    public function test_index_requires_authentication(): void
    {
        $this->getJson('/api/customers')->assertUnauthorized();
    }

    public function test_search_matches_name_or_phone(): void
    {
        [$user, $business] = $this->userWithBusiness();
        Customer::factory()->for($business)->create(['name' => 'Sinta Permata', 'phone' => '0811']);
        Customer::factory()->for($business)->create(['name' => 'Budi Santoso', 'phone' => '0822']);

        $this->actingAs($user)
            ->getJson('/api/customers?search=Sinta')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Sinta Permata');

        $this->actingAs($user)
            ->getJson('/api/customers?search=0822')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Budi Santoso');
    }

    public function test_filter_by_customer_type(): void
    {
        [$user, $business] = $this->userWithBusiness();
        Customer::factory()->for($business)->create(['customer_type' => 'vip', 'name' => 'VIP One']);
        Customer::factory()->for($business)->create(['customer_type' => 'new', 'name' => 'New One']);

        $this->actingAs($user)
            ->getJson('/api/customers?type=vip')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'VIP One');
    }

    public function test_store_creates_customer_scoped_to_business(): void
    {
        [$user, $business] = $this->userWithBusiness();

        $this->actingAs($user)
            ->postJson('/api/customers', [
                'name' => 'Sinta Permata',
                'phone' => '08123456789',
                'customer_type' => 'regular',
            ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Sinta Permata')
            ->assertJsonPath('data.customer_type', 'regular');

        $this->assertDatabaseHas('customers', [
            'name' => 'Sinta Permata',
            'business_id' => $business->id,
        ]);
    }

    public function test_store_requires_name(): void
    {
        [$user] = $this->userWithBusiness();

        $this->actingAs($user)
            ->postJson('/api/customers', ['name' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_show_update_destroy_respect_tenant_isolation(): void
    {
        [$userA] = $this->userWithBusiness();
        [$userB, $businessB] = $this->userWithBusiness();
        $customerB = Customer::factory()->for($businessB)->create();

        // User A cannot see, update, or delete user B's customer.
        $this->actingAs($userA)->getJson("/api/customers/{$customerB->id}")->assertNotFound();
        $this->actingAs($userA)
            ->putJson("/api/customers/{$customerB->id}", ['name' => 'Hacked'])
            ->assertNotFound();
        $this->actingAs($userA)->deleteJson("/api/customers/{$customerB->id}")->assertNotFound();

        $this->assertDatabaseHas('customers', ['id' => $customerB->id, 'deleted_at' => null]);
    }

    public function test_update_changes_own_customer(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create(['name' => 'Old']);

        $this->actingAs($user)
            ->putJson("/api/customers/{$customer->id}", ['name' => 'New Name'])
            ->assertOk()
            ->assertJsonPath('data.name', 'New Name');

        $this->assertDatabaseHas('customers', ['id' => $customer->id, 'name' => 'New Name']);
    }

    public function test_destroy_soft_deletes_own_customer(): void
    {
        [$user, $business] = $this->userWithBusiness();
        $customer = Customer::factory()->for($business)->create();

        $this->actingAs($user)
            ->deleteJson("/api/customers/{$customer->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('customers', ['id' => $customer->id]);
    }
}
