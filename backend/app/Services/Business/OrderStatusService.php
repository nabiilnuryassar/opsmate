<?php

namespace App\Services\Business;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Validation\ValidationException;

/**
 * Validates order/payment status transitions and records the change to the
 * activity log. Keeps the state machine in one place so the rules cannot drift
 * between callers.
 */
class OrderStatusService
{
    /**
     * Allowed order-status transitions. `cancelled` is reachable from any
     * non-terminal state; terminal states (delivered, cancelled) go nowhere.
     *
     * @var array<string, array<int, OrderStatus>>
     */
    private const ORDER_TRANSITIONS = [
        'new' => [OrderStatus::Confirmed, OrderStatus::Processing, OrderStatus::Cancelled],
        'confirmed' => [OrderStatus::Processing, OrderStatus::Ready, OrderStatus::Cancelled],
        'processing' => [OrderStatus::Ready, OrderStatus::Completed, OrderStatus::Cancelled],
        'ready' => [OrderStatus::Completed, OrderStatus::Delivered, OrderStatus::Cancelled],
        'completed' => [OrderStatus::Delivered],
        'delivered' => [],
        'cancelled' => [],
    ];

    /**
     * Allowed payment-status transitions.
     *
     * @var array<string, array<int, PaymentStatus>>
     */
    private const PAYMENT_TRANSITIONS = [
        'unpaid' => [PaymentStatus::Partial, PaymentStatus::Paid],
        'partial' => [PaymentStatus::Paid],
        'paid' => [PaymentStatus::Refunded],
        'refunded' => [],
    ];

    public function canTransitionOrder(OrderStatus $from, OrderStatus $to): bool
    {
        return $from === $to
            || in_array($to, self::ORDER_TRANSITIONS[$from->value] ?? [], true);
    }

    public function canTransitionPayment(PaymentStatus $from, PaymentStatus $to): bool
    {
        return $from === $to
            || in_array($to, self::PAYMENT_TRANSITIONS[$from->value] ?? [], true);
    }

    public function assertOrderTransition(OrderStatus $from, OrderStatus $to): void
    {
        if (! $this->canTransitionOrder($from, $to)) {
            throw ValidationException::withMessages([
                'status' => ["Status tidak bisa diubah dari '{$from->label()}' ke '{$to->label()}'."],
            ]);
        }
    }

    public function assertPaymentTransition(PaymentStatus $from, PaymentStatus $to): void
    {
        if (! $this->canTransitionPayment($from, $to)) {
            throw ValidationException::withMessages([
                'payment_status' => ["Pembayaran tidak bisa diubah dari '{$from->label()}' ke '{$to->label()}'."],
            ]);
        }
    }
}
