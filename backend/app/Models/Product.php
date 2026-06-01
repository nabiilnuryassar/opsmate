<?php

namespace App\Models;

use App\Enums\ProductType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'business_id',
        'name',
        'type',
        'category',
        'price',
        'cost_price',
        'stock',
        'minimum_stock',
        'unit',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'type' => ProductType::class,
            'price' => 'decimal:2',
            'cost_price' => 'decimal:2',
            'stock' => 'integer',
            'minimum_stock' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /** A stock-tracked product at or below its minimum stock level. */
    public function isLowStock(): bool
    {
        return $this->stock !== null
            && $this->minimum_stock !== null
            && $this->stock <= $this->minimum_stock;
    }

    public function scopeForBusiness(Builder $query, int $businessId): Builder
    {
        return $query->where('business_id', $businessId);
    }

    /** Stock-tracked products at or below minimum stock. */
    public function scopeLowStock(Builder $query): Builder
    {
        return $query
            ->whereNotNull('stock')
            ->whereNotNull('minimum_stock')
            ->whereColumn('stock', '<=', 'minimum_stock');
    }
}
