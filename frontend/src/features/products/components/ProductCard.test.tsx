import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCard } from './ProductCard'
import type { Product } from '../types'

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: 'Brownies Coklat',
    type: 'product',
    category: 'Kue',
    price: 45000,
    cost_price: 30000,
    stock: 10,
    minimum_stock: 5,
    unit: 'pcs',
    description: null,
    is_active: true,
    is_low_stock: false,
    margin: 15000,
    created_at: null,
    ...overrides,
  }
}

describe('ProductCard', () => {
  it('shows the low-stock badge only when is_low_stock is true', () => {
    const { rerender } = render(<ProductCard product={makeProduct({ is_low_stock: true })} />)
    expect(screen.getByText('Stok Hampir Habis')).toBeInTheDocument()

    rerender(<ProductCard product={makeProduct({ is_low_stock: false })} />)
    expect(screen.queryByText('Stok Hampir Habis')).not.toBeInTheDocument()
  })

  it('renders an inactive badge for inactive products', () => {
    render(<ProductCard product={makeProduct({ is_active: false })} />)
    expect(screen.getByText('Nonaktif')).toBeInTheDocument()
  })

  it('labels services instead of showing stock', () => {
    render(<ProductCard product={makeProduct({ type: 'service', stock: null })} />)
    expect(screen.getByText(/Layanan/)).toBeInTheDocument()
    expect(screen.queryByText(/tersisa/)).not.toBeInTheDocument()
  })

  it('shows remaining stock for products', () => {
    render(<ProductCard product={makeProduct({ stock: 7, unit: 'pcs' })} />)
    expect(screen.getByText(/Stok 7 pcs tersisa/)).toBeInTheDocument()
  })

  it('formats the price as rupiah', () => {
    render(<ProductCard product={makeProduct({ price: 45000 })} />)
    expect(screen.getByText(/Rp.?45\.000/)).toBeInTheDocument()
  })

  it('fires onClick when pressed', async () => {
    const onClick = vi.fn()
    render(<ProductCard product={makeProduct()} onClick={onClick} />)
    screen.getByRole('button').click()
    expect(onClick).toHaveBeenCalledOnce()
  })
})
