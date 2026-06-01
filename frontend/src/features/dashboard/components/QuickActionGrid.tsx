import { useNavigate } from 'react-router-dom'
import { ShoppingCart, UserPlus, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Action {
  label: string
  icon: LucideIcon
  to: string
}

const ACTIONS: Action[] = [
  { label: 'Tambah Order', icon: ShoppingCart, to: '/orders/new' },
  { label: 'Tambah Customer', icon: UserPlus, to: '/customers/new' },
  { label: 'Buat Invoice', icon: FileText, to: '/invoices/new' },
]

export function QuickActionGrid() {
  const navigate = useNavigate()
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {ACTIONS.map((a) => {
        const Icon = a.icon
        return (
          <button
            key={a.to}
            onClick={() => navigate(a.to)}
            className="flex shrink-0 items-center gap-2 rounded-[16px] border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <Icon className="h-4 w-4" />
            </span>
            {a.label}
          </button>
        )
      })}
    </div>
  )
}
