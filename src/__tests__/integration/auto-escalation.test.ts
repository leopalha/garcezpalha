/**
 * Integration Test: Auto-Escalation Logic
 *
 * Tests the auto-escalation functionality for high-score leads
 */

import { describe, it, expect } from 'vitest'
import { ESCALATION_RULES } from '@/lib/ai/agents/state-machine/types'
import type { ConversationData } from '@/lib/ai/agents/state-machine/types'

// Helper to create complete mock data
function createMockConversation(overrides: Partial<ConversationData> = {}): ConversationData {
  return {
    conversation_id: 'test-conv-123',
    channel: 'website' as const,
    client: {
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '+5511999999999',
    },
    classification: {
      area: 'real-estate',
      agent_assigned: 'real-estate-agent',
      confidence: 0.95,
    },
    qualification: {
      status: 'complete',
      score: 50,
      questions_answered: 10,
      total_questions: 10,
      flags: [],
    },
    proposal: {},
    status: {
      state: 'qualified',
      updated_at: new Date(),
    },
    created_at: new Date(),
    last_message_at: new Date(),
    ...overrides,
  }
}

describe('Auto-Escalation Logic', () => {
  it('should have escalation rule for high-score leads (>= 80)', () => {
    // Verify the rule exists
    const highScoreRule = ESCALATION_RULES.find((rule) =>
      rule.reason.includes('Score >= 80')
    )

    expect(highScoreRule).toBeDefined()
    expect(highScoreRule?.priority).toBe('high')
  })

  it('should trigger escalation for lead with score 80', () => {
    const mockData = createMockConversation({
      qualification: {
        status: 'complete',
        score: 80,
        questions_answered: 10,
        total_questions: 10,
        flags: [],
      },
    })

    const highScoreRule = ESCALATION_RULES[0] // First rule is high score
    const shouldEscalate = highScoreRule.condition(mockData)

    expect(shouldEscalate).toBe(true)
  })

  it('should trigger escalation for lead with score 95', () => {
    const mockData = createMockConversation({
      qualification: {
        status: 'complete',
        score: 95,
        questions_answered: 10,
        total_questions: 10,
        flags: [],
      },
    })

    const highScoreRule = ESCALATION_RULES[0]
    const shouldEscalate = highScoreRule.condition(mockData)

    expect(shouldEscalate).toBe(true)
  })

  it('should NOT trigger escalation for lead with score 79', () => {
    const mockData = createMockConversation({
      qualification: {
        status: 'complete',
        score: 79,
        questions_answered: 10,
        total_questions: 10,
        flags: [],
      },
    })

    const highScoreRule = ESCALATION_RULES[0]
    const shouldEscalate = highScoreRule.condition(mockData)

    expect(shouldEscalate).toBe(false)
  })

  it('should NOT trigger escalation for score 80+ if status is not qualified', () => {
    const mockData = createMockConversation({
      status: {
        state: 'classifying', // Wrong state
        updated_at: new Date(),
      },
      qualification: {
        status: 'complete',
        score: 85,
        questions_answered: 10,
        total_questions: 10,
        flags: [],
      },
    })

    const highScoreRule = ESCALATION_RULES[0]
    const shouldEscalate = highScoreRule.condition(mockData)

    expect(shouldEscalate).toBe(false)
  })

  it('should NOT trigger escalation if qualification is incomplete', () => {
    const mockData = createMockConversation({
      status: {
        state: 'qualified',
        updated_at: new Date(),
      },
      qualification: {
        status: 'in_progress', // Not complete
        score: 90,
        questions_answered: 5,
        total_questions: 10,
        flags: [],
      },
    })

    const highScoreRule = ESCALATION_RULES[0]
    const shouldEscalate = highScoreRule.condition(mockData)

    expect(shouldEscalate).toBe(false)
  })

  it('should have multiple escalation rules (score, complex, angry, etc)', () => {
    expect(ESCALATION_RULES.length).toBeGreaterThanOrEqual(5)

    // Check that different priority levels exist
    const priorities = ESCALATION_RULES.map((rule) => rule.priority)
    expect(priorities).toContain('high')
    expect(priorities).toContain('critical')
    expect(priorities).toContain('medium')
  })

  it('should escalate angry customers with critical priority', () => {
    const angryRule = ESCALATION_RULES.find((rule) =>
      rule.reason.includes('insatisfeito')
    )

    expect(angryRule).toBeDefined()
    expect(angryRule?.priority).toBe('critical')

    const mockData: Partial<ConversationData> = {
      qualification: {
        status: 'complete',
        score: 60,
        questions_answered: 8,
        total_questions: 10,
        flags: ['angry_customer'],
      },
    } as ConversationData

    const shouldEscalate = angryRule?.condition(mockData as ConversationData)
    expect(shouldEscalate).toBe(true)
  })

  it('should escalate complex cases', () => {
    const complexRule = ESCALATION_RULES.find((rule) =>
      rule.reason.includes('complexo')
    )

    expect(complexRule).toBeDefined()

    const mockData: Partial<ConversationData> = {
      qualification: {
        status: 'complete',
        score: 70,
        questions_answered: 10,
        total_questions: 10,
        flags: ['complex_case'],
      },
    } as ConversationData

    const shouldEscalate = complexRule?.condition(mockData as ConversationData)
    expect(shouldEscalate).toBe(true)
  })

  it('should escalate high-value proposals', () => {
    const highValueRule = ESCALATION_RULES.find((rule) =>
      rule.reason.includes('R$ 5.000')
    )

    expect(highValueRule).toBeDefined()

    const mockData: Partial<ConversationData> = {
      proposal: {
        value: 600000, // R$ 6.000 (in centavos)
      },
    } as ConversationData

    const shouldEscalate = highValueRule?.condition(mockData as ConversationData)
    expect(shouldEscalate).toBe(true)
  })

  it('should NOT escalate proposals under R$ 5.000', () => {
    const highValueRule = ESCALATION_RULES.find((rule) =>
      rule.reason.includes('R$ 5.000')
    )

    const mockData: Partial<ConversationData> = {
      proposal: {
        value: 300000, // R$ 3.000 (in centavos)
      },
    } as ConversationData

    const shouldEscalate = highValueRule?.condition(mockData as ConversationData)
    expect(shouldEscalate).toBe(false)
  })
})
