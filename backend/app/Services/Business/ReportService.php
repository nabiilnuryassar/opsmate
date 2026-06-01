<?php

namespace App\Services\Business;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Business;
use App\Models\Customer;
use App\Models\DailyReport;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Carbon;

class ReportService
{
    /**
     * Build (and persist) the daily report for a business on a given date.
     * Idempotent: re-running updates the same (business, date) row.
     */
    public function generate(Business $business, ?Carbon $date = null): DailyReport
    {
        $date ??= Carbon::today();
        $dateStr = $date->toDateString();

        $orders = Order::forBusiness($business->id)->whereDate('order_date', $dateStr);

        $totalOrders = (clone $orders)->count();
        $totalRevenue = (float) (clone $orders)
            ->where('payment_status', '!=', PaymentStatus::Refunded->value)
            ->sum('total');
        $totalUnpaid = (float) (clone $orders)
            ->where('payment_status', PaymentStatus::Unpaid->value)
            ->sum('total');
        $totalCompleted = (clone $orders)
            ->whereIn('status', [OrderStatus::Completed->value, OrderStatus::Delivered->value])
            ->count();

        $newCustomers = Customer::forBusiness($business->id)
            ->whereDate('created_at', $dateStr)
            ->count();

        $topProducts = OrderItem::query()
            ->select('product_name')
            ->selectRaw('SUM(quantity) as qty')
            ->selectRaw('SUM(total) as revenue')
            ->whereIn('order_id', (clone $orders)->select('id'))
            ->groupBy('product_name')
            ->orderByDesc('qty')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'name' => $row->product_name,
                'quantity' => (int) $row->qty,
                'revenue' => (float) $row->revenue,
            ])
            ->all();

        $lowStock = Product::forBusiness($business->id)
            ->lowStock()
            ->orderBy('stock')
            ->get()
            ->map(fn (Product $p) => [
                'name' => $p->name,
                'stock' => $p->stock,
                'minimum_stock' => $p->minimum_stock,
            ])
            ->all();

        return DailyReport::updateOrCreate(
            ['business_id' => $business->id, 'report_date' => $dateStr],
            [
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'total_unpaid' => $totalUnpaid,
                'total_completed' => $totalCompleted,
                'new_customers' => $newCustomers,
                'top_products_json' => $topProducts,
                'low_stock_json' => $lowStock,
            ],
        );
    }

    /**
     * Template-based fallback summary (AI-generated in TASK-15).
     */
    public function fallbackSummary(DailyReport $report): string
    {
        if ($report->total_orders === 0) {
            return 'Belum ada order yang tercatat hari ini.';
        }

        $revenue = 'Rp'.number_format((float) $report->total_revenue, 0, ',', '.');
        $summary = "Hari ini bisnis kamu mendapatkan {$report->total_orders} order dengan total {$revenue}.";

        $top = $report->top_products_json[0] ?? null;
        if ($top) {
            $summary .= " Produk terlaris adalah {$top['name']} sebanyak {$top['quantity']} kali.";
        }

        if ((float) $report->total_unpaid > 0) {
            $unpaid = 'Rp'.number_format((float) $report->total_unpaid, 0, ',', '.');
            $summary .= " Ada order belum dibayar dengan total {$unpaid}.";
        }

        $lowCount = count($report->low_stock_json ?? []);
        if ($lowCount > 0) {
            $summary .= " {$lowCount} produk stoknya hampir habis dan perlu restock.";
        }

        return $summary;
    }
}
