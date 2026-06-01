export type CustomerType = 'new' | 'regular' | 'vip' | 'inactive'

export interface Customer {
  id: number
  name: string
  phone: string | null
  email: string | null
  address: string | null
  notes: string | null
  customer_type: CustomerType
  last_order_at: string | null
  orders_count?: number
  created_at: string | null
}

export interface CustomerPayload {
  name: string
  phone?: string | null
  email?: string | null
  address?: string | null
  notes?: string | null
  customer_type?: CustomerType
}

export interface Paginated<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    total: number
  }
}

export interface CustomerFilters {
  search?: string
  type?: CustomerType
}
