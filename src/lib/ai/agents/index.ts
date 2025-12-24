/**
 * AI Agents System - Main Exports
 *
 * This module provides a complete AI agent system for legal consultation
 * with specialized agents for different areas of law and expertise.
 *
 * ## Available Agents:
 *
 * 1. **Real Estate Agent** - Property law, contracts, transactions
 * 2. **Document Forensics Agent** - Signature analysis, document authentication
 * 3. **Property Valuation Agent** - Real estate appraisal per NBR 14653
 * 4. **Medical Expertise Agent** - Medical-legal analysis, disability assessment
 *
 * ## Usage:
 *
 * ### Simple Query (Auto-routing)
 * ```typescript
 * import { processQuery } from '@/lib/ai/agents'
 *
 * const response = await processQuery("Quanto vale meu apartamento de 80m²?")
 * console.log(response.content) // AI response
 * console.log(response.agentUsed) // 'valuation'
 * ```
 *
 * ### Using Orchestrator
 * ```typescript
 * import { getOrchestrator } from '@/lib/ai/agents'
 *
 * const orchestrator = getOrchestrator()
 * const response = await orchestrator.process("Como fazer usucapião?")
 * ```
 *
 * ### Direct Agent Access
 * ```typescript
 * import { RealEstateAgent } from '@/lib/ai/agents'
 *
 * const agent = new RealEstateAgent()
 * const response = await agent.analyzeContract(contractText)
 * ```
 *
 * ### With Conversation History
 * ```typescript
 * const history = [
 *   { role: 'user', content: 'Quero comprar um imóvel' },
 *   { role: 'assistant', content: 'Posso ajudá-lo...' }
 * ]
 *
 * const response = await processQuery("Quais documentos preciso?", history)
 * ```
 */

// Base types and classes
export { BaseAgent } from './base-agent'
export type {
  AgentRole,
  Message,
  AgentResponse,
  AgentConfig,
  AgentContext,
} from './types'
export {
  DEFAULT_MODEL,
  DEFAULT_TEMPERATURE,
  DEFAULT_MAX_TOKENS,
} from './types'

// Specialized agents
export { RealEstateAgent } from './real-estate-agent'
export { DocumentForensicsAgent } from './document-forensics-agent'
export { PropertyValuationAgent } from './property-valuation-agent'
export { MedicalExpertiseAgent } from './medical-expertise-agent'
export { CriminalLawAgent } from './criminal-law-agent'
export { FinancialProtectionAgent } from './financial-protection-agent'
export { HealthInsuranceAgent } from './health-insurance-agent'
export { SocialSecurityAgent } from './social-security-agent'

// Orchestrator
export {
  AgentOrchestrator,
  getOrchestrator,
  processQuery,
  type OrchestratorResponse,
} from './agent-orchestrator'

/**
 * Quick start helper - creates orchestrator and processes a query
 *
 * @example
 * ```typescript
 * import { quickQuery } from '@/lib/ai/agents'
 *
 * const answer = await quickQuery("Como funciona o ITBI?")
 * console.log(answer)
 * ```
 */
export async function quickQuery(
  query: string,
  conversationHistory?: import('./types').Message[]
): Promise<string> {
  // Import processQuery dynamically to avoid circular dependency
  const { processQuery: pq } = await import('./agent-orchestrator')
  const response = await pq(query, conversationHistory)
  return response.content
}
