/**
 * A/B Testing System - Types
 *
 * Sistema para testar diferentes subject lines e otimizar conversão
 */

export interface ABTest {
  id: string
  name: string
  description: string
  sequenceId: string
  stepId: string
  status: 'draft' | 'running' | 'paused' | 'completed'

  // Variantes
  variants: ABTestVariant[]

  // Configuração
  config: {
    trafficSplit: number[] // [50, 50] = 50% cada variante
    startDate: Date
    endDate?: Date
    minSampleSize: number // Mínimo de envios antes de declarar vencedor
    confidenceLevel: number // 0.95 = 95% de confiança
  }

  // Resultados
  results?: {
    winner?: string // ID da variante vencedora
    confidence: number // Nível de confiança estatística
    conclusionDate?: Date
  }

  createdAt: Date
  updatedAt: Date
}

export interface ABTestVariant {
  id: string
  name: string // "A", "B", "C"
  subject: string

  // Métricas
  stats: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    converted: number

    // Taxas
    openRate: number
    clickRate: number
    conversionRate: number
  }
}

export interface ABTestAssignment {
  id: string
  testId: string
  variantId: string
  leadId: string
  emailId?: string
  assignedAt: Date

  // Eventos
  events: {
    delivered?: Date
    opened?: Date
    clicked?: Date
    converted?: Date
  }
}

export interface ABTestResult {
  testId: string
  winner: ABTestVariant
  loser: ABTestVariant
  improvement: {
    openRate: number // % de melhoria
    clickRate: number
    conversionRate: number
  }
  confidence: number // 0-1 (ex: 0.95 = 95%)
  pValue: number // Significância estatística
  recommendation: string
}
