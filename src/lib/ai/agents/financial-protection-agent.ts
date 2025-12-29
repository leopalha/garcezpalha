/**
 * Financial Protection Agent
 * Specializes in banking issues, fraud, and consumer protection
 *
 * @deprecated This class is now a wrapper around the config-driven factory.
 * Use `createLegalAgent('financial-protection')` from '@/lib/ai/factories' instead.
 */

import { createLegalAgent } from '../factories/legal-agent-factory'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class FinancialProtectionAgent {
  private instance: Awaited<ReturnType<typeof createLegalAgent>>
  private initPromise: Promise<Awaited<ReturnType<typeof createLegalAgent>>>

  constructor(config?: Partial<AgentConfig>) {
    this.instance = null as any
    this.initPromise = createLegalAgent('financial-protection', config)
  }

  private async getInstance() {
    if (!this.instance) {
      this.instance = await this.initPromise
    }
    return this.instance
  }

  get name(): string {
    return 'Financial Protection Agent'
  }

  async isRelevant(input: string): Promise<boolean> {
    const instance = await this.getInstance()
    return instance.isRelevant(input)
  }

  async analyzeBlocking(blockingDetails: string, context?: AgentContext): Promise<AgentResponse> {
    return (await this.getInstance() as any).analyzeBlocking(blockingDetails, context)
  }

  async evaluateFraud(fraudDetails: string, context?: AgentContext): Promise<AgentResponse> {
    return (await this.getInstance() as any).evaluateFraud(fraudDetails, context)
  }
}
