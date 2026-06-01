import { useEffect, useRef } from 'react'
import { ChatBubble } from './ChatBubble'
import { AITypingIndicator } from './AITypingIndicator'
import type { AIMessage } from '../api/ai-api'

interface AIChatPanelProps {
  messages: AIMessage[]
  pending?: AIMessage | null
  isThinking?: boolean
}

export function AIChatPanel({ messages, pending, isThinking }: AIChatPanelProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isThinking, pending])

  return (
    <div className="flex flex-col gap-4 py-4">
      {messages.length === 0 && !pending && !isThinking && (
        <p className="py-8 text-center text-sm text-neutral-400">
          Tanya apa saja tentang kondisi bisnismu hari ini.
        </p>
      )}

      {messages.map((m) => (
        <ChatBubble key={m.id} message={m} />
      ))}

      {pending && <ChatBubble message={pending} />}

      {isThinking && <AITypingIndicator />}

      <div ref={endRef} />
    </div>
  )
}
