<?php

namespace App\Services\Business;

use App\Enums\InvoiceStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ReminderPriority;
use App\Enums\ReminderStatus;
use App\Enums\ReminderType;
use App\Models\Business;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Product;
use App\Models\Reminder;
use Illuminate\Support\Carbon;

class ReminderService
{
    /**
     * Regenerate auto reminders for a business. Idempotent: an open reminder for
     * the same (type, source row) is reused, not duplicated.
     *
     * @return int number of reminders created this run
     */
    public function generateForBusiness(Business $business): int
    {
        $created = 0;
        $today = Carbon::today();

        // 1. Unpaid orders placed before today.
        $unpaidOrders = Order::forBusiness($business->id)
            ->where('payment_status', PaymentStatus::Unpaid->value)
            ->whereDate('order_date', '<', $today)
            ->with('customer')
            ->get();
        foreach ($unpaidOrders as $order) {
            $daysOverdue = abs($today->diffInDays(Carbon::parse($order->order_date)));
            $created += $this->upsert($business, ReminderType::UnpaidOrder, 'order', $order->id, [
                'title' => ($order->customer?->name ?? 'Customer').' belum bayar',
                'description' => "Order {$order->order_number} sebesar Rp".number_format((float) $order->total, 0, ',', '.').' belum dibayar.',
                'priority' => $daysOverdue > 3 ? ReminderPriority::Urgent : ReminderPriority::Today,
                'due_at' => $order->due_date,
            ]);
        }

        // 2. Overdue invoices (due in the past, not paid/cancelled).
        $overdueInvoices = Invoice::forBusiness($business->id)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', $today)
            ->whereNotIn('status', [InvoiceStatus::Paid->value, InvoiceStatus::Cancelled->value])
            ->with('customer')
            ->get();
        foreach ($overdueInvoices as $invoice) {
            $created += $this->upsert($business, ReminderType::OverdueInvoice, 'invoice', $invoice->id, [
                'title' => 'Invoice '.$invoice->invoice_number.' jatuh tempo',
                'description' => 'Invoice untuk '.($invoice->customer?->name ?? 'customer').' sebesar Rp'.number_format((float) $invoice->total, 0, ',', '.').' sudah lewat jatuh tempo.',
                'priority' => ReminderPriority::Urgent,
                'due_at' => $invoice->due_date,
            ]);
        }

        // 3. Low-stock products.
        $lowStock = Product::forBusiness($business->id)->lowStock()->get();
        foreach ($lowStock as $product) {
            $created += $this->upsert($business, ReminderType::LowStock, 'product', $product->id, [
                'title' => 'Restock: '.$product->name,
                'description' => 'Stok '.$product->name.' tinggal '.$product->stock.'. Pertimbangkan restock.',
                'priority' => $product->stock <= 0 ? ReminderPriority::Urgent : ReminderPriority::Today,
                'due_at' => null,
            ]);
        }

        // 4. Unfinished orders older than 2 days.
        $unfinished = Order::forBusiness($business->id)
            ->whereNotIn('status', [
                OrderStatus::Completed->value,
                OrderStatus::Delivered->value,
                OrderStatus::Cancelled->value,
            ])
            ->whereDate('order_date', '<', $today->copy()->subDays(2))
            ->with('customer')
            ->get();
        foreach ($unfinished as $order) {
            $created += $this->upsert($business, ReminderType::UnfinishedOrder, 'order', $order->id, [
                'title' => 'Order belum selesai',
                'description' => "Order {$order->order_number} untuk ".($order->customer?->name ?? 'customer').' masih belum selesai.',
                'priority' => ReminderPriority::Today,
                'due_at' => null,
            ]);
        }

        // 5. Inactive customers (no order in 30 days).
        $inactive = Customer::forBusiness($business->id)
            ->whereNotNull('last_order_at')
            ->whereDate('last_order_at', '<', $today->copy()->subDays(30))
            ->get();
        foreach ($inactive as $customer) {
            $created += $this->upsert($business, ReminderType::InactiveCustomer, 'customer', $customer->id, [
                'title' => $customer->name.' belum order lagi',
                'description' => $customer->name.' belum order sejak 30 hari lalu. Coba follow-up.',
                'priority' => ReminderPriority::Later,
                'due_at' => null,
            ]);
        }

        return $created;
    }

    /**
     * Create the reminder only if no open one exists for this source row.
     *
     * @param  array{title:string, description:string, priority:ReminderPriority, due_at:mixed}  $attrs
     * @return int 1 if created, 0 if a matching open reminder already exists
     */
    private function upsert(
        Business $business,
        ReminderType $type,
        string $relatedType,
        int $relatedId,
        array $attrs,
    ): int {
        $exists = Reminder::forBusiness($business->id)
            ->where('type', $type->value)
            ->where('related_type', $relatedType)
            ->where('related_id', $relatedId)
            ->where('status', '!=', ReminderStatus::Done->value)
            ->exists();

        if ($exists) {
            return 0;
        }

        Reminder::create([
            'business_id' => $business->id,
            'related_type' => $relatedType,
            'related_id' => $relatedId,
            'title' => $attrs['title'],
            'description' => $attrs['description'],
            'type' => $type->value,
            'status' => ReminderStatus::Pending->value,
            'priority' => $attrs['priority']->value,
            'due_at' => $attrs['due_at'],
        ]);

        return 1;
    }
}
