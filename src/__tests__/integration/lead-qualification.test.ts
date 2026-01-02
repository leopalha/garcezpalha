/**
 * Integration Tests: Lead Qualification - Error Scenarios
 */

import { describe, it, expect, beforeEach } from 'vitest'

describe('Lead Qualification - Error Scenarios', () => {
  beforeEach(() => {
    // Reset database state
  })

  describe('Edge Case Scores', () => {
    it('should handle lead with score = 0 (minimum)', async () => {
      const response = await fetch('/api/marketing/evaluate-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'zero-score@example.com',
          source: 'organic',
          // No engagement metrics
          pageViews: 0,
          timeOnSite: 0,
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.score).toBe(0)
      expect(data.qualified).toBe(false)
      expect(data.category).toBe('cold')
    })

    it('should handle lead with score = 100 (maximum)', async () => {
      const response = await fetch('/api/marketing/evaluate-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'perfect-lead@lawfirm.com',
          source: 'referral',
          company: 'Large Law Firm',
          pageViews: 50,
          timeOnSite: 3600,
          formSubmissions: 5,
          downloadedResources: true,
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.score).toBe(100)
      expect(data.qualified).toBe(true)
      expect(data.category).toBe('hot')
    })
  })

  describe('Duplicate Lead Detection', () => {
    it('should detect and update existing lead', async () => {
      const leadData = {
        email: 'duplicate@example.com',
        source: 'organic',
        pageViews: 5,
      }

      // First submission
      const firstResponse = await fetch('/api/marketing/evaluate-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      })

      expect(firstResponse.status).toBe(200)
      const firstData = await firstResponse.json()
      const firstLeadId = firstData.leadId

      // Second submission (duplicate)
      const secondResponse = await fetch('/api/marketing/evaluate-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          pageViews: 10, // Updated engagement
        }),
      })

      expect(secondResponse.status).toBe(200)
      const secondData = await secondResponse.json()

      // Should be same lead, updated
      expect(secondData.leadId).toBe(firstLeadId)
      expect(secondData.score).toBeGreaterThan(firstData.score)
      expect(secondData.updated).toBe(true)
    })

    it('should prevent duplicate leads from different sources', async () => {
      const email = 'multi-source@example.com'

      // Create from organic
      await fetch('/api/marketing/evaluate-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'organic',
        }),
      })

      // Attempt from paid ads
      const response = await fetch('/api/marketing/evaluate-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'paid-ads',
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.duplicate).toBe(true)
      expect(data.sources).toContain('organic')
      expect(data.sources).toContain('paid-ads')
    })
  })

  describe('Invalid Input', () => {
    it('should reject invalid email', async () => {
      const response = await fetch('/api/marketing/evaluate-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'not-an-email',
          source: 'organic',
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.errors[0].path).toContain('email')
    })

    it('should reject negative metrics', async () => {
      const response = await fetch('/api/marketing/evaluate-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          source: 'organic',
          pageViews: -5,
        }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.errors[0].path).toContain('pageViews')
    })
  })
})
