<?php

namespace App\Models;

use App\Enums\ReminderPriority;
use App\Enums\ReminderStatus;
use App\Enums\ReminderType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'related_type',
        'related_id',
        'title',
        'description',
        'type',
        'status',
        'priority',
        'due_at',
        'completed_at',
        'snoozed_until',
    ];

    protected function casts(): array
    {
        return [
            'type' => ReminderType::class,
            'status' => ReminderStatus::class,
            'priority' => ReminderPriority::class,
            'due_at' => 'datetime',
            'completed_at' => 'datetime',
            'snoozed_until' => 'datetime',
        ];
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function scopeForBusiness(Builder $query, int $businessId): Builder
    {
        return $query->where('business_id', $businessId);
    }

    /** Active reminders the owner should see now (pending, or snooze elapsed). */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where(function (Builder $q) {
            $q->where('status', ReminderStatus::Pending->value)
                ->orWhere(function (Builder $s) {
                    $s->where('status', ReminderStatus::Snoozed->value)
                        ->whereNotNull('snoozed_until')
                        ->where('snoozed_until', '<=', now());
                });
        });
    }
}
