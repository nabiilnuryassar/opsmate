import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import type { Product, ProductFilters, ProductPayload, Paginated } from '../types'

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.products, filters],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Product>>('/products', { params: filters })
      return data
    },
  })
}

export function useProduct(id: number | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEYS.products, id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Product }>(`/products/${id}`)
      return data.data
    },
    enabled: Boolean(id),
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ProductPayload) => {
      const { data } = await api.post<{ data: Product }>('/products', payload)
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.products }),
  })
}

export function useUpdateProduct(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ProductPayload) => {
      const { data } = await api.put<{ data: Product }>(`/products/${id}`, payload)
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.products }),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.products }),
  })
}

export type StockMovementType = 'in' | 'out' | 'adjustment'

export interface StockMovement {
  id: number
  type: StockMovementType
  type_label: string
  quantity: number
  reference_type: string | null
  reference_id: number | null
  notes: string | null
  created_at: string | null
}

export function useStockMovements(productId: number | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEYS.products, productId, 'stock-movements'],
    queryFn: async () => {
      const { data } = await api.get<{ data: StockMovement[] }>(
        `/products/${productId}/stock-movements`,
      )
      return data.data
    },
    enabled: Boolean(productId),
  })
}

export function useStockAdjustment(productId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { type: StockMovementType; quantity: number; notes?: string }) => {
      const { data } = await api.post<{ data: Product }>(
        `/products/${productId}/stock-adjustment`,
        payload,
      )
      return data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.products })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.dashboard })
    },
  })
}
