import { Badge } from '@/components/shared/StatusBadge'
import { formatRupiah } from '@/lib/utils'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onClick?: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const isService = product.type === 'service'

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-1 rounded-[16px] border border-neutral-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-neutral-50"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-neutral-900">{product.name}</p>
        <div className="flex shrink-0 gap-1">
          {product.is_low_stock && <Badge label="Stok Hampir Habis" tone="danger" />}
          {!product.is_active && <Badge label="Nonaktif" tone="neutral" />}
        </div>
      </div>

      <p className="text-sm font-semibold text-primary-700">{formatRupiah(product.price)}</p>

      <p className="text-xs text-neutral-400">
        {isService
          ? 'Layanan'
          : product.stock != null
            ? `Stok ${product.stock}${product.unit ? ' ' + product.unit : ''} tersisa`
            : 'Stok tidak dilacak'}
        {product.category ? ` · ${product.category}` : ''}
      </p>
    </button>
  )
}
