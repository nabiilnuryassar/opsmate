<?php

namespace App\Services\Business;

use App\Enums\ReminderType;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Product;
use App\Models\Reminder;

/**
 * Template-based WhatsApp follow-up generation. TASK-15 swaps in the AI layer
 * behind this same interface, so callers do not change.
 */
class FollowUpMessageService
{
    public function forReminder(Reminder $reminder): string
    {
        $business = $reminder->business;
        $businessName = $business?->name ?? 'kami';

        return match ($reminder->type) {
            ReminderType::UnpaidOrder => $this->unpaidOrder($reminder, $businessName),
            ReminderType::OverdueInvoice => $this->overdueInvoice($reminder, $businessName),
            ReminderType::InactiveCustomer => $this->inactiveCustomer($reminder, $businessName),
            ReminderType::LowStock => $this->lowStock($reminder),
            default => $this->generic($reminder, $businessName),
        };
    }

    private function unpaidOrder(Reminder $reminder, string $businessName): string
    {
        $order = $reminder->related_id ? Order::with('customer')->find($reminder->related_id) : null;
        $name = $order?->customer?->name ?? 'Kak';
        $total = $order ? 'Rp'.number_format((float) $order->total, 0, ',', '.') : '';
        $ref = $order?->order_number ?? '';

        return "Halo Kak {$name}, ini kami dari {$businessName}. "
            ."Mau mengingatkan pembayaran untuk order {$ref} sebesar {$total}. "
            .'Jika sudah transfer, boleh kirim bukti pembayaran ya Kak. Terima kasih banyak.';
    }

    private function overdueInvoice(Reminder $reminder, string $businessName): string
    {
        $invoice = $reminder->related_id ? Invoice::with('customer')->find($reminder->related_id) : null;
        $name = $invoice?->customer?->name ?? 'Kak';
        $total = $invoice ? 'Rp'.number_format((float) $invoice->total, 0, ',', '.') : '';
        $ref = $invoice?->invoice_number ?? '';

        return "Halo Kak {$name}, kami dari {$businessName} ingin mengingatkan invoice {$ref} sebesar {$total} "
            .'yang sudah lewat jatuh tempo. Mohon konfirmasinya ya Kak. Terima kasih.';
    }

    private function inactiveCustomer(Reminder $reminder, string $businessName): string
    {
        $customer = $reminder->related_id ? Customer::find($reminder->related_id) : null;
        $name = $customer?->name ?? 'Kak';

        return "Halo Kak {$name}, sudah lama nih tidak order di {$businessName}. "
            .'Ada promo menarik buat Kakak. Mau saya bantu siapkan order lagi?';
    }

    private function lowStock(Reminder $reminder): string
    {
        $product = $reminder->related_id ? Product::find($reminder->related_id) : null;
        $name = $product?->name ?? 'produk ini';

        return "Pengingat internal: stok {$name} sudah menipis. Segera lakukan restock agar tidak kehabisan.";
    }

    private function generic(Reminder $reminder, string $businessName): string
    {
        return "Halo Kak, ini kami dari {$businessName}. {$reminder->description}";
    }
}
