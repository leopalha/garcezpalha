/**
 * Real Estate Agent
 * Specializes in property law, usucapião, and eviction
 *
 * @deprecated This class is now a wrapper around the config-driven factory.
 * Use `createLegalAgent('real-estate')` from '@/lib/ai/factories' instead.
 */

import { createLegalAgent } from '../factories/legal-agent-factory'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class RealEstateAgent {
  private instance: Awaited<ReturnType<typeof createLegalAgent>>
  private initPromise: Promise<Awaited<ReturnType<typeof createLegalAgent>>>

  constructor(config?: Partial<AgentConfig>) {
    this.instance = null as any
    this.initPromise = createLegalAgent('real-estate', config)
  }

  private async getInstance() {
    if (!this.instance) {
      this.instance = await this.initPromise
    }
    return this.instance
  }

  get name(): string {
    return 'Real Estate Agent'
  }

  async isRelevant(input: string): Promise<boolean> {
    const instance = await this.getInstance()
    return instance.isRelevant(input)
  }

  async evaluateUsucapiao(propertyDetails: string, context?: AgentContext): Promise<AgentResponse> {
    return (await this.getInstance() as any).evaluateUsucapiao(propertyDetails, context)
  }

  async analyzeEviction(evictionDetails: string, context?: AgentContext): Promise<AgentResponse> {
    return (await this.getInstance() as any).analyzeEviction(evictionDetails, context)
  }
}
