import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIGradientCardProps {
  summary: ReactNode
  actions?: ReactNode
  title?: string
  className?: string
}

/** AI Summary Card (DESIGN §12.3) — gradient hero with sparkle icon + actions. */
export function AIGradientCard({
  summary,
  actions,
  title = 'Ringkasan AI',
  className,
}: AIGradientCardProps) {
  return (
    <div
      className={cn(
        'gradient-ai-card relative overflow-hidden rounded-[24px] p-5 text-white shadow-md',
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold tracking-wide">{title}</span>
      </div>
      <div className="text-[15px] leading-6 text-white/95">{summary}</div>
      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
