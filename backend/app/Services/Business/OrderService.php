<?php

namespace App\Services\Business;

use App\Models\Business;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Create an order with items, computing totals and a per-business order number.
     *
     * @param  array{customer_id:int, order_date?:string, due_date?:?string, status?:string, payment_status?:string, discount?:float, notes?:?string, items:array<int, array{product_id:int, quantity:int, price?:float}>}  $data
     */
    public function create(Business $business, User $user, array $data): Order
    {
        return DB::transaction(function () use ($business, $user, $data) {
            $items = $this->resolveItems($business, $data['items']);
            $subtotal = array_sum(array_column($items, 'total'));
            $discount = (float) ($data['discount'] ?? 0);

            $order = Order::create([
                'business_id' => $business->id,
                'customer_id' => $data['customer_id'],
                'order_number' => $this->nextOrderNumber($business),
                'order_date' => $data['order_date'] ?? now()->toDateString(),
                'due_date' => $data['due_date'] ?? null,
                'status' => $data['status'] ?? 'new',
                'payment_status' => $data['payment_status'] ?? 'unpaid',
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => max(0, $subtotal - $discount),
                'notes' => $data['notes'] ?? null,
                'created_by' => $user->id,
            ]);

            $order->items()->createMany($items);

            $this->touchCustomerLastOrder($order);

            return $order->load('items', 'customer');
        });
    }

    /**
     * Replace an order's items and recompute totals atomically.
     *
     * @param  array{customer_id?:int, order_date?:string, due_date?:?string, status?:string, payment_status?:string, discount?:float, notes?:?string, items?:array<int, array{product_id:int, quantity:int, price?:float}>}  $data
     */
    public function update(Order $order, array $data): Order
    {
        return DB::transaction(function () use ($order, $data) {
            $business = $order->business;

            if (isset($data['items'])) {
                $items = $this->resolveItems($business, $data['items']);
                $order->items()->delete();
                $order->items()->createMany($items);
                $subtotal = array_sum(array_column($items, 'total'));
            } else {
                $subtotal = (float) $order->subtotal;
            }

            $discount = (float) ($data['discount'] ?? $order->discount);

            $order->fill([
                'customer_id' => $data['customer_id'] ?? $order->customer_id,
                'order_date' => $data['order_date'] ?? $order->order_date,
                'due_date' => array_key_exists('due_date', $data) ? $data['due_date'] : $order->due_date,
                'status' => $data['status'] ?? $order->status->value,
                'payment_status' => $data['payment_status'] ?? $order->payment_status->value,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => max(0, $subtotal - $discount),
                'notes' => array_key_exists('notes', $data) ? $data['notes'] : $order->notes,
            ])->save();

            return $order->load('items', 'customer');
        });
    }

    /**
     * Resolve item rows: snapshot product name and unit price at order time.
     *
     * @param  array<int, array{product_id:int, quantity:int, price?:float}>  $rawItems
     * @return array<int, array{product_id:int, product_name:string, quantity:int, price:float, total:float}>
     */
    private function resolveItems(Business $business, array $rawItems): array
    {
        $productIds = array_column($rawItems, 'product_id');
        $products = Product::forBusiness($business->id)
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        $resolved = [];
        foreach ($rawItems as $raw) {
            $product = $products->get($raw['product_id']);
            abort_if($product === null, 422, 'Produk tidak valid untuk bisnis ini.');

            $quantity = (int) $raw['quantity'];
            $price = isset($raw['price']) ? (float) $raw['price'] : (float) $product->price;

            $resolved[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'quantity' => $quantity,
                'price' => $price,
                'total' => $price * $quantity,
            ];
        }

        return $resolved;
    }

    /** Sequential, zero-padded, per-business: ORD-0001. */
    private function nextOrderNumber(Business $business): string
    {
        $count = Order::withTrashed()
            ->where('business_id', $business->id)
            ->count();

        return sprintf('ORD-%04d', $count + 1);
    }

    private function touchCustomerLastOrder(Order $order): void
    {
        $order->customer?->update(['last_order_at' => $order->order_date]);
    }
}
