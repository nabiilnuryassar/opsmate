<?php

namespace App\Services\AI;

use App\Enums\PaymentStatus;
use App\Models\Business;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\Business\DashboardService;
use Illuminate\Support\Carbon;

/**
 * Controlled tool functions the AI may call (PRD §13.3, §16.2). The model never
 * touches the database directly — every tool is scoped to the active business.
 */
class AIToolService
{
    public function __construct(private readonly DashboardService $dashboard) {}

    /** @return array<string, mixed> */
    public function getTodaySummary(Business $business): array
    {
        return $this->dashboard->metrics($business);
    }

    /** @return array<int, array<string, mixed>> */
    public function getUnpaidOrders(Business $business): array
    {
        return Order::forBusiness($business->id)
            ->where('payment_status', PaymentStatus::Unpaid->value)
            ->with('customer')
            ->latest('order_date')
            ->limit(20)
            ->get()
            ->map(fn (Order $o) => [
                'order_number' => $o->order_number,
                'customer' => $o->customer?->name,
                'customer_id' => $o->customer_id,
                'order_id' => $o->id,
                'total' => (float) $o->total,
            ])
            ->all();
    }

    /** @return array<int, array<string, mixed>> */
    public function getLowStockProducts(Business $business): array
    {
        return Product::forBusiness($business->id)
            ->lowStock()
            ->orderBy('stock')
            ->get()
            ->map(fn (Product $p) => [
                'name' => $p->name,
                'stock' => $p->stock,
                'minimum_stock' => $p->minimum_stock,
            ])
            ->all();
    }

    /** @return array<int, array<string, mixed>> */
    public function getTopProducts(Business $business, int $days = 7): array
    {
        $since = Carbon::today()->subDays($days)->toDateString();

        return OrderItem::query()
            ->select('product_name')
            ->selectRaw('SUM(quantity) as qty')
            ->selectRaw('SUM(total) as revenue')
            ->whereIn(
                'order_id',
                Order::forBusiness($business->id)->whereDate('order_date', '>=', $since)->select('id'),
            )
            ->groupBy('product_name')
            ->orderByDesc('qty')
            ->limit(5)
            ->get()
            ->map(fn ($r) => [
                'name' => $r->product_name,
                'quantity' => (int) $r->qty,
                'revenue' => (float) $r->revenue,
            ])
            ->all();
    }

    /** @return array<int, array<string, mixed>> */
    public function getInactiveCustomers(Business $business, int $days = 30): array
    {
        $cutoff = Carbon::today()->subDays($days)->toDateString();

        return Customer::forBusiness($business->id)
            ->whereNotNull('last_order_at')
            ->whereDate('last_order_at', '<', $cutoff)
            ->limit(20)
            ->get()
            ->map(fn (Customer $c) => [
                'name' => $c->name,
                'customer_id' => $c->id,
                'last_order_at' => $c->last_order_at?->toDateString(),
            ])
            ->all();
    }
}
