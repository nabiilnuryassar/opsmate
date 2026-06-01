import Markdown from 'react-markdown'
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
          'max-w-[85%] rounded-[16px] px-4 py-2.5 text-sm',
          isUser ? 'bg-primary-700 text-white' : 'bg-ai-50 text-neutral-900',
        )}
      >
        {isUser ? (
          <span className="whitespace-pre-line">{message.content}</span>
        ) : (
          <Markdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              ul: ({ children }) => <ul className="mb-2 list-disc pl-4 last:mb-0">{children}</ul>,
              ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 last:mb-0">{children}</ol>,
              li: ({ children }) => <li className="mb-0.5">{children}</li>,
              h1: ({ children }) => <p className="mb-1 font-bold">{children}</p>,
              h2: ({ children }) => <p className="mb-1 font-bold">{children}</p>,
              h3: ({ children }) => <p className="mb-1 font-semibold">{children}</p>,
            }}
          >
            {message.content}
          </Markdown>
        )}
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
