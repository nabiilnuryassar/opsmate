import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AISummaryCardProps {
  summary: string
  onAskAI?: () => void
  onDetail?: () => void
}

const MAX_LENGTH = 100

/** Dashboard AI hero card — truncated by default, expandable. */
export function AISummaryCard({ summary, onAskAI, onDetail }: AISummaryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const needsTruncate = summary.length > MAX_LENGTH
  const displayText = !expanded && needsTruncate
    ? summary.slice(0, MAX_LENGTH).trimEnd() + '...'
    : summary

  return (
    <div className="gradient-ai-card relative overflow-hidden rounded-[24px] p-5 text-white shadow-md">
      <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
      <div className="relative">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-wide">Ringkasan Pintar</span>
        </div>
        <p className="text-[15px] leading-6 text-white/95">{displayText}</p>
        {needsTruncate && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-sm font-semibold text-white/80 underline-offset-2 hover:underline"
          >
            {expanded ? 'Sembunyikan' : 'Lihat selengkapnya'}
          </button>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={onAskAI}>
            <Sparkles className="h-4 w-4" />
            Tanya AI
          </Button>
          {onDetail && (
            <button
              onClick={onDetail}
              className="text-sm font-semibold text-white/90 underline-offset-2 hover:underline"
            >
              Lihat Detail
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
