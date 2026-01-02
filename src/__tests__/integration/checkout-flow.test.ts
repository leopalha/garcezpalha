/**
 * Integration Tests: Checkout Flow - Error Scenarios
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Checkout Flow - Error Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Product Not Found', () => {
    it('should return 404 when product does not exist', async () => {
      const response = await fetch('/api/checkout/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'non-existent-product-id',
          email: 'test@example.com',
        }),
      })

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data.error).toMatch(/product.*not found/i)
    })
  })

  describe('Stripe Session Fails', () => {
    it('should handle Stripe API errors gracefully', async () => {
      // Mock Stripe to throw error
      vi.mock('stripe', () => ({
        default: vi.fn(() => ({
          checkout: {
            sessions: {
              create: vi.fn().mockRejectedValue(new Error('Stripe API error')),
            },
          },
        })),
      }))

      const response = await fetch('/api/checkout/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'valid-product-id',
          email: 'test@example.com',
        }),
      })

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toMatch(/payment.*failed/i)
    })
  })

  describe('Invalid Customer Data', () => {
    it('should reject invalid email format', async () => {
      const response = await fetch('/api/checkout/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'valid-product-id',
          email: 'invalid-email-format',
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.errors).toBeDefined()
      expect(data.errors[0].path).toContain('email')
    })

    it('should reject missing required fields', async () => {
      const response = await fetch('/api/checkout/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'valid-product-id',
          // email missing
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.errors).toBeDefined()
    })
  })

  describe('Insufficient Product Data', () => {
    it('should handle products with missing price', async () => {
      const response = await fetch('/api/checkout/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'product-without-price',
          email: 'test@example.com',
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toMatch(/price.*not.*configured/i)
    })
  })
})
