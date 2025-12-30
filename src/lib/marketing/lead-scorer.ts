/**
 * Lead Scoring Algorithm
 *
 * Calculates lead score (0-100) based on multiple factors:
 * - Demographic data
 * - Behavioral data (user tracking)
 * - Engagement level
 * - Intent signals
 */

import { UserSession } from './user-tracker'

export interface LeadData {
  // Contact info
  fullName?: string
  email?: string
  phone?: string
  company?: string

  // Service interest
  serviceInterest?: string
  message?: string

  // Source
  source: 'website' | 'whatsapp' | 'gmail' | 'referral' | 'ads'

  // Behavioral data
  userSession?: UserSession

  // Additional context
  metadata?: Record<string, any>
}

export interface LeadScore {
  total: number // 0-100
  breakdown: {
    demographic: number // 0-25
    behavioral: number // 0-30
    intent: number // 0-25
    engagement: number // 0-20
  }
  classification: 'hot' | 'warm' | 'cold'
  priority: 'high' | 'medium' | 'low'
  reasons: string[]
  recommendations: string[]
}

export class LeadScorer {
  /**
   * Calculate lead score
   */
  public static calculateScore(lead: LeadData): LeadScore {
    const demographic = this.calculateDemographicScore(lead)
    const behavioral = this.calculateBehavioralScore(lead)
    const intent = this.calculateIntentScore(lead)
    const engagement = this.calculateEngagementScore(lead)

    const total = demographic + behavioral + intent + engagement

    const classification = this.classifyLead(total)
    const priority = this.determinePriority(total, lead)
    const reasons = this.generateReasons(lead, { demographic, behavioral, intent, engagement })
    const recommendations = this.generateRecommendations(lead, classification)

    return {
      total: Math.round(total),
      breakdown: {
        demographic: Math.round(demographic),
        behavioral: Math.round(behavioral),
        intent: Math.round(intent),
        engagement: Math.round(engagement),
      },
      classification,
      priority,
      reasons,
      recommendations,
    }
  }

  /**
   * Demographic Score (0-25 points)
   * Based on contact information quality
   */
  private static calculateDemographicScore(lead: LeadData): number {
    let score = 0

    // Has full name (5 points)
    if (lead.fullName && lead.fullName.split(' ').length >= 2) {
      score += 5
    }

    // Has valid email (5 points)
    if (lead.email && this.isValidEmail(lead.email)) {
      score += 5
      // Bonus for business email (3 points)
      if (this.isBusinessEmail(lead.email)) {
        score += 3
      }
    }

    // Has phone (5 points)
    if (lead.phone) {
      score += 5
    }

    // Has company (5 points)
    if (lead.company) {
      score += 5
    }

    // Has message (2 points)
    if (lead.message && lead.message.length > 20) {
      score += 2
    }

    return Math.min(score, 25)
  }

  /**
   * Behavioral Score (0-30 points)
   * Based on user tracking data
   */
  private static calculateBehavioralScore(lead: LeadData): number {
    if (!lead.userSession) return 0

    const session = lead.userSession
    let score = 0

    // Page views (max 10 points)
    const pageViews = session.events.filter(e => e.type === 'page_view').length
    score += Math.min(pageViews * 2, 10)

    // Time on site (max 10 points)
    const duration = (session.lastActivity - session.startTime) / 1000 / 60 // minutes
    score += Math.min(duration / 5, 10) // 5 minutes = 10 points

    // Scroll depth (max 5 points)
    const scrollEvents = session.events.filter(e => e.type === 'scroll')
    const maxScroll = Math.max(...scrollEvents.map(e => e.data?.depth || 0), 0)
    score += (maxScroll / 100) * 5

    // Clicks on CTAs (max 5 points)
    const ctaClicks = session.events.filter(e => e.type === 'click').length
    score += Math.min(ctaClicks, 5)

    return Math.min(score, 30)
  }

