import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AIInsightCard } from './AIInsightCard'

describe('AIInsightCard', () => {
  it('renders the insight text', () => {
    render(<AIInsightCard text="Customer ini belum bayar 2 hari." />)
    expect(screen.getByText('Customer ini belum bayar 2 hari.')).toBeInTheDocument()
  })

  it('renders an action button only when both label and handler are provided', () => {
    const onAction = vi.fn()
    render(<AIInsightCard text="Mau follow-up?" actionLabel="Buat Pesan" onAction={onAction} />)
    const btn = screen.getByRole('button', { name: 'Buat Pesan' })
    btn.click()
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('omits the action button when no handler is given', () => {
    render(<AIInsightCard text="Hanya info." actionLabel="Buat Pesan" />)
    expect(screen.queryByRole('button', { name: 'Buat Pesan' })).not.toBeInTheDocument()
  })
})
