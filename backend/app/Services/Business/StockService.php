<?php

namespace App\Services\Business;

use App\Enums\OrderStatus;
use App\Enums\StockMovementType;
use App\Models\Order;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class StockService
{
    /**
     * Reduce stock for each tracked product in an order (type=out). Idempotent
     * per order: skips if an 'out' movement already exists for the order.
     */
    public function reduceForOrder(Order $order, ?int $userId = null): void
    {
        DB::transaction(function () use ($order, $userId) {
            $already = StockMovement::where('reference_type', 'order')
                ->where('reference_id', $order->id)
                ->where('type', StockMovementType::Out->value)
                ->exists();

            if ($already) {
                return;
            }

            $order->loadMissing('items');
            foreach ($order->items as $item) {
                if ($item->product_id === null) {
                    continue;
                }
                $product = Product::find($item->product_id);
                if ($product === null || $product->stock === null) {
                    continue; // service or untracked product
                }

                $this->record($product, StockMovementType::Out, -$item->quantity, 'order', $order->id, $userId);
            }
        });
    }

    /**
     * Reverse a previously-reduced order (type=in) when it is cancelled.
     */
    public function reverseForOrder(Order $order, ?int $userId = null): void
    {
        DB::transaction(function () use ($order, $userId) {
            $reduced = StockMovement::where('reference_type', 'order')
                ->where('reference_id', $order->id)
                ->where('type', StockMovementType::Out->value)
                ->exists();
            $alreadyReversed = StockMovement::where('reference_type', 'order')
                ->where('reference_id', $order->id)
                ->where('type', StockMovementType::In->value)
                ->exists();

            if (! $reduced || $alreadyReversed) {
                return;
            }

            $order->loadMissing('items');
            foreach ($order->items as $item) {
                if ($item->product_id === null) {
                    continue;
                }
                $product = Product::find($item->product_id);
                if ($product === null || $product->stock === null) {
                    continue;
                }

                $this->record($product, StockMovementType::In, $item->quantity, 'order', $order->id, $userId);
            }
        });
    }

    /**
     * Apply a manual stock change. `in`/`out` are deltas; `adjustment` sets the
     * absolute level and records the difference as the movement quantity.
     */
    public function adjust(
        Product $product,
        StockMovementType $type,
        int $quantity,
        ?string $notes = null,
        ?int $userId = null,
    ): StockMovement {
        abort_if($product->stock === null, 422, 'Produk ini tidak melacak stok.');

        return DB::transaction(function () use ($product, $type, $quantity, $notes, $userId) {
            $delta = match ($type) {
                StockMovementType::In => abs($quantity),
                StockMovementType::Out => -abs($quantity),
                StockMovementType::Adjustment => $quantity - $product->stock,
            };

            return $this->record($product, $type, $delta, 'manual', null, $userId, $notes);
        });
    }

    /**
     * Persist one movement and apply the signed delta to the product stock
     * (clamped at zero). Assumes it runs inside a transaction.
     */
    private function record(
        Product $product,
        StockMovementType $type,
        int $signedQuantity,
        string $referenceType,
        ?int $referenceId,
        ?int $userId,
        ?string $notes = null,
    ): StockMovement {
        $movement = StockMovement::create([
            'business_id' => $product->business_id,
            'product_id' => $product->id,
            'type' => $type->value,
            'quantity' => $signedQuantity,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'notes' => $notes,
            'created_by' => $userId,
        ]);

        $product->stock = max(0, (int) $product->stock + $signedQuantity);
        $product->save();

        return $movement;
    }
}
