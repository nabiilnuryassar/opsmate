import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

/** Centered card layout for auth pages (TASK-03 §3.2 design rules). */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary-700 text-white">
            <Sparkles className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
        </div>

        <div className="rounded-[16px] border border-neutral-200 bg-white p-6 shadow-sm">
          {children}
        </div>

        {footer && <div className="mt-4 text-center text-sm text-neutral-500">{footer}</div>}
      </div>
    </div>
  )
}
