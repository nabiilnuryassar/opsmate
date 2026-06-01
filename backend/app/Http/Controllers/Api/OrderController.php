<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Customer;
use App\Models\Order;
use App\Services\Business\OrderService;
use App\Services\Business\OrderStatusService;
use App\Services\Business\StockService;
use App\Support\ActiveBusiness;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orders,
        private readonly OrderStatusService $statuses,
        private readonly StockService $stock,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        $query = Order::forBusiness($business->id)
            ->with('customer')
            ->withCount('items');

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($c) => $c->where('name', 'like', "%{$search}%"));
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($paymentStatus = $request->query('payment_status')) {
            $query->where('payment_status', $paymentStatus);
        }

        if ($request->query('today')) {
            $query->whereDate('order_date', now()->toDateString());
        }

        if ($from = $request->query('from')) {
            $query->whereDate('order_date', '>=', $from);
        }
        if ($to = $request->query('to')) {
            $query->whereDate('order_date', '<=', $to);
        }

        $sort = in_array($request->query('sort'), ['order_date', 'created_at', 'total'], true)
            ? $request->query('sort')
            : 'order_date';
        $direction = $request->query('direction') === 'asc' ? 'asc' : 'desc';

        return OrderResource::collection(
            $query->orderBy($sort, $direction)->orderByDesc('id')->paginate(20)->withQueryString(),
        );
    }

    public function store(CreateOrderRequest $request): OrderResource
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        $this->assertCustomerInBusiness($business->id, (int) $request->validated()['customer_id']);

        $order = $this->orders->create($business, $request->user(), $request->validated());

        return new OrderResource($order);
    }

    public function show(Request $request, Order $order): OrderResource
    {
        $this->authorizeOrder($request, $order);

        return new OrderResource($order->load('items', 'customer'));
    }

    public function update(CreateOrderRequest $request, Order $order): OrderResource
    {
        $this->authorizeOrder($request, $order);
        $this->assertCustomerInBusiness($order->business_id, (int) $request->validated()['customer_id']);

        $order = $this->orders->update($order, $request->validated());

        return new OrderResource($order);
    }

    public function destroy(Request $request, Order $order): Response
    {
        $this->authorizeOrder($request, $order);

        $order->delete();

        return response()->noContent();
    }

    public function updateStatus(Request $request, Order $order): OrderResource
    {
        $this->authorizeOrder($request, $order);

        $validated = $request->validate([
            'status' => ['required', Rule::enum(OrderStatus::class)],
        ]);

        $from = $order->status;
        $to = OrderStatus::from($validated['status']);
        $this->statuses->assertOrderTransition($from, $to);

        if ($from !== $to) {
            $order->update(['status' => $to->value]);
            $order->activities()->create([
                'user_id' => $request->user()->id,
                'action' => 'status_changed',
                'from_value' => $from->value,
                'to_value' => $to->value,
            ]);

            // Reduce stock when an order is fulfilled; reverse it when cancelled.
            if ($to->isFinished()) {
                $this->stock->reduceForOrder($order, $request->user()->id);
            } elseif ($to === OrderStatus::Cancelled) {
                $this->stock->reverseForOrder($order, $request->user()->id);
            }
        }

        return new OrderResource($order->load('items', 'customer', 'activities'));
    }

    public function updatePaymentStatus(Request $request, Order $order): OrderResource
    {
        $this->authorizeOrder($request, $order);

        $validated = $request->validate([
            'payment_status' => ['required', Rule::enum(PaymentStatus::class)],
        ]);

        $from = $order->payment_status;
        $to = PaymentStatus::from($validated['payment_status']);
        $this->statuses->assertPaymentTransition($from, $to);

        if ($from !== $to) {
            $order->update(['payment_status' => $to->value]);
            $order->activities()->create([
                'user_id' => $request->user()->id,
                'action' => 'payment_updated',
                'from_value' => $from->value,
                'to_value' => $to->value,
            ]);
        }

        return new OrderResource($order->load('items', 'customer', 'activities'));
    }

    private function authorizeOrder(Request $request, Order $order): void
    {
        $business = ActiveBusiness::forUserOrFail($request->user());

        abort_unless($order->business_id === $business->id, 404, 'Order tidak ditemukan.');
    }

    /** Ensure the referenced customer belongs to this business (cross-tenant guard). */
    private function assertCustomerInBusiness(int $businessId, int $customerId): void
    {
        $exists = Customer::forBusiness($businessId)->whereKey($customerId)->exists();

        abort_unless($exists, 422, 'Customer tidak valid untuk bisnis ini.');
    }
}
