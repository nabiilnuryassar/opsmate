import { ORDER_STATUS } from '@/lib/status'
import type { OrderStatus } from '@/lib/status'
import { allowedOrderTargets } from '../transitions'
import { cn } from '@/lib/utils'

interface StatusControlProps {
  current: OrderStatus
  onChange: (status: OrderStatus) => void
  disabled?: boolean
}

/** Order-status picker that only offers valid forward transitions (TASK-08). */
export function StatusControl({ current, onChange, disabled }: StatusControlProps) {
  const targets = allowedOrderTargets(current)

  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={cn(
          'rounded-full border px-3 py-1 text-xs font-semibold',
          'border-primary-700 bg-primary-50 text-primary-700',
        )}
      >
        {ORDER_STATUS[current].label}
      </span>
      {targets.map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onChange(s)}
          className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-500 transition-colors hover:border-primary-400 hover:text-primary-700 disabled:opacity-50"
        >
          → {ORDER_STATUS[s].label}
        </button>
      ))}
      {targets.length === 0 && (
        <span className="text-xs text-neutral-400">Status final, tidak bisa diubah.</span>
      )}
    </div>
  )
}
