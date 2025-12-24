/**
 * Agent Orchestrator (Simplified)
 * Routes messages to appropriate specialized agents
 */

import type { AgentRole } from './agents/types'

export interface AgentSuggestion {
  role: AgentRole
  confidence: number
  reasoning: string
}

export class AgentOrchestrator {
  /**
   * Suggest which agent should handle a message
   */
  suggestAgent(message: string): AgentSuggestion {
    const lowerMessage = message.toLowerCase()

    // Financial Protection keywords
    if (
      lowerMessage.includes('bloqueio') ||
      lowerMessage.includes('conta bloqueada') ||
      lowerMessage.includes('pix') ||
      lowerMessage.includes('golpe') ||
      lowerMessage.includes('negativ') ||
      lowerMessage.includes('serasa') ||
      lowerMessage.includes('spc')
    ) {
      return {
        role: 'financial-protection',
        confidence: 0.9,
        reasoning: 'Detected financial protection keywords',
      }
    }

    // Health Insurance keywords
    if (
      lowerMessage.includes('plano de saúde') ||
      lowerMessage.includes('convênio') ||
      lowerMessage.includes('cirurgia') ||
      lowerMessage.includes('tratamento') ||
      lowerMessage.includes('tea') ||
      lowerMessage.includes('autismo')
    ) {
      return {
        role: 'health-insurance',
        confidence: 0.9,
        reasoning: 'Detected health insurance keywords',
      }
    }

    // Social Security keywords
    if (
      lowerMessage.includes('inss') ||
      lowerMessage.includes('aposentadoria') ||
      lowerMessage.includes('bpc') ||
      lowerMessage.includes('loas') ||
      lowerMessage.includes('benefício')
    ) {
      return {
        role: 'social-security',
        confidence: 0.9,
        reasoning: 'Detected social security keywords',
      }
    }

    // Real Estate keywords
    if (
      lowerMessage.includes('imóvel') ||
      lowerMessage.includes('imovel') ||
      lowerMessage.includes('casa') ||
      lowerMessage.includes('terreno') ||
      lowerMessage.includes('usucapião') ||
      lowerMessage.includes('usucapiao') ||
      lowerMessage.includes('inventário') ||
      lowerMessage.includes('inventario') ||
      lowerMessage.includes('holding')
    ) {
      return {
        role: 'real-estate',
        confidence: 0.85,
        reasoning: 'Detected real estate keywords',
      }
    }

    // Criminal keywords
    if (
      lowerMessage.includes('criminal') ||
      lowerMessage.includes('processo criminal') ||
      lowerMessage.includes('advogado criminal') ||
      lowerMessage.includes('defesa criminal')
    ) {
      return {
        role: 'criminal',
        confidence: 0.9,
        reasoning: 'Detected criminal law keywords',
      }
    }

    // Default to general
    return {
      role: 'general',
      confidence: 0.5,
      reasoning: 'No specific keywords detected, using general agent',
    }
  }
}
