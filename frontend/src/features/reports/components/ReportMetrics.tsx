import { formatRupiah } from '@/lib/utils'
import type { DailyReport } from '../api/reports-api'

export function ReportMetrics({ report }: { report: DailyReport }) {
  const items = [
    { label: 'Total Order', value: `${report.total_orders}` },
    { label: 'Omzet', value: formatRupiah(report.total_revenue) },
    { label: 'Belum Bayar', value: formatRupiah(report.total_unpaid) },
    { label: 'Order Selesai', value: `${report.total_completed}` },
    { label: 'Customer Baru', value: `${report.new_customers}` },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {items.map((it) => (
        <div key={it.label} className="rounded-[16px] border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-neutral-500">{it.label}</p>
          <p className="text-lg font-bold text-neutral-900">{it.value}</p>
        </div>
      ))}
    </div>
  )
}
