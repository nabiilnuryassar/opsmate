import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingState } from '@/components/shared/LoadingState'
import { useMe } from '@/features/auth/api/auth-api'
import { CustomerCard } from '../components/CustomerCard'
import { useCustomers } from '../api/customers-api'
import type { CustomerType } from '../types'
import { cn } from '@/lib/utils'

const FILTERS: { value: CustomerType | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'new', label: 'Baru' },
  { value: 'regular', label: 'Langganan' },
  { value: 'vip', label: 'VIP' },
  { value: 'inactive', label: 'Tidak Aktif' },
]

export function CustomerListPage() {
  const navigate = useNavigate()
  const { data: user } = useMe()
  const [search, setSearch] = useState('')
  const [type, setType] = useState<CustomerType | 'all'>('all')

  const { data, isLoading } = useCustomers({
    search: search || undefined,
    type: type === 'all' ? undefined : type,
  })

  const customers = data?.data ?? []
  const isEmpty = !isLoading && customers.length === 0 && !search && type === 'all'

  return (
    <AppShell
      greeting="Customers"
      businessName={user?.business?.name ?? 'OpsMate AI'}
      userName={user?.name ?? 'Owner'}
      onLogout={() => navigate('/login')}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-neutral-900">Customers</h1>
          <Button size="sm" onClick={() => navigate('/customers/new')}>
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau nomor..."
            className="auth-input pl-9"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setType(f.value)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
                type === f.value
                  ? 'border-primary-700 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 text-neutral-500',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <LoadingState message="Memuat customer..." />
        ) : isEmpty ? (
          <EmptyState
            title="Belum ada customer"
            description="Tambah customer pertama supaya order bisa dicatat."
            actionLabel="Tambah Customer Pertama"
            onAction={() => navigate('/customers/new')}
          />
        ) : customers.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-500">
            Tidak ada customer yang cocok.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {customers.map((c) => (
              <CustomerCard
                key={c.id}
                customer={c}
                onClick={() => navigate(`/customers/${c.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
