import { describe, it, expect } from 'vitest'
import { allowedOrderTargets, allowedPaymentTargets } from './transitions'

describe('order status transitions', () => {
  it('offers forward transitions from new', () => {
    expect(allowedOrderTargets('new')).toEqual(['confirmed', 'processing', 'cancelled'])
  })

  it('treats delivered and cancelled as terminal', () => {
    expect(allowedOrderTargets('delivered')).toEqual([])
    expect(allowedOrderTargets('cancelled')).toEqual([])
  })

  it('never offers a backward jump to new', () => {
    for (const targets of [
      allowedOrderTargets('processing'),
      allowedOrderTargets('completed'),
      allowedOrderTargets('ready'),
    ]) {
      expect(targets).not.toContain('new')
    }
  })

  it('allows cancelling a processing order', () => {
    expect(allowedOrderTargets('processing')).toContain('cancelled')
  })
})

describe('payment status transitions', () => {
  it('allows unpaid to partial or paid', () => {
    expect(allowedPaymentTargets('unpaid')).toEqual(['partial', 'paid'])
  })

  it('allows paid to be refunded but not reverted', () => {
    expect(allowedPaymentTargets('paid')).toEqual(['refunded'])
  })

  it('treats refunded as terminal', () => {
    expect(allowedPaymentTargets('refunded')).toEqual([])
  })
})
