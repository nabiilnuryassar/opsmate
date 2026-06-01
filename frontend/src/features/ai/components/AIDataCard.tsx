import { MessageCircle } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import type { UnpaidEntry } from '../api/ai-api'

export function AIDataCard({ entry }: { entry: UnpaidEntry }) {
  return (
    <div className="rounded-[12px] border border-neutral-200 bg-white p-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-neutral-900">{entry.customer ?? 'Customer'}</span>
        <span className="font-semibold text-danger">{formatRupiah(entry.total)}</span>
      </div>
      <p className="text-xs text-neutral-400">{entry.order_number}</p>
      <a
        href={`/orders/${entry.order_id}`}
        className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary-700 px-3 py-1 text-xs font-semibold text-white"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        Buat Pesan WhatsApp
      </a>
    </div>
  )
}
