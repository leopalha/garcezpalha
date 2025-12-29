/**
 * Document Forensics Agent
 * Specializes in document analysis and signature fraud
 *
 * @deprecated This class is now a wrapper around the config-driven factory.
 * Use `createLegalAgent('document-forensics')` from '@/lib/ai/factories' instead.
 */

import { createLegalAgent } from '../factories/legal-agent-factory'
import type { AgentConfig, AgentContext, AgentResponse } from './types'

export class DocumentForensicsAgent {
  private instance: Awaited<ReturnType<typeof createLegalAgent>>
  private initPromise: Promise<Awaited<ReturnType<typeof createLegalAgent>>>

  constructor(config?: Partial<AgentConfig>) {
    this.instance = null as any
    this.initPromise = createLegalAgent('document-forensics', config)
  }

  private async getInstance() {
    if (!this.instance) {
      this.instance = await this.initPromise
    }
    return this.instance
  }

  get name(): string {
    return 'Document Forensics Agent'
  }

  async isRelevant(input: string): Promise<boolean> {
    const instance = await this.getInstance()
    return instance.isRelevant(input)
  }

  async analyzeDocument(documentDetails: string, context?: AgentContext): Promise<AgentResponse> {
    return (await this.getInstance() as any).analyzeDocument(documentDetails, context)
  }
}
