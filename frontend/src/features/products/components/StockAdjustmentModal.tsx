import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useStockAdjustment } from '../api/products-api'
import type { StockMovementType } from '../api/products-api'

const TYPE_OPTIONS: { value: StockMovementType; label: string }[] = [
  { value: 'in', label: 'Masuk' },
  { value: 'out', label: 'Keluar' },
  { value: 'adjustment', label: 'Koreksi' },
]

interface StockAdjustmentModalProps {
  productId: number
  open: boolean
  onClose: () => void
}

export function StockAdjustmentModal({ productId, open, onClose }: StockAdjustmentModalProps) {
  const adjust = useStockAdjustment(productId)
  const [type, setType] = useState<StockMovementType>('in')
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')

  const close = () => {
    setType('in')
    setQuantity('')
    setNotes('')
    onClose()
  }

  const submit = async () => {
    const qty = Number(quantity)
    if (!Number.isFinite(qty) || qty < 0) return
    await adjust.mutateAsync({ type, quantity: qty, notes: notes || undefined })
    close()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-900/40 sm:items-center">
      <div className="w-full max-w-md rounded-t-[24px] bg-white p-5 sm:rounded-[24px]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">Sesuaikan Stok</h3>
          <button onClick={close} aria-label="Tutup" className="text-neutral-400 hover:text-neutral-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {TYPE_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setType(o.value)}
                className={cn(
                  'flex-1 rounded-[12px] border px-3 py-2 text-sm font-medium',
                  type === o.value
                    ? 'border-primary-700 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 text-neutral-500',
                )}
              >
                {o.label}
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700">
              {type === 'adjustment' ? 'Stok Akhir' : 'Jumlah'}
            </span>
            <input
              type="number"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="auth-input"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700">Catatan</span>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Restock dari supplier"
              className="auth-input"
            />
          </label>

          <Button onClick={submit} disabled={adjust.isPending || quantity === ''}>
            {adjust.isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>
    </div>
  )
}
