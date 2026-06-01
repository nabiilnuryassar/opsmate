import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardTitle } from '@/components/ui/card'
import { useMe } from '@/features/auth/api/auth-api'
import { useDailyReport } from '../api/reports-api'
import { ReportMetrics } from '../components/ReportMetrics'
import { TopProducts } from '../components/TopProducts'
import { ReportActions } from '../components/ReportActions'

function shiftDate(date: string, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function isToday(date: string): boolean {
  return date === new Date().toISOString().slice(0, 10)
}

function humanDate(date: string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function DailyReportPage() {
  const navigate = useNavigate()
  const { data: user } = useMe()
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const { data: report, isLoading } = useDailyReport(date)

  return (
    <AppShell
      greeting="Laporan Harian"
      businessName={user?.business?.name ?? 'OpsMate AI'}
      userName={user?.name ?? 'Owner'}
      onLogout={() => navigate('/login')}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setDate((d) => shiftDate(d, -1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200"
            aria-label="Hari sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold text-neutral-900">{humanDate(date)}</p>
          <button
            onClick={() => setDate((d) => shiftDate(d, 1))}
            disabled={isToday(date)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 disabled:opacity-40"
            aria-label="Hari berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {isLoading || !report ? (
          <p className="text-sm text-neutral-500">Memuat laporan...</p>
        ) : (
          <>
            <div className="gradient-soft-ai rounded-[20px] border border-ai-100 p-4">
              <div className="mb-2 flex items-center gap-2 text-ai-700">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Ringkasan</span>
              </div>
              <p className="text-sm text-neutral-700">{report.ai_summary}</p>
            </div>

            <ReportActions date={date} summary={report.ai_summary} />

            <ReportMetrics report={report} />

            <Card>
              <CardTitle>Produk Terlaris</CardTitle>
              <div className="mt-3">
                <TopProducts products={report.top_products} />
              </div>
            </Card>

            <Card>
              <CardTitle>Stok Rendah</CardTitle>
              <div className="mt-3 flex flex-col gap-2">
                {report.low_stock.length === 0 ? (
                  <p className="text-sm text-neutral-400">Semua stok aman.</p>
                ) : (
                  report.low_stock.map((s) => (
                    <div key={s.name} className="flex justify-between text-sm">
                      <span className="text-neutral-700">{s.name}</span>
                      <span className="text-danger">
                        Stok {s.stock} / min {s.minimum_stock}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  )
}
