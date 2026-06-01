import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth-store'
import type { Business, UpdateBusinessPayload } from '../types'

async function fetchBusiness(): Promise<Business> {
  const { data } = await api.get<{ data: Business }>('/business')
  return data.data
}

export function useBusiness() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: QUERY_KEYS.business,
    queryFn: fetchBusiness,
    enabled: Boolean(token),
  })
}

export function useUpdateBusiness() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateBusinessPayload) => {
      const { data } = await api.put<{ data: Business }>('/business', payload)
      return data.data
    },
    onSuccess: (business) => {
      qc.setQueryData(QUERY_KEYS.business, business)
      // /me embeds the business name; refresh it too.
      qc.invalidateQueries({ queryKey: QUERY_KEYS.auth })
    },
  })
}
