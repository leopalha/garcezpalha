import { useState, useCallback, useRef } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export function useRealtimeAPI(productId: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true)
      setError(null)

      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
      if (!apiKey) {
        throw new Error('NEXT_PUBLIC_OPENAI_API_KEY not configured')
      }

      // Connect to OpenAI Realtime API
      const ws = new WebSocket(
        'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview',
        ['realtime', `openai-insecure-api-key.${apiKey}`.trim()]
      )

      ws.onopen = () => {
        console.log('[useRealtimeAPI] WebSocket connected')
        setIsConnected(true)
        setIsConnecting(false)
        wsRef.current = ws
      }

      ws.onerror = (err) => {
        console.error('[useRealtimeAPI] WebSocket error:', err)
        setError('Falha ao conectar com servidor de voz')
        setIsConnecting(false)
      }

      ws.onclose = () => {
        console.log('[useRealtimeAPI] WebSocket closed')
        setIsConnected(false)
        setIsConnecting(false)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          // Handle different message types
          if (data.type === 'response.audio_transcript.delta') {
            // AI is speaking
            setIsSpeaking(true)
          } else if (data.type === 'response.audio_transcript.done') {
            setIsSpeaking(false)
            if (data.transcript) {
              setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: data.transcript,
                timestamp: new Date()
              }])
            }
          } else if (data.type === 'conversation.item.input_audio_transcription.completed') {
            // User spoke
            if (data.transcript) {
              setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'user',
                content: data.transcript,
                timestamp: new Date()
              }])
            }
          }
        } catch (err) {
          console.error('[useRealtimeAPI] Error parsing message:', err)
        }
      }
    } catch (err: any) {
      console.error('[useRealtimeAPI] Connection error:', err)
      setError(err.message)
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async (convertedToCheckout = false) => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    setIsConnected(false)
    setMessages([])
  }, [])

  const startMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      // TODO: Send audio to WebSocket
      console.log('[useRealtimeAPI] Microphone started')
    } catch (err: any) {
      console.error('[useRealtimeAPI] Microphone error:', err)
      setError('Falha ao acessar microfone')
    }
  }, [])

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    messages,
    error,
    connect,
    disconnect,
    startMicrophone
  }
}
