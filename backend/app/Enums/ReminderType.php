<?php

namespace App\Enums;

enum ReminderType: string
{
    case UnpaidOrder = 'unpaid_order';
    case OverdueInvoice = 'overdue_invoice';
    case LowStock = 'low_stock';
    case InactiveCustomer = 'inactive_customer';
    case UnfinishedOrder = 'unfinished_order';
    case FollowUp = 'follow_up';

    public function label(): string
    {
        return match ($this) {
            self::UnpaidOrder => 'Belum Bayar',
            self::OverdueInvoice => 'Invoice Jatuh Tempo',
            self::LowStock => 'Stok Rendah',
            self::InactiveCustomer => 'Customer Lama',
            self::UnfinishedOrder => 'Order Belum Selesai',
            self::FollowUp => 'Follow-up',
        };
    }
}
