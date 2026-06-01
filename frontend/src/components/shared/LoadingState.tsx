import { cn } from '@/lib/utils'

interface LoadingStateProps {
  message?: string
  className?: string
  fullscreen?: boolean
}

/**
 * Minimal, refined loading indicator.
 * Thin spinner + muted text. No card, no skeleton, no noise.
 */
export function LoadingState({
  message = 'Memuat data...',
  className,
  fullscreen = false,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center gap-3',
        fullscreen ? 'min-h-screen' : 'py-12',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span className="inline-block h-5 w-5 shrink-0 rounded-full border-2 border-neutral-200 border-t-primary-600 animate-spin" />
      <p className="text-sm text-neutral-400">{message}</p>
    </div>
  )
}
