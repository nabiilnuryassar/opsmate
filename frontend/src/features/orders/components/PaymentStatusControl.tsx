import { PAYMENT_STATUS } from '@/lib/status'
import type { PaymentStatus } from '@/lib/status'
import { allowedPaymentTargets } from '../transitions'
import { cn } from '@/lib/utils'

interface PaymentStatusControlProps {
  current: PaymentStatus
  onChange: (status: PaymentStatus) => void
  disabled?: boolean
}

/** Payment-status picker that only offers valid transitions (TASK-08). */
export function PaymentStatusControl({ current, onChange, disabled }: PaymentStatusControlProps) {
  const targets = allowedPaymentTargets(current)

  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={cn(
          'rounded-full border px-3 py-1 text-xs font-semibold',
          'border-primary-700 bg-primary-50 text-primary-700',
        )}
      >
        {PAYMENT_STATUS[current].label}
      </span>
      {targets.map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onChange(s)}
          className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-500 transition-colors hover:border-primary-400 hover:text-primary-700 disabled:opacity-50"
        >
          → {PAYMENT_STATUS[s].label}
        </button>
      ))}
      {targets.length === 0 && (
        <span className="text-xs text-neutral-400">Status final.</span>
      )}
    </div>
  )
}
