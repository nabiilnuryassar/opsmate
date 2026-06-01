import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ChatBubble } from './ChatBubble'
import type { AIMessage } from '../api/ai-api'

function msg(overrides: Partial<AIMessage> = {}): AIMessage {
  return {
    id: 1,
    role: 'assistant',
    content: 'Ada 1 order belum dibayar.',
    unpaid: [],
    created_at: '2026-05-31T09:41:00Z',
    ...overrides,
  }
}

function renderBubble(message: AIMessage) {
  return render(
    <MemoryRouter>
      <ChatBubble message={message} />
    </MemoryRouter>,
  )
}

describe('ChatBubble', () => {
  it('renders assistant content', () => {
    renderBubble(msg())
    expect(screen.getByText('Ada 1 order belum dibayar.')).toBeInTheDocument()
  })

  it('renders embedded unpaid data cards for assistant messages', () => {
    renderBubble(
      msg({
        unpaid: [
          { order_number: 'ORD-0012', customer: 'Sinta', customer_id: 3, order_id: 12, total: 250000 },
        ],
      }),
    )
    expect(screen.getByText('Sinta')).toBeInTheDocument()
    expect(screen.getByText('ORD-0012')).toBeInTheDocument()
    expect(screen.getByText(/Rp.?250\.000/)).toBeInTheDocument()
    expect(screen.getByText('Buat Pesan WhatsApp')).toBeInTheDocument()
  })

  it('does not render data cards for user messages', () => {
    renderBubble(
      msg({
        role: 'user',
        content: 'Siapa belum bayar?',
        unpaid: [
          { order_number: 'ORD-0012', customer: 'Sinta', customer_id: 3, order_id: 12, total: 250000 },
        ],
      }),
    )
    expect(screen.queryByText('Buat Pesan WhatsApp')).not.toBeInTheDocument()
  })
})
