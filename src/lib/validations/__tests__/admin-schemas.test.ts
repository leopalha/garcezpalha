/**
 * Admin Schemas Validation Tests
 * Garcez Palha - MANUS v7.0
 */

import { describe, it, expect } from 'vitest'
import {
  agentConfigUpdateSchema,
  agentTestSchema,
  analyticsLeadsQuerySchema,
  conversationMessageSchema,
  conversationTakeoverSchema,
  qualifiedLeadCreateSchema,
  manualFollowUpSchema,
} from '../admin-schemas'

describe('agentConfigUpdateSchema', () => {
  it('should validate correct agent config', () => {
    const validConfig = {
      role: 'assistant',
      category: 'legal',
      name: 'Test Agent',
      description: 'A test agent',
      systemPrompt: 'You are a helpful assistant',
      model: 'gpt-4' as const,
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      enabled: true,
      requiresApproval: false,
      tools: []
    }

    const result = agentConfigUpdateSchema.safeParse(validConfig)
    expect(result.success).toBe(true)
  })

  it('should reject invalid model', () => {
    const invalidConfig = {
      role: 'assistant',
      category: 'legal',
      name: 'Test Agent',
      description: 'A test agent',
      systemPrompt: 'System prompt',
      model: 'invalid-model',
    }

    const result = agentConfigUpdateSchema.safeParse(invalidConfig)
    expect(result.success).toBe(false)
  })

  it('should reject empty name', () => {
    const invalidConfig = {
      role: 'assistant',
      category: 'legal',
      name: '',
      description: 'A test agent',
      systemPrompt: 'System prompt',
      model: 'gpt-4',
    }

    const result = agentConfigUpdateSchema.safeParse(invalidConfig)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Name is required')
    }
  })
})

describe('agentTestSchema', () => {
  it('should validate test input', () => {
    const validTest = {
      input: 'Test message',
      context: { sessionId: '123' }
    }

    const result = agentTestSchema.safeParse(validTest)
    expect(result.success).toBe(true)
  })

  it('should reject empty input', () => {
    const invalidTest = { input: '' }

    const result = agentTestSchema.safeParse(invalidTest)
    expect(result.success).toBe(false)
  })
})

describe('analyticsLeadsQuerySchema', () => {
  it('should use default values', () => {
    const result = analyticsLeadsQuerySchema.parse({})

    expect(result.period).toBe('30')
    expect(result.groupBy).toBe('day')
  })

  it('should accept valid groupBy values', () => {
    const validQuery = { groupBy: 'week' as const }
    const result = analyticsLeadsQuerySchema.safeParse(validQuery)

    expect(result.success).toBe(true)
  })

  it('should reject invalid groupBy', () => {
    const invalidQuery = { groupBy: 'invalid' }
    const result = analyticsLeadsQuerySchema.safeParse(invalidQuery)

    expect(result.success).toBe(false)
  })
})

describe('conversationMessageSchema', () => {
  it('should validate message', () => {
    const validMessage = {
      content: 'Hello, how can I help?',
      role: 'assistant' as const,
    }

    const result = conversationMessageSchema.safeParse(validMessage)
    expect(result.success).toBe(true)
  })

  it('should reject empty content', () => {
    const invalidMessage = {
      content: '',
      role: 'user' as const,
    }

    const result = conversationMessageSchema.safeParse(invalidMessage)
    expect(result.success).toBe(false)
  })

  it('should reject content over 5000 chars', () => {
    const invalidMessage = {
      content: 'a'.repeat(5001),
      role: 'user' as const,
    }

    const result = conversationMessageSchema.safeParse(invalidMessage)
    expect(result.success).toBe(false)
  })

  it('should reject invalid role', () => {
    const invalidMessage = {
      content: 'Test',
      role: 'invalid',
    }

    const result = conversationMessageSchema.safeParse(invalidMessage)
    expect(result.success).toBe(false)
  })
})

describe('conversationTakeoverSchema', () => {
  it('should validate takeover request', () => {
    const validTakeover = {
      reason: 'Customer escalation needed',
      notify: true,
    }

    const result = conversationTakeoverSchema.safeParse(validTakeover)
    expect(result.success).toBe(true)
  })

  it('should use default notify value', () => {
    const takeover = { reason: 'Escalation' }
    const result = conversationTakeoverSchema.parse(takeover)

    expect(result.notify).toBe(true)
  })

  it('should reject empty reason', () => {
    const invalidTakeover = { reason: '' }
    const result = conversationTakeoverSchema.safeParse(invalidTakeover)

    expect(result.success).toBe(false)
  })

  it('should reject reason over 500 chars', () => {
    const invalidTakeover = { reason: 'a'.repeat(501) }
    const result = conversationTakeoverSchema.safeParse(invalidTakeover)

    expect(result.success).toBe(false)
  })
})

