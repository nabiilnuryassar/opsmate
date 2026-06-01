import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TopProducts } from './TopProducts'
import type { TopProduct } from '../api/reports-api'

describe('TopProducts', () => {
  it('shows an empty message when there are no products', () => {
    render(<TopProducts products={[]} />)
    expect(screen.getByText('Belum ada penjualan hari ini.')).toBeInTheDocument()
  })

  it('renders each product with quantity and revenue', () => {
    const products: TopProduct[] = [
      { name: 'Paket A', quantity: 8, revenue: 200000 },
      { name: 'Paket B', quantity: 2, revenue: 60000 },
    ]
    render(<TopProducts products={products} />)
    expect(screen.getByText('Paket A')).toBeInTheDocument()
    expect(screen.getByText(/8x/)).toBeInTheDocument()
    expect(screen.getByText(/Rp.?200\.000/)).toBeInTheDocument()
    expect(screen.getByText('Paket B')).toBeInTheDocument()
  })

  it('scales bar widths relative to the top seller', () => {
    const products: TopProduct[] = [
      { name: 'Top', quantity: 10, revenue: 100000 },
      { name: 'Half', quantity: 5, revenue: 50000 },
    ]
    const { container } = render(<TopProducts products={products} />)
    const bars = container.querySelectorAll('.bg-primary-500')
    expect(bars[0]).toHaveStyle({ width: '100%' })
    expect(bars[1]).toHaveStyle({ width: '50%' })
  })
})
