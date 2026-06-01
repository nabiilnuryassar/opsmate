import type { Paginated } from '@/features/customers/types'
import type { Activity } from './components/ActivityTimeline'
import type { OrderStatus, PaymentStatus } from '@/lib/status'

export interface OrderItem {
  id: number
  product_id: number | null
  product_name: string
  quantity: number
  price: number
  total: number
}

export interface OrderCustomer {
  id: number
  name: string
  phone: string | null
}

export interface Order {
  id: number
  order_number: string
  order_date: string | null
  due_date: string | null
  status: OrderStatus
  status_label: string
  payment_status: PaymentStatus
  payment_status_label: string
  subtotal: number
  discount: number
  total: number
  notes: string | null
  customer?: OrderCustomer
  items?: OrderItem[]
  items_count?: number
  activities?: Activity[]
  created_at: string | null
}

export interface OrderItemInput {
  product_id: number
  quantity: number
  price?: number
}

export interface OrderPayload {
  customer_id: number
  order_date?: string
  due_date?: string | null
  status?: OrderStatus
  payment_status?: PaymentStatus
  discount?: number
  notes?: string | null
  items: OrderItemInput[]
}

export interface OrderFilters {
  search?: string
  status?: OrderStatus
  payment_status?: PaymentStatus
  today?: boolean
}

export type { Paginated }
