import { PaymentStatusBadge, OrderStatusBadge } from '@/components/shared/StatusBadge'
import { formatRupiah } from '@/lib/utils'
import type { Order } from '../types'

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

function dateLabel(iso: string | null): string {
  if (!iso) return ''
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'Hari ini'
  if (days === 1) return 'Kemarin'
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

interface OrderCardProps {
  order: Order
  onClick?: () => void
  actions?: React.ReactNode
}

export function OrderCard({ order, onClick, actions }: OrderCardProps) {
  const name = order.customer?.name ?? 'Tanpa customer'
  const isUnpaid = order.payment_status === 'unpaid'

  return (
    <div
      className={`rounded-[16px] border bg-white p-4 shadow-sm transition-colors ${
        isUnpaid ? 'border-danger-soft' : 'border-neutral-200'
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 text-left hover:bg-neutral-50"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
          {initials(name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-neutral-900">{name}</p>
          <p className="text-xs text-neutral-400">
            {order.order_number} · {dateLabel(order.order_date)}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            <PaymentStatusBadge status={order.payment_status} />
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        <p className="shrink-0 font-semibold text-neutral-900">{formatRupiah(order.total)}</p>
      </button>
      {actions}
    </div>
  )
}
