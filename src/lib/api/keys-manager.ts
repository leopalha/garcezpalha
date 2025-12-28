/**
 * API Keys Manager
 * Sistema centralizado de gerenciamento e validação de chaves de API
 * com cache, validação automática e proteção contra expiração
 */

import { cache } from 'react'

interface APIKeyStatus {
  isValid: boolean
  lastChecked: Date
  expiresAt?: Date
  errorMessage?: string
}

interface KeyCache {
  openai?: APIKeyStatus
  did?: APIKeyStatus
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
  } catch (error: any) {
    // Se for erro de rede/timeout, usar cache antigo se disponível
    if (cached && cached.isValid && error.name === 'AbortError') {
      console.warn('[Keys Manager] Usando cache OpenAI (timeout na validação)')
      return key
    }
    throw error
  }
}

/**
 * Valida e retorna a chave D-ID
 * Com cache e validação automática
 */
export async function getDIDKey(): Promise<string> {
  const key = process.env.DID_API_KEY

  if (!key) {
    throw new Error('DID_API_KEY não configurada. Configure em .env.local')
  }

  // Validar formato básico
  if (!key.startsWith('Basic ')) {
    throw new Error('DID_API_KEY deve começar com "Basic " (com espaço)')
  }

  // Verificar cache
  const cached = keyStatusCache.did
  if (cached && cached.isValid &&
      (Date.now() - cached.lastChecked.getTime()) < CACHE_DURATION) {
    return key
  }

  // Validar com a API (lightweight check)
  try {
    const response = await fetch('https://api.d-id.com/credits', {
      method: 'GET',
      headers: {
        'Authorization': key,
      },
      signal: AbortSignal.timeout(5000) // 5s timeout
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        keyStatusCache.did = {
          isValid: false,
          lastChecked: new Date(),
          errorMessage: 'Chave D-ID inválida ou expirada'
        }
        throw new Error('DID_API_KEY inválida. Verifique em https://studio.d-id.com/account/api-keys')
      }
      throw new Error(`D-ID API retornou status ${response.status}`)
    }

    // Chave válida - atualizar cache
    keyStatusCache.did = {
      isValid: true,
      lastChecked: new Date()
    }

    return key
  } catch (error: any) {
    // Se for erro de rede/timeout, usar cache antigo se disponível
    if (cached && cached.isValid && error.name === 'AbortError') {
      console.warn('[Keys Manager] Usando cache D-ID (timeout na validação)')
      return key
    }
    throw error
  }
}

/**
 * Invalida o cache de uma chave específica
 * Útil quando detectamos que a chave expirou
 */
export function invalidateKeyCache(provider: 'openai' | 'did') {
  if (provider === 'openai') {
    keyStatusCache.openai = undefined
  } else {
    keyStatusCache.did = undefined
  }
}

/**
 * Retorna status do cache (para debug/monitoring)
 */
export function getKeyStatus() {
  return {
    openai: keyStatusCache.openai || { isValid: false, lastChecked: new Date(0) },
    did: keyStatusCache.did || { isValid: false, lastChecked: new Date(0) },
  }
}

/**
 * Valida todas as chaves na inicialização
 * Retorna erros detalhados se alguma estiver inválida
 */
export async function validateAllKeys(): Promise<{
  openai: { valid: boolean; error?: string }
  did: { valid: boolean; error?: string }
}> {
  const results = {
    openai: { valid: false, error: undefined as string | undefined },
    did: { valid: false, error: undefined as string | undefined }
  }

  // Validar OpenAI
  try {
    await getOpenAIKey()
    results.openai.valid = true
  } catch (error: any) {
    results.openai.error = error.message
  }

  // Validar D-ID
  try {
    await getDIDKey()
    results.did.valid = true
  } catch (error: any) {
    results.did.error = error.message
  }

  return results
}

/**
 * Middleware para validar chave antes de usar
 * Atualiza automaticamente o cache
 */
export async function withValidKey<T>(
  provider: 'openai' | 'did',
  operation: (key: string) => Promise<T>
): Promise<T> {
  try {
    const key = provider === 'openai'
      ? await getOpenAIKey()
      : await getDIDKey()

    return await operation(key)
  } catch (error: any) {
    // Se erro 401/403, invalidar cache e tentar uma vez
    if (error.status === 401 || error.status === 403) {
      invalidateKeyCache(provider)

      // Tentar uma última vez com validação forçada
      const key = provider === 'openai'
        ? await getOpenAIKey()
        : await getDIDKey()

      return await operation(key)
    }
    throw error
  }
}
