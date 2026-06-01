<?php

namespace App\Services\Business;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Business;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Carbon;

class DashboardService
{
    /**
     * Aggregate the day's operational metrics for a business.
     *
     * @return array<string, mixed>
     */
    public function metrics(Business $business): array
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();

        $ordersToday = Order::forBusiness($business->id)
            ->whereDate('order_date', $today)->count();
        $ordersYesterday = Order::forBusiness($business->id)
            ->whereDate('order_date', $yesterday)->count();

        $revenueToday = (float) Order::forBusiness($business->id)
            ->whereDate('order_date', $today)
            ->where('payment_status', '!=', PaymentStatus::Refunded->value)
            ->sum('total');
        $revenueYesterday = (float) Order::forBusiness($business->id)
            ->whereDate('order_date', $yesterday)
            ->where('payment_status', '!=', PaymentStatus::Refunded->value)
            ->sum('total');

        $unpaid = Order::forBusiness($business->id)
            ->where('payment_status', PaymentStatus::Unpaid->value);
        $unpaidTotal = (float) (clone $unpaid)->sum('total');
        $unpaidCount = (clone $unpaid)->count();

        $processingCount = Order::forBusiness($business->id)
            ->where('status', OrderStatus::Processing->value)->count();

        $newCustomers = Customer::forBusiness($business->id)
            ->whereDate('created_at', $today)->count();

        $lowStockCount = Product::forBusiness($business->id)->lowStock()->count();

        return [
            'orders_today' => $ordersToday,
            'orders_today_trend' => $this->signed($ordersToday - $ordersYesterday),
            'revenue_today' => $revenueToday,
            'revenue_trend_pct' => $this->percentTrend($revenueToday, $revenueYesterday),
            'unpaid_total' => $unpaidTotal,
            'unpaid_count' => $unpaidCount,
            'processing_count' => $processingCount,
            'new_customers' => $newCustomers,
            'low_stock_count' => $lowStockCount,
        ];
    }

    /** Greeting bucketed by hour of day (PRD §10.3 / TASK-09 §9.1). */
    public function greeting(?Carbon $now = null): string
    {
        $hour = ($now ?? Carbon::now())->hour;

        return match (true) {
            $hour < 11 => 'Pagi',
            $hour < 15 => 'Siang',
            $hour < 18 => 'Sore',
            default => 'Malam',
        };
    }

    private function signed(int $delta): string
    {
        return ($delta >= 0 ? '+' : '').$delta;
    }

    /** Percentage change vs a baseline, formatted like "+12%" / "-5%". */
    private function percentTrend(float $current, float $previous): string
    {
        if ($previous <= 0.0) {
            return $current > 0.0 ? '+100%' : '0%';
        }

        $pct = (int) round((($current - $previous) / $previous) * 100);

        return ($pct >= 0 ? '+' : '').$pct.'%';
    }
}
