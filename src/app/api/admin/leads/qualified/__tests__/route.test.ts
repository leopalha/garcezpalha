/**
 * Integration Tests - POST /api/admin/leads/qualified
 * Tests Zod validation and business logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'
import { createMockRequest, expectValidationError, expectSuccess } from '@/test/helpers/api-test-helpers'

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: 'test-user-id', email: 'test@example.com' } },
        error: null,
      })),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: 'lead-123',
              client_name: 'John Doe',
              phone: '11999999999',
              status: 'new',
            },
            error: null,
          })),
        })),
      })),
    })),
  })),
}))

describe('POST /api/admin/leads/qualified', () => {
  const validLeadData = {
    clientName: 'John Doe',
    phone: '11999999999',
    email: 'john@example.com',
    productId: 'prod_123',
    productName: 'Consultoria Jurídica',
    score: {
      total: 85,
      urgency: 90,
      probability: 80,
      complexity: 70,
      category: 'hot',
      reasoning: ['High urgency case', 'Strong probability'],
    },
    answers: [
      { question: 'Qual seu caso?', answer: 'Preciso de consultoria' },
    ],
    source: 'whatsapp',
    sessionId: 'session_123',
    metadata: { campaign: 'test' },
  }

  it('should create qualified lead with valid data', async () => {
    const req = createMockRequest(validLeadData)
    const response = await POST(req)
    const json = await expectSuccess(response, 201)

    expect(json.lead).toBeDefined()
    expect(json.message).toBe('Lead created successfully')
  })

  it('should accept minimal required data', async () => {
    const minimalData = {
      phone: '11999999999',
      productId: 'prod_123',
      productName: 'Produto A',
      score: {
        total: 70,
        urgency: 75,
        probability: 65,
        complexity: 60,
        category: 'warm',
      },
      sessionId: 'session_123',
    }

    const req = createMockRequest(minimalData)
    const response = await POST(req)
    const json = await expectSuccess(response, 201)

    expect(json.lead).toBeDefined()
  })

  it('should reject missing phone', async () => {
    const invalidData = { ...validLeadData, phone: undefined }
    const req = createMockRequest(invalidData)
    const response = await POST(req)

    await expectValidationError(response, 'phone')
  })

  it('should reject empty phone', async () => {
    const invalidData = { ...validLeadData, phone: '' }
    const req = createMockRequest(invalidData)
    const response = await POST(req)

    const json = await expectValidationError(response, 'phone')
    expect(json.details[0].message).toContain('Phone is required')
  })

  it('should reject missing productId', async () => {
    const invalidData = { ...validLeadData, productId: undefined }
    const req = createMockRequest(invalidData)
    const response = await POST(req)

    await expectValidationError(response, 'productId')
  })

  it('should reject missing score', async () => {
    const invalidData = { ...validLeadData, score: undefined }
    const req = createMockRequest(invalidData)
    const response = await POST(req)

    await expectValidationError(response, 'score')
  })

  it('should reject invalid email format', async () => {
    const invalidData = { ...validLeadData, email: 'invalid-email' }
    const req = createMockRequest(invalidData)
    const response = await POST(req)

    await expectValidationError(response, 'email')
  })

  it('should reject score total over 100', async () => {
    const invalidData = {
      ...validLeadData,
      score: { ...validLeadData.score, total: 150 },
    }
    const req = createMockRequest(invalidData)
    const response = await POST(req)

    await expectValidationError(response, 'score.total')
  })

  it('should reject score total below 0', async () => {
    const invalidData = {
      ...validLeadData,
      score: { ...validLeadData.score, total: -10 },
    }
    const req = createMockRequest(invalidData)
    const response = await POST(req)

    await expectValidationError(response, 'score.total')
  })

  it('should reject invalid score category', async () => {
    const invalidData = {
      ...validLeadData,
      score: { ...validLeadData.score, category: 'invalid' },
    }
    const req = createMockRequest(invalidData)
    const response = await POST(req)

    await expectValidationError(response, 'score.category')
  })

  it('should accept all valid score categories', async () => {
    const categories = ['hot', 'warm', 'cold', 'very-cold']

    for (const category of categories) {
      const data = {
        ...validLeadData,
        score: { ...validLeadData.score, category },
      }
      const req = createMockRequest(data)
      const response = await POST(req)

      expect(response.status).toBe(201)
    }
  })

  it('should handle optional fields correctly', async () => {
    const dataWithoutOptionals = {
      phone: '11999999999',
      productId: 'prod_123',
      productName: 'Produto A',
      score: {
        total: 70,
        urgency: 75,
        probability: 65,
        complexity: 60,
        category: 'warm',
      },
      sessionId: 'session_123',
      // Optional fields omitted: clientName, email, answers, source, metadata
    }

    const req = createMockRequest(dataWithoutOptionals)
    const response = await POST(req)

    expect(response.status).toBe(201)
  })
})
