/**
 * Integration Tests: WhatsApp Conversations - Rate Limiting
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('WhatsApp Conversation - Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rate Limit Exceeded', () => {
    it('should throttle after 30 messages in 1 second', async () => {
      const phoneNumber = '+5511999999999'
      const responses = []

      // Send 35 messages rapidly
      for (let i = 0; i < 35; i++) {
        const response = await fetch('/api/chat/route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: phoneNumber,
            message: `Test message ${i}`,
          }),
        })

        responses.push({
          status: response.status,
          index: i,
        })
      }

      // First 30 should succeed
      const successful = responses.filter((r) => r.status === 200)
      expect(successful.length).toBeLessThanOrEqual(30)

      // Remaining should be rate limited
      const rateLimited = responses.filter((r) => r.status === 429)
      expect(rateLimited.length).toBeGreaterThan(0)
    })

    it('should include retry-after header in rate limit response', async () => {
      const phoneNumber = '+5511888888888'

      // Exhaust rate limit
      for (let i = 0; i < 31; i++) {
        await fetch('/api/chat/route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: phoneNumber,
            message: `Message ${i}`,
          }),
        })
      }

      // This should be rate limited
      const response = await fetch('/api/chat/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: phoneNumber,
          message: 'Rate limited message',
        }),
      })

      expect(response.status).toBe(429)
      expect(response.headers.get('retry-after')).toBeDefined()

      const data = await response.json()
      expect(data.error).toMatch(/rate limit/i)
      expect(data.retryAfter).toBeGreaterThan(0)
    })

    it('should reset rate limit after timeout', async () => {
      const phoneNumber = '+5511777777777'

      // Exhaust rate limit
      for (let i = 0; i < 31; i++) {
        await fetch('/api/chat/route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: phoneNumber,
            message: `Message ${i}`,
          }),
        })
      }

      // Verify rate limited
      const limitedResponse = await fetch('/api/chat/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: phoneNumber,
          message: 'Should be limited',
        }),
      })

      expect(limitedResponse.status).toBe(429)

      // Wait for rate limit window to expire (1 second)
      await new Promise((resolve) => setTimeout(resolve, 1100))

      // Should work again
      const afterResetResponse = await fetch('/api/chat/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: phoneNumber,
          message: 'Should work now',
        }),
      })

      expect(afterResetResponse.status).toBe(200)
    })
  })

  describe('Per-User Rate Limiting', () => {
    it('should apply rate limits per phone number', async () => {
      const user1 = '+5511111111111'
      const user2 = '+5522222222222'

      // User 1 exhausts their limit
      for (let i = 0; i < 31; i++) {
        await fetch('/api/chat/route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: user1,
            message: `User1 message ${i}`,
          }),
        })
      }

      // User 1 should be rate limited
      const user1Response = await fetch('/api/chat/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: user1,
          message: 'User1 limited',
        }),
      })

      expect(user1Response.status).toBe(429)

      // User 2 should still work
      const user2Response = await fetch('/api/chat/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: user2,
          message: 'User2 first message',
        }),
      })

      expect(user2Response.status).toBe(200)
    })
  })

  describe('Rate Limit Bypass for Premium', () => {
    it('should allow higher limits for premium users', async () => {
      const premiumUser = '+5511999999999'

      // Mark user as premium
      await fetch('/api/admin/users/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: premiumUser,
          tier: 'premium',
        }),
      })

      const responses = []

      // Premium users get 100 messages/second
      for (let i = 0; i < 105; i++) {
        const response = await fetch('/api/chat/route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: premiumUser,
            message: `Premium message ${i}`,
          }),
        })

        responses.push(response.status)
      }

      const successful = responses.filter((status) => status === 200)
      expect(successful.length).toBeGreaterThan(30) // More than free tier
      expect(successful.length).toBeLessThanOrEqual(100)
    })
  })
})
