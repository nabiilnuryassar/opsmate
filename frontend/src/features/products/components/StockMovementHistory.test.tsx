import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StockMovementHistory, TYPE_TONE } from './StockMovementHistory'
import type { StockMovement } from '../api/products-api'

const mockMovements = vi.fn()

vi.mock('../api/products-api', () => ({
  useStockMovements: () => mockMovements(),
}))

function movement(overrides: Partial<StockMovement> = {}): StockMovement {
  return {
    id: 1,
    type: 'in',
    type_label: 'Masuk',
    quantity: 5,
    reference_type: 'manual',
    reference_id: null,
    notes: null,
    created_at: '2026-05-31T10:00:00Z',
    ...overrides,
  }
}

describe('StockMovementHistory', () => {
  it('maps movement types to tones', () => {
    expect(TYPE_TONE.in).toBe('success')
    expect(TYPE_TONE.out).toBe('danger')
    expect(TYPE_TONE.adjustment).toBe('info')
  })

  it('shows an empty message when there are no movements', () => {
    mockMovements.mockReturnValue({ data: [], isLoading: false })
    render(<StockMovementHistory productId={1} />)
    expect(screen.getByText('Belum ada pergerakan stok.')).toBeInTheDocument()
  })

  it('renders signed quantities (+ for in, - for out)', () => {
    mockMovements.mockReturnValue({
      data: [
        movement({ id: 1, type: 'in', type_label: 'Masuk', quantity: 5 }),
        movement({ id: 2, type: 'out', type_label: 'Keluar', quantity: -3 }),
      ],
      isLoading: false,
    })
    render(<StockMovementHistory productId={1} />)
    expect(screen.getByText('+5')).toBeInTheDocument()
    expect(screen.getByText('-3')).toBeInTheDocument()
  })

  it('flags movements sourced from an order', () => {
    mockMovements.mockReturnValue({
      data: [movement({ reference_type: 'order', reference_id: 9, quantity: -2 })],
      isLoading: false,
    })
    render(<StockMovementHistory productId={1} />)
    expect(screen.getByText('dari order')).toBeInTheDocument()
  })
})
