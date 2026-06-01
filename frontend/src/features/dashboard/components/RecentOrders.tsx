import { useNavigate } from 'react-router-dom'
import { OrderCard } from '@/features/orders/components/OrderCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Order } from '@/features/orders/types'

export function RecentOrders({ orders }: { orders: Order[] }) {
  const navigate = useNavigate()

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-bold text-neutral-900">Order Terbaru</h2>
        <button
          onClick={() => navigate('/orders')}
          className="text-sm font-semibold text-primary-700"
        >
          Lihat Semua
        </button>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="Belum ada order"
          description="Mulai catat order pertama supaya laporan harian bisa dibuat otomatis."
          actionLabel="Tambah Order Pertama"
          onAction={() => navigate('/orders/new')}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} onClick={() => navigate(`/orders/${o.id}`)} />
          ))}
        </div>
      )}
    </section>
  )
}
