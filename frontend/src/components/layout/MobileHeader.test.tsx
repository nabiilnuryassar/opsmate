import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MobileHeader } from './MobileHeader'

describe('MobileHeader', () => {
  it('renders app logo in mobile header', () => {
    render(<MobileHeader greeting="Pagi, Rina" businessName="Rina Catering" />)

    const logo = screen.getByRole('img', { name: 'Logo OpsMate AI' })
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo.png')
  })
})
