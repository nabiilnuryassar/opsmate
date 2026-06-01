import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import type {
  Customer,
  CustomerFilters,
  CustomerPayload,
  Paginated,
} from '../types'

export function useCustomers(filters: CustomerFilters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.customers, filters],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Customer>>('/customers', {
        params: filters,
      })
      return data
    },
  })
}

export function useCustomer(id: number | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEYS.customers, id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Customer }>(`/customers/${id}`)
      return data.data
    },
    enabled: Boolean(id),
  })
}

export function useCreateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CustomerPayload) => {
      const { data } = await api.post<{ data: Customer }>('/customers', payload)
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.customers }),
  })
}

export function useUpdateCustomer(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CustomerPayload) => {
      const { data } = await api.put<{ data: Customer }>(`/customers/${id}`, payload)
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.customers }),
  })
}

export function useDeleteCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/customers/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.customers }),
  })
}
