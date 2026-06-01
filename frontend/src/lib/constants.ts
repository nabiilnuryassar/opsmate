export const APP_NAME = 'OpsMate AI'

export const QUERY_KEYS = {
  auth: ['auth', 'me'] as const,
  business: ['business'] as const,
  customers: ['customers'] as const,
  products: ['products'] as const,
  orders: ['orders'] as const,
  invoices: ['invoices'] as const,
  reminders: ['reminders'] as const,
  dashboard: ['dashboard', 'summary'] as const,
  reports: ['reports', 'daily'] as const,
} as const
