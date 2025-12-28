/**
 * Conversation ID Generator
 * Gera IDs únicos para conversas no formato: channel:timestamp-random
 */

import type { Channel } from '@/types/chat'

/**
 * Gera um ID único para conversação
 * Formato: {channel}:{timestamp}-{random}
 * Exemplo: website:1735401234567-a3f9c2
 */
export function generateConversationId(channel: Channel = 'website'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${channel}:${timestamp}-${random}`
}

/**
 * Parse conversation ID para extrair informações
 */
export function parseConversationId(conversationId: string): {
  channel: Channel
  timestamp: number
  random: string
} | null {
  const match = conversationId.match(/^(\w+):(\d+)-(\w+)$/)

  if (!match) {
    return null
  }

  const [, channel, timestamp, random] = match

  return {
    channel: channel as Channel,
    timestamp: parseInt(timestamp, 10),
    random,
  }
}

/**
 * Valida se um conversation ID está no formato correto
 */
export function isValidConversationId(conversationId: string): boolean {
  return /^\w+:\d+-\w+$/.test(conversationId)
}

/**
 * Extrai o canal de um conversation ID
 */
export function getChannelFromId(conversationId: string): Channel | null {
  const parsed = parseConversationId(conversationId)
  return parsed?.channel || null
}

/**
 * Extrai o timestamp de um conversation ID
 */
export function getTimestampFromId(conversationId: string): number | null {
  const parsed = parseConversationId(conversationId)
  return parsed?.timestamp || null
}

/**
 * Calcula a idade de uma conversa em minutos
 */
export function getConversationAgeMinutes(conversationId: string): number | null {
  const timestamp = getTimestampFromId(conversationId)
  if (!timestamp) return null

  const now = Date.now()
  const ageMs = now - timestamp
  return Math.floor(ageMs / 60000) // Converte para minutos
}

/**
 * Verifica se uma conversa expirou (baseado em timeout)
 */
export function isConversationExpired(
  conversationId: string,
  timeoutMinutes: number = 30
): boolean {
  const age = getConversationAgeMinutes(conversationId)
  if (age === null) return true

  return age > timeoutMinutes
}
