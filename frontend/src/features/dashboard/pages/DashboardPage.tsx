import { useNavigate } from 'react-router-dom'
import { Wallet, PackageX, Clock, UserPlus } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { formatRupiah } from '@/lib/utils'
import { useLogout } from '@/features/auth/api/auth-api'
import { useDashboard } from '../api/dashboard-api'
import { AISummaryCard } from '../components/AISummaryCard'
import { MetricCard } from '../components/MetricCard'
import { QuickActionGrid } from '../components/QuickActionGrid'
import { RecentOrders } from '../components/RecentOrders'
import { LowStockPanel } from '../components/LowStockPanel'
import { trendTone, buildSummary } from '../summary'
import { useAISummary } from '@/features/ai/api/ai-api'

export function DashboardPage() {
  const navigate = useNavigate()
  const logout = useLogout()
  const { data, isLoading } = useDashboard()

  const m = data?.metrics
  const { data: aiSummary } = useAISummary()
  const summary = aiSummary ?? (m ? buildSummary(m) : '')

  return (
    <AppShell
      greeting={data?.greeting ?? 'Halo'}
      businessName={data?.business_name ?? 'OpsMate AI'}
      onLogout={() => logout.mutate(undefined, { onSettled: () => navigate('/login') })}
    >
      {isLoading || !m ? (
        <p className="text-sm text-neutral-500">Memuat dashboard...</p>
      ) : (
        <div className="flex flex-col gap-5">
          <AISummaryCard summary={summary} onAskAI={() => navigate('/ai')} />
          <QuickActionGrid />

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetricCard
              icon={Wallet}
              label="Omzet Hari Ini"
              value={formatRupiah(m.revenue_today)}
              trend={m.revenue_trend_pct}
              trendTone={trendTone(m.revenue_trend_pct)}
            />
            <MetricCard
              icon={Clock}
              label="Belum Bayar"
              value={formatRupiah(m.unpaid_total)}
              trend={m.unpaid_count > 0 ? `${m.unpaid_count} order` : undefined}
              trendTone="down"
              iconClass="bg-warning-soft text-[#92600a]"
            />
            <MetricCard
              icon={PackageX}
              label="Stok Rendah"
              value={`${m.low_stock_count} item`}
              iconClass="bg-danger-soft text-danger"
            />
            <MetricCard
              icon={UserPlus}
              label="Customer Baru"
              value={`${m.new_customers}`}
              iconClass="bg-info-soft text-info"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentOrders orders={data.recent_orders} />
            </div>
            <div className="flex flex-col gap-5">
              <LowStockPanel products={data.low_stock_products} />
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
