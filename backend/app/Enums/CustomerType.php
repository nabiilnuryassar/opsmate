<?php

namespace App\Enums;

enum CustomerType: string
{
    case New = 'new';
    case Regular = 'regular';
    case Vip = 'vip';
    case Inactive = 'inactive';

    public function label(): string
    {
        return match ($this) {
            self::New => 'Baru',
            self::Regular => 'Langganan',
            self::Vip => 'VIP',
            self::Inactive => 'Tidak Aktif',
        };
    }
}
