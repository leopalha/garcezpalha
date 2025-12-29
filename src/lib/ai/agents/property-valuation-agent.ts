/**
 * Property Valuation Agent
 * Specializes in property appraisal and valuation
 *
 * @deprecated This class is now a wrapper around the config-driven factory.
 * Use `createLegalAgent('property-valuation')` from '@/lib/ai/factories' instead.
 */

import { createLegalAgent } from '../factories/legal-agent-factory'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class PropertyValuationAgent {
  private instance: Awaited<ReturnType<typeof createLegalAgent>>
  private initPromise: Promise<Awaited<ReturnType<typeof createLegalAgent>>>

  constructor(config?: Partial<AgentConfig>) {
    this.instance = null as any
    this.initPromise = createLegalAgent('property-valuation', config)
  }

  private async getInstance() {
    if (!this.instance) {
      this.instance = await this.initPromise
    }
    return this.instance
  }

  get name(): string {
    return 'Property Valuation Agent'
  }

  async isRelevant(input: string): Promise<boolean> {
    const instance = await this.getInstance()
    return instance.isRelevant(input)
  }

  async evaluateProperty(propertyDetails: string, context?: AgentContext): Promise<AgentResponse> {
    return (await this.getInstance() as any).evaluateProperty(propertyDetails, context)
  }
}
