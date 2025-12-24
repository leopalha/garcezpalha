import OpenAI from 'openai'

// Lazy initialization - only creates client when actually used
let openaiInstance: OpenAI | null = null
let groqInstance: OpenAI | null = null

/**
 * AI API Configuration
 *
 * Supports multiple providers:
 * 1. OpenAI API (primary) - OPENAI_API_KEY
 * 2. Groq API (alternative) - GROQ_API_KEY
 *
 * Priority: OpenAI > Groq
 */
export function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    // Try OpenAI first
    if (process.env.OPENAI_API_KEY) {
      openaiInstance = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        // Use official OpenAI API directly (not OpenRouter)
      })
      return openaiInstance
    }

    // Fallback to Groq
    if (process.env.GROQ_API_KEY) {
      openaiInstance = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      })
      return openaiInstance
    }

    throw new Error('No AI API key configured. Set OPENAI_API_KEY or GROQ_API_KEY in your .env.local file.')
  }
  return openaiInstance
}

/**
 * Get Groq client specifically (for faster inference)
 */
export function getGroq(): OpenAI | null {
  if (!process.env.GROQ_API_KEY) {
    return null
  }

  if (!groqInstance) {
    groqInstance = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    })
  }
  return groqInstance
}

// For backward compatibility - will throw error when accessed if not configured
export const openai = new Proxy({} as OpenAI, {
  get(_, prop) {
    return getOpenAI()[prop as keyof OpenAI]
  },
})

export const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || ''

export function isOpenAIConfigured(): boolean {
  return !!(process.env.OPENAI_API_KEY && process.env.OPENAI_ASSISTANT_ID)
}
