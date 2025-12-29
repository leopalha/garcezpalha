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

/**
 * @deprecated Use createLegalAgent('criminal-law') instead
 */
export class CriminalLawAgent {
  private instance: Awaited<ReturnType<typeof createLegalAgent>>

  constructor(config?: Partial<AgentConfig>) {
    // Initialize as promise that will be resolved on first use
    this.instance = null as any
    this.initPromise = createLegalAgent('criminal-law', config)
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
}
