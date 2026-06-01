<?php

namespace Database\Factories;

use App\Enums\ProductType;
use App\Models\Business;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'business_id' => Business::factory(),
            'name' => fake()->words(2, true),
            'type' => ProductType::Product->value,
            'category' => 'umum',
            'price' => fake()->numberBetween(5000, 100000),
            'cost_price' => fake()->numberBetween(2000, 50000),
            'stock' => fake()->numberBetween(0, 50),
            'minimum_stock' => 5,
            'unit' => 'pcs',
            'is_active' => true,
        ];
    }

    public function service(): static
    {
        return $this->state(fn () => [
            'type' => ProductType::Service->value,
            'stock' => null,
            'minimum_stock' => null,
        ]);
    }

    public function lowStock(): static
    {
        return $this->state(fn () => ['stock' => 1, 'minimum_stock' => 5]);
    }
}
