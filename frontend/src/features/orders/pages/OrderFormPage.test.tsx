import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import { OrderFormPage } from './OrderFormPage'

const createMutate = vi.fn().mockResolvedValue({ id: 1 })
const createCustomerMutate = vi.fn().mockResolvedValue({ id: 11, name: 'Budi', phone: '0812' })

vi.mock('@/features/auth/api/auth-api', () => ({
  useMe: () => ({ data: { name: 'Rina', business: { id: 1, name: 'Rina Catering' } } }),
}))

vi.mock('@/features/customers/api/customers-api', () => ({
  useCustomers: () => ({
    data: { data: [{ id: 7, name: 'Sinta', phone: '0811', customer_type: 'new' }] },
  }),
  useCreateCustomer: () => ({ mutateAsync: createCustomerMutate, isPending: false }),
}))

vi.mock('@/features/products/api/products-api', () => ({
  useProducts: () => ({
    data: { data: [{ id: 3, name: 'Kopi Susu', price: 25000, type: 'product' }] },
  }),
}))

vi.mock('../api/orders-api', () => ({
  useOrder: (_id?: number) => ({ data: undefined }),
  useCreateOrder: () => ({ mutateAsync: createMutate, isPending: false }),
  useUpdateOrder: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

describe('OrderFormPage', () => {
  beforeEach(() => {
    createMutate.mockClear()
    createCustomerMutate.mockClear()
    localStorage.clear()
  })

  it('updates the total as products are added', async () => {
    const user = userEvent.setup()
    renderWithProviders(<OrderFormPage />)

    expect(screen.getByText(/Rp.?0$/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Kopi Susu' }))
    await waitFor(() => expect(screen.getAllByText(/Rp.?25\.000/).length).toBeGreaterThanOrEqual(2))

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

  it('creates inline customer and sets it as selected', async () => {
    const user = userEvent.setup()
    renderWithProviders(<OrderFormPage />)

    await user.click(screen.getByRole('button', { name: /Customer baru cepat/i }))
    await user.type(screen.getByPlaceholderText('Nama customer'), 'Budi')
    await user.type(screen.getByPlaceholderText('No. WhatsApp'), '0812')
    await user.click(screen.getByRole('button', { name: 'Simpan & Pilih' }))

    await waitFor(() =>
      expect(createCustomerMutate).toHaveBeenCalledWith({
        name: 'Budi',
        phone: '0812',
        customer_type: 'new',
      }),
    )

    await waitFor(() =>
      expect(screen.queryByPlaceholderText('Nama customer')).not.toBeInTheDocument(),
    )
  })
})
