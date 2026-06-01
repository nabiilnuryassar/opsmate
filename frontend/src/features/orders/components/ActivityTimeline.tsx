import { CheckCircle2 } from 'lucide-react'
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/status'
import type { OrderStatus, PaymentStatus } from '@/lib/status'

export interface Activity {
  id: number
  action: string
  from_value: string | null
  to_value: string | null
  created_at: string | null
}

function label(action: string, value: string | null): string {
  if (!value) return ''
  if (action === 'status_changed') return ORDER_STATUS[value as OrderStatus]?.label ?? value
  if (action === 'payment_updated') return PAYMENT_STATUS[value as PaymentStatus]?.label ?? value
  return value
}

function describe(a: Activity): string {
  if (a.action === 'status_changed') {
    return `Status: ${label(a.action, a.from_value)} → ${label(a.action, a.to_value)}`
  }
  if (a.action === 'payment_updated') {
    return `Pembayaran: ${label(a.action, a.from_value)} → ${label(a.action, a.to_value)}`
  }
  return 'Order dibuat'
}

function timeLabel(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return <p className="text-sm text-neutral-400">Belum ada aktivitas.</p>
  }

  return (
    <ol className="flex flex-col gap-3">
      {activities.map((a) => (
        <li key={a.id} className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <div>
            <p className="text-sm text-neutral-700">{describe(a)}</p>
            <p className="text-xs text-neutral-400">{timeLabel(a.created_at)}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
