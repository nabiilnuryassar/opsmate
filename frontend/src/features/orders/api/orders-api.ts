import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import type { OrderStatus, PaymentStatus } from '@/lib/status'
import type { Order, OrderFilters, OrderPayload, Paginated } from '../types'

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.orders, filters],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Order>>('/orders', { params: filters })
      return data
    },
  })
}

export function useOrder(id: number | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEYS.orders, id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Order }>(`/orders/${id}`)
      return data.data
    },
    enabled: Boolean(id),
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: OrderPayload) => {
      const { data } = await api.post<{ data: Order }>('/orders', payload)
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.orders }),
  })
}

export function useUpdateOrder(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: OrderPayload) => {
      const { data } = await api.put<{ data: Order }>(`/orders/${id}`, payload)
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.orders }),
  })
}

export function useUpdateOrderStatus(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (status: OrderStatus) => {
      const { data } = await api.patch<{ data: Order }>(`/orders/${id}/status`, { status })
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.orders }),
  })
}

export function useUpdatePaymentStatus(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payment_status: PaymentStatus) => {
      const { data } = await api.patch<{ data: Order }>(`/orders/${id}/payment-status`, {
        payment_status,
      })
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.orders }),
  })
}

export function useDeleteOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/orders/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.orders }),
  })
}
