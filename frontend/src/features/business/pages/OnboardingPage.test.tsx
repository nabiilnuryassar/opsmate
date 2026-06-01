import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import { OnboardingPage } from './OnboardingPage'

// Isolate the wizard from the network: the data hooks are exercised elsewhere.
vi.mock('../api/business-api', () => ({
  useBusiness: () => ({ data: undefined }),
  useUpdateBusiness: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

describe('OnboardingPage step gating', () => {
  it('blocks advancing from step 1 until required fields are valid', async () => {
    const user = userEvent.setup()
    renderWithProviders(<OnboardingPage />)

    // Step 1 is "Profil Bisnis".
    expect(screen.getByText('Profil Bisnis')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Lanjut' }))

    // Validation errors appear and we remain on step 1.
    expect(await screen.findByText('Pilih kategori bisnis.')).toBeInTheDocument()
    expect(screen.getByText('Profil Bisnis')).toBeInTheDocument()
    expect(screen.queryByText('Jenis Layanan')).not.toBeInTheDocument()
  })

  it('advances to step 2 once profile fields are filled', async () => {
    const user = userEvent.setup()
    renderWithProviders(<OnboardingPage />)

    await user.type(screen.getByLabelText('Nama Bisnis'), 'Rina Catering')
    await user.selectOptions(screen.getByLabelText('Kategori Bisnis'), 'makanan_minuman')
    await user.type(screen.getByLabelText('Nomor WhatsApp'), '08123456789')
    await user.type(screen.getByLabelText('Kota'), 'Bandung')

    await user.click(screen.getByRole('button', { name: 'Lanjut' }))

    await waitFor(() => {
      expect(screen.getByText('Jenis Layanan')).toBeInTheDocument()
    })
  })
})
