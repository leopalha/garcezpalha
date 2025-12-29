/**
 * Classifying State Behavior
 * Classifies the case into appropriate legal area and assigns specialist agent
 */

import { StateBehavior, ConversationData } from '../types'
import { AgentOrchestrator } from '../../agent-orchestrator'

export class ClassifyingBehavior implements StateBehavior {
  state = 'classifying' as const
  private orchestrator: AgentOrchestrator

  constructor() {
    this.orchestrator = new AgentOrchestrator()
  }

  async handleMessage(
    message: string,
    data: ConversationData
  ): Promise<{
    response: string
    nextState?: 'qualifying' | 'escalated' | 'abandoned'
    data: ConversationData
  }> {
    // Use agent orchestrator to classify
    const suggestion = await this.orchestrator.suggestAgent(message)

    // Update classification
    data.classification = {
      area: this.mapRoleToArea(suggestion.role),
      agent_assigned: suggestion.role,
      confidence: suggestion.confidence,
    }

    // If confidence is too low, escalate
    if (suggestion.confidence < 0.3) {
      data.qualification.flags.push('low_confidence_classification')
    }

    const response = `Perfeito! Identifiquei que sua questão está relacionada a **${this.getAreaName(data.classification.area)}**.

Vou te conectar com nosso especialista e fazer algumas perguntas para qualificar seu caso adequadamente.`

    return {
      response,
      nextState: 'qualifying',
      data,
    }
  }

  private mapRoleToArea(role: string): string {
    const mapping: Record<string, string> = {
      'real-estate': 'Direito Imobiliário',
      'forensics': 'Perícia Documental',
      'valuation': 'Avaliação de Imóveis',
      'medical': 'Direito Médico',
      'criminal': 'Direito Criminal',
      'financial-protection': 'Proteção Financeira',
      'health-insurance': 'Planos de Saúde',
      'social-security': 'Direito Previdenciário',
      'general': 'Consulta Geral',
    }
    return mapping[role] || 'Consulta Jurídica'
  }

  private getAreaName(area: string): string {
    return area || 'Direito'
  }
}
