import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReminderCard, PRIORITY_TONE, PRIORITY_LABEL } from './ReminderCard'
import type { Reminder } from '../api/reminders-api'

function makeReminder(overrides: Partial<Reminder> = {}): Reminder {
  return {
    id: 1,
    title: 'Sinta belum bayar',
    description: 'Order ORD-0012 sebesar Rp250.000 belum dibayar.',
    type: 'unpaid_order',
    type_label: 'Belum Bayar',
    status: 'pending',
    priority: 'urgent',
    related_type: 'order',
    related_id: 12,
    due_at: null,
    completed_at: null,
    ...overrides,
  }
}

describe('ReminderCard priority mapping', () => {
  it('maps urgent/today/later to the right tone and label', () => {
    expect(PRIORITY_TONE.urgent).toBe('danger')
    expect(PRIORITY_TONE.today).toBe('warning')
    expect(PRIORITY_TONE.later).toBe('neutral')
    expect(PRIORITY_LABEL.urgent).toBe('Urgent')
    expect(PRIORITY_LABEL.today).toBe('Hari Ini')
  })

  it('renders title, description and priority badge', () => {
    render(<ReminderCard reminder={makeReminder()} />)
    expect(screen.getByText('Sinta belum bayar')).toBeInTheDocument()
    expect(screen.getByText(/Rp250\.000/)).toBeInTheDocument()
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('fires the action callbacks', () => {
    const onMessage = vi.fn()
    const onDone = vi.fn()
    const onSnooze = vi.fn()
    render(
      <ReminderCard
        reminder={makeReminder()}
        onMessage={onMessage}
        onDone={onDone}
        onSnooze={onSnooze}
      />,
    )
    screen.getByRole('button', { name: /Buat Pesan/ }).click()
    screen.getByRole('button', { name: /Selesai/ }).click()
    screen.getByRole('button', { name: /Tunda/ }).click()
    expect(onMessage).toHaveBeenCalledOnce()
    expect(onDone).toHaveBeenCalledOnce()
    expect(onSnooze).toHaveBeenCalledOnce()
  })
})
