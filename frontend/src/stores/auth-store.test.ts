import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth-store'
import { getToken } from '@/lib/api'

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().clear()
  })

  it('persists the token to localStorage on set', () => {
    useAuthStore.getState().setAuthToken('abc123')
    expect(useAuthStore.getState().token).toBe('abc123')
    expect(getToken()).toBe('abc123')
  })

  it('removes the token from localStorage on clear', () => {
    useAuthStore.getState().setAuthToken('abc123')
    useAuthStore.getState().clear()
    expect(useAuthStore.getState().token).toBeNull()
    expect(getToken()).toBeNull()
  })

  it('treats setting null as a clear', () => {
    useAuthStore.getState().setAuthToken('abc123')
    useAuthStore.getState().setAuthToken(null)
    expect(getToken()).toBeNull()
  })
})
