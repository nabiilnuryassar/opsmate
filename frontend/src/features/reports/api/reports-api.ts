import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth-store'

export interface TopProduct {
  name: string
  quantity: number
  revenue: number
}

export interface LowStockEntry {
  name: string
  stock: number | null
  minimum_stock: number | null
}

export interface DailyReport {
  id: number
  report_date: string
  total_orders: number
  total_revenue: number
  total_unpaid: number
  total_completed: number
  new_customers: number
  top_products: TopProduct[]
  low_stock: LowStockEntry[]
  ai_summary: string | null
}

export function useDailyReport(date?: string) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: [...QUERY_KEYS.reports, date ?? 'today'],
    queryFn: async () => {
      const path = date ? `/reports/daily/${date}` : '/reports/daily'
      const { data } = await api.get<{ data: DailyReport }>(path)
      return data.data
    },
    enabled: Boolean(token),
  })
}

export function reportPdfUrl(date: string): string {
  const base = import.meta.env.VITE_API_URL ?? '/api'
  return `${base}/reports/daily/${date}/pdf`
}
