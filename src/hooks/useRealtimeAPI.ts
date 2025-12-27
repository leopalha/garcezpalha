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
  const audioContextRef = useRef<AudioContext | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const audioQueueRef = useRef<ArrayBuffer[]>([])
  const isPlayingRef = useRef(false)

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true)
      setError(null)

      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
      if (!apiKey) {
        throw new Error('NEXT_PUBLIC_OPENAI_API_KEY not configured')
      }

      console.log('[useRealtimeAPI] Connecting to OpenAI Realtime API...')

      // Connect to OpenAI Realtime API
      const ws = new WebSocket(
        'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
        ['realtime', `openai-insecure-api-key.${apiKey}`.trim()]
      )

      ws.onopen = () => {
        console.log('[useRealtimeAPI] WebSocket connected')
        wsRef.current = ws

        // Send session.update to configure the session
        ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: `Você é um assistente jurídico especializado em ${productId}.
Seja educado, profissional e objetivo.
Responda em português brasileiro.
Pergunte detalhes quando necessário para qualificar o lead.
Seja conciso e claro nas suas respostas.`,
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: {
              model: 'whisper-1'
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500
            },
            temperature: 0.8,
            max_response_output_tokens: 4096,
          }
        }))

        setIsConnected(true)
        setIsConnecting(false)
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
          console.log('[useRealtimeAPI] Received:', data.type)

          switch (data.type) {
            case 'session.created':
            case 'session.updated':
              console.log('[useRealtimeAPI] Session configured:', data.session?.id)
              break

            case 'response.audio.delta':
              // Play audio chunk
              if (data.delta) {
                const audioData = base64ToArrayBuffer(data.delta)
                audioQueueRef.current.push(audioData)
                if (!isPlayingRef.current) {
                  playNextAudioChunk()
                }
              }
              break

            case 'response.audio_transcript.delta':
              setIsSpeaking(true)
              // Update partial transcription
              setMessages(prev => {
                const last = prev[prev.length - 1]
                if (last?.role === 'assistant' && last.id.startsWith('temp-')) {
                  return [...prev.slice(0, -1), {
                    ...last,
                    content: last.content + data.delta
                  }]
                }
                return [...prev, {
                  id: `temp-${Date.now()}`,
                  role: 'assistant',
                  content: data.delta,
                  timestamp: new Date()
                }]
              })
              break

            case 'response.audio_transcript.done':
              setIsSpeaking(false)
              if (data.transcript) {
                setMessages(prev => {
                  const last = prev[prev.length - 1]
                  if (last?.role === 'assistant' && last.id.startsWith('temp-')) {
                    return [...prev.slice(0, -1), {
                      id: Date.now().toString(),
                      role: 'assistant',
                      content: data.transcript,
                      timestamp: new Date()
                    }]
                  }
                  return [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: data.transcript,
                    timestamp: new Date()
                  }]
                })
              }
              break

            case 'conversation.item.input_audio_transcription.completed':
              if (data.transcript) {
                setMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  role: 'user',
                  content: data.transcript,
                  timestamp: new Date()
                }])
              }
              break

            case 'input_audio_buffer.speech_started':
              console.log('[useRealtimeAPI] User started speaking')
              break

            case 'input_audio_buffer.speech_stopped':
              console.log('[useRealtimeAPI] User stopped speaking')
              break

            case 'error':
              console.error('[useRealtimeAPI] Server error:', data.error)
              setError(data.error.message || 'Erro no servidor')
              break
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
  }, [productId])

  const disconnect = useCallback(async () => {
    // Stop microphone
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }

    // Stop audio processing
    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
    }

    if (audioContextRef.current) {
      await audioContextRef.current.close()
      audioContextRef.current = null
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    // Clear audio queue
    audioQueueRef.current = []
    isPlayingRef.current = false

    setIsConnected(false)
    setMessages([])
  }, [])

  const startMicrophone = useCallback(async () => {
    try {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        throw new Error('WebSocket not connected')
      }

      console.log('[useRealtimeAPI] Starting microphone...')

      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 24000,
        }
      })
      mediaStreamRef.current = stream

      // Create AudioContext
      const audioContext = new AudioContext({ sampleRate: 24000 })
      audioContextRef.current = audioContext

      const source = audioContext.createMediaStreamSource(stream)

      // Create processor to capture PCM data
      const processor = audioContext.createScriptProcessor(2048, 1, 1)
      processorRef.current = processor

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return
        }

        const inputData = e.inputBuffer.getChannelData(0)

        // Convert Float32 to Int16 PCM
        const pcmData = new Int16Array(inputData.length)
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]))
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
        }

        // Convert to base64
        const base64Audio = arrayBufferToBase64(pcmData.buffer)

        // Send to WebSocket
        wsRef.current.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: base64Audio
        }))
      }

      source.connect(processor)
      processor.connect(audioContext.destination)

      console.log('[useRealtimeAPI] Microphone started successfully')
    } catch (err: any) {
      console.error('[useRealtimeAPI] Microphone error:', err)
      setError('Falha ao acessar microfone')
    }
  }, [])

  // Helper: Base64 to ArrayBuffer
  function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  // Helper: ArrayBuffer to Base64
  function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  // Helper: Play next audio chunk from queue
  async function playNextAudioChunk() {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false
      return
    }

    isPlayingRef.current = true
    const audioData = audioQueueRef.current.shift()!

    try {
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 })
      }

      const audioContext = audioContextRef.current
      const int16Array = new Int16Array(audioData)
      const float32Array = new Float32Array(int16Array.length)

      // Convert Int16 to Float32
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / (int16Array[i] < 0 ? 0x8000 : 0x7FFF)
      }

      // Create audio buffer
      const audioBuffer = audioContext.createBuffer(1, float32Array.length, 24000)
      audioBuffer.getChannelData(0).set(float32Array)

      // Play
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.destination)
      source.onended = () => {
        playNextAudioChunk()
      }
      source.start()
    } catch (err) {
      console.error('[useRealtimeAPI] Audio playback error:', err)
      playNextAudioChunk()
    }
  }

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
