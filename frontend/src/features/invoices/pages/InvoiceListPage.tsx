import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { useMe } from '@/features/auth/api/auth-api'
import { InvoiceCard } from '../components/InvoiceCard'
import { useInvoices } from '../api/invoices-api'
import type { InvoiceStatus } from '../api/invoices-api'
import { cn } from '@/lib/utils'

const FILTERS: { value: InvoiceStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Terkirim' },
  { value: 'paid', label: 'Lunas' },
  { value: 'overdue', label: 'Jatuh Tempo' },
]

export function InvoiceListPage() {
  const navigate = useNavigate()
  const { data: user } = useMe()
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all')

  const { data, isLoading } = useInvoices(filter === 'all' ? undefined : filter)
  const invoices = data?.data ?? []
  const isEmpty = !isLoading && invoices.length === 0 && filter === 'all'

  return (
    <AppShell
      greeting="Invoices"
      businessName={user?.business?.name ?? 'OpsMate AI'}
      userName={user?.name ?? 'Owner'}
      onLogout={() => navigate('/login')}
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-neutral-900">Invoices</h1>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium',
                filter === f.value
                  ? 'border-primary-700 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 text-neutral-500',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-sm text-neutral-500">Memuat...</p>
        ) : isEmpty ? (
          <EmptyState
            title="Belum ada invoice"
            description="Buat invoice dari order yang sudah ada di halaman detail order."
            actionLabel="Lihat Order"
            onAction={() => navigate('/orders')}
          />
        ) : invoices.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-500">
            Tidak ada invoice dengan status ini.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {invoices.map((inv) => (
              <InvoiceCard
                key={inv.id}
                invoice={inv}
                onClick={() => navigate(`/invoices/${inv.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
