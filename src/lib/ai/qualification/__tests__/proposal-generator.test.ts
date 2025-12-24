/**
 * Proposal Generator Unit Tests
 */

import {
  generateProposal,
  formatProposalForWhatsApp,
  formatProposalAsHTML,
  formatProposalForPDF,
} from '../proposal-generator'
import type { QualificationResult, LeadScore, RecommendedAction } from '../types'

describe('Proposal Generator', () => {
  const mockScore: LeadScore = {
    total: 75,
    urgency: 70,
    probability: 80,
    complexity: 60,
    category: 'warm',
    reasoning: ['Case has good evidence', 'Client is cooperative', 'Timeline is manageable'],
  }

  const mockAction: RecommendedAction = {
    type: 'send-proposal',
    priority: 'high',
    message: 'Send proposal to client',
    estimatedValue: 500000,
    estimatedFee: 250000,
  }

  const mockResult: QualificationResult = {
    leadId: 'lead-123',
    productId: 'desbloqueio-conta',
    agentRole: 'financial-protection',
    questions: [],
    answers: [],
    score: mockScore,
    startedAt: new Date('2024-01-01T10:00:00'),
    completedAt: new Date('2024-01-01T10:30:00'),
    isComplete: true,
    recommendedAction: mockAction,
  }

  describe('generateProposal', () => {
    it('should generate a complete proposal', () => {
      const proposal = generateProposal(mockResult, 'João Silva')

      expect(proposal).toBeDefined()
      expect(proposal.id).toBe('prop_lead-123')
      expect(proposal.leadId).toBe('lead-123')
      expect(proposal.productId).toBe('desbloqueio-conta')
      expect(proposal.clientName).toBe('João Silva')
    })

    it('should include product name from database', () => {
      const proposal = generateProposal(mockResult, 'João Silva')

      expect(proposal.productName).toBe('Desbloqueio de Conta Bancária')
    })

    it('should include all required sections', () => {
      const proposal = generateProposal(mockResult, 'João Silva')

      expect(proposal.sections.length).toBeGreaterThanOrEqual(8)

      const sectionTitles = proposal.sections.map(s => s.title)
      expect(sectionTitles.some(t => t.includes('João Silva'))).toBe(true) // Introduction
      expect(sectionTitles).toContain('Análise do Caso')
      expect(sectionTitles).toContain('Solução Proposta')
      expect(sectionTitles).toContain('Escopo do Trabalho')
      expect(sectionTitles).toContain('Prazos Estimados')
      expect(sectionTitles).toContain('Investimento')
      expect(sectionTitles).toContain('Por que escolher Garcez Palha?')
      expect(sectionTitles).toContain('Próximos Passos')
    })

    it('should order sections correctly', () => {
      const proposal = generateProposal(mockResult, 'João Silva')

      const orders = proposal.sections.map(s => s.order)
      const sortedOrders = [...orders].sort((a, b) => a - b)
      expect(orders).toEqual(sortedOrders)
    })

    it('should include pricing information', () => {
      const proposal = generateProposal(mockResult, 'João Silva')

      expect(proposal.pricing).toBeDefined()
      expect(proposal.pricing.basePrice).toBeGreaterThan(0)
      expect(proposal.pricing.adjustedPrice).toBe(mockAction.estimatedFee)
      expect(proposal.pricing.estimatedCaseValue).toBe(mockAction.estimatedValue)
    })

    it('should set installments based on category', () => {
      // Hot leads: 1 installment
      const hotResult = {
        ...mockResult,
        score: { ...mockScore, category: 'hot' as const },
      }
      const hotProposal = generateProposal(hotResult, 'João')
      expect(hotProposal.pricing.installments).toBe(1)

      // Warm leads: 3 installments
      const warmProposal = generateProposal(mockResult, 'João')
      expect(warmProposal.pricing.installments).toBe(3)

      // Cold leads: 6 installments
      const coldResult = {
        ...mockResult,
        score: { ...mockScore, category: 'cold' as const },
      }
      const coldProposal = generateProposal(coldResult, 'João')
      expect(coldProposal.pricing.installments).toBe(6)
    })

    it('should set validity based on category', () => {
      const now = Date.now()

      // Hot leads: 24 hours validity
      const hotResult = {
        ...mockResult,
        score: { ...mockScore, category: 'hot' as const },
      }
      const hotProposal = generateProposal(hotResult, 'João')
      const hotHours = (hotProposal.validUntil.getTime() - now) / (1000 * 60 * 60)
      expect(hotHours).toBeLessThanOrEqual(24.1)
      expect(hotHours).toBeGreaterThan(23)

      // Cold leads: 168 hours (1 week) validity
      const coldResult = {
        ...mockResult,
        score: { ...mockScore, category: 'cold' as const },
      }
      const coldProposal = generateProposal(coldResult, 'João')
      const coldHours = (coldProposal.validUntil.getTime() - now) / (1000 * 60 * 60)
      expect(coldHours).toBeLessThanOrEqual(168.1)
      expect(coldHours).toBeGreaterThan(167)
    })

    it('should include metadata from qualification', () => {
      const proposal = generateProposal(mockResult, 'João Silva')

      expect(proposal.metadata.leadCategory).toBe('warm')
      expect(proposal.metadata.qualificationScore).toBe(75)
      expect(proposal.metadata.urgency).toBe(70)
      expect(proposal.metadata.probability).toBe(80)
      expect(proposal.metadata.complexity).toBe(60)
    })

    it('should handle unknown product gracefully', () => {
      const unknownResult = {
        ...mockResult,
        productId: 'unknown-product-xyz',
      }
      const proposal = generateProposal(unknownResult, 'João')

      expect(proposal.productName).toBe('Serviço Jurídico')
    })

    it('should include case analysis reasoning', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const analysisSection = proposal.sections.find(s => s.title === 'Análise do Caso')

      expect(analysisSection?.content).toContain('Case has good evidence')
      expect(analysisSection?.content).toContain('Client is cooperative')
    })

    it('should show urgency level in analysis', () => {
      // High urgency case
      const urgentResult = {
        ...mockResult,
        score: { ...mockScore, urgency: 85 },
      }
      const urgentProposal = generateProposal(urgentResult, 'João')
      const analysisSection = urgentProposal.sections.find(s => s.title === 'Análise do Caso')

      expect(analysisSection?.content).toContain('URGÊNCIA')
    })
  })

  describe('formatProposalForWhatsApp', () => {
    it('should format proposal as WhatsApp message', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const whatsappMessage = formatProposalForWhatsApp(proposal)

      expect(whatsappMessage).toBeDefined()
      expect(typeof whatsappMessage).toBe('string')

      // Should use WhatsApp bold formatting
      expect(whatsappMessage).toContain('*')

      // Should contain section content
      expect(whatsappMessage).toContain('João Silva')
      expect(whatsappMessage).toContain('Análise do Caso')
    })

    it('should include separators between sections', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const whatsappMessage = formatProposalForWhatsApp(proposal)

      expect(whatsappMessage).toContain('---')
    })
  })

  describe('formatProposalAsHTML', () => {
    it('should format proposal as HTML', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const html = formatProposalAsHTML(proposal)

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<html>')
      expect(html).toContain('</html>')
    })

    it('should include CSS styles', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const html = formatProposalAsHTML(proposal)

      expect(html).toContain('<style>')
      expect(html).toContain('font-family')
    })

    it('should include product name in title', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const html = formatProposalAsHTML(proposal)

      expect(html).toContain('Desbloqueio de Conta Bancária')
    })

    it('should include footer with company info', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const html = formatProposalAsHTML(proposal)

      expect(html).toContain('Garcez Palha Advocacia')
      expect(html).toContain('364 anos')
    })

    it('should include validity date', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const html = formatProposalAsHTML(proposal)

      expect(html).toContain('Proposta válida até')
    })

    it('should convert markdown formatting to HTML', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const html = formatProposalAsHTML(proposal)

      // Should convert **bold** to <strong>
      expect(html).toContain('<strong>')
    })
  })

  describe('formatProposalForPDF', () => {
    it('should return HTML format for PDF generation', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const pdf = formatProposalForPDF(proposal)

      // Currently returns same as HTML
      expect(pdf).toContain('<!DOCTYPE html>')
      expect(pdf).toContain('Garcez Palha')
    })
  })

  describe('Product-specific content', () => {
    it('should include product-specific solution strategy', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const solutionSection = proposal.sections.find(s => s.title === 'Solução Proposta')

      // desbloqueio-conta has specific strategy
      expect(solutionSection?.content).toContain('tutela de urgência')
    })

    it('should include product-specific timeline', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const timelineSection = proposal.sections.find(s => s.title === 'Prazos Estimados')

      // desbloqueio-conta has specific timeline
      expect(timelineSection?.content).toContain('Liminar')
    })

    it('should handle different products', () => {
      const pixFraudResult = {
        ...mockResult,
        productId: 'golpe-pix',
      }
      const proposal = generateProposal(pixFraudResult, 'Maria')

      expect(proposal.productName).toBe('Recuperação de Valores - Golpe PIX')

      const solutionSection = proposal.sections.find(s => s.title === 'Solução Proposta')
      expect(solutionSection?.content).toContain('MED')
    })
  })

  describe('Investment section formatting', () => {
    it('should format currency in BRL', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const investmentSection = proposal.sections.find(s => s.title === 'Investimento')

      expect(investmentSection?.content).toContain('R$')
    })

    it('should show discount when applicable', () => {
      const discountResult = {
        ...mockResult,
        recommendedAction: {
          ...mockAction,
          estimatedFee: 120000, // Lower than base price (150000 for desbloqueio-conta)
        },
      }
      const proposal = generateProposal(discountResult, 'João')
      const investmentSection = proposal.sections.find(s => s.title === 'Investimento')

      expect(investmentSection?.content).toContain('Desconto')
    })

    it('should show installment options for warm leads', () => {
      const proposal = generateProposal(mockResult, 'João Silva') // warm lead
      const investmentSection = proposal.sections.find(s => s.title === 'Investimento')

      expect(investmentSection?.content).toContain('Parcelamento')
      expect(investmentSection?.content).toContain('3x')
    })

    it('should show ROI for cases with estimated value', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const investmentSection = proposal.sections.find(s => s.title === 'Investimento')

      expect(investmentSection?.content).toContain('Retorno sobre investimento')
    })

    it('should show payment methods', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const investmentSection = proposal.sections.find(s => s.title === 'Investimento')

      expect(investmentSection?.content).toContain('PIX')
      expect(investmentSection?.content).toContain('Cartão de crédito')
      expect(investmentSection?.content).toContain('Boleto')
    })
  })

  describe('Next steps section', () => {
    it('should show immediate action for hot leads', () => {
      const hotResult = {
        ...mockResult,
        score: { ...mockScore, category: 'hot' as const },
      }
      const proposal = generateProposal(hotResult, 'João')
      const nextStepsSection = proposal.sections.find(s => s.title === 'Próximos Passos')

      expect(nextStepsSection?.content).toContain('imediato')
      expect(nextStepsSection?.content).toContain('24 horas')
    })

    it('should show relaxed timeline for other leads', () => {
      const proposal = generateProposal(mockResult, 'João Silva') // warm lead
      const nextStepsSection = proposal.sections.find(s => s.title === 'Próximos Passos')

      expect(nextStepsSection?.content).toContain('Analise esta proposta')
    })
  })

  describe('Scope of work section', () => {
    it('should list included services', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const scopeSection = proposal.sections.find(s => s.title === 'Escopo do Trabalho')

      expect(scopeSection?.content).toContain('✓')
      expect(scopeSection?.content).toContain('Análise completa')
      expect(scopeSection?.content).toContain('Acompanhamento processual')
    })

    it('should list excluded items', () => {
      const proposal = generateProposal(mockResult, 'João Silva')
      const scopeSection = proposal.sections.find(s => s.title === 'Escopo do Trabalho')

      expect(scopeSection?.content).toContain('✗')
      expect(scopeSection?.content).toContain('Custas judiciais')
    })
  })
})
