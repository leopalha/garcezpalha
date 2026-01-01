/**
 * Integration Test for Lead Qualification System
 * Tests all products with their questions and scoring rules
 */

import { describe, it, expect } from 'vitest'
import {
  // Criminal
  DEFESA_CRIMINAL_QUESTIONS,
  DEFESA_CRIMINAL_RULES,
  HABEAS_CORPUS_QUESTIONS,
  HABEAS_CORPUS_RULES,
  // Expertise
  GRAFOTECNICA_QUESTIONS,
  GRAFOTECNICA_RULES,
  AVALIACAO_IMOVEIS_QUESTIONS,
  AVALIACAO_IMOVEIS_RULES,
  PERICIA_MEDICA_QUESTIONS,
  PERICIA_MEDICA_RULES,
  // Social Security
  BPC_LOAS_QUESTIONS,
  BPC_LOAS_RULES,
  APOSENTADORIA_INVALIDEZ_QUESTIONS,
  APOSENTADORIA_INVALIDEZ_RULES,
  AUXILIO_DOENCA_QUESTIONS,
  AUXILIO_DOENCA_RULES,
  // Health Insurance
  PLANO_SAUDE_QUESTIONS,
  PLANO_SAUDE_RULES,
  BARIATRICA_QUESTIONS,
  BARIATRICA_RULES,
  TEA_QUESTIONS,
  TEA_RULES,
  // Patrimonial
  USUCAPIAO_QUESTIONS,
  USUCAPIAO_RULES,
  HOLDING_FAMILIAR_QUESTIONS,
  HOLDING_FAMILIAR_RULES,
  INVENTARIO_QUESTIONS,
  INVENTARIO_RULES,
  REGULARIZACAO_IMOVEL_QUESTIONS,
  REGULARIZACAO_IMOVEL_RULES,
  // Financial Protection
  ACCOUNT_UNBLOCKING_QUESTIONS,
  ACCOUNT_UNBLOCKING_RULES,
  PIX_FRAUD_QUESTIONS,
  PIX_FRAUD_RULES,
  CREDIT_NEGATIVATION_QUESTIONS,
  CREDIT_NEGATIVATION_RULES,
  // Engine & Scoring
  QuestionEngine,
  calculateLeadScore,
} from '../index'

