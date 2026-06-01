import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'

export type ReminderPriority = 'urgent' | 'today' | 'later'
export type ReminderType =
  | 'unpaid_order'
  | 'overdue_invoice'
  | 'low_stock'
  | 'inactive_customer'
  | 'unfinished_order'
  | 'follow_up'

export interface Reminder {
  id: number
  title: string
  description: string | null
  type: ReminderType
  type_label: string
  status: 'pending' | 'done' | 'snoozed'
  priority: ReminderPriority
  related_type: string | null
  related_id: number | null
  due_at: string | null
  completed_at: string | null
}

export function useReminders() {
  return useQuery({
    queryKey: QUERY_KEYS.reminders,
    queryFn: async () => {
      const { data } = await api.get<{ data: Reminder[] }>('/reminders')
      return data.data
    },
  })
}

export function useCompleteReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/reminders/${id}/done`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.reminders })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.dashboard })
    },
  })
}

export function useSnoozeReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, until }: { id: number; until?: string }) => {
      await api.patch(`/reminders/${id}/snooze`, until ? { until } : {})
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.reminders }),
  })
}

export async function generateFollowUp(id: number): Promise<string> {
  const { data } = await api.post<{ message: string }>(`/reminders/${id}/generate-message`)
  return data.message
}
