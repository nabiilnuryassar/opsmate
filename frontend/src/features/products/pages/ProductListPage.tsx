import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { useMe } from '@/features/auth/api/auth-api'
import { ProductCard } from '../components/ProductCard'
import { useProducts } from '../api/products-api'
import type { ProductType } from '../types'
import { cn } from '@/lib/utils'

type FilterKey = 'all' | ProductType | 'low_stock'

const FILTERS: { value: FilterKey; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'product', label: 'Produk' },
  { value: 'service', label: 'Layanan' },
  { value: 'low_stock', label: 'Stok Rendah' },
]

export function ProductListPage() {
  const navigate = useNavigate()
  const { data: user } = useMe()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')

  const { data, isLoading } = useProducts({
    search: search || undefined,
    type: filter === 'product' || filter === 'service' ? filter : undefined,
    low_stock: filter === 'low_stock' ? true : undefined,
  })

  const products = data?.data ?? []
  const isEmpty = !isLoading && products.length === 0 && !search && filter === 'all'

  return (
    <AppShell
      greeting="Products"
      businessName={user?.business?.name ?? 'OpsMate AI'}
      userName={user?.name ?? 'Owner'}
      onLogout={() => navigate('/login')}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-neutral-900">Produk & Layanan</h1>
          <Button size="sm" onClick={() => navigate('/products/new')}>
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="auth-input pl-9"
          />
        </div>

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
            title="Belum ada produk"
            description="Tambah produk pertama supaya bisa mulai catat order."
            actionLabel="Tambah Produk Pertama"
            onAction={() => navigate('/products/new')}
          />
        ) : products.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-500">
            Tidak ada produk yang cocok.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => navigate(`/products/${p.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
