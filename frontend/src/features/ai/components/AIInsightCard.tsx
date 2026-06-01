import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AIInsightCardProps {
  text: string
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
}

/** Inline AI suggestion shown on order/customer detail pages (TASK-15 §15.5). */
export function AIInsightCard({ text, actionLabel, onAction, children }: AIInsightCardProps) {
  return (
    <div className="rounded-[16px] border border-ai-100 bg-ai-50 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ai-600 text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm text-neutral-700">{text}</p>
          {actionLabel && onAction && (
            <Button size="sm" variant="ai" className="mt-2" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
