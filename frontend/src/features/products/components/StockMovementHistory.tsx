import { Badge } from '@/components/shared/StatusBadge'
import type { BadgeTone } from '@/lib/status'
import { useStockMovements } from '../api/products-api'
import type { StockMovementType } from '../api/products-api'

const TYPE_TONE: Record<StockMovementType, BadgeTone> = {
  in: 'success',
  out: 'danger',
  adjustment: 'info',
}

function dateLabel(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function StockMovementHistory({ productId }: { productId: number }) {
  const { data: movements, isLoading } = useStockMovements(productId)

  if (isLoading) return <p className="text-sm text-neutral-500">Memuat...</p>
  if (!movements || movements.length === 0) {
    return <p className="text-sm text-neutral-400">Belum ada pergerakan stok.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {movements.map((m) => (
        <div key={m.id} className="flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge label={m.type_label} tone={TYPE_TONE[m.type]} />
            <span className="text-neutral-500">{dateLabel(m.created_at)}</span>
            {m.reference_type === 'order' && (
              <span className="text-xs text-neutral-400">dari order</span>
            )}
          </div>
          <span
            className={`font-semibold ${m.quantity >= 0 ? 'text-success' : 'text-danger'}`}
          >
            {m.quantity >= 0 ? '+' : ''}
            {m.quantity}
          </span>
        </div>
      ))}
    </div>
  )
}

export { TYPE_TONE }
