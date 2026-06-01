import { CheckCircle2 } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { PaymentStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/utils'
import { useUpdatePaymentStatus } from '@/features/orders/api/orders-api'
import type { Order } from '@/features/orders/types'

interface UnpaidOrdersPanelProps {
  orders: Order[]
}

export function UnpaidOrdersPanel({ orders }: UnpaidOrdersPanelProps) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-bold text-neutral-900">Tagihan Perlu Aksi</h2>
        <span className="text-xs text-neutral-500">1 tap lunas</span>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="Tidak ada tagihan tertunda"
          description="Semua order sudah lunas. Pertahankan ritme ini."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {orders.map((order) => (
            <UnpaidOrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  )
}

function UnpaidOrderRow({ order }: { order: Order }) {
  const updatePayment = useUpdatePaymentStatus(order.id)

  return (
    <div className="rounded-[14px] border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {order.customer?.name ?? 'Tanpa customer'}
          </p>
          <p className="text-xs text-neutral-500">{order.order_number}</p>
        </div>
        <PaymentStatusBadge status={order.payment_status} />
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-neutral-900">{formatRupiah(order.total)}</p>
        <Button
          size="sm"
          variant="secondary"
          disabled={updatePayment.isPending}
          onClick={() => updatePayment.mutate('paid')}
        >
          <CheckCircle2 className="h-4 w-4" />
          {updatePayment.isPending ? 'Menyimpan...' : 'Tandai Lunas'}
        </Button>
      </div>
    </div>
  )
}
