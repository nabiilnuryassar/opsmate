import { NavLink } from 'react-router-dom'
import { Plus, LogOut } from 'lucide-react'
import { SIDEBAR_NAV } from './nav-config'
import { cn } from '@/lib/utils'

interface DesktopSidebarProps {
  onNewEntry?: () => void
  onLogout?: () => void
}

/** Fixed 260px desktop sidebar (DESIGN §10.2 / §11.2). */
export function DesktopSidebar({ onNewEntry, onLogout }: DesktopSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[260px] flex-col border-r border-neutral-200 bg-white px-4 py-5 lg:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <img src="/logo.png" alt="OpsMate AI" className="h-9 w-9 rounded-[12px]" />
        <div className="leading-tight">
          <p className="text-base font-bold text-neutral-900">OpsMate AI</p>
          <p className="text-xs text-neutral-500">SME Manager</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNewEntry}
        className="mb-5 flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-primary-700 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
      >
        <Plus className="h-4 w-4" />
        New Entry
      </button>

      <nav className="flex flex-1 flex-col gap-1">
        {SIDEBAR_NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-4 flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-danger"
      >
        <LogOut className="h-5 w-5" />
        Keluar
      </button>
    </aside>
  )
}
