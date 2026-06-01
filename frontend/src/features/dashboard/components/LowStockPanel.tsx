import { useNavigate } from 'react-router-dom'
import { PackageX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/features/products/types'

export function LowStockPanel({ products }: { products: Product[] }) {
  const navigate = useNavigate()

  if (products.length === 0) return null

  return (
    <section className="rounded-[16px] border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-bold text-neutral-900">Stok Menipis</h2>
      <div className="flex flex-col gap-2">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            className="flex items-center gap-3 rounded-[12px] border border-neutral-100 p-2 text-left hover:bg-neutral-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-danger-soft text-danger">
              <PackageX className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">{p.name}</p>
              <p className="text-xs text-danger">
                Tersisa {p.stock ?? 0}
                {p.unit ? ` ${p.unit}` : ''}
              </p>
            </div>
          </button>
        ))}
      </div>
      <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => navigate('/products?low=1')}>
        Atur Inventori
      </Button>
    </section>
  )
}
