<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Business;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'business_id' => Business::factory(),
            'customer_id' => Customer::factory(),
            'order_number' => 'ORD-'.fake()->unique()->numerify('####'),
            'order_date' => now()->toDateString(),
            'due_date' => null,
            'status' => OrderStatus::New->value,
            'payment_status' => PaymentStatus::Unpaid->value,
            'subtotal' => 0,
            'discount' => 0,
            'total' => 0,
            'notes' => null,
        ];
    }
}
