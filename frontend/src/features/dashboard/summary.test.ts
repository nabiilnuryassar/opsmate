import { describe, it, expect } from 'vitest'
import { trendTone, buildSummary } from './summary'
import type { DashboardMetrics } from './api/dashboard-api'

function metrics(overrides: Partial<DashboardMetrics> = {}): DashboardMetrics {
  return {
    orders_today: 12,
    orders_today_trend: '+3',
    revenue_today: 1450000,
    revenue_trend_pct: '+12%',
    unpaid_total: 650000,
    unpaid_count: 3,
    processing_count: 5,
    new_customers: 3,
    low_stock_count: 2,
    ...overrides,
  }
}

describe('trendTone', () => {
  it('marks positive non-zero trends as up', () => {
    expect(trendTone('+12%')).toBe('up')
    expect(trendTone('+3')).toBe('up')
  })

  it('marks negative trends as down', () => {
    expect(trendTone('-5%')).toBe('down')
  })

  it('treats zero as neutral', () => {
    expect(trendTone('+0')).toBe('neutral')
    expect(trendTone('0%')).toBe('neutral')
  })
})

describe('buildSummary', () => {
  it('summarizes orders and flags unpaid count', () => {
    const text = buildSummary(metrics())
    expect(text).toContain('12 order')
    expect(text).toContain('3 order belum dibayar')
  })

  it('congratulates when nothing is unpaid', () => {
    const text = buildSummary(metrics({ unpaid_count: 0, unpaid_total: 0 }))
    expect(text).toContain('sudah dibayar')
    expect(text).not.toContain('belum dibayar')
  })

  it('nudges to create the first order when empty', () => {
    const text = buildSummary(metrics({ orders_today: 0 }))
    expect(text).toContain('Belum ada order hari ini')
  })
})
