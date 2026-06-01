import { Bell } from 'lucide-react'

interface MobileHeaderProps {
  greeting: string
  businessName?: string
}

/** Sticky mobile top header (DESIGN §10.1 / TASK-02). */
export function MobileHeader({ greeting, businessName = 'OpsMate AI' }: MobileHeaderProps) {
  const initials = greeting
    .replace(/^(Pagi|Siang|Sore|Malam),?\s*/i, '')
    .trim()
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
          {initials || 'OM'}
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-neutral-900">{greeting}</p>
          <p className="text-xs text-neutral-500">{businessName}</p>
        </div>
      </div>
      <button
        type="button"
        aria-label="Notifikasi"
        className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
      >
        <Bell className="h-5 w-5" />
      </button>
    </header>
  )
}
