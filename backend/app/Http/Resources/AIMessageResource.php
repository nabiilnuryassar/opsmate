<?php

namespace App\Http\Resources;

use App\Models\AIMessage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin AIMessage
 */
class AIMessageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'role' => $this->role,
            'content' => $this->content,
            'unpaid' => $this->metadata_json['unpaid'] ?? [],
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
