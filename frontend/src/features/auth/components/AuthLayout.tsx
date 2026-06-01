import type { ReactNode } from 'react'


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
          <img src="/logo.png" alt="OpsMate AI" className="mb-3 h-12 w-12 rounded-[16px]" />
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
