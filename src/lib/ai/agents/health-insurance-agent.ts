/**
 * Health Insurance Agent
 * Specializes in health plan denials, bariatric surgery, TEA treatment
 *
 * @deprecated This class is now a wrapper around the config-driven factory.
 * Use `createLegalAgent('health-insurance')` from '@/lib/ai/factories' instead.
 */

import { createLegalAgent } from '../factories/legal-agent-factory'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class HealthInsuranceAgent {
  private instance: Awaited<ReturnType<typeof createLegalAgent>>
  private initPromise: Promise<Awaited<ReturnType<typeof createLegalAgent>>>

  constructor(config?: Partial<AgentConfig>) {
    this.instance = null as any
    this.initPromise = createLegalAgent('health-insurance', config)
  }

  private async getInstance() {
    if (!this.instance) {
      this.instance = await this.initPromise
    }
    return this.instance
  }

  get name(): string {
    return 'Health Insurance Agent'
  }

  async isRelevant(input: string): Promise<boolean> {
    const instance = await this.getInstance()
    return instance.isRelevant(input)
  }

  async analyzeDenial(denialDetails: string, context?: AgentContext): Promise<AgentResponse> {
    return (await this.getInstance() as any).analyzeDenial(denialDetails, context)
  }

  async evaluateBariatric(patientInfo: string, context?: AgentContext): Promise<AgentResponse> {
    return (await this.getInstance() as any).evaluateBariatric(patientInfo, context)
  }

  async analyzeTEA(treatmentDetails: string, context?: AgentContext): Promise<AgentResponse> {
    return (await this.getInstance() as any).analyzeTEA(treatmentDetails, context)
  }

  async createAppeal(caseInfo: string, context?: AgentContext): Promise<AgentResponse> {
    return (await this.getInstance() as any).createAppeal(caseInfo, context)
  }
}
