import { useNavigate } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { useMe } from '@/features/auth/api/auth-api'
import { useDashboard } from '@/features/dashboard/api/dashboard-api'
import { AIChatPanel } from '../components/AIChatPanel'
import { SuggestedPromptChips } from '../components/SuggestedPromptChips'
import { ChatInput } from '../components/ChatInput'
import { useAIMessages, useSendMessage } from '../api/ai-api'

export function AIAssistantPage() {
  const navigate = useNavigate()
  const { data: user } = useMe()
  const { data: dashboard } = useDashboard()
  const { data: messages } = useAIMessages()
  const send = useSendMessage()

  const onSend = (text: string) => send.mutate(text)

  return (
    <AppShell
      greeting="Tanya AI"
      businessName={user?.business?.name ?? 'OpsMate AI'}
      userName={user?.name ?? 'Owner'}
      onLogout={() => navigate('/login')}
    >
      <div className="flex flex-col gap-3 pb-4">
        <div className="flex items-center gap-3 rounded-[16px] border border-ai-100 bg-ai-50 p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ai-600 text-white">
            <Bot className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-neutral-900">{user?.business?.name ?? 'Bisnismu'}</p>
            <p className="text-xs text-neutral-500">
              {dashboard ? `${dashboard.metrics.orders_today} order hari ini` : 'AI Ops Manager'}
            </p>
          </div>
          <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success">
            AKTIF
          </span>
        </div>

        <AIChatPanel messages={messages ?? []} isThinking={send.isPending} />

        <div className="sticky bottom-0 flex flex-col gap-2 bg-neutral-50 pt-2">
          <SuggestedPromptChips onPick={onSend} disabled={send.isPending} />
          <ChatInput onSend={onSend} disabled={send.isPending} />
        </div>
      </div>
    </AppShell>
  )
}
