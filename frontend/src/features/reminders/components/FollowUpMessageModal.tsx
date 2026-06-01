import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FollowUpMessageModalProps {
  open: boolean
  message: string
  loading: boolean
  onClose: () => void
}

/** Shows the generated follow-up message; lets the user edit + copy it. */
export function FollowUpMessageModal({
  open,
  message,
  loading,
  onClose,
}: FollowUpMessageModalProps) {
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)

  // Sync the editable draft when a fresh message arrives.
  if (!loading && message && draft === '' && open) {
    setDraft(message)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(draft)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const close = () => {
    setDraft('')
    setCopied(false)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-900/40 sm:items-center">
      <div className="w-full max-w-md rounded-t-[24px] bg-white p-5 sm:rounded-[24px]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">Pesan Follow-up</h3>
          <button onClick={close} aria-label="Tutup" className="text-neutral-400 hover:text-neutral-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <p className="py-6 text-center text-sm text-neutral-500">Menyiapkan pesan...</p>
        ) : (
          <>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={6}
              className="auth-input h-auto py-2 text-sm"
            />
            <div className="mt-3 flex gap-2">
              <Button className="flex-1" onClick={copy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Tersalin' : 'Copy Pesan'}
              </Button>
              <Button variant="secondary" onClick={close}>
                Tutup
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
