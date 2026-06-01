import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InvoiceCard, STATUS_TONE } from './InvoiceCard'
import type { Invoice } from '../api/invoices-api'

function makeInvoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
    id: 1,
    invoice_number: 'INV-0001',
    order_id: 10,
    issue_date: '2026-05-31',
    due_date: '2026-06-07',
    total: 250000,
    status: 'draft',
    status_label: 'Draft',
    customer: { id: 5, name: 'Sinta', phone: '0811' },
    order: { id: 10, order_number: 'ORD-0001' },
    created_at: null,
    ...overrides,
  }
}

describe('InvoiceCard status tone mapping', () => {
  it('maps paid to success and overdue to danger', () => {
    expect(STATUS_TONE.paid).toBe('success')
    expect(STATUS_TONE.overdue).toBe('danger')
    expect(STATUS_TONE.draft).toBe('neutral')
    expect(STATUS_TONE.sent).toBe('info')
  })

  it('renders the number, customer, amount and due date', () => {
    render(<InvoiceCard invoice={makeInvoice()} />)
    expect(screen.getByText('INV-0001')).toBeInTheDocument()
    expect(screen.getByText(/Sinta/)).toBeInTheDocument()
    expect(screen.getByText(/Rp.?250\.000/)).toBeInTheDocument()
    expect(screen.getByText(/Jatuh tempo/)).toBeInTheDocument()
  })

  it('shows the status label badge', () => {
    render(<InvoiceCard invoice={makeInvoice({ status: 'paid', status_label: 'Lunas' })} />)
    expect(screen.getByText('Lunas')).toBeInTheDocument()
  })
})