  /**
   * Intent Score (0-25 points)
   * Based on signals of purchase intent
   */
  private static calculateIntentScore(lead: LeadData): number {
    let score = 0

    // Has specific service interest (10 points)
    if (lead.serviceInterest) {
      score += 10

      // High-value services (5 extra points)
      const highValueServices = [
        'direito-imobiliario',
        'pericia-medica',
        'pericia-documental',
      ]
      if (highValueServices.some(s => lead.serviceInterest?.toLowerCase().includes(s))) {
        score += 5
      }
    }

    // Message indicates urgency (5 points)
    if (lead.message) {
      const urgencyKeywords = ['urgente', 'rápido', 'logo', 'breve', 'hoje', 'amanhã']
      if (urgencyKeywords.some(k => lead.message?.toLowerCase().includes(k))) {
        score += 5
      }
    }

    // Visited pricing page (5 points)
    if (lead.userSession) {
      const visitedPricing = lead.userSession.events.some(
        e => e.type === 'page_view' && (e.page.includes('preco') || e.page.includes('servico'))
      )
      if (visitedPricing) {
        score += 5
      }
    }

    return Math.min(score, 25)
  }

  /**
   * Engagement Score (0-20 points)
   * Based on interaction level
   */
  private static calculateEngagementScore(lead: LeadData): number {
    if (!lead.userSession) return 0

    let score = 0

    // Form interactions (max 10 points)
    const formFocus = lead.userSession.events.filter(e => e.type === 'form_focus').length
    score += Math.min(formFocus * 2, 10)

    // Return visits (10 points)
    if (lead.userSession.events.filter(e => e.type === 'page_view').length > 3) {
      score += 10
    }

    return Math.min(score, 20)
  }

  /**
   * Classify lead based on total score
   */
  private static classifyLead(score: number): 'hot' | 'warm' | 'cold' {
    if (score >= 70) return 'hot'
    if (score >= 40) return 'warm'
    return 'cold'
  }

  /**
   * Determine priority
   */
  private static determinePriority(score: number, lead: LeadData): 'high' | 'medium' | 'low' {
    // High priority: hot leads or high-value services
    if (score >= 70) return 'high'

    const highValueServices = ['direito-imobiliario', 'pericia-medica']
    if (highValueServices.some(s => lead.serviceInterest?.toLowerCase().includes(s))) {
      return 'high'
    }

    if (score >= 40) return 'medium'
    return 'low'
  }

  /**
   * Generate reasons for score
   */
  private static generateReasons(lead: LeadData, breakdown: Record<string, number>): string[] {
    const reasons: string[] = []

    // Demographic
    if (breakdown.demographic >= 20) {
      reasons.push('Informações de contato completas')
    }
    if (lead.company) {
      reasons.push('Lead corporativo')
    }

    // Behavioral
    if (breakdown.behavioral >= 20) {
      reasons.push('Alto engajamento no site')
    }
    if (lead.userSession && lead.userSession.events.length > 10) {
      reasons.push('Múltiplas interações')
    }

    // Intent
    if (breakdown.intent >= 15) {
      reasons.push('Forte intenção de compra')
    }
    if (lead.message?.toLowerCase().includes('urgente')) {
      reasons.push('Necessidade urgente')
    }

    // Engagement
    if (breakdown.engagement >= 15) {
      reasons.push('Alta taxa de engajamento')
    }

    return reasons
  }

  /**
   * Generate recommendations for sales team
   */
  private static generateRecommendations(lead: LeadData, classification: string): string[] {
    const recommendations: string[] = []

    if (classification === 'hot') {
      recommendations.push('Contato imediato (dentro de 1 hora)')
      recommendations.push('Oferecer agendamento prioritário')
      recommendations.push('Enviar proposta personalizada')
    } else if (classification === 'warm') {
      recommendations.push('Contato em até 24 horas')
      recommendations.push('Enviar material complementar')
      recommendations.push('Agendar call de qualificação')
    } else {
      recommendations.push('Incluir em sequência de nurturing')
      recommendations.push('Enviar conteúdo educativo')
      recommendations.push('Follow-up em 3-5 dias')
    }

    // Service-specific recommendations
    if (lead.serviceInterest?.includes('imobiliario')) {
      recommendations.push('Destacar casos de sucesso em imobiliário')
    }
    if (lead.serviceInterest?.includes('pericia')) {
      recommendations.push('Enviar credenciais técnicas do perito')
    }

    return recommendations
  }

  /**
   * Helper: Validate email
   */
  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  /**
   * Helper: Check if business email
   */
  private static isBusinessEmail(email: string): boolean {
    const personalDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com']
    const domain = email.split('@')[1]?.toLowerCase()
    return domain ? !personalDomains.includes(domain) : false
  }
}
