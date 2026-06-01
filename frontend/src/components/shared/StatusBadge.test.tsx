import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  PaymentStatusBadge,
  OrderStatusBadge,
  CustomerTypeBadge,
} from '@/components/shared/StatusBadge'

describe('StatusBadge', () => {
  it('maps every payment status to its Indonesian label', () => {
    render(<PaymentStatusBadge status="unpaid" />)
    expect(screen.getByText('Belum Bayar')).toBeInTheDocument()
  })

  it('renders DP label with the warning tone for partial payment', () => {
    render(<PaymentStatusBadge status="partial" />)
    const badge = screen.getByText('DP')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('bg-warning-soft')
  })

  it('uses the success tone for paid orders', () => {
    render(<PaymentStatusBadge status="paid" />)
    expect(screen.getByText('Lunas').className).toContain('text-success')
  })

  it('maps order statuses including the AI tone for ready', () => {
    render(<OrderStatusBadge status="ready" />)
    const badge = screen.getByText('Siap')
    expect(badge.className).toContain('text-ai-700')
  })

  it('renders the cancelled order status as a neutral Batal badge', () => {
    render(<OrderStatusBadge status="cancelled" />)
    expect(screen.getByText('Batal').className).toContain('text-neutral-500')
  })

  it('maps customer type vip to the VIP label', () => {
    render(<CustomerTypeBadge type="vip" />)
    expect(screen.getByText('VIP')).toBeInTheDocument()
  })
})
