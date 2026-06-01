<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_user_business_and_returns_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Rina',
            'email' => 'rina@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'business_name' => 'Rina Catering',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'business' => ['id', 'name', 'role']]])
            ->assertJsonPath('user.business.role', 'owner')
            ->assertJsonPath('user.business.name', 'Rina Catering');

        $this->assertDatabaseHas('users', ['email' => 'rina@test.com']);
        $this->assertDatabaseHas('businesses', ['name' => 'Rina Catering']);
        $this->assertDatabaseHas('business_users', ['role' => 'owner']);

        // Password must be hashed, never stored in plain text.
        $user = User::where('email', 'rina@test.com')->first();
        $this->assertNotSame('password123', $user->password);
        $this->assertTrue(password_verify('password123', $user->password));
    }

    public function test_register_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'taken@test.com']);

        $this->postJson('/api/register', [
            'name' => 'X',
            'email' => 'taken@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'business_name' => 'X',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_register_rejects_short_password(): void
    {
        $this->postJson('/api/register', [
            'name' => 'X',
            'email' => 'new@test.com',
            'password' => 'short',
            'password_confirmation' => 'short',
            'business_name' => 'X',
        ])->assertStatus(422)->assertJsonValidationErrors('password');
    }

    public function test_login_returns_token_for_valid_credentials(): void
    {
        $user = User::factory()->create(['password' => 'password123']);

        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ])->assertOk()->assertJsonStructure(['token', 'user' => ['id', 'email']]);
    }

    public function test_login_rejects_wrong_password(): void
    {
        $user = User::factory()->create(['password' => 'password123']);

        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/me')->assertUnauthorized();
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = User::factory()->create();
        $business = Business::create(['owner_id' => $user->id, 'name' => 'Toko A']);
        $business->members()->attach($user->id, ['role' => 'owner']);

        $this->actingAs($user)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('data.email', $user->email)
            ->assertJsonPath('data.business.name', 'Toko A');
    }

    public function test_logout_revokes_current_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('api')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
