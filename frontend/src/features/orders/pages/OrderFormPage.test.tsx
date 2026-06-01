import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import { OrderFormPage } from './OrderFormPage'

const createMutate = vi.fn().mockResolvedValue({ id: 1 })

vi.mock('@/features/auth/api/auth-api', () => ({
  useMe: () => ({ data: { name: 'Rina', business: { name: 'Rina Catering' } } }),
}))

vi.mock('@/features/customers/api/customers-api', () => ({
  useCustomers: () => ({
    data: { data: [{ id: 7, name: 'Sinta', phone: '0811', customer_type: 'new' }] },
  }),
}))

vi.mock('@/features/products/api/products-api', () => ({
  useProducts: () => ({
    data: { data: [{ id: 3, name: 'Kopi Susu', price: 25000, type: 'product' }] },
  }),
}))

vi.mock('../api/orders-api', () => ({
  useOrder: () => ({ data: undefined }),
  useCreateOrder: () => ({ mutateAsync: createMutate, isPending: false }),
  useUpdateOrder: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

describe('OrderFormPage', () => {
  it('updates the total as products are added', async () => {
    const user = userEvent.setup()
    renderWithProviders(<OrderFormPage />)

    expect(screen.getByText(/Rp.?0$/)).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Cari atau pilih produk...'), 'Kopi')
    await user.click(await screen.findByText('Kopi Susu'))

    // One unit added -> item price and total both show the unit price.
    await waitFor(() => expect(screen.getAllByText(/Rp.?25\.000/).length).toBeGreaterThanOrEqual(2))

    // Increment quantity -> total doubles.
    await user.click(screen.getByLabelText('Tambah'))
    await waitFor(() => expect(screen.getByText(/Rp.?50\.000/)).toBeInTheDocument())
  })

  it('blocks submit until a customer and item are chosen', async () => {
    const user = userEvent.setup()
    renderWithProviders(<OrderFormPage />)

    await user.click(screen.getByRole('button', { name: 'Simpan Order' }))
    expect(await screen.findByText('Pilih customer dulu.')).toBeInTheDocument()
    expect(createMutate).not.toHaveBeenCalled()
  })
})
