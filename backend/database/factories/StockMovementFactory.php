<?php

namespace Database\Factories;

use App\Enums\StockMovementType;
use App\Models\Business;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StockMovement>
 */
class StockMovementFactory extends Factory
{
    protected $model = StockMovement::class;

    public function definition(): array
    {
        return [
            'business_id' => Business::factory(),
            'product_id' => Product::factory(),
            'type' => StockMovementType::In->value,
            'quantity' => fake()->numberBetween(1, 20),
            'reference_type' => 'manual',
            'reference_id' => null,
            'notes' => null,
        ];
    }
}
