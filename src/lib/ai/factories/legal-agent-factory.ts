/**
 * Legal Agent Factory
 * Dynamically creates legal domain agents from configuration
 * Replaces 8 individual agent class files with config-driven approach
 */

import { BaseAgent } from '../agents/base-agent'
import { LEGAL_AGENTS_CONFIG } from '../config/legal-agents-config'
import type { LegalAgentConfig, AgentTaskConfig } from '../config/agent-config'
import type { AgentConfig, AgentContext, AgentResponse } from '../agents/types'

/**
 * Generic Legal Agent Class
 * Created dynamically from configuration
 */
class GenericLegalAgent extends BaseAgent {
  private agentConfig: LegalAgentConfig
  private prompts: any
  private promptTasks: any

  constructor(
    agentConfig: LegalAgentConfig,
    prompts: any,
    baseConfig?: Partial<AgentConfig>
  ) {
    // Get system prompt from prompts module
    const systemPrompt = prompts[agentConfig.systemPromptKey]
    super(systemPrompt, baseConfig)

    this.agentConfig = agentConfig
    this.prompts = prompts
    this.promptTasks = prompts[`${agentConfig.systemPromptKey.replace('_SYSTEM_PROMPT', '')}_TASKS`]

    // Dynamically create task methods
    this.createTaskMethods()
  }

  get name(): string {
    return this.agentConfig.name
  }

  isRelevant(input: string): boolean {
    const lowerInput = input.toLowerCase()
    return this.agentConfig.keywords.some(keyword => lowerInput.includes(keyword))
  }

  /**
   * Dynamically create methods for each configured task
   */
  private createTaskMethods(): void {
    this.agentConfig.tasks.forEach((task: AgentTaskConfig) => {
      // Create method dynamically
      ;(this as any)[task.methodName] = async (
        input: string,
        context?: AgentContext
      ): Promise<AgentResponse> => {
        const taskPrompt = this.promptTasks[task.promptKey]
        const paramLabel = this.getParamLabel(task.paramName || 'input')
        return this.processTask(
          taskPrompt,
          `${paramLabel}:\n\n${input}`,
          context
        )
      }
    })
  }

  /**
   * Get friendly parameter label
   */
  private getParamLabel(paramName: string): string {
    const labels: Record<string, string> = {
      caseDetails: 'Detalhes do caso',
      situationDetails: 'Situação',
      caseInfo: 'Informações do caso',
      crimeDetails: 'Detalhes do crime',
      denialDetails: 'Detalhes da negativa',
      patientInfo: 'Informações do paciente',
      treatmentDetails: 'Detalhes do tratamento',
      blockingDetails: 'Detalhes do bloqueio',
      fraudDetails: 'Detalhes da fraude',
      propertyDetails: 'Detalhes do imóvel',
      evictionDetails: 'Detalhes do despejo',
      contributionDetails: 'Detalhes da contribuição',
      disabilityDetails: 'Detalhes da incapacidade',
      documentDetails: 'Detalhes do documento',
    }
    return labels[paramName] || 'Informações'
  }
}

/**
 * Cache for created agents (singleton pattern per agent type)
 */
const agentCache = new Map<string, GenericLegalAgent>()

/**
 * Cache for loaded prompt modules
 */
const promptModuleCache = new Map<string, any>()

/**
 * Create or retrieve a legal domain agent
 *
 * @param agentId - Agent identifier from LEGAL_AGENTS_CONFIG
 * @param config - Optional base agent configuration
 * @returns Configured agent instance
 *
 * @example
 * ```typescript
 * const criminalAgent = await createLegalAgent('criminal-law')
 * const response = await criminalAgent.analyzeCase('Details...')
 *
 * const healthAgent = await createLegalAgent('health-insurance')
 * const denial = await healthAgent.analyzeDenial('Denial letter...')
 * ```
 */
export async function createLegalAgent(
  agentId: string,
  config?: Partial<AgentConfig>
): Promise<GenericLegalAgent> {
  // Return cached instance if exists (singleton per type)
  const cacheKey = `${agentId}-${JSON.stringify(config || {})}`
  if (agentCache.has(cacheKey)) {
    return agentCache.get(cacheKey)!
  }

  // Get agent configuration
  const agentConfig = LEGAL_AGENTS_CONFIG[agentId]
  if (!agentConfig) {
    throw new Error(
      `Unknown legal agent: ${agentId}. Available: ${Object.keys(LEGAL_AGENTS_CONFIG).join(', ')}`
    )
  }

  // Load prompts module (with caching)
  let prompts = promptModuleCache.get(agentConfig.promptsModule)
  if (!prompts) {
    try {
      prompts = await import(agentConfig.promptsModule)
      promptModuleCache.set(agentConfig.promptsModule, prompts)
    } catch (error) {
      throw new Error(
        `Failed to load prompts module for ${agentId}: ${agentConfig.promptsModule}\nError: ${error}`
      )
    }
  }

  // Create agent instance
  const agent = new GenericLegalAgent(agentConfig, prompts, config)

  // Cache and return
  agentCache.set(cacheKey, agent)
  return agent
}

/**
 * Get all available legal agent IDs
 */
export function getAvailableLegalAgents(): string[] {
  return Object.keys(LEGAL_AGENTS_CONFIG)
}

/**
 * Get configuration for a specific agent
 */
export function getLegalAgentConfig(agentId: string): LegalAgentConfig | undefined {
  return LEGAL_AGENTS_CONFIG[agentId]
}

/**
 * Find relevant legal agent based on input text
 *
 * @param input - User input text
 * @returns Most relevant agent ID or undefined
 *
 * @example
 * ```typescript
 * const agentId = findRelevantLegalAgent('Fui preso em flagrante')
 * // Returns: 'criminal-law'
 *
 * const agent = await createLegalAgent(agentId)
 * ```
 */
export function findRelevantLegalAgent(input: string): string | undefined {
  const lowerInput = input.toLowerCase()

  for (const [agentId, config] of Object.entries(LEGAL_AGENTS_CONFIG)) {
    const hasMatch = config.keywords.some(keyword =>
      lowerInput.includes(keyword.toLowerCase())
    )
    if (hasMatch) {
      return agentId
    }
  }

  return undefined
}

/**
 * Clear agent cache (useful for testing or hot reloading)
 */
export function clearLegalAgentCache(): void {
  agentCache.clear()
  promptModuleCache.clear()
}
