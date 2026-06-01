<?php

namespace App\Http\Resources;

use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Business
 */
class BusinessResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'logo_url' => $this->logo_url,
            'description' => $this->description,
            'currency' => $this->currency,
            'is_complete' => filled($this->category) && filled($this->phone) && filled($this->city),
        ];
    }
}
