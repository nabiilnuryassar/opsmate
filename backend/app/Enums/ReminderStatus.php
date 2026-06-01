<?php

namespace App\Enums;

enum ReminderStatus: string
{
    case Pending = 'pending';
    case Done = 'done';
    case Snoozed = 'snoozed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Belum Selesai',
            self::Done => 'Selesai',
            self::Snoozed => 'Ditunda',
        };
    }
}
