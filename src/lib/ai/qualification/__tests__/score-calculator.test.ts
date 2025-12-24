/**
 * Score Calculator Unit Tests
 */

import {
  calculateLeadScore,
  categorizeScore,
  getAnswerValue,
  answerEquals,
  answerIn,
  answerInRange,
  answerGreaterThan,
  answerContains,
  countAnsweredQuestions,
  areRequiredQuestionsAnswered,
  calculateCompletionPercentage,
  getScoreInterpretation,
  estimateCaseValue,
} from '../score-calculator'
import type { QuestionAnswer, ScoringRule, LeadScore } from '../types'

describe('Score Calculator', () => {
  describe('categorizeScore', () => {
    it('should categorize score >= 80 as hot', () => {
      expect(categorizeScore(80)).toBe('hot')
      expect(categorizeScore(90)).toBe('hot')
      expect(categorizeScore(100)).toBe('hot')
    })

    it('should categorize score 60-79 as warm', () => {
      expect(categorizeScore(60)).toBe('warm')
      expect(categorizeScore(70)).toBe('warm')
      expect(categorizeScore(79)).toBe('warm')
    })

    it('should categorize score 40-59 as cold', () => {
      expect(categorizeScore(40)).toBe('cold')
      expect(categorizeScore(50)).toBe('cold')
      expect(categorizeScore(59)).toBe('cold')
    })

    it('should categorize score < 40 as unqualified', () => {
      expect(categorizeScore(0)).toBe('unqualified')
      expect(categorizeScore(20)).toBe('unqualified')
      expect(categorizeScore(39)).toBe('unqualified')
    })
  })

  describe('calculateLeadScore', () => {
    const mockRules: ScoringRule[] = [
      {
        id: 'rule-urgency-high',
        description: 'High urgency case',
        condition: (answers) => answers.some(a => a.questionId === 'urgency' && a.value === 'high'),
        impact: { urgency: 30 },
      },
      {
        id: 'rule-probability-good',
        description: 'Good evidence',
        condition: (answers) => answers.some(a => a.questionId === 'evidence' && a.value === 'strong'),
        impact: { probability: 25 },
      },
      {
        id: 'rule-complexity-low',
        description: 'Simple case',
        condition: (answers) => answers.some(a => a.questionId === 'complexity' && a.value === 'low'),
        impact: { complexity: -20 },
      },
    ]

    it('should calculate base score without matching rules', () => {
      const answers: QuestionAnswer[] = []
      const score = calculateLeadScore(answers, mockRules)

      expect(score.urgency).toBe(50)
      expect(score.probability).toBe(50)
      expect(score.complexity).toBe(50)
      expect(score.total).toBe(50)
      expect(score.category).toBe('cold')
      expect(score.reasoning).toHaveLength(0)
    })

    it('should apply urgency rule', () => {
      const answers: QuestionAnswer[] = [
        { questionId: 'urgency', value: 'high', timestamp: new Date() },
      ]
      const score = calculateLeadScore(answers, mockRules)

      expect(score.urgency).toBe(80) // 50 + 30
      expect(score.reasoning).toContain('High urgency case')
    })

    it('should apply multiple rules', () => {
      const answers: QuestionAnswer[] = [
        { questionId: 'urgency', value: 'high', timestamp: new Date() },
        { questionId: 'evidence', value: 'strong', timestamp: new Date() },
      ]
      const score = calculateLeadScore(answers, mockRules)

      expect(score.urgency).toBe(80) // 50 + 30
      expect(score.probability).toBe(75) // 50 + 25
      expect(score.reasoning).toHaveLength(2)
    })

    it('should cap scores at 100', () => {
      const rules: ScoringRule[] = [
        {
          id: 'rule-max',
          description: 'Max urgency',
          condition: () => true,
          impact: { urgency: 100 },
        },
      ]
      const score = calculateLeadScore([], rules)

      expect(score.urgency).toBe(100) // Capped at 100
    })

    it('should not go below 0', () => {
      const rules: ScoringRule[] = [
        {
          id: 'rule-min',
          description: 'Min complexity',
          condition: () => true,
          impact: { complexity: -100 },
        },
      ]
      const score = calculateLeadScore([], rules)

      expect(score.complexity).toBe(0) // Capped at 0
    })

    it('should calculate weighted total correctly', () => {
      // Total = urgency * 0.4 + probability * 0.35 + complexity * 0.25
      const answers: QuestionAnswer[] = []
      const score = calculateLeadScore(answers, [])

      // 50 * 0.4 + 50 * 0.35 + 50 * 0.25 = 20 + 17.5 + 12.5 = 50
      expect(score.total).toBe(50)
    })
  })

  describe('getAnswerValue', () => {
    const answers: QuestionAnswer[] = [
      { questionId: 'q1', value: 'answer1', timestamp: new Date() },
      { questionId: 'q2', value: 42, timestamp: new Date() },
      { questionId: 'q3', value: true, timestamp: new Date() },
    ]

    it('should return value for existing question', () => {
      expect(getAnswerValue(answers, 'q1')).toBe('answer1')
      expect(getAnswerValue(answers, 'q2')).toBe(42)
      expect(getAnswerValue(answers, 'q3')).toBe(true)
    })

    it('should return undefined for non-existing question', () => {
      expect(getAnswerValue(answers, 'q-unknown')).toBeUndefined()
    })
  })

  describe('answerEquals', () => {
    const answers: QuestionAnswer[] = [
      { questionId: 'status', value: 'active', timestamp: new Date() },
      { questionId: 'count', value: 5, timestamp: new Date() },
    ]

    it('should return true when value matches', () => {
      expect(answerEquals(answers, 'status', 'active')).toBe(true)
      expect(answerEquals(answers, 'count', 5)).toBe(true)
    })

    it('should return false when value does not match', () => {
      expect(answerEquals(answers, 'status', 'inactive')).toBe(false)
      expect(answerEquals(answers, 'count', 10)).toBe(false)
    })

    it('should return false for non-existing question', () => {
      expect(answerEquals(answers, 'unknown', 'value')).toBe(false)
    })
  })

  describe('answerIn', () => {
    const answers: QuestionAnswer[] = [
      { questionId: 'category', value: 'B', timestamp: new Date() },
    ]

    it('should return true when value is in array', () => {
      expect(answerIn(answers, 'category', ['A', 'B', 'C'])).toBe(true)
    })

    it('should return false when value is not in array', () => {
      expect(answerIn(answers, 'category', ['X', 'Y', 'Z'])).toBe(false)
    })
  })

  describe('answerInRange', () => {
    const answers: QuestionAnswer[] = [
      { questionId: 'amount', value: 50, timestamp: new Date() },
      { questionId: 'text', value: 'not a number', timestamp: new Date() },
    ]

    it('should return true when number is in range', () => {
      expect(answerInRange(answers, 'amount', 0, 100)).toBe(true)
      expect(answerInRange(answers, 'amount', 50, 50)).toBe(true)
    })

    it('should return false when number is out of range', () => {
      expect(answerInRange(answers, 'amount', 0, 49)).toBe(false)
      expect(answerInRange(answers, 'amount', 51, 100)).toBe(false)
    })

    it('should return false for non-numeric values', () => {
      expect(answerInRange(answers, 'text', 0, 100)).toBe(false)
    })
  })

  describe('answerGreaterThan', () => {
    const answers: QuestionAnswer[] = [
      { questionId: 'value', value: 75, timestamp: new Date() },
    ]

    it('should return true when value is greater', () => {
      expect(answerGreaterThan(answers, 'value', 50)).toBe(true)
    })

    it('should return false when value is equal or less', () => {
      expect(answerGreaterThan(answers, 'value', 75)).toBe(false)
      expect(answerGreaterThan(answers, 'value', 100)).toBe(false)
    })
  })

  describe('answerContains', () => {
    const answers: QuestionAnswer[] = [
      { questionId: 'description', value: 'Case about fraud and theft', timestamp: new Date() },
      { questionId: 'tags', value: ['criminal', 'urgent', 'priority'], timestamp: new Date() },
    ]

    it('should return true when string contains text', () => {
      expect(answerContains(answers, 'description', 'fraud')).toBe(true)
      expect(answerContains(answers, 'description', 'FRAUD')).toBe(true) // Case insensitive
    })

    it('should return true when array contains text', () => {
      expect(answerContains(answers, 'tags', 'urgent')).toBe(true)
      expect(answerContains(answers, 'tags', 'CRIMINAL')).toBe(true)
    })

    it('should return false when text not found', () => {
      expect(answerContains(answers, 'description', 'murder')).toBe(false)
      expect(answerContains(answers, 'tags', 'low-priority')).toBe(false)
    })
  })

  describe('countAnsweredQuestions', () => {
    it('should count non-empty answers', () => {
      const answers: QuestionAnswer[] = [
        { questionId: 'q1', value: 'answer', timestamp: new Date() },
        { questionId: 'q2', value: 0, timestamp: new Date() },
        { questionId: 'q3', value: false, timestamp: new Date() },
      ]
      expect(countAnsweredQuestions(answers)).toBe(3)
    })

    it('should not count empty string values', () => {
      const answers: QuestionAnswer[] = [
        { questionId: 'q1', value: '', timestamp: new Date() },
        { questionId: 'q2', value: 'filled', timestamp: new Date() },
      ]
      expect(countAnsweredQuestions(answers)).toBe(1)
    })

    it('should not count undefined values', () => {
      const answers: QuestionAnswer[] = [
        { questionId: 'q1', value: undefined as any, timestamp: new Date() },
        { questionId: 'q2', value: 'filled', timestamp: new Date() },
      ]
      expect(countAnsweredQuestions(answers)).toBe(1)
    })
  })

  describe('areRequiredQuestionsAnswered', () => {
    const answers: QuestionAnswer[] = [
      { questionId: 'name', value: 'John', timestamp: new Date() },
      { questionId: 'email', value: 'john@test.com', timestamp: new Date() },
    ]

    it('should return true when all required questions answered', () => {
      expect(areRequiredQuestionsAnswered(answers, ['name', 'email'])).toBe(true)
    })

    it('should return false when some required questions not answered', () => {
      expect(areRequiredQuestionsAnswered(answers, ['name', 'email', 'phone'])).toBe(false)
    })

    it('should return true for empty required list', () => {
      expect(areRequiredQuestionsAnswered(answers, [])).toBe(true)
    })
  })

  describe('calculateCompletionPercentage', () => {
    it('should calculate percentage correctly', () => {
      const answers: QuestionAnswer[] = [
        { questionId: 'q1', value: 'a', timestamp: new Date() },
        { questionId: 'q2', value: 'b', timestamp: new Date() },
      ]
      expect(calculateCompletionPercentage(answers, 4)).toBe(50)
    })

    it('should return 100 for completed', () => {
      const answers: QuestionAnswer[] = [
        { questionId: 'q1', value: 'a', timestamp: new Date() },
        { questionId: 'q2', value: 'b', timestamp: new Date() },
      ]
      expect(calculateCompletionPercentage(answers, 2)).toBe(100)
    })

    it('should return 100 for zero total questions', () => {
      expect(calculateCompletionPercentage([], 0)).toBe(100)
    })
  })

  describe('getScoreInterpretation', () => {
    it('should return hot interpretation for high urgency', () => {
      const score: LeadScore = {
        total: 85,
        urgency: 85,
        probability: 80,
        complexity: 70,
        category: 'hot',
        reasoning: [],
      }
      const interpretation = getScoreInterpretation(score)
      expect(interpretation).toContain('altamente qualificado')
      expect(interpretation).toContain('imediatamente')
    })

    it('should return warm interpretation', () => {
      const score: LeadScore = {
        total: 65,
        urgency: 65,
        probability: 60,
        complexity: 50,
        category: 'warm',
        reasoning: [],
      }
      const interpretation = getScoreInterpretation(score)
      expect(interpretation).toContain('qualificado')
    })

    it('should return cold interpretation', () => {
      const score: LeadScore = {
        total: 45,
        urgency: 40,
        probability: 45,
        complexity: 65,
        category: 'cold',
        reasoning: [],
      }
      const interpretation = getScoreInterpretation(score)
      expect(interpretation).toContain('potencial limitado')
    })

    it('should return unqualified interpretation', () => {
      const score: LeadScore = {
        total: 25,
        urgency: 20,
        probability: 25,
        complexity: 30,
        category: 'unqualified',
        reasoning: [],
      }
      const interpretation = getScoreInterpretation(score)
      expect(interpretation).toContain('não qualificado')
    })
  })

  describe('estimateCaseValue', () => {
    it('should apply complexity multiplier for high complexity', () => {
      const score: LeadScore = {
        total: 70,
        urgency: 70,
        probability: 80,
        complexity: 85,
        category: 'warm',
        reasoning: [],
      }
      const result = estimateCaseValue(score, 100000)

      // High complexity (>= 80) multiplies by 1.5
      // High probability (>= 80) keeps at 1.0
      // 100000 * 1.5 * 1.0 = 150000
      expect(result.estimatedFee).toBe(150000)
      expect(result.estimatedValue).toBe(300000) // 2x fee
    })

    it('should apply probability reduction for low probability', () => {
      const score: LeadScore = {
        total: 35,
        urgency: 30,
        probability: 35,
        complexity: 50,
        category: 'unqualified',
        reasoning: [],
      }
      const result = estimateCaseValue(score, 100000)

      // Medium complexity (40-60) multiplies by 1.1
      // Low probability (< 40) multiplies by 0.7
      // 100000 * 1.1 * 0.7 = 77000
      expect(result.estimatedFee).toBe(77000)
    })
  })
})
