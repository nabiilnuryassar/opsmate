import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { MOBILE_NAV, ADD_ICON } from './nav-config'
import { cn } from '@/lib/utils'

const QUICK_ACTIONS = [
  { label: 'Tambah Order', to: '/orders/new' },
  { label: 'Tambah Customer', to: '/customers/new' },
  { label: 'Tambah Produk', to: '/products/new' },
  { label: 'Buat Invoice', to: '/invoices/new' },
]

/** Floating mobile bottom navigation with center Add sheet (DESIGN §11.1). */
export function MobileBottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const navigate = useNavigate()

  const go = (to: string) => {
    setSheetOpen(false)
    navigate(to)
  }

  const left = MOBILE_NAV.slice(0, 2)
  const right = MOBILE_NAV.slice(2)
  const AddIcon = ADD_ICON

  return (
    <>
      {sheetOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/40 lg:hidden"
          onClick={() => setSheetOpen(false)}
        >
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-[24px] bg-white p-4 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-neutral-200" />
            <p className="mb-3 text-sm font-semibold text-neutral-900">Aksi Cepat</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.to}
                  onClick={() => go(a.to)}
                  className="rounded-[12px] border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-4 bottom-4 z-30 flex h-[72px] items-center justify-around rounded-[24px] border border-neutral-200 bg-white shadow-md lg:hidden">
        {left.map((item) => (
          <NavItemLink key={item.to} item={item} />
        ))}

        <button
          type="button"
          aria-label="Aksi cepat"
          onClick={() => setSheetOpen((v) => !v)}
          className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary-700 text-white shadow-md transition-colors hover:bg-primary-800"
        >
          <AddIcon className="h-6 w-6" />
        </button>

        {right.map((item) => (
          <NavItemLink key={item.to} item={item} />
        ))}
      </nav>
    </>
  )
}

function NavItemLink({ item }: { item: (typeof MOBILE_NAV)[number] }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        cn(
          'flex flex-1 flex-col items-center gap-0.5 text-[11px] font-medium',
          isActive ? 'text-primary-700' : 'text-neutral-400',
        )
      }
    >
      <Icon className="h-5 w-5" />
      {item.label}
    </NavLink>
  )
}
