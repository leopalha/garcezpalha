/**
 * API Keys Manager
 * Sistema centralizado de gerenciamento e validação de chaves de API OpenAI
 * com cache, validação automática e proteção contra expiração
 */

interface APIKeyStatus {
  isValid: boolean
  lastChecked: Date
  expiresAt?: Date
  errorMessage?: string
}

interface KeyCache {
  openai?: APIKeyStatus
}

// Cache de status das chaves (em memória do servidor)
let keyStatusCache: KeyCache = {}

// Tempo de cache (5 minutos)
const CACHE_DURATION = 5 * 60 * 1000

/**
 * Valida e retorna a chave OpenAI
 * Com cache e validação automática
 */
export async function getOpenAIKey(): Promise<string> {
  const key = process.env.OPENAI_API_KEY

  if (!key) {
    throw new Error('OPENAI_API_KEY não configurada. Configure em .env.local')
  }

  // Validar formato
  if (!key.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY inválida. Deve começar com "sk-"')
  }

  // Verificar cache
  const cached = keyStatusCache.openai
  if (cached && cached.isValid &&
      (Date.now() - cached.lastChecked.getTime()) < CACHE_DURATION) {
    return key
  }

  // Validar com a API (lightweight check)
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
      },
      signal: AbortSignal.timeout(5000) // 5s timeout
    })

    if (!response.ok) {
      if (response.status === 401) {
        keyStatusCache.openai = {
          isValid: false,
          lastChecked: new Date(),
          errorMessage: 'Chave OpenAI inválida ou expirada'
        }
        throw new Error('OPENAI_API_KEY inválida. Crie uma nova em https://platform.openai.com/api-keys')
      }
      throw new Error(`OpenAI API retornou status ${response.status}`)
    }

    // Chave válida - atualizar cache
    keyStatusCache.openai = {
      isValid: true,
      lastChecked: new Date()
    }

    return key
  } catch (error) {
    // Se for erro de rede/timeout, usar cache antigo se disponível
    if (cached && cached.isValid && error instanceof Error && error.name === 'AbortError') {
      console.warn('[Keys Manager] Usando cache OpenAI (timeout na validação)')
      return key
    }
    throw error
  }
}

/**
 * Invalida o cache da chave OpenAI
 * Útil quando detectamos que a chave expirou
 */
export function invalidateKeyCache() {
  keyStatusCache.openai = undefined
}

/**
 * Retorna status do cache (para debug/monitoring)
 */
export function getKeyStatus() {
  return {
    openai: keyStatusCache.openai || { isValid: false, lastChecked: new Date(0) },
  }
}

/**
 * Valida a chave OpenAI na inicialização
 * Retorna erro detalhado se estiver inválida
 */
export async function validateOpenAIKey(): Promise<{
  valid: boolean
  error?: string
}> {
  try {
    await getOpenAIKey()
    return { valid: true }
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Middleware para validar chave antes de usar
 * Atualiza automaticamente o cache
 */
export async function withValidKey<T>(
  operation: (key: string) => Promise<T>
): Promise<T> {
  try {
    const key = await getOpenAIKey()
    return await operation(key)
  } catch (error) {
    // Se erro 401/403, invalidar cache e tentar uma vez
    if (error && typeof error === 'object' && 'status' in error && (error.status === 401 || error.status === 403)) {
      invalidateKeyCache()

      // Tentar uma última vez com validação forçada
      const key = await getOpenAIKey()
      return await operation(key)
    }
    throw error
  }
}
