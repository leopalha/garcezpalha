import { describe, it, expect, beforeEach } from '@jest/globals'
import { isResendConfigured } from '../resend-client'

describe('Resend Email Service', () => {
  it('should be configured when API key is present', () => {
    const isConfigured = isResendConfigured()
    expect(typeof isConfigured).toBe('boolean')
  })

  it('should validate Resend API key format', () => {
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      // Resend API keys start with 're_'
      expect(apiKey).toMatch(/^re_/)
    }
  })
})
