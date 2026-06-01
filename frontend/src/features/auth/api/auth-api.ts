import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth-store'
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '../types'

async function fetchMe(): Promise<User> {
  const { data } = await api.get<{ data: User }>('/me')
  return data.data
}

export function useMe() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: QUERY_KEYS.auth,
    queryFn: fetchMe,
    enabled: Boolean(token),
    staleTime: 5 * 60_000,
  })
}

export function useLogin() {
  const setAuthToken = useAuthStore((s) => s.setAuthToken)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<AuthResponse>('/login', payload)
      return data
    },
    onSuccess: (data) => {
      setAuthToken(data.token)
      qc.setQueryData(QUERY_KEYS.auth, data.user)
    },
  })
}

export function useRegister() {
  const setAuthToken = useAuthStore((s) => s.setAuthToken)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post<AuthResponse>('/register', payload)
      return data
    },
    onSuccess: (data) => {
      setAuthToken(data.token)
      qc.setQueryData(QUERY_KEYS.auth, data.user)
    },
  })
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.post('/logout')
    },
    onSettled: () => {
      clear()
      qc.clear()
    },
  })
}
