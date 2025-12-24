/**
 * Criminal Law Agent
 * Specializes in criminal defense and procedural law
 */

import { BaseAgent } from './base-agent'
import { CRIMINAL_LAW_SYSTEM_PROMPT, CRIMINAL_LAW_TASKS } from '../prompts/criminal-law-prompts'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class CriminalLawAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    super(CRIMINAL_LAW_SYSTEM_PROMPT, config)
  }

  get name(): string {
    return 'Criminal Law Agent'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      // Criminal terms
      'criminal', 'penal', 'crime', 'delito',
      // Procedures
      'prisão', 'prisao', 'preso', 'presa', 'flagrante', 'preventiva',
      // Legal actions
      'habeas corpus', 'habeas', 'denúncia', 'denuncia', 'inquérito', 'inquerito',
      // Court
      'delegacia', 'audiência criminal', 'audiencia criminal', 'júri', 'juri',
      // Crimes
      'furto', 'roubo', 'homicídio', 'homicidio', 'latrocínio', 'latrocinio',
      'estelionato', 'receptação', 'recepta', 'ameaça', 'ameaca',
      'lesão corporal', 'lesao corporal', 'agressão', 'agressao',
      // Charges
      'calúnia', 'calunia', 'difamação', 'difamacao', 'injúria', 'injuria',
      // Traffic
      'embriaguez ao volante', 'dirigir bêbado', 'dirigir bebado',
      // Drugs
      'tráfico', 'trafico', 'droga', 'entorpecente',
      // Violence
      'violência doméstica', 'violencia domestica', 'maria da penha',
      // Process
      'defesa criminal', 'advogado criminal', 'intimação', 'intimacao',
      'sentença criminal', 'sentenca criminal', 'condenação', 'condenacao',
      // Freedom
      'liberdade provisória', 'liberdade provisoria', 'fiança', 'fianca',
      'medidas cautelares', 'progressão de regime', 'progressao de regime',
    ]

    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  /**
   * Analyze a criminal case
   */
  async analyzeCase(
    caseDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      CRIMINAL_LAW_TASKS.analyzeCase,
      `Detalhes do caso:\n\n${caseDetails}`,
      context
    )
  }

  /**
   * Evaluate Habeas Corpus feasibility
   */
  async evaluateHabeasCorpus(
    situationDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      CRIMINAL_LAW_TASKS.habeascorpus,
      `Situação:\n\n${situationDetails}`,
      context
    )
  }

  /**
   * Create defense strategy
   */
  async createDefenseStrategy(
    caseInfo: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      CRIMINAL_LAW_TASKS.defensestrategy,
      `Informações do caso:\n\n${caseInfo}`,
      context
    )
  }

  /**
   * Calculate sentence
   */
  async calculateSentence(
    crimeDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    return this.processTask(
      CRIMINAL_LAW_TASKS.sentenceCalculation,
      `Detalhes do crime:\n\n${crimeDetails}`,
      context
    )
  }
}
