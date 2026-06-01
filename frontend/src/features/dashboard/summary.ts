import { formatRupiah } from '@/lib/utils'
import type { DashboardMetrics } from './api/dashboard-api'

export type TrendTone = 'up' | 'down' | 'neutral'

/** Classify a trend string like "+12%" / "-5%" / "+0" into a visual tone. */
export function trendTone(trend: string): TrendTone {
  if (/^\+(?!0%?$)/.test(trend)) return 'up'
  if (trend.startsWith('-')) return 'down'
  return 'neutral'
}

/** Build the human AI-style summary line shown in the dashboard hero. */
export function buildSummary(m: DashboardMetrics): string {
  if (m.orders_today <= 0) {
    return 'Belum ada order hari ini. Mulai catat order pertama supaya saya bisa bantu rangkum bisnismu.'
  }

  const head = `Hari ini ada ${m.orders_today} order dengan estimasi omzet ${formatRupiah(m.revenue_today)}. `

  const tail =
    m.unpaid_count > 0
      ? `Ada ${m.unpaid_count} order belum dibayar (${formatRupiah(m.unpaid_total)}) yang perlu dicek ya.`
      : 'Semua order hari ini sudah dibayar. Mantap!'

  return head + tail
}
