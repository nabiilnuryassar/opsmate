<?php

namespace App\Enums;

enum OrderStatus: string
{
    case New = 'new';
    case Confirmed = 'confirmed';
    case Processing = 'processing';
    case Ready = 'ready';
    case Completed = 'completed';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::New => 'Baru',
            self::Confirmed => 'Dikonfirmasi',
            self::Processing => 'Diproses',
            self::Ready => 'Siap',
            self::Completed => 'Selesai',
            self::Delivered => 'Dikirim',
            self::Cancelled => 'Batal',
        };
    }

    /** Statuses that count an order as finished/fulfilled. */
    public function isFinished(): bool
    {
        return in_array($this, [self::Completed, self::Delivered], true);
    }
}
