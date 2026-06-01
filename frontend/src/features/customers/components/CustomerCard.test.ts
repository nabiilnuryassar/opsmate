import { describe, it, expect } from 'vitest'
import { maskPhone } from './CustomerCard'

describe('maskPhone', () => {
  it('masks the middle digits of a phone number', () => {
    expect(maskPhone('081234567890')).toBe('0812-xxxx-90')
  })

  it('returns a dash for empty/null phone', () => {
    expect(maskPhone(null)).toBe('-')
    expect(maskPhone('')).toBe('-')
  })

  it('leaves very short numbers untouched', () => {
    expect(maskPhone('123')).toBe('123')
  })

  it('strips non-digit characters before masking', () => {
    expect(maskPhone('0812-3456-7890')).toBe('0812-xxxx-90')
  })
})
