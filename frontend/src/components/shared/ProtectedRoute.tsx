import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { useMe } from '@/features/auth/api/auth-api'
import { LoadingState } from './LoadingState'

/** Route guard: redirect to /login when there is no valid session. */
export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()
  const { isLoading, isError } = useMe()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (isLoading) {
    return <LoadingState message="Menyiapkan sesi..." fullscreen />
  }

  if (isError) {
    // Token rejected by the API (interceptor already cleared it).
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
