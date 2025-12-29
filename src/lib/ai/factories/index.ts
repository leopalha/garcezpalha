/**
 * Agent Factories
 * Centralized exports for all agent factories
 */

export {
  createLegalAgent,
  getAvailableLegalAgents,
  getLegalAgentConfig,
  findRelevantLegalAgent,
  clearLegalAgentCache,
} from './legal-agent-factory'

export type { LegalAgentConfig, AgentTaskConfig, AgentConfigMap } from '../config/agent-config'
