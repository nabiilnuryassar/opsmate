<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BusinessTest extends TestCase
{
    use RefreshDatabase;

    private function userWithBusiness(array $businessAttrs = []): array
    {
        $user = User::factory()->create();
        $business = Business::create(array_merge([
            'owner_id' => $user->id,
            'name' => 'Rina Catering',
        ], $businessAttrs));
        $business->members()->attach($user->id, ['role' => 'owner']);

        return [$user, $business];
    }

    public function test_show_returns_active_business(): void
    {
        [$user, $business] = $this->userWithBusiness();

        $this->actingAs($user)
            ->getJson('/api/business')
            ->assertOk()
            ->assertJsonPath('data.id', $business->id)
            ->assertJsonPath('data.name', 'Rina Catering')
            ->assertJsonPath('data.is_complete', false);
    }

    public function test_show_requires_authentication(): void
    {
        $this->getJson('/api/business')->assertUnauthorized();
    }

    public function test_update_persists_profile_and_marks_complete(): void
    {
        [$user] = $this->userWithBusiness();

        $this->actingAs($user)
            ->putJson('/api/business', [
                'name' => 'Rina Catering',
                'category' => 'makanan_minuman',
                'phone' => '08123456789',
                'city' => 'Bandung',
                'description' => 'Catering rumahan',
            ])
            ->assertOk()
            ->assertJsonPath('data.category', 'makanan_minuman')
            ->assertJsonPath('data.city', 'Bandung')
            ->assertJsonPath('data.is_complete', true);

        $this->assertDatabaseHas('businesses', [
            'name' => 'Rina Catering',
            'category' => 'makanan_minuman',
            'city' => 'Bandung',
        ]);
    }

    public function test_update_rejects_invalid_category(): void
    {
        [$user] = $this->userWithBusiness();

        $this->actingAs($user)
            ->putJson('/api/business', [
                'name' => 'X',
                'category' => 'not_a_category',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('category');
    }

    public function test_update_requires_name(): void
    {
        [$user] = $this->userWithBusiness();

        $this->actingAs($user)
            ->putJson('/api/business', ['name' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_user_cannot_see_another_businesses_profile(): void
    {
        [$userA, $businessA] = $this->userWithBusiness(['name' => 'Bisnis A']);
        [$userB, $businessB] = $this->userWithBusiness(['name' => 'Bisnis B']);

        // User B's /business must return B's data, never A's.
        $this->actingAs($userB)
            ->getJson('/api/business')
            ->assertOk()
            ->assertJsonPath('data.id', $businessB->id)
            ->assertJsonPath('data.name', 'Bisnis B');

        // And updating only touches B's row.
        $this->actingAs($userB)
            ->putJson('/api/business', ['name' => 'Bisnis B Updated'])
            ->assertOk();

        $this->assertDatabaseHas('businesses', ['id' => $businessA->id, 'name' => 'Bisnis A']);
        $this->assertDatabaseHas('businesses', ['id' => $businessB->id, 'name' => 'Bisnis B Updated']);
    }
}
