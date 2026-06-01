import { CheckCircle2, FastForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ORDER_STATUS, PAYMENT_STATUS, type OrderStatus, type PaymentStatus } from '@/lib/status'
import { useUpdateOrderStatus, useUpdatePaymentStatus } from '../api/orders-api'
import type { Order } from '../types'

const NEXT_ORDER_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  new: 'confirmed',
  confirmed: 'processing',
  processing: 'ready',
  ready: 'completed',
  completed: 'delivered',
}

const FINAL_PAYMENT: PaymentStatus[] = ['paid', 'refunded']

interface OrderQuickActionsProps {
  order: Order
}

export function OrderQuickActions({ order }: OrderQuickActionsProps) {
  const updateStatus = useUpdateOrderStatus(order.id)
  const updatePayment = useUpdatePaymentStatus(order.id)

  const nextStatus = NEXT_ORDER_STATUS[order.status]
  const canMarkPaid = !FINAL_PAYMENT.includes(order.payment_status)

  if (!nextStatus && !canMarkPaid) {
    return null
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {nextStatus && (
        <Button
          size="sm"
          variant="secondary"
          disabled={updateStatus.isPending}
          onClick={() => updateStatus.mutate(nextStatus)}
        >
          <FastForward className="h-4 w-4" />
          {updateStatus.isPending ? 'Mengubah...' : `Lanjut ke ${ORDER_STATUS[nextStatus].label}`}
        </Button>
      )}

      {canMarkPaid && (
        <Button
          size="sm"
          variant="secondary"
          disabled={updatePayment.isPending}
          onClick={() => updatePayment.mutate('paid')}
        >
          <CheckCircle2 className="h-4 w-4" />
          {updatePayment.isPending ? 'Menyimpan...' : `Tandai ${PAYMENT_STATUS.paid.label}`}
        </Button>
      )}
    </div>
  )
}
