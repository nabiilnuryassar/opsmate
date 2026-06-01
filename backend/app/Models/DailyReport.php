<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyReport extends Model
{
    protected $fillable = [
        'business_id',
        'report_date',
        'total_orders',
        'total_revenue',
        'total_unpaid',
        'total_completed',
        'new_customers',
        'top_products_json',
        'low_stock_json',
        'ai_summary',
    ];

    protected function casts(): array
    {
        return [
            'report_date' => 'date',
            'total_revenue' => 'decimal:2',
            'total_unpaid' => 'decimal:2',
            'top_products_json' => 'array',
            'low_stock_json' => 'array',
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
}
