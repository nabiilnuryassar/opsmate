import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Copy, Check } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/shared/StatusBadge'
import { LoadingState } from '@/components/shared/LoadingState'
import { formatRupiah, cn } from '@/lib/utils'
import { useMe } from '@/features/auth/api/auth-api'
import {
  useInvoice,
  useUpdateInvoiceStatus,
  fetchInvoiceText,
  invoicePdfUrl,
  INVOICE_STATUS_LABELS,
} from '../api/invoices-api'
import type { InvoiceStatus } from '../api/invoices-api'
import { STATUS_TONE } from '../components/InvoiceCard'

const STATUS_KEYS = Object.keys(INVOICE_STATUS_LABELS) as InvoiceStatus[]

export function InvoiceDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const invoiceId = id ? Number(id) : undefined
  const { data: user } = useMe()
  const { data: invoice, isLoading } = useInvoice(invoiceId)
  const updateStatus = useUpdateInvoiceStatus(invoiceId ?? 0)
  const [copied, setCopied] = useState(false)

  const copyText = async () => {
    if (!invoiceId) return
    const text = await fetchInvoiceText(invoiceId)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AppShell
      greeting="Detail Invoice"
      businessName={user?.business?.name ?? 'OpsMate AI'}
      userName={user?.name ?? 'Owner'}
      onLogout={() => navigate('/login')}
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-neutral-500"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </button>

      {isLoading || !invoice ? (
        <LoadingState message="Memuat detail invoice..." />
      ) : (
        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">{invoice.invoice_number}</h1>
                <p className="text-sm text-neutral-500">
                  {invoice.customer?.name} · {invoice.order?.order_number}
                </p>
              </div>
              <Badge label={invoice.status_label} tone={STATUS_TONE[invoice.status]} />
            </div>
            <p className="mt-3 text-2xl font-bold text-primary-700">
              {formatRupiah(invoice.total)}
            </p>
            <p className="text-sm text-neutral-500">
              Terbit {invoice.issue_date} · Jatuh tempo {invoice.due_date ?? '-'}
            </p>
          </Card>

          <Card>
            <CardTitle>Aksi</CardTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={invoicePdfUrl(invoice.id)} target="_blank" rel="noreferrer">
                <Button size="sm" variant="secondary">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </a>
              <Button size="sm" variant="secondary" onClick={copyText}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Tersalin' : 'Copy Teks'}
              </Button>
            </div>
          </Card>

          <Card>
            <CardTitle>Ubah Status</CardTitle>
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUS_KEYS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus.mutate(s)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium',
                    invoice.status === s
                      ? 'border-primary-700 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 text-neutral-500',
                  )}
                >
                  {INVOICE_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  )
}
