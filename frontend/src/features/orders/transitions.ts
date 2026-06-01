import type { OrderStatus, PaymentStatus } from '@/lib/status'

/** Mirrors backend OrderStatusService. Self-transition always allowed (no-op). */
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  new: ['confirmed', 'processing', 'cancelled'],
  confirmed: ['processing', 'ready', 'cancelled'],
  processing: ['ready', 'completed', 'cancelled'],
  ready: ['completed', 'delivered', 'cancelled'],
  completed: ['delivered'],
  delivered: [],
  cancelled: [],
}

export const PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  unpaid: ['partial', 'paid'],
  partial: ['paid'],
  paid: ['refunded'],
  refunded: [],
}

export function allowedOrderTargets(from: OrderStatus): OrderStatus[] {
  return ORDER_TRANSITIONS[from] ?? []
}

export function allowedPaymentTargets(from: PaymentStatus): PaymentStatus[] {
  return PAYMENT_TRANSITIONS[from] ?? []
}
