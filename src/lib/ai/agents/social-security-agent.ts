/**
 * Social Security Agent
 * Specializes in INSS benefits, retirement, and disability
 *
 * @deprecated This class is now a wrapper around the config-driven factory.
 * Use `createLegalAgent('social-security')` from '@/lib/ai/factories' instead.
 */

import { createLegalAgent } from '../factories/legal-agent-factory'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class SocialSecurityAgent {
  private instance: Awaited<ReturnType<typeof createLegalAgent>>
  private initPromise: Promise<Awaited<ReturnType<typeof createLegalAgent>>>

  constructor(config?: Partial<AgentConfig>) {
    this.instance = null as any
    this.initPromise = createLegalAgent('social-security', config)
  }

  private async getInstance() {
    if (!this.instance) {
      this.instance = await this.initPromise
    }
    return this.instance
  }

  get name(): string {
    return 'Social Security Agent'
  }

  async isRelevant(input: string): Promise<boolean> {
    const instance = await this.getInstance()
    return instance.isRelevant(input)
  }

  async analyzeRetirement(contributionDetails: string, context?: AgentContext): Promise<AgentResponse> {
    return (await this.getInstance() as any).analyzeRetirement(contributionDetails, context)
  }

  async evaluateDisability(disabilityDetails: string, context?: AgentContext): Promise<AgentResponse> {
    return (await this.getInstance() as any).evaluateDisability(disabilityDetails, context)
  }
}
