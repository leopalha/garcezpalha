/**
 * Common types for AI agents
 */

export type AgentRole = 'real-estate' | 'forensics' | 'valuation' | 'medical' | 'criminal' | 'financial-protection' | 'health-insurance' | 'social-security' | 'general'

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AgentResponse {
  content: string
  tokensUsed?: number
  model?: string
  finishReason?: string
}

export interface AgentConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface AgentContext {
  conversationId?: string
  userId?: string
  sessionData?: Record<string, unknown>
}

// Default models for different providers
// OpenAI: gpt-4-turbo, gpt-4o, gpt-3.5-turbo
// Groq: llama-3.3-70b-versatile, mixtral-8x7b-32768, llama3-8b-8192
export const DEFAULT_MODEL = 'gpt-4-turbo' // OpenAI direct (no OpenRouter prefix)
export const GROQ_DEFAULT_MODEL = 'llama-3.3-70b-versatile' // Groq alternative
export const DEFAULT_TEMPERATURE = 0.7
export const DEFAULT_MAX_TOKENS = 4000
