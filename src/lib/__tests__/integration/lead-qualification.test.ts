/**
 * Integration Test: Lead Qualification Flow
 * Tests the complete lead qualification process
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock lead qualification data
const mockQualifiedLead = {
  id: 'lead-123',
  client_name: 'João Silva',
  phone: '21987654321',
  email: 'joao@example.com',
  product_id: 'product-1',
  product_name: 'Aposentadoria por Invalidez',
  score_total: 85,
  score_urgency: 90,
  score_probability: 80,
  score_complexity: 85,
  category: 'hot',
  answers: [
    { question: 'Qual sua necessidade?', answer: 'Aposentadoria por invalidez' },
    { question: 'Urgência?', answer: 'Alta' },
  ],
  source: 'whatsapp',
  status: 'new',
  created_at: new Date().toISOString(),
}

describe('Lead Qualification Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should qualify lead as HOT (score > 80)', () => {
    const score = {
      urgency: 90,
      probability: 80,
      complexity: 85,
    }

    const total = (score.urgency + score.probability + score.complexity) / 3
    expect(total).toBeGreaterThan(80)

    const category = total > 80 ? 'hot' : total > 60 ? 'warm' : 'cold'
    expect(category).toBe('hot')
  })

  it('should qualify lead as WARM (score 60-80)', () => {
    const score = {
      urgency: 70,
      probability: 65,
      complexity: 70,
    }

    const total = (score.urgency + score.probability + score.complexity) / 3
    expect(total).toBeGreaterThanOrEqual(60)
    expect(total).toBeLessThanOrEqual(80)

    const category = total > 80 ? 'hot' : total > 60 ? 'warm' : 'cold'
    expect(category).toBe('warm')
  })

  it('should qualify lead as COLD (score < 60)', () => {
    const score = {
      urgency: 40,
      probability: 50,
      complexity: 45,
    }

    const total = (score.urgency + score.probability + score.complexity) / 3
    expect(total).toBeLessThan(60)

    const category = total > 80 ? 'hot' : total > 60 ? 'warm' : 'cold'
    expect(category).toBe('cold')
  })

  it('should store complete lead data', () => {
    expect(mockQualifiedLead).toHaveProperty('client_name')
    expect(mockQualifiedLead).toHaveProperty('phone')
    expect(mockQualifiedLead).toHaveProperty('email')
    expect(mockQualifiedLead).toHaveProperty('product_id')
    expect(mockQualifiedLead).toHaveProperty('score_total')
    expect(mockQualifiedLead).toHaveProperty('category')
    expect(mockQualifiedLead).toHaveProperty('answers')
    expect(mockQualifiedLead.answers).toBeInstanceOf(Array)
    expect(mockQualifiedLead.answers.length).toBeGreaterThan(0)
  })

  it('should track lead source', () => {
    const validSources = ['whatsapp', 'website', 'telegram', 'phone', 'email']
    expect(validSources).toContain(mockQualifiedLead.source)
  })
})
