import { cn } from '@/lib/utils'
import {
  PAYMENT_STATUS,
  ORDER_STATUS,
  CUSTOMER_TYPE,
  type BadgeTone,
  type PaymentStatus,
  type OrderStatus,
  type CustomerType,
} from '@/lib/status'

const TONE_CLASS: Record<BadgeTone, string> = {
  primary: 'bg-primary-100 text-primary-800',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-[#92600a]',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  ai: 'bg-ai-100 text-ai-700',
  neutral: 'bg-neutral-100 text-neutral-500',
}

function Badge({ label, tone }: { label: string; tone: BadgeTone }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full px-2 text-[12px] font-semibold',
        TONE_CLASS[tone],
      )}
    >
      {label}
    </span>
  )
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const meta = PAYMENT_STATUS[status]
  return <Badge label={meta.label} tone={meta.tone} />
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS[status]
  return <Badge label={meta.label} tone={meta.tone} />
}

export function CustomerTypeBadge({ type }: { type: CustomerType }) {
  const meta = CUSTOMER_TYPE[type]
  return <Badge label={meta.label} tone={meta.tone} />
}

export { Badge }
