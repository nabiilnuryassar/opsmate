import { useState } from 'react'
import { Sparkles, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGeneratePromoIdeas } from '../api/ai-api'

/** On-demand promo idea generator (TASK-15 §15.3). */
export function PromoIdeasPanel() {
  const generate = useGeneratePromoIdeas()
  const [ideas, setIdeas] = useState('')
  const [copied, setCopied] = useState(false)

  const run = async () => {
    setIdeas(await generate.mutateAsync('this_week'))
  }

  const copy = async () => {
    await navigator.clipboard.writeText(ideas)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-[16px] border border-ai-100 bg-ai-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-ai-700">
        <Sparkles className="h-4 w-4" />
        <span className="text-sm font-semibold">Ide Promo</span>
      </div>

      {ideas ? (
        <>
          <p className="text-sm whitespace-pre-line text-neutral-700">{ideas}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="secondary" onClick={copy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Tersalin' : 'Salin Ide'}
            </Button>
            <Button size="sm" variant="ghost" onClick={run} disabled={generate.isPending}>
              Buat Lagi
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-neutral-600">
            Dapatkan ide promo berdasarkan produk yang sedang laku.
          </p>
          <Button size="sm" variant="ai" className="mt-3" onClick={run} disabled={generate.isPending}>
            {generate.isPending ? 'Menyiapkan...' : 'Buat Ide Promo'}
          </Button>
        </>
      )}
    </div>
  )
}
