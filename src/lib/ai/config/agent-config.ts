/**
 * Agent Configuration Type Definitions
 * Config-driven agent architecture for consolidation
 */

export interface AgentTaskConfig {
  /** Unique identifier for the task */
  id: string
  /** Display name for the task */
  name: string
  /** Prompt template constant reference */
  promptKey: string
  /** Method name that will be created */
  methodName: string
  /** Parameter name for the input */
  paramName?: string
  /** JSDoc description for the method */
  description?: string
}

export interface LegalAgentConfig {
  /** Unique agent identifier */
  id: string
  /** Display name */
  name: string
  /** Short description */
  description: string
  /** System prompt constant reference from prompts file */
  systemPromptKey: string
  /** Keywords for relevance detection */
  keywords: string[]
  /** Tasks this agent can perform */
  tasks: AgentTaskConfig[]
  /** Prompt module path (for dynamic import) */
  promptsModule: string
}

export interface AgentConfigMap {
  [agentId: string]: LegalAgentConfig
}
