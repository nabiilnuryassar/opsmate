import { cn } from '@/lib/utils'
import { AIDataCard } from './AIDataCard'
import type { AIMessage } from '../api/ai-api'

function timeLabel(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export function ChatBubble({ message }: { message: AIMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-[16px] px-4 py-2.5 text-sm whitespace-pre-line',
          isUser ? 'bg-primary-700 text-white' : 'bg-ai-50 text-neutral-900',
        )}
      >
        {message.content}
      </div>

      {!isUser && message.unpaid.length > 0 && (
        <div className="mt-2 flex w-full max-w-[85%] flex-col gap-2">
          {message.unpaid.slice(0, 5).map((u) => (
            <AIDataCard key={u.order_id} entry={u} />
          ))}
        </div>
      )}

      <span className="mt-1 text-[11px] text-neutral-400">{timeLabel(message.created_at)}</span>
    </div>
  )
}
