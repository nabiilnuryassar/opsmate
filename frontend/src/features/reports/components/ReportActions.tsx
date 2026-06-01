import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Copy, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { reportPdfUrl } from '../api/reports-api'

interface ReportActionsProps {
  date: string
  summary: string | null
}

export function ReportActions({ date, summary }: ReportActionsProps) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!summary) return
    await navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a href={reportPdfUrl(date)} target="_blank" rel="noreferrer">
        <Button size="sm" variant="secondary">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </a>
      <Button size="sm" variant="secondary" onClick={copy} disabled={!summary}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Tersalin' : 'Copy Ringkasan'}
      </Button>
      <Button size="sm" variant="ai" onClick={() => navigate('/ai')}>
        <Sparkles className="h-4 w-4" />
        Tanya AI
      </Button>
    </div>
  )
}
