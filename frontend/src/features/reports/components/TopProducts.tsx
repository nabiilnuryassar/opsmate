import { formatRupiah } from '@/lib/utils'
import type { TopProduct } from '../api/reports-api'

export function TopProducts({ products }: { products: TopProduct[] }) {
  if (products.length === 0) {
    return <p className="text-sm text-neutral-400">Belum ada penjualan hari ini.</p>
  }

  const max = Math.max(...products.map((p) => p.quantity), 1)

  return (
    <div className="flex flex-col gap-3">
      {products.map((p) => (
        <div key={p.name}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-neutral-900">{p.name}</span>
            <span className="text-neutral-500">
              {p.quantity}x · {formatRupiah(p.revenue)}
            </span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-neutral-100">
            <div
              className="h-2 rounded-full bg-primary-500"
              style={{ width: `${(p.quantity / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
