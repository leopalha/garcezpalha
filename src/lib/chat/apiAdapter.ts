/**
 * Chat API Adapter
 * Abstração para diferentes backends de chat
 */

import type {
  ChatMode,
  Message,
  Channel,
  ChatAPIResponse,
  AgentFlowResponse,
} from '@/types/chat'

interface SendMessageParams {
  mode: ChatMode
  productId: string
  message: string
  messages: Message[]
  conversationId?: string
  channel?: Channel
  files?: File[]
}

interface APIResponse {
  message: string
  state?: string
  qualification?: any
  classification?: any
  proposal?: any
  metadata?: Record<string, any>
}

/**
 * Envia mensagem para o backend apropriado baseado no modo
 */
export async function sendMessage(params: SendMessageParams): Promise<APIResponse> {
  const { mode, productId, message, messages, conversationId, channel, files } = params

  // ==================== MODO CHAT ====================
  if (mode === 'chat') {
    const formData = new FormData()
    formData.append('productId', productId)
    formData.append('message', message)
    formData.append(
      'history',
      JSON.stringify(
        messages.map((m) => ({
          role: m.role,
          content: m.content,
        }))
      )
    )

    // Anexar arquivos
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file)
      })
    }

    const response = await fetch('/api/chat/assistant', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erro ao enviar mensagem')
    }

    const data: ChatAPIResponse = await response.json()

    return {
      message: data.message,
      metadata: data.metadata,
    }
  }

  // ==================== MODO AGENT-FLOW ====================
  if (mode === 'agent-flow') {
    if (!conversationId) {
      throw new Error('conversationId é obrigatório para modo agent-flow')
    }

    const response = await fetch('/api/chat/agent-flow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        message,
        channel: channel || 'website',
        productId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erro ao enviar mensagem')
    }

    const data: AgentFlowResponse = await response.json()

    return {
      message: data.message,
      state: data.state,
      qualification: data.qualification,
      classification: data.classification,
      proposal: data.proposal,
      metadata: data.metadata,
    }
  }

  // ==================== MODO REALTIME-VOICE ====================
  if (mode === 'realtime-voice') {
    // Realtime voice usa WebSocket via useRealtimeAPI hook
    // Não precisa de adapter HTTP
    throw new Error('Modo realtime-voice usa WebSocket, não HTTP')
  }

  throw new Error(`Modo desconhecido: ${mode}`)
}

/**
 * Transcreve áudio
 */
export async function transcribeAudio(
  audioBlob: Blob,
  productId?: string
): Promise<string> {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')
  if (productId) {
    formData.append('productId', productId)
  }

  const response = await fetch('/api/chat/transcribe', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao transcrever áudio')
  }

  const data = await response.json()
  return data.text
}

/**
 * Valida se um modo de chat é suportado
 */
export function isValidChatMode(mode: string): mode is ChatMode {
  return ['chat', 'agent-flow', 'realtime-voice'].includes(mode)
}

/**
 * Retorna configuração padrão para cada modo
 */
export function getDefaultModeConfig(mode: ChatMode) {
  const configs = {
    chat: {
      features: {
        fileUpload: true,
        audioRecording: true,
        textToSpeech: false,
        videoMode: true,
        qualificationTracking: false,
        historyClearing: true,
        settingsPanel: false,
      },
      autoOpen: true,
      openDelay: 3000,
    },
    'agent-flow': {
      features: {
        fileUpload: false,
        audioRecording: false,
        textToSpeech: false,
        videoMode: false,
        qualificationTracking: true,
        historyClearing: false,
        settingsPanel: false,
      },
      autoOpen: false,
      openDelay: 3000,
    },
    'realtime-voice': {
      features: {
        fileUpload: false,
        audioRecording: false,
        textToSpeech: false,
        videoMode: false,
        qualificationTracking: false,
        historyClearing: false,
        settingsPanel: false,
      },
      autoOpen: false,
      openDelay: 0,
    },
  }

  return configs[mode]
}
