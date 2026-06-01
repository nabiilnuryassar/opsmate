export interface BusinessSummary {
  id: number
  name: string
  role: 'owner' | 'staff' | null
}

export interface User {
  id: number
  name: string
  email: string
  business: BusinessSummary | null
}

export interface AuthResponse {
  token: string
  user: User
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  business_name: string
}

export interface LoginPayload {
  email: string
  password: string
}
