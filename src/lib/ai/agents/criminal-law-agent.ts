/**
 * Criminal Law Agent
 * Specializes in criminal defense and procedural law
 *
 * @deprecated This class is now a wrapper around the config-driven factory.
 * Use `createLegalAgent('criminal-law')` from '@/lib/ai/factories' instead.
 *
 * This wrapper maintains backward compatibility but will be removed in future versions.
 */

import { createLegalAgent } from '../factories/legal-agent-factory'
import type { AgentConfig, AgentContext, AgentResponse } from './types'
import {
  CrimeAnalyzer,
  SentencingCalculator,
  DefenseStrategist,
  type CrimeAnalysis,
} from './legal/criminal-law'

/**
 * @deprecated Use createLegalAgent('criminal-law') instead
 */
export class CriminalLawAgent {
  private instance: Awaited<ReturnType<typeof createLegalAgent>>
  private crimeAnalyzer: CrimeAnalyzer
  private sentencingCalculator: SentencingCalculator
  private defenseStrategist: DefenseStrategist

  constructor(config?: Partial<AgentConfig>) {
    // Initialize as promise that will be resolved on first use
    this.instance = null as any
    this.initPromise = createLegalAgent('criminal-law', config)

    // Initialize specialized tools
    this.crimeAnalyzer = new CrimeAnalyzer()
    this.sentencingCalculator = new SentencingCalculator()
    this.defenseStrategist = new DefenseStrategist()
  }

  private initPromise: Promise<Awaited<ReturnType<typeof createLegalAgent>>>

  private async getInstance() {
    if (!this.instance) {
      this.instance = await this.initPromise
    }
    return this.instance
  }

  get name(): string {
    return 'Criminal Law Agent'
  }

  async isRelevant(input: string): Promise<boolean> {
    const instance = await this.getInstance()
    return instance.isRelevant(input)
  }

  /**
   * Analyze a criminal case
   */
  async analyzeCase(
    caseDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    const instance = await this.getInstance()
    return (instance as any).analyzeCase(caseDetails, context)
  }

  /**
   * Evaluate Habeas Corpus feasibility
   */
  async evaluateHabeasCorpus(
    situationDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    const instance = await this.getInstance()
    return (instance as any).evaluateHabeasCorpus(situationDetails, context)
  }

  /**
   * Create defense strategy
   */
  async createDefenseStrategy(
    caseInfo: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    const instance = await this.getInstance()
    return (instance as any).createDefenseStrategy(caseInfo, context)
  }

  /**
   * Calculate sentence
   */
  async calculateSentence(
    crimeDetails: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    const instance = await this.getInstance()
    return (instance as any).calculateSentence(crimeDetails, context)
  }

  /**
   * Analyze crime using specialized CrimeAnalyzer tool
   * Returns detailed crime analysis with legal articles and classifications
   */
  async analyzeCrimeDetails(facts: string): Promise<CrimeAnalysis> {
    return this.crimeAnalyzer.analyzeCrime(facts)
  }

  /**
   * Calculate sentence using specialized SentencingCalculator tool
   * Requires crime analysis and sentencing factors
   */
  async calculateDetailedSentence(
    crimeAnalysis: CrimeAnalysis,
    factors: {
      culpabilidade: 'baixa' | 'media' | 'alta'
      antecedentes: 'bons' | 'ruins'
      condutaSocial: 'boa' | 'ruim'
      personalidade: 'favoravel' | 'desfavoravel'
      motivos: 'favoraveis' | 'desfavoraveis'
      circunstancias: 'favoraveis' | 'desfavoraveis'
      consequencias: 'leves' | 'graves'
      comportamentoVitima: 'favoravel' | 'desfavoravel'
    }
  ) {
    return this.sentencingCalculator.calculateSentence(crimeAnalysis, factors)
  }

  /**
   * Evaluate defense strategy using specialized DefenseStrategist tool
   */
  async evaluateDefenseStrategy(
    crimeAnalysis: CrimeAnalysis,
    evidences: Array<{
      tipo: 'documental' | 'testemunhal' | 'pericial' | 'material'
      descricao: string
      favoravel: boolean
      confiabilidade: 'alta' | 'media' | 'baixa'
    }>
  ) {
    return this.defenseStrategist.evaluateDefense(crimeAnalysis, evidences)
  }
}
