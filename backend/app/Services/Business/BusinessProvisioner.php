<?php

namespace App\Services\Business;

use App\Enums\BusinessRole;
use App\Models\Business;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class BusinessProvisioner
{
    /**
     * Create a business for a freshly registered user and attach them as owner.
     */
    public function createForOwner(User $owner, string $businessName): Business
    {
        return DB::transaction(function () use ($owner, $businessName) {
            $business = Business::create([
                'owner_id' => $owner->getKey(),
                'name' => $businessName,
            ]);

            $business->members()->attach($owner->getKey(), [
                'role' => BusinessRole::Owner->value,
            ]);

            return $business;
        });
    }
}
