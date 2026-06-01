import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  trend?: string
  trendTone?: 'up' | 'down' | 'neutral'
  iconClass?: string
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  trendTone = 'neutral',
  iconClass = 'bg-primary-100 text-primary-700',
}: MetricCardProps) {
  return (
    <div className="rounded-[16px] border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-[12px]', iconClass)}>
          <Icon className="h-5 w-5" />
        </span>
        {trend && (
          <span
            className={cn(
              'text-xs font-semibold',
              trendTone === 'up' && 'text-success',
              trendTone === 'down' && 'text-danger',
              trendTone === 'neutral' && 'text-neutral-400',
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="mt-3 text-xs text-neutral-500">{label}</p>
      <p className="text-xl font-bold text-neutral-900">{value}</p>
    </div>
  )
}