describe('Lead Qualification System - Integration Tests', () => {
  describe('Criminal Questions', () => {
    it('should have valid Defesa Criminal questions and rules', () => {
      expect(DEFESA_CRIMINAL_QUESTIONS).toBeDefined()
      expect(DEFESA_CRIMINAL_QUESTIONS.length).toBeGreaterThan(0)
      expect(DEFESA_CRIMINAL_RULES).toBeDefined()
      expect(DEFESA_CRIMINAL_RULES.length).toBeGreaterThan(0)

      // Check question structure
      DEFESA_CRIMINAL_QUESTIONS.forEach(q => {
        expect(q).toHaveProperty('id')
        expect(q).toHaveProperty('text')
        expect(q).toHaveProperty('type')
        expect(q).toHaveProperty('priority')
      })
    })

    it('should have valid Habeas Corpus questions and rules', () => {
      expect(HABEAS_CORPUS_QUESTIONS).toBeDefined()
      expect(HABEAS_CORPUS_QUESTIONS.length).toBeGreaterThan(0)
      expect(HABEAS_CORPUS_RULES).toBeDefined()
      expect(HABEAS_CORPUS_RULES.length).toBeGreaterThan(0)
    })
  })

  describe('Expertise Questions', () => {
    it('should have valid Grafotécnica questions and rules', () => {
      expect(GRAFOTECNICA_QUESTIONS).toBeDefined()
      expect(GRAFOTECNICA_QUESTIONS.length).toBeGreaterThan(0)
      expect(GRAFOTECNICA_RULES).toBeDefined()
      expect(GRAFOTECNICA_RULES.length).toBeGreaterThan(0)
    })

    it('should have valid Avaliação Imóveis questions and rules', () => {
      expect(AVALIACAO_IMOVEIS_QUESTIONS).toBeDefined()
      expect(AVALIACAO_IMOVEIS_QUESTIONS.length).toBeGreaterThan(0)
      expect(AVALIACAO_IMOVEIS_RULES).toBeDefined()
      expect(AVALIACAO_IMOVEIS_RULES.length).toBeGreaterThan(0)
    })

    it('should have valid Perícia Médica questions and rules', () => {
      expect(PERICIA_MEDICA_QUESTIONS).toBeDefined()
      expect(PERICIA_MEDICA_QUESTIONS.length).toBeGreaterThan(0)
      expect(PERICIA_MEDICA_RULES).toBeDefined()
      expect(PERICIA_MEDICA_RULES.length).toBeGreaterThan(0)
    })
  })

  describe('Social Security Questions', () => {
    it('should have valid BPC LOAS questions and rules', () => {
      expect(BPC_LOAS_QUESTIONS).toBeDefined()
      expect(BPC_LOAS_QUESTIONS.length).toBeGreaterThan(0)
      expect(BPC_LOAS_RULES).toBeDefined()
      expect(BPC_LOAS_RULES.length).toBeGreaterThan(0)
    })

    it('should have valid Aposentadoria Invalidez questions and rules', () => {
      expect(APOSENTADORIA_INVALIDEZ_QUESTIONS).toBeDefined()
      expect(APOSENTADORIA_INVALIDEZ_QUESTIONS.length).toBeGreaterThan(0)
      expect(APOSENTADORIA_INVALIDEZ_RULES).toBeDefined()
      expect(APOSENTADORIA_INVALIDEZ_RULES.length).toBeGreaterThan(0)
    })

    it('should have valid Auxílio Doença questions and rules', () => {
      expect(AUXILIO_DOENCA_QUESTIONS).toBeDefined()
      expect(AUXILIO_DOENCA_QUESTIONS.length).toBeGreaterThan(0)
      expect(AUXILIO_DOENCA_RULES).toBeDefined()
      expect(AUXILIO_DOENCA_RULES.length).toBeGreaterThan(0)
    })
  })

  describe('Health Insurance Questions', () => {
    it('should have valid Plano Saúde questions and rules', () => {
      expect(PLANO_SAUDE_QUESTIONS).toBeDefined()
      expect(PLANO_SAUDE_QUESTIONS.length).toBeGreaterThan(0)
      expect(PLANO_SAUDE_RULES).toBeDefined()
      expect(PLANO_SAUDE_RULES.length).toBeGreaterThan(0)
    })

    it('should have valid Bariátrica questions and rules', () => {
      expect(BARIATRICA_QUESTIONS).toBeDefined()
      expect(BARIATRICA_QUESTIONS.length).toBeGreaterThan(0)
      expect(BARIATRICA_RULES).toBeDefined()
      expect(BARIATRICA_RULES.length).toBeGreaterThan(0)
    })

    it('should have valid TEA questions and rules', () => {
      expect(TEA_QUESTIONS).toBeDefined()
      expect(TEA_QUESTIONS.length).toBeGreaterThan(0)
      expect(TEA_RULES).toBeDefined()
      expect(TEA_RULES.length).toBeGreaterThan(0)
    })
  })

  describe('Patrimonial Questions', () => {
    it('should have valid Usucapião questions and rules', () => {
      expect(USUCAPIAO_QUESTIONS).toBeDefined()
      expect(USUCAPIAO_QUESTIONS.length).toBeGreaterThan(0)
      expect(USUCAPIAO_RULES).toBeDefined()
      expect(USUCAPIAO_RULES.length).toBeGreaterThan(0)
    })

    it('should have valid Holding Familiar questions and rules', () => {
      expect(HOLDING_FAMILIAR_QUESTIONS).toBeDefined()
      expect(HOLDING_FAMILIAR_QUESTIONS.length).toBeGreaterThan(0)
      expect(HOLDING_FAMILIAR_RULES).toBeDefined()
      expect(HOLDING_FAMILIAR_RULES.length).toBeGreaterThan(0)
    })

    it('should have valid Inventário questions and rules', () => {
      expect(INVENTARIO_QUESTIONS).toBeDefined()
      expect(INVENTARIO_QUESTIONS.length).toBeGreaterThan(0)
      expect(INVENTARIO_RULES).toBeDefined()
      expect(INVENTARIO_RULES.length).toBeGreaterThan(0)
    })

    it('should have valid Regularização questions and rules', () => {
      expect(REGULARIZACAO_IMOVEL_QUESTIONS).toBeDefined()
      expect(REGULARIZACAO_IMOVEL_QUESTIONS.length).toBeGreaterThan(0)
      expect(REGULARIZACAO_IMOVEL_RULES).toBeDefined()
      expect(REGULARIZACAO_IMOVEL_RULES.length).toBeGreaterThan(0)
    })
  })

  describe('Financial Protection Questions', () => {
    it('should have valid Account Unblocking questions and rules', () => {
      expect(ACCOUNT_UNBLOCKING_QUESTIONS).toBeDefined()
      expect(ACCOUNT_UNBLOCKING_QUESTIONS.length).toBeGreaterThan(0)
      expect(ACCOUNT_UNBLOCKING_RULES).toBeDefined()
      expect(ACCOUNT_UNBLOCKING_RULES.length).toBeGreaterThan(0)
    })

    it('should have valid PIX Fraud questions and rules', () => {
      expect(PIX_FRAUD_QUESTIONS).toBeDefined()
      expect(PIX_FRAUD_QUESTIONS.length).toBeGreaterThan(0)
      expect(PIX_FRAUD_RULES).toBeDefined()
      expect(PIX_FRAUD_RULES.length).toBeGreaterThan(0)
    })

    it('should have valid Credit Negativation questions and rules', () => {
      expect(CREDIT_NEGATIVATION_QUESTIONS).toBeDefined()
      expect(CREDIT_NEGATIVATION_QUESTIONS.length).toBeGreaterThan(0)
      expect(CREDIT_NEGATIVATION_RULES).toBeDefined()
      expect(CREDIT_NEGATIVATION_RULES.length).toBeGreaterThan(0)
    })
  })

  describe('Question Engine Integration', () => {
    it('should create engine for Defesa Criminal and get next question', () => {
      const engine = new QuestionEngine(
        DEFESA_CRIMINAL_QUESTIONS,
        { sessionId: 'test-session', source: 'website' },
        []
      )

      const nextQuestion = engine.getNextQuestion()
      expect(nextQuestion).toBeDefined()
      expect(nextQuestion?.id).toBe('crime-type')
    })

    it('should calculate score for Habeas Corpus case', () => {
      const answers = [
        { questionId: 'hc-type', value: 'liberatory', timestamp: new Date() },
        { questionId: 'detention-type', value: 'preventive', timestamp: new Date() },
        { questionId: 'illegality-ground', value: 'excess-deadline', timestamp: new Date() },
        { questionId: 'detention-duration', value: 'long', timestamp: new Date() },
      ]

      const score = calculateLeadScore(answers, HABEAS_CORPUS_RULES)

      expect(score).toBeDefined()
      expect(score.urgency).toBeGreaterThan(0)
      expect(score.probability).toBeGreaterThan(0)
    })

    it('should calculate score for Perícia Médica case', () => {
      const answers = [
        { questionId: 'purpose', value: 'medical-malpractice', timestamp: new Date() },
        { questionId: 'severity', value: 'severe', timestamp: new Date() },
        { questionId: 'condition-type', value: 'neurological', timestamp: new Date() },
        { questionId: 'financial-impact', value: 'very-high', timestamp: new Date() },
      ]

      const score = calculateLeadScore(answers, PERICIA_MEDICA_RULES)

      expect(score).toBeDefined()
      expect(score.urgency).toBeGreaterThan(0)
      expect(score.complexity).toBeGreaterThan(0)
    })

    it('should handle BPC LOAS qualification', () => {
      const engine = new QuestionEngine(
        BPC_LOAS_QUESTIONS,
        { sessionId: 'test-session', source: 'whatsapp' },
        []
      )

      const requiredQuestions = engine.getRequiredUnanswered()
      expect(requiredQuestions.length).toBeGreaterThan(0)

      // Answer first question
      const firstQ = engine.getNextQuestion()
      if (firstQ) {
        engine.addAnswer({
          questionId: firstQ.id,
          value: 'disabled',
          timestamp: new Date(),
        })

        const progress = engine.getProgress()
        expect(progress.answered).toBe(1)
        expect(progress.total).toBe(BPC_LOAS_QUESTIONS.length)
      }
    })
  })

  describe('Scoring System Integration', () => {
    it('should apply urgency rules correctly for criminal detention', () => {
      const answers = [
        { questionId: 'detention-status', value: 'detained', timestamp: new Date() },
        { questionId: 'crime-type', value: 'violent', timestamp: new Date() },
        { questionId: 'penalty-severity', value: 'very-serious', timestamp: new Date() },
      ]

      const score = calculateLeadScore(answers, DEFESA_CRIMINAL_RULES)

      // Should have high urgency due to detention
      expect(score.urgency).toBeGreaterThanOrEqual(50)
    })

    it('should apply complexity rules for property valuation', () => {
      const answers = [
        { questionId: 'purpose', value: 'expropriation', timestamp: new Date() },
        { questionId: 'nbr-compliance', value: 'yes-judicial', timestamp: new Date() },
        { questionId: 'property-type', value: 'rural', timestamp: new Date() },
      ]

      const score = calculateLeadScore(answers, AVALIACAO_IMOVEIS_RULES)

      // Should have high complexity due to NBR requirement and rural property
      expect(score.complexity).toBeGreaterThan(30)
    })

    it('should apply probability rules for graphotechnical expertise', () => {
      const answers = [
        { questionId: 'forgery-evidence', value: 'strong-visual', timestamp: new Date() },
        { questionId: 'authentic-samples', value: 'many', timestamp: new Date() },
        { questionId: 'legal-context', value: 'criminal', timestamp: new Date() },
      ]

      const score = calculateLeadScore(answers, GRAFOTECNICA_RULES)

      // Should have good probability with strong evidence and samples
      expect(score.probability).toBeGreaterThan(30)
    })
  })

  describe('All Products Coverage', () => {
    const allProducts = [
      { name: 'Defesa Criminal', questions: DEFESA_CRIMINAL_QUESTIONS, rules: DEFESA_CRIMINAL_RULES },
      { name: 'Habeas Corpus', questions: HABEAS_CORPUS_QUESTIONS, rules: HABEAS_CORPUS_RULES },
      { name: 'Grafotécnica', questions: GRAFOTECNICA_QUESTIONS, rules: GRAFOTECNICA_RULES },
      { name: 'Avaliação Imóveis', questions: AVALIACAO_IMOVEIS_QUESTIONS, rules: AVALIACAO_IMOVEIS_RULES },
      { name: 'Perícia Médica', questions: PERICIA_MEDICA_QUESTIONS, rules: PERICIA_MEDICA_RULES },
      { name: 'BPC LOAS', questions: BPC_LOAS_QUESTIONS, rules: BPC_LOAS_RULES },
      { name: 'Aposentadoria Invalidez', questions: APOSENTADORIA_INVALIDEZ_QUESTIONS, rules: APOSENTADORIA_INVALIDEZ_RULES },
      { name: 'Auxílio Doença', questions: AUXILIO_DOENCA_QUESTIONS, rules: AUXILIO_DOENCA_RULES },
      { name: 'Plano Saúde', questions: PLANO_SAUDE_QUESTIONS, rules: PLANO_SAUDE_RULES },
      { name: 'Bariátrica', questions: BARIATRICA_QUESTIONS, rules: BARIATRICA_RULES },
      { name: 'TEA', questions: TEA_QUESTIONS, rules: TEA_RULES },
      { name: 'Usucapião', questions: USUCAPIAO_QUESTIONS, rules: USUCAPIAO_RULES },
      { name: 'Holding Familiar', questions: HOLDING_FAMILIAR_QUESTIONS, rules: HOLDING_FAMILIAR_RULES },
      { name: 'Inventário', questions: INVENTARIO_QUESTIONS, rules: INVENTARIO_RULES },
      { name: 'Regularização', questions: REGULARIZACAO_IMOVEL_QUESTIONS, rules: REGULARIZACAO_IMOVEL_RULES },
      { name: 'Account Unblocking', questions: ACCOUNT_UNBLOCKING_QUESTIONS, rules: ACCOUNT_UNBLOCKING_RULES },
      { name: 'PIX Fraud', questions: PIX_FRAUD_QUESTIONS, rules: PIX_FRAUD_RULES },
      { name: 'Credit Negativation', questions: CREDIT_NEGATIVATION_QUESTIONS, rules: CREDIT_NEGATIVATION_RULES },
    ]

    it('should have all 18 products with valid questions and rules', () => {
      expect(allProducts).toHaveLength(18)

      allProducts.forEach(product => {
        expect(product.questions.length).toBeGreaterThan(0)
        expect(product.rules.length).toBeGreaterThan(0)

        // Each product should have at least 5 questions
        expect(product.questions.length).toBeGreaterThanOrEqual(5)

        // Each product should have at least 4 scoring rules
        expect(product.rules.length).toBeGreaterThanOrEqual(4)
      })
    })

    it('should have unique question IDs within each product', () => {
      allProducts.forEach(product => {
        const ids = product.questions.map(q => q.id)
        const uniqueIds = new Set(ids)
        expect(uniqueIds.size).toBe(ids.length)
      })
    })

    it('should have unique rule IDs within each product', () => {
      allProducts.forEach(product => {
        const ids = product.rules.map(r => r.id)
        const uniqueIds = new Set(ids)
        expect(uniqueIds.size).toBe(ids.length)
      })
    })
  })
})
