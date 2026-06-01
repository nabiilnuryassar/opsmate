import { Badge } from '@/components/shared/StatusBadge'
import type { BadgeTone } from '@/lib/status'
import { formatRupiah } from '@/lib/utils'
import type { Invoice, InvoiceStatus } from '../api/invoices-api'

const STATUS_TONE: Record<InvoiceStatus, BadgeTone> = {
  draft: 'neutral',
  sent: 'info',
  paid: 'success',
  overdue: 'danger',
  cancelled: 'neutral',
}

function dueLabel(iso: string | null): string {
  if (!iso) return ''
  return `Jatuh tempo: ${new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`
}

interface InvoiceCardProps {
  invoice: Invoice
  onClick?: () => void
}

export function InvoiceCard({ invoice, onClick }: InvoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-1 rounded-[16px] border border-neutral-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-neutral-50"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-neutral-900">{invoice.invoice_number}</p>
        <Badge label={invoice.status_label} tone={STATUS_TONE[invoice.status]} />
      </div>
      <p className="text-sm text-neutral-500">
        {invoice.customer?.name ?? '-'} · {formatRupiah(invoice.total)}
      </p>
      <p className="text-xs text-neutral-400">{dueLabel(invoice.due_date)}</p>
    </button>
  )
}

export { STATUS_TONE }
