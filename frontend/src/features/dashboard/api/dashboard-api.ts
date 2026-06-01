import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth-store'
import type { Order } from '@/features/orders/types'
import type { Product } from '@/features/products/types'

export interface DashboardMetrics {
  orders_today: number
  orders_today_trend: string
  revenue_today: number
  revenue_trend_pct: string
  unpaid_total: number
  unpaid_count: number
  processing_count: number
  new_customers: number
  low_stock_count: number
}

export interface DashboardSummary {
  greeting: string
  business_name: string
  metrics: DashboardMetrics
  recent_orders: Order[]
  reminders: unknown[]
  unpaid_orders: Order[]
  low_stock_products: Product[]
}

export function useDashboard() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: async () => {
      const { data } = await api.get<DashboardSummary>('/dashboard/summary')
      return data
    },
    enabled: Boolean(token),
  })
}
