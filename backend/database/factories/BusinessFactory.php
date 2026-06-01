<?php

namespace Database\Factories;

use App\Models\Business;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Business>
 */
class BusinessFactory extends Factory
{
    protected $model = Business::class;

    public function definition(): array
    {
        return [
            'owner_id' => User::factory(),
            'name' => fake()->company(),
            'category' => 'makanan_minuman',
            'phone' => fake()->numerify('08##########'),
            'city' => fake()->city(),
            'currency' => 'IDR',
        ];
    }
}
