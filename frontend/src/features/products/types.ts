import type { Paginated } from '@/features/customers/types'

export type ProductType = 'product' | 'service'

export interface Product {
  id: number
  name: string
  type: ProductType
  category: string | null
  price: number
  cost_price: number | null
  stock: number | null
  minimum_stock: number | null
  unit: string | null
  description: string | null
  is_active: boolean
  is_low_stock: boolean
  margin: number | null
  created_at: string | null
}

export interface ProductPayload {
  name: string
  type: ProductType
  category?: string | null
  price: number
  cost_price?: number | null
  stock?: number | null
  minimum_stock?: number | null
  unit?: string | null
  description?: string | null
  is_active?: boolean
}

export interface ProductFilters {
  search?: string
  type?: ProductType
  low_stock?: boolean
}

export type { Paginated }
