/**
 * Lead Qualifier Unit Tests
 */

import { LeadQualifier, createLeadQualifier, resumeLeadQualification } from '../lead-qualifier'
import type { ProductQualificationConfig, QualificationContext, QualificationQuestion, ScoringRule } from '../types'

// Mock uuid
jest.mock('uuid', () => ({
  v4: () => 'test-lead-id-12345',
}))

describe('LeadQualifier', () => {
  const mockQuestions: QualificationQuestion[] = [
    {
      id: 'q1',
      text: 'What is your issue?',
      type: 'single-choice',
      priority: 'required',
      options: [
        { value: 'urgent', label: 'Urgent', score: 10 },
        { value: 'normal', label: 'Normal', score: 5 },
      ],
    },
    {
      id: 'q2',
      text: 'Do you have documentation?',
      type: 'single-choice',
      priority: 'required',
      options: [
        { value: 'yes', label: 'Yes', score: 10 },
        { value: 'no', label: 'No', score: 0 },
      ],
    },
    {
      id: 'q3',
      text: 'Additional details?',
      type: 'text',
      priority: 'optional',
    },
  ]

  const mockRules: ScoringRule[] = [
    {
      id: 'rule-urgent',
      description: 'Urgent case',
      condition: (answers) => answers.some(a => a.questionId === 'q1' && a.value === 'urgent'),
      impact: { urgency: 30, probability: 10 },
    },
    {
      id: 'rule-docs',
      description: 'Has documentation',
      condition: (answers) => answers.some(a => a.questionId === 'q2' && a.value === 'yes'),
      impact: { probability: 20 },
    },
  ]

  const mockConfig: ProductQualificationConfig = {
    productId: 'test-product',
    questions: mockQuestions,
    scoringRules: mockRules,
  }

  const mockContext: QualificationContext = {
    sessionId: 'session-123',
    source: 'website',
    userId: 'user-456',
  }

  const basePrice = 100000 // R$ 1.000,00

  describe('constructor and getNextQuestion', () => {
    it('should create qualifier and get first question', () => {
      const qualifier = new LeadQualifier(mockConfig, mockContext, basePrice)
      const nextQ = qualifier.getNextQuestion()

      expect(nextQ).toBeDefined()
      expect(nextQ?.id).toBe('q1')
    })

    it('should track progress initially', () => {
      const qualifier = new LeadQualifier(mockConfig, mockContext, basePrice)
      const progress = qualifier.getProgress()

      expect(progress.answered).toBe(0)
      expect(progress.total).toBe(3)
      expect(progress.percentage).toBe(0)
    })
  })

  describe('submitAnswer', () => {
    it('should accept valid answer and return next question', async () => {
      const qualifier = new LeadQualifier(mockConfig, mockContext, basePrice)

      const result = await qualifier.submitAnswer('q1', 'urgent')

      expect(result.success).toBe(true)
      expect(result.nextQuestion).toBeDefined()
      expect(result.nextQuestion?.id).toBe('q2')
    })

    it('should update progress after answer', async () => {
      const qualifier = new LeadQualifier(mockConfig, mockContext, basePrice)

      await qualifier.submitAnswer('q1', 'urgent')
      const progress = qualifier.getProgress()

      expect(progress.answered).toBe(1)
      expect(progress.percentage).toBeGreaterThan(0)
    })

    it('should reject invalid answer', async () => {
      const qualifier = new LeadQualifier(mockConfig, mockContext, basePrice)

      // Trying to answer non-existent question
      const result = await qualifier.submitAnswer('invalid-q', 'value')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('isComplete', () => {
    it('should return false when required questions not answered', () => {
      const qualifier = new LeadQualifier(mockConfig, mockContext, basePrice)

      expect(qualifier.isComplete()).toBe(false)
    })

    it('should return true when all required questions answered', async () => {
      const qualifier = new LeadQualifier(mockConfig, mockContext, basePrice)

      await qualifier.submitAnswer('q1', 'urgent')
      await qualifier.submitAnswer('q2', 'yes')

      expect(qualifier.isComplete()).toBe(true)
    })
  })

  describe('getResult', () => {
    it('should return qualification result with scores', async () => {
      const qualifier = new LeadQualifier(mockConfig, mockContext, basePrice)

      await qualifier.submitAnswer('q1', 'urgent')
      await qualifier.submitAnswer('q2', 'yes')

      const result = qualifier.getResult()

      expect(result.leadId).toBe('test-lead-id-12345')
      expect(result.productId).toBe('test-product')
      expect(result.score).toBeDefined()
      expect(result.score.urgency).toBeGreaterThan(50) // Rule applied
      expect(result.score.probability).toBeGreaterThan(50) // Rules applied
      expect(result.answers).toHaveLength(2)
      expect(result.isComplete).toBe(true)
    })

    it('should determine recommended action based on score', async () => {
      const qualifier = new LeadQualifier(mockConfig, mockContext, basePrice)

      await qualifier.submitAnswer('q1', 'urgent')
      await qualifier.submitAnswer('q2', 'yes')

      const result = qualifier.getResult()

      expect(result.recommendedAction).toBeDefined()
      expect(result.recommendedAction.type).toBeDefined()
      expect(result.recommendedAction.priority).toBeDefined()
      expect(result.recommendedAction.message).toBeDefined()
    })
  })

  describe('getClientSummary', () => {
    it('should return progress summary when incomplete', () => {
      const qualifier = new LeadQualifier(mockConfig, mockContext, basePrice)

      const summary = qualifier.getClientSummary()

      expect(summary).toContain('0 de 3')
      expect(summary).toContain('obrigatórias')
    })

    it('should return score interpretation when complete', async () => {
      const qualifier = new LeadQualifier(mockConfig, mockContext, basePrice)

      await qualifier.submitAnswer('q1', 'urgent')
      await qualifier.submitAnswer('q2', 'yes')

      const summary = qualifier.getClientSummary()

      // Should contain score interpretation
      expect(summary.length).toBeGreaterThan(0)
    })
  })

  describe('exportState and importState', () => {
    it('should export and restore state', async () => {
      const qualifier = new LeadQualifier(mockConfig, mockContext, basePrice)
      await qualifier.submitAnswer('q1', 'urgent')

      const state = qualifier.exportState()

      expect(state.leadId).toBe('test-lead-id-12345')
      expect(state.productId).toBe('test-product')
      expect(state.engineState).toBeDefined()
    })

    it('should import state and resume', async () => {
      const original = new LeadQualifier(mockConfig, mockContext, basePrice)
      await original.submitAnswer('q1', 'urgent')
      const state = original.exportState()

      const restored = LeadQualifier.importState(state, mockConfig)
      const nextQ = restored.getNextQuestion()

      // Should continue from where we left
      expect(nextQ?.id).toBe('q2')
      expect(restored.getProgress().answered).toBe(1)
    })
  })

  describe('createLeadQualifier', () => {
    it('should create qualifier with helper function', () => {
      const qualifier = createLeadQualifier(mockConfig, mockContext, basePrice)

      expect(qualifier).toBeInstanceOf(LeadQualifier)
      expect(qualifier.getNextQuestion()).toBeDefined()
    })
  })

  describe('resumeLeadQualification', () => {
    it('should resume qualification from state', async () => {
      const original = createLeadQualifier(mockConfig, mockContext, basePrice)
      await original.submitAnswer('q1', 'urgent')
      const state = original.exportState()

      const resumed = resumeLeadQualification(state, mockConfig)

      expect(resumed.getProgress().answered).toBe(1)
    })
  })

  describe('recommended action determination', () => {
    it('should recommend schedule-consultation for hot leads with high urgency', async () => {
      // Create rules that will result in hot category with high urgency
      // Base scores are 50, and total = urgency*0.4 + probability*0.35 + complexity*0.25
      // Need total >= 80 to be "hot"
      // With urgency=90, probability=85, complexity=80: 90*0.4 + 85*0.35 + 80*0.25 = 36+29.75+20 = 85.75
      const hotRules: ScoringRule[] = [
        {
          id: 'rule-extreme-urgency',
          description: 'Extreme urgency',
          condition: () => true,
          impact: { urgency: 40, probability: 35, complexity: 30 },
        },
      ]

      const hotConfig: ProductQualificationConfig = {
        productId: 'test',
        questions: [{ id: 'q1', text: 'Q', type: 'text', priority: 'required' }],
        scoringRules: hotRules,
      }

      const qualifier = new LeadQualifier(hotConfig, mockContext, basePrice)
      await qualifier.submitAnswer('q1', 'value')

      const result = qualifier.getResult()

      expect(result.score.category).toBe('hot')
      expect(['schedule-consultation', 'send-proposal']).toContain(result.recommendedAction.type)
      expect(result.recommendedAction.priority).toBe('immediate')
    })

    it('should recommend follow-up for cold leads', async () => {
      // Create rules that will result in cold category
      const coldRules: ScoringRule[] = [
        {
          id: 'rule-low-scores',
          description: 'Low scores',
          condition: () => true,
          impact: { urgency: -10, probability: -10 },
        },
      ]

      const coldConfig: ProductQualificationConfig = {
        productId: 'test',
        questions: [{ id: 'q1', text: 'Q', type: 'text', priority: 'required' }],
        scoringRules: coldRules,
      }

      const qualifier = new LeadQualifier(coldConfig, mockContext, basePrice)
      await qualifier.submitAnswer('q1', 'value')

      const result = qualifier.getResult()

      expect(result.score.category).toBe('cold')
      expect(result.recommendedAction.type).toBe('follow-up')
      expect(result.recommendedAction.priority).toBe('medium')
    })
  })
})
