import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  FileText,
  BellRing,
  BarChart3,
  Sparkles,
  Settings,
  Home,
  Plus,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

/** Desktop sidebar items (DESIGN §11.2 / PRD §17.2). */
export const SIDEBAR_NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/reminders', label: 'Reminders', icon: BellRing },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/ai', label: 'AI Assistant', icon: Sparkles },
  { to: '/settings', label: 'Settings', icon: Settings },
]

/** Mobile bottom nav (DESIGN §11.1). The center "Add" opens a quick-action sheet. */
export const MOBILE_NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/reminders', label: 'Reminder', icon: BellRing },
  { to: '/ai', label: 'AI', icon: Sparkles },
]

export const ADD_ICON = Plus
