<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type?->value,
            'category' => $this->category,
            'price' => (float) $this->price,
            'cost_price' => $this->cost_price !== null ? (float) $this->cost_price : null,
            'stock' => $this->stock,
            'minimum_stock' => $this->minimum_stock,
            'unit' => $this->unit,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'is_low_stock' => $this->isLowStock(),
            'margin' => $this->cost_price !== null
                ? (float) $this->price - (float) $this->cost_price
                : null,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
