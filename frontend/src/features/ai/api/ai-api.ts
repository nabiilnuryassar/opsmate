import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'

export interface UnpaidEntry {
  order_number: string
  customer: string | null
  customer_id: number | null
  order_id: number
  total: number
}

export interface AIMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  unpaid: UnpaidEntry[]
  created_at: string | null
}

const AI_KEY = ['ai', 'messages'] as const

export function useAIMessages() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: AI_KEY,
    queryFn: async () => {
      const { data } = await api.get<{ data: AIMessage[] }>('/ai/messages')
      return data.data
    },
    enabled: Boolean(token),
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (message: string) => {
      const { data } = await api.post<{ data: AIMessage }>('/ai/chat', { message })
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: AI_KEY }),
  })
}

export function useAISummary() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['ai', 'dashboard-summary'],
    queryFn: async () => {
      const { data } = await api.get<{ summary: string }>('/dashboard/ai-summary')
      return data.summary
    },
    enabled: Boolean(token),
    staleTime: 5 * 60_000,
  })
}

export type FollowUpType = 'payment' | 'reorder' | 'general'

export async function generateFollowUp(payload: {
  customer_id: number
  order_id?: number
  type: FollowUpType
}): Promise<string> {
  const { data } = await api.post<{ message: string }>('/ai/generate-follow-up', payload)
  return data.message
}

export function useGeneratePromoIdeas() {
  return useMutation({
    mutationFn: async (period: 'this_week' | 'this_month' = 'this_week') => {
      const { data } = await api.post<{ ideas: string }>('/ai/generate-promo-ideas', { period })
      return data.ideas
    },
  })
}
