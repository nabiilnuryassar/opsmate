import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import type { Paginated } from '@/features/customers/types'

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface Invoice {
  id: number
  invoice_number: string
  order_id: number
  issue_date: string | null
  due_date: string | null
  total: number
  status: InvoiceStatus
  status_label: string
  customer?: { id: number; name: string; phone: string | null }
  order?: { id: number; order_number: string }
  created_at: string | null
}

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Terkirim',
  paid: 'Lunas',
  overdue: 'Jatuh Tempo',
  cancelled: 'Batal',
}

export function useInvoices(status?: InvoiceStatus) {
  return useQuery({
    queryKey: [...QUERY_KEYS.invoices, status ?? 'all'],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Invoice>>('/invoices', {
        params: status ? { status } : {},
      })
      return data
    },
  })
}

export function useInvoice(id: number | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEYS.invoices, id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Invoice }>(`/invoices/${id}`)
      return data.data
    },
    enabled: Boolean(id),
  })
}

export function useCreateInvoiceFromOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (orderId: number) => {
      const { data } = await api.post<{ data: Invoice }>(`/invoices/from-order/${orderId}`)
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.invoices }),
  })
}

export function useUpdateInvoiceStatus(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (status: InvoiceStatus) => {
      const { data } = await api.patch<{ data: Invoice }>(`/invoices/${id}/status`, { status })
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.invoices }),
  })
}

export async function fetchInvoiceText(id: number): Promise<string> {
  const { data } = await api.get<{ text: string }>(`/invoices/${id}/text`)
  return data.text
}

export function invoicePdfUrl(id: number): string {
  const base = import.meta.env.VITE_API_URL ?? '/api'
  return `${base}/invoices/${id}/pdf`
}
