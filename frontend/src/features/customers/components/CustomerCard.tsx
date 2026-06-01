import { CustomerTypeBadge } from '@/components/shared/StatusBadge'
import type { Customer } from '../types'

/** Mask a phone like 081234567890 -> 0812-xxxx-7890 for the list view (privacy). */
export function maskPhone(phone: string | null): string {
  if (!phone) return '-'
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 6) return phone
  const head = digits.slice(0, 4)
  const tail = digits.slice(-2)
  return `${head}-xxxx-${tail}`
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

function lastOrderLabel(iso: string | null): string {
  if (!iso) return 'Belum pernah order'
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'Order hari ini'
  if (days === 1) return 'Order kemarin'
  return `Terakhir order ${days} hari lalu`
}

interface CustomerCardProps {
  customer: Customer
  onClick?: () => void
}

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[16px] border border-neutral-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-neutral-50"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
        {initials(customer.name)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold text-neutral-900">{customer.name}</p>
          <CustomerTypeBadge type={customer.customer_type} />
        </div>
        <p className="text-sm text-neutral-500">{maskPhone(customer.phone)}</p>
        <p className="text-xs text-neutral-400">
          {customer.orders_count != null ? `${customer.orders_count} order · ` : ''}
          {lastOrderLabel(customer.last_order_at)}
        </p>
      </div>
    </button>
  )
}
