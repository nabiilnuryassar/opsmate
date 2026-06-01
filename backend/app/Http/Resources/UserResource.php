<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $business = $this->currentBusiness();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'business' => $business ? [
                'id' => $business->id,
                'name' => $business->name,
                'role' => $business->roleFor($this->resource)?->value,
            ] : null,
        ];
    }
}
