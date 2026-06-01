import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { DesktopSidebar } from './DesktopSidebar'
import { MobileHeader } from './MobileHeader'
import { MobileBottomNav } from './MobileBottomNav'
import { TopBar } from './TopBar'

interface AppShellProps {
  children: ReactNode
  businessName?: string
  userName?: string
  greeting?: string
  onLogout?: () => void
}

/** Responsive app shell: sidebar + top bar on desktop, header + bottom nav on mobile. */
export function AppShell({
  children,
  businessName = 'OpsMate AI',
  userName = 'Owner',
  greeting = 'Halo',
  onLogout,
}: AppShellProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-neutral-50">
      <DesktopSidebar onNewEntry={() => navigate('/orders/new')} onLogout={onLogout} />

      <div className="lg:pl-[260px]">
        <MobileHeader greeting={greeting} businessName={businessName} />
        <TopBar businessName={businessName} greeting={greeting} userName={userName} />

        <main className="mx-auto w-full max-w-6xl px-4 pt-4 pb-28 lg:px-6 lg:pb-10">
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}
