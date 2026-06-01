<?php

namespace App\Support;

use App\Models\Business;
use App\Models\User;

/**
 * Resolves the active business for the authenticated user.
 *
 * MVP: a user operates a single business (their first membership). This is the
 * single chokepoint every tenant-scoped controller uses, so widening the rule
 * later (e.g. an explicit business switcher) touches one place.
 */
class ActiveBusiness
{
    public static function forUser(?User $user): ?Business
    {
        return $user?->currentBusiness();
    }

    /**
     * Resolve the active business or fail. Use in controllers that require one.
     */
    public static function forUserOrFail(?User $user): Business
    {
        $business = self::forUser($user);

        abort_if($business === null, 404, 'Bisnis tidak ditemukan.');

        return $business;
    }
}
