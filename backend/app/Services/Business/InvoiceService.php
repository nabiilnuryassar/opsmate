<?php

namespace App\Services\Business;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
    /**
     * Generate (or return existing) invoice for an order. One invoice per order.
     */
    public function fromOrder(Order $order): Invoice
    {
        return DB::transaction(function () use ($order) {
            $existing = Invoice::forBusiness($order->business_id)
                ->where('order_id', $order->id)
                ->first();

            if ($existing) {
                return $existing;
            }

            return Invoice::create([
                'business_id' => $order->business_id,
                'order_id' => $order->id,
                'customer_id' => $order->customer_id,
                'invoice_number' => $this->nextInvoiceNumber($order->business_id),
                'issue_date' => Carbon::today()->toDateString(),
                'due_date' => $order->due_date ?? Carbon::today()->addDays(7)->toDateString(),
                'total' => $order->total,
                'status' => InvoiceStatus::Draft->value,
            ]);
        });
    }

    /** Render the invoice as a PDF and return the binary string. */
    public function renderPdf(Invoice $invoice): string
    {
        $invoice->load(['business', 'customer', 'order.items']);

        return Pdf::loadView('pdf.invoice', ['invoice' => $invoice])
            ->setPaper('a4')
            ->output();
    }

    /** Plain-text invoice suitable for pasting into WhatsApp. */
    public function toText(Invoice $invoice): string
    {
        $invoice->load(['business', 'customer', 'order.items']);

        $lines = [];
        $lines[] = "*{$invoice->business->name}*";
        $lines[] = "Invoice {$invoice->invoice_number}";
        $lines[] = "Tanggal: {$invoice->issue_date->format('d M Y')}";
        $lines[] = "Untuk: {$invoice->customer->name}";
        $lines[] = '';
        foreach ($invoice->order->items as $item) {
            $lineTotal = number_format((float) $item->total, 0, ',', '.');
            $lines[] = "{$item->product_name} x{$item->quantity} - Rp{$lineTotal}";
        }
        $lines[] = '';
        $total = number_format((float) $invoice->total, 0, ',', '.');
        $lines[] = "*Total: Rp{$total}*";
        $lines[] = "Status: {$invoice->status->label()}";

        return implode("\n", $lines);
    }

    /** Sequential, zero-padded, per-business: INV-0001. */
    private function nextInvoiceNumber(int $businessId): string
    {
        $count = Invoice::where('business_id', $businessId)->count();

        return sprintf('INV-%04d', $count + 1);
    }
}
