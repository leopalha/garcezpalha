/**
 * Integration Tests: Payment Webhooks - Security Scenarios
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import crypto from 'crypto'

describe('Payment Webhook - Security Scenarios', () => {
  const validSecret = 'whsec_test_secret'

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_WEBHOOK_SECRET = validSecret
  })

  describe('Invalid Signature', () => {
    it('should reject webhook with invalid signature', async () => {
      const payload = JSON.stringify({
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_123' } },
      })

      const response = await fetch('/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'invalid-signature',
        },
        body: payload,
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toMatch(/signature.*invalid/i)
    })

    it('should reject webhook with missing signature', async () => {
      const payload = JSON.stringify({
        type: 'payment_intent.succeeded',
      })

      const response = await fetch('/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No signature header
        },
        body: payload,
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toMatch(/signature.*required/i)
    })
  })

  describe('Replay Attack Prevention', () => {
    it('should reject old timestamp (replay attack)', async () => {
      const oldTimestamp = Math.floor(Date.now() / 1000) - 600 // 10 minutes ago

      const payload = JSON.stringify({
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_replay' } },
      })

      const signature = generateStripeSignature(payload, oldTimestamp, validSecret)

      const response = await fetch('/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature,
        },
        body: payload,
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toMatch(/timestamp.*expired|replay/i)
    })

    it('should accept recent webhook', async () => {
      const timestamp = Math.floor(Date.now() / 1000)

      const payload = JSON.stringify({
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_valid',
            amount: 10000,
            status: 'succeeded',
          },
        },
      })

      const signature = generateStripeSignature(payload, timestamp, validSecret)

      const response = await fetch('/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature,
        },
        body: payload,
      })

      expect(response.status).toBe(200)
    })
  })

  describe('Non-Existent Payment', () => {
    it('should handle webhook for unknown payment', async () => {
      const timestamp = Math.floor(Date.now() / 1000)

      const payload = JSON.stringify({
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_unknown_payment_id',
            metadata: {
              orderId: 'non-existent-order',
            },
          },
        },
      })

      const signature = generateStripeSignature(payload, timestamp, validSecret)

      const response = await fetch('/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature,
        },
        body: payload,
      })

      // Should still return 200 to acknowledge receipt
      expect(response.status).toBe(200)

      // But should log the error
      const data = await response.json()
      expect(data.warning).toMatch(/order.*not found/i)
    })
  })

  describe('Idempotency', () => {
    it('should handle duplicate webhook events', async () => {
      const timestamp = Math.floor(Date.now() / 1000)
      const eventId = 'evt_duplicate_test'

      const payload = JSON.stringify({
        id: eventId,
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_idempotent',
            amount: 5000,
          },
        },
      })

      const signature = generateStripeSignature(payload, timestamp, validSecret)

      // First webhook
      const firstResponse = await fetch('/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature,
        },
        body: payload,
      })

      expect(firstResponse.status).toBe(200)

      // Duplicate webhook (same event ID)
      const secondResponse = await fetch('/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature,
        },
        body: payload,
      })

      expect(secondResponse.status).toBe(200)
      const data = await secondResponse.json()
      expect(data.processed).toBe(false)
      expect(data.reason).toMatch(/already.*processed/i)
    })
  })
})

// Helper function to generate Stripe signature
function generateStripeSignature(payload: string, timestamp: number, secret: string): string {
  const signedPayload = `${timestamp}.${payload}`
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex')

  return `t=${timestamp},v1=${signature}`
}
