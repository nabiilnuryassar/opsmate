import { Search } from 'lucide-react'

interface TopBarProps {
  businessName: string
  greeting: string
  userName: string
  role?: string
}

/** Desktop top bar (DESIGN §10.2 / TASK-02). */
export function TopBar({ businessName, greeting, userName, role = 'Owner' }: TopBarProps) {
  const initials = userName.slice(0, 2).toUpperCase()

  return (
    <div className="sticky top-0 z-20 hidden items-center justify-between border-b border-neutral-200 bg-white/95 px-6 py-3 backdrop-blur lg:flex">
      <div className="leading-tight">
        <p className="text-base font-bold text-neutral-900">{businessName}</p>
        <p className="text-sm text-neutral-500">{greeting}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Cari order, customer, produk..."
            className="h-10 w-72 rounded-[12px] border border-neutral-200 bg-neutral-50 pr-3 pl-9 text-sm outline-none focus:border-primary-400 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
            {initials}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-neutral-900">{userName}</p>
            <p className="text-xs text-primary-700">{role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