describe('qualifiedLeadCreateSchema', () => {
  it('should validate complete lead data', () => {
    const validLead = {
      clientName: 'John Doe',
      phone: '11999999999',
      email: 'john@example.com',
      productId: 'prod_123',
      productName: 'Product A',
      score: {
        total: 85,
        urgency: 90,
        probability: 80,
        complexity: 70,
        category: 'hot' as const,
        reasoning: ['High urgency case']
      },
      sessionId: 'session_123',
    }

    const result = qualifiedLeadCreateSchema.safeParse(validLead)
    expect(result.success).toBe(true)
  })

  it('should validate minimal lead data', () => {
    const minimalLead = {
      phone: '11999999999',
      productId: 'prod_123',
      productName: 'Product A',
      score: {
        total: 85,
        urgency: 90,
        probability: 80,
        complexity: 70,
        category: 'warm' as const,
      },
      sessionId: 'session_123',
    }

    const result = qualifiedLeadCreateSchema.safeParse(minimalLead)
    expect(result.success).toBe(true)
  })

  it('should reject missing phone', () => {
    const invalidLead = {
      productId: 'prod_123',
      productName: 'Product A',
      score: {
        total: 85,
        urgency: 90,
        probability: 80,
        complexity: 70,
        category: 'hot' as const,
      },
      sessionId: 'session_123',
    }

    const result = qualifiedLeadCreateSchema.safeParse(invalidLead)
    expect(result.success).toBe(false)
  })

  it('should reject invalid email', () => {
    const invalidLead = {
      phone: '11999999999',
      email: 'invalid-email',
      productId: 'prod_123',
      productName: 'Product A',
      score: {
        total: 85,
        urgency: 90,
        probability: 80,
        complexity: 70,
        category: 'hot' as const,
      },
      sessionId: 'session_123',
    }

    const result = qualifiedLeadCreateSchema.safeParse(invalidLead)
    expect(result.success).toBe(false)
  })

  it('should reject score out of range', () => {
    const invalidLead = {
      phone: '11999999999',
      productId: 'prod_123',
      productName: 'Product A',
      score: {
        total: 150, // Invalid: over 100
        urgency: 90,
        probability: 80,
        complexity: 70,
        category: 'hot' as const,
      },
      sessionId: 'session_123',
    }

    const result = qualifiedLeadCreateSchema.safeParse(invalidLead)
    expect(result.success).toBe(false)
  })

  it('should reject invalid score category', () => {
    const invalidLead = {
      phone: '11999999999',
      productId: 'prod_123',
      productName: 'Product A',
      score: {
        total: 85,
        urgency: 90,
        probability: 80,
        complexity: 70,
        category: 'invalid' as any,
      },
      sessionId: 'session_123',
    }

    const result = qualifiedLeadCreateSchema.safeParse(invalidLead)
    expect(result.success).toBe(false)
  })
})

describe('manualFollowUpSchema', () => {
  it('should validate follow-up', () => {
    const validFollowUp = {
      leadId: '123e4567-e89b-12d3-a456-426614174000',
      type: 'whatsapp' as const,
      message: 'Follow up message',
    }

    const result = manualFollowUpSchema.safeParse(validFollowUp)
    expect(result.success).toBe(true)
  })

  it('should reject invalid UUID', () => {
    const invalidFollowUp = {
      leadId: 'not-a-uuid',
      type: 'email' as const,
      message: 'Message',
    }

    const result = manualFollowUpSchema.safeParse(invalidFollowUp)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Invalid lead ID')
    }
  })

  it('should reject message over 5000 chars', () => {
    const invalidFollowUp = {
      leadId: '123e4567-e89b-12d3-a456-426614174000',
      type: 'email' as const,
      message: 'a'.repeat(5001),
    }

    const result = manualFollowUpSchema.safeParse(invalidFollowUp)
    expect(result.success).toBe(false)
  })

  it('should accept all follow-up types', () => {
    const types = ['email', 'whatsapp', 'sms', 'call'] as const

    types.forEach(type => {
      const followUp = {
        leadId: '123e4567-e89b-12d3-a456-426614174000',
        type,
        message: 'Test message',
      }

      const result = manualFollowUpSchema.safeParse(followUp)
      expect(result.success).toBe(true)
    })
  })
})
