<?php

namespace Database\Factories;

use App\Enums\ReminderPriority;
use App\Enums\ReminderStatus;
use App\Enums\ReminderType;
use App\Models\Business;
use App\Models\Reminder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reminder>
 */
class ReminderFactory extends Factory
{
    protected $model = Reminder::class;

    public function definition(): array
    {
        return [
            'business_id' => Business::factory(),
            'related_type' => 'order',
            'related_id' => 1,
            'title' => fake()->sentence(3),
            'description' => fake()->sentence(),
            'type' => ReminderType::UnpaidOrder->value,
            'status' => ReminderStatus::Pending->value,
            'priority' => ReminderPriority::Today->value,
            'due_at' => null,
        ];
    }
}
