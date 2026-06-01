// Status definitions mirror PRD §11.6 / §14 and DESIGN §12.5.

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded'

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'processing'
  | 'ready'
  | 'completed'
  | 'delivered'
  | 'cancelled'

export type CustomerType = 'new' | 'regular' | 'vip' | 'inactive'

export type BadgeTone =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'ai'
  | 'neutral'

interface StatusMeta {
  label: string
  tone: BadgeTone
}

export const PAYMENT_STATUS: Record<PaymentStatus, StatusMeta> = {
  unpaid: { label: 'Belum Bayar', tone: 'danger' },
  partial: { label: 'DP', tone: 'warning' },
  paid: { label: 'Lunas', tone: 'success' },
  refunded: { label: 'Refund', tone: 'neutral' },
}

export const ORDER_STATUS: Record<OrderStatus, StatusMeta> = {
  new: { label: 'Baru', tone: 'info' },
  confirmed: { label: 'Dikonfirmasi', tone: 'primary' },
  processing: { label: 'Diproses', tone: 'warning' },
  ready: { label: 'Siap', tone: 'ai' },
  completed: { label: 'Selesai', tone: 'success' },
  delivered: { label: 'Dikirim', tone: 'success' },
  cancelled: { label: 'Batal', tone: 'neutral' },
}

export const CUSTOMER_TYPE: Record<CustomerType, StatusMeta> = {
  new: { label: 'Baru', tone: 'info' },
  regular: { label: 'Langganan', tone: 'primary' },
  vip: { label: 'VIP', tone: 'ai' },
  inactive: { label: 'Tidak Aktif', tone: 'neutral' },
}
