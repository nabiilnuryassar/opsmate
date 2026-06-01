import { create } from 'zustand'
import { getToken, setToken } from '@/lib/api'

interface AuthState {
  token: string | null
  setAuthToken: (token: string | null) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: getToken(),
  setAuthToken: (token) => {
    setToken(token)
    set({ token })
  },
  clear: () => {
    setToken(null)
    set({ token: null })
  },
}))
