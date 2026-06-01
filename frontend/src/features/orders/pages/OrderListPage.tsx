import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { useMe } from '@/features/auth/api/auth-api'
import { OrderCard } from '../components/OrderCard'
import { useOrders } from '../api/orders-api'
import type { OrderFilters } from '../types'
import { cn } from '@/lib/utils'

type Chip = { key: string; label: string; filters: OrderFilters }

const CHIPS: Chip[] = [
  { key: 'all', label: 'Semua', filters: {} },
  { key: 'today', label: 'Hari Ini', filters: { today: true } },
  { key: 'unpaid', label: 'Belum Bayar', filters: { payment_status: 'unpaid' } },
  { key: 'processing', label: 'Diproses', filters: { status: 'processing' } },
  { key: 'completed', label: 'Selesai', filters: { status: 'completed' } },
]

export function OrderListPage() {
  const navigate = useNavigate()
  const { data: user } = useMe()
  const [search, setSearch] = useState('')
  const [chip, setChip] = useState('all')

  const active = CHIPS.find((c) => c.key === chip) ?? CHIPS[0]
  const { data, isLoading } = useOrders({
    ...active.filters,
    search: search || undefined,
  })

  const orders = data?.data ?? []
  const isEmpty = !isLoading && orders.length === 0 && !search && chip === 'all'

  return (
    <AppShell
      greeting="Orders"
      businessName={user?.business?.name ?? 'OpsMate AI'}
      userName={user?.name ?? 'Owner'}
      onLogout={() => navigate('/login')}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-neutral-900">Orders</h1>
          <Button size="sm" onClick={() => navigate('/orders/new')}>
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor order atau customer..."
            className="auth-input pl-9"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {CHIPS.map((c) => (
            <button
              key={c.key}
              onClick={() => setChip(c.key)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
                chip === c.key
                  ? 'border-primary-700 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 text-neutral-500',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-sm text-neutral-500">Memuat...</p>
        ) : isEmpty ? (
          <EmptyState
            title="Belum ada order"
            description="Mulai catat order pertama supaya laporan harian bisa dibuat otomatis."
            actionLabel="Tambah Order Pertama"
            onAction={() => navigate('/orders/new')}
          />
        ) : orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-500">Tidak ada order yang cocok.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} onClick={() => navigate(`/orders/${o.id}`)} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
