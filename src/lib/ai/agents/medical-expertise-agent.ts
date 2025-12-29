/**
 * Medical Expertise Agent
 * Specializes in medical error and malpractice
 *
 * @deprecated This class is now a wrapper around the config-driven factory.
 * Use `createLegalAgent('medical-expertise')` from '@/lib/ai/factories' instead.
 */

import { createLegalAgent } from '../factories/legal-agent-factory'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class MedicalExpertiseAgent {
  private instance: Awaited<ReturnType<typeof createLegalAgent>>
  private initPromise: Promise<Awaited<ReturnType<typeof createLegalAgent>>>

  constructor(config?: Partial<AgentConfig>) {
    this.instance = null as any
    this.initPromise = createLegalAgent('medical-expertise', config)
  }

  private async getInstance() {
    if (!this.instance) {
      this.instance = await this.initPromise
    }
    return this.instance
  }

  get name(): string {
    return 'Medical Expertise Agent'
  }

  async isRelevant(input: string): Promise<boolean> {
    const instance = await this.getInstance()
    return instance.isRelevant(input)
  }

  async evaluateMalpractice(caseDetails: string, context?: AgentContext): Promise<AgentResponse> {
    return (await this.getInstance() as any).evaluateMalpractice(caseDetails, context)
  }
}
