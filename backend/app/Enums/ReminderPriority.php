<?php

namespace App\Enums;

enum ReminderPriority: string
{
    case Urgent = 'urgent';
    case Today = 'today';
    case Later = 'later';

    public function label(): string
    {
        return match ($this) {
            self::Urgent => 'Urgent',
            self::Today => 'Hari Ini',
            self::Later => 'Nanti',
        };
    }
}
