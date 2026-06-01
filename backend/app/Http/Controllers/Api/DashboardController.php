<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Enums\PaymentStatus;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Product;
use App\Services\Business\DashboardService;
use App\Support\ActiveBusiness;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboard) {}

    public function summary(Request $request): JsonResponse
    {
        $user = $request->user();
        $business = ActiveBusiness::forUserOrFail($user);

        $recentOrders = Order::forBusiness($business->id)
            ->with('customer')
            ->withCount('items')
            ->latest('order_date')
            ->latest('id')
            ->limit(5)
            ->get();

        $lowStock = Product::forBusiness($business->id)
            ->lowStock()
            ->orderBy('stock')
            ->limit(5)
            ->get();

        $unpaidOrders = Order::forBusiness($business->id)
            ->whereIn('payment_status', [PaymentStatus::Unpaid->value, PaymentStatus::Partial->value])
            ->with('customer')
            ->withCount('items')
            ->latest('order_date')
            ->latest('id')
            ->limit(5)
            ->get();

        return response()->json([
            'greeting' => "{$this->dashboard->greeting()}, {$user->name}",
            'business_name' => $business->name,
            'metrics' => $this->dashboard->metrics($business),
            'recent_orders' => OrderResource::collection($recentOrders),
            'reminders' => [], // populated in TASK-11
            'unpaid_orders' => OrderResource::collection($unpaidOrders),
            'low_stock_products' => ProductResource::collection($lowStock),
        ]);
    }
}
