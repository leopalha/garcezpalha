'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRealtimeAPI } from '@/hooks/useRealtimeAPI'
import { useDIDAvatar } from '@/hooks/useDIDAvatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, Video, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

type VoiceMode = 'audio' | 'avatar'

// Simple markdown parser for chat messages
function parseMarkdown(text: string): React.ReactNode {
  if (!text) return text

  let parts: React.ReactNode[] = [text]
  let key = 0

  // Regex patterns for markdown
  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, component: (match: string) => <strong key={key++}>{match}</strong> },
    { regex: /\*(.+?)\*/g, component: (match: string) => <em key={key++}>{match}</em> },
    { regex: /`(.+?)`/g, component: (match: string) => <code key={key++} className="bg-gray-800 px-1 rounded">{match}</code> },
  ]

  // Process each pattern
  for (const { regex, component } of patterns) {
    const newParts: React.ReactNode[] = []

    for (const part of parts) {
      if (typeof part !== 'string') {
        newParts.push(part)
        continue
      }

      const matches = [...part.matchAll(regex)]
      if (matches.length === 0) {
        newParts.push(part)
        continue
      }

      let lastIndex = 0
      for (const match of matches) {
        // Add text before match
        if (match.index! > lastIndex) {
          newParts.push(part.substring(lastIndex, match.index))
        }
        // Add formatted match
        newParts.push(component(match[1]))
        lastIndex = match.index! + match[0].length
      }
      // Add remaining text
      if (lastIndex < part.length) {
        newParts.push(part.substring(lastIndex))
      }
    }

    parts = newParts
  }

  return <>{parts}</>
}

interface RealtimeVoiceAssistantProps {
  productId: string
  productName: string
  onClose?: () => void
}

export function RealtimeVoiceAssistant({
  productId,
  productName,
  onClose
}: RealtimeVoiceAssistantProps) {
  const [mode, setMode] = useState<VoiceMode>('audio')
  const [isActive, setIsActive] = useState(false)
  const [showModeSelector, setShowModeSelector] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const lastSpokenMessageIdRef = useRef<string | null>(null)

  // Hooks
  const realtime = useRealtimeAPI(productId)
  const avatar = useDIDAvatar()

  // Start conversation
  const startConversation = useCallback(async (selectedMode: VoiceMode) => {
    try {
      setMode(selectedMode)
      setShowModeSelector(false)
      setIsActive(true)

      // Reset last spoken message tracking
      lastSpokenMessageIdRef.current = null

      // Connect to Realtime API
      await realtime.connect()

      // If avatar mode, connect D-ID
      if (selectedMode === 'avatar' && videoRef.current) {
        await avatar.connect(videoRef.current)
      }

      // Start microphone
      await realtime.startMicrophone()
    } catch (error) {
      console.error('Failed to start conversation:', error)
      setIsActive(false)
      setShowModeSelector(true)
    }
  }, [realtime, avatar])

  // Stop conversation
  const stopConversation = useCallback(async (convertedToCheckout = false) => {
    try {
      await realtime.disconnect(convertedToCheckout)

      if (mode === 'avatar') {
        await avatar.disconnect()
      }

      setIsActive(false)
      setShowModeSelector(true)
    } catch (error) {
      console.error('Failed to stop conversation:', error)
    }
  }, [realtime, avatar, mode])

  // Sync Realtime API responses to D-ID Avatar
  useEffect(() => {
    // Only sync when in avatar mode and avatar is connected
    if (mode !== 'avatar' || !avatar.isConnected) {
      return
    }

    // Get the last assistant message
    const lastMessage = realtime.messages[realtime.messages.length - 1]

    // Only process new assistant messages (not user messages)
    if (
      lastMessage?.role === 'assistant' &&
      lastMessage.content &&
      lastMessage.id !== lastSpokenMessageIdRef.current
    ) {
      console.log('[RealtimeVoiceAssistant] Syncing to avatar:', lastMessage.content.substring(0, 50))

      // Send text to D-ID avatar for lip-synced speech
      avatar.speakText(lastMessage.content)

      // Track this message to avoid duplicate calls
      lastSpokenMessageIdRef.current = lastMessage.id
    }
  }, [mode, realtime.messages, avatar.isConnected, avatar])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isActive) {
        stopConversation()
      }
    }
  }, [isActive, stopConversation])

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="bg-black/50 border-b border-gray-800 p-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Conversa por Voz</h2>
              <p className="text-sm text-gray-400">{productName}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mode Selector (antes de iniciar) */}
          <AnimatePresence>
            {showModeSelector && !isActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8 space-y-6"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Como prefere conversar?
                  </h3>
                  <p className="text-gray-400">
                    Escolha o modo de conversa mais confortável para você
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Audio Puro */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startConversation('audio')}
                    className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl text-left hover:from-blue-500 hover:to-blue-700 transition-all group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <Mic className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Áudio Puro</h4>
                        <p className="text-xs text-blue-100">Rápido e leve</p>
                      </div>
                    </div>
                    <p className="text-sm text-blue-100 opacity-90">
                      Conversa por voz com visualização animada. Ideal para conexões mais lentas.
                    </p>
                  </motion.button>

                  {/* Avatar Visual */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startConversation('avatar')}
                    className="p-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl text-left hover:from-purple-500 hover:to-purple-700 transition-all group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Avatar Visual</h4>
                        <p className="text-xs text-purple-100">Mais imersivo</p>
                      </div>
                    </div>
                    <p className="text-sm text-purple-100 opacity-90">
                      Advogado virtual com rosto humano e lip sync. Experiência completa.
                    </p>
                  </motion.button>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Sua conversa será privada e segura</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interface Ativa */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {mode === 'audio' ? (
                  <AudioPureInterface
                    isSpeaking={realtime.isSpeaking}
                    isConnected={realtime.isConnected}
                    isConnecting={realtime.isConnecting}
                    messages={realtime.messages}
                    error={realtime.error}
                    onStop={() => stopConversation()}
                  />
                ) : (
                  <AvatarInterface
                    videoRef={videoRef}
                    isSpeaking={realtime.isSpeaking}
                    isConnected={realtime.isConnected && avatar.isConnected}
                    isConnecting={realtime.isConnecting || avatar.isConnecting}
                    messages={realtime.messages}
                    error={realtime.error || avatar.error}
                    onStop={() => stopConversation()}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}

// ============================================================================
// AUDIO PURE INTERFACE (Apple Watch Style)
// ============================================================================

interface AudioPureInterfaceProps {
  isSpeaking: boolean
  isConnected: boolean
  isConnecting: boolean
  messages: any[]
  error: string | null
  onStop: () => void
}

function AudioPureInterface({
  isSpeaking,
  isConnected,
  isConnecting,
  messages,
  error,
  onStop
}: AudioPureInterfaceProps) {
  return (
    <div className="p-8 min-h-[500px] flex flex-col items-center justify-center">
      {/* Waveform Circular (Apple Watch Style) */}
      <div className="relative w-64 h-64 mb-8">
        <motion.div
          animate={{
            scale: isSpeaking ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isSpeaking ? Infinity : 0,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>

            {/* Outer Ring */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="4"
              opacity="0.3"
            />

            {/* Animated Ring */}
            <motion.circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="534"
              initial={{ strokeDashoffset: 534 }}
              animate={{
                strokeDashoffset: isSpeaking ? [534, 0, 534] : 534,
                rotate: isSpeaking ? 360 : 0
              }}
              transition={{
                strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" },
                rotate: { duration: 4, repeat: Infinity, ease: "linear" }
              }}
            />
          </svg>
        </motion.div>

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: isSpeaking ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: isSpeaking ? Infinity : 0,
            }}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center",
              isSpeaking ? "bg-blue-600" : "bg-gray-700"
            )}
          >
            {isConnecting ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center mb-6">
        {isConnecting && (
          <p className="text-gray-400">Conectando...</p>
        )}
        {isConnected && !isSpeaking && (
          <p className="text-gray-400">Estou ouvindo...</p>
        )}
        {isSpeaking && (
          <p className="text-blue-400 font-medium">Falando...</p>
        )}
        {error && (
          <p className="text-red-400">{error}</p>
        )}
      </div>

      {/* Transcrição (últimas 5 mensagens) */}
      <div className="w-full max-w-2xl space-y-3 mb-6 max-h-48 overflow-y-auto">
        {messages.slice(-5).map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: msg.role === 'user' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "p-3 rounded-lg text-sm",
              msg.role === 'user'
                ? "bg-blue-600/20 text-blue-100 ml-8"
                : "bg-gray-700/50 text-gray-200 mr-8"
            )}
          >
            <div className="flex items-start gap-2">
              <span className="text-xs opacity-60">
                {msg.role === 'user' ? 'Você' : 'Advogado'}:
              </span>
              <p className="flex-1">{parseMarkdown(msg.content)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stop Button */}
      <Button
        onClick={onStop}
        variant="destructive"
        size="lg"
        className="bg-red-600 hover:bg-red-700"
      >
        Encerrar Conversa
      </Button>
    </div>
  )
}

// ============================================================================
// AVATAR INTERFACE (D-ID + Transcrição)
// ============================================================================

interface AvatarInterfaceProps {
  videoRef: React.RefObject<HTMLVideoElement>
  isSpeaking: boolean
  isConnected: boolean
  isConnecting: boolean
  messages: any[]
  error: string | null
  onStop: () => void
}

function AvatarInterface({
  videoRef,
  isSpeaking,
  isConnected,
  isConnecting,
  messages,
  error,
  onStop
}: AvatarInterfaceProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 p-6">
      {/* Video Avatar */}
      <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Speaking Ring */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 border-4 border-blue-500 rounded-xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Connecting Overlay */}
        {isConnecting && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
              <p className="text-white">Conectando avatar...</p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <p className="text-red-400 text-center px-4">{error}</p>
          </div>
        )}
      </div>

      {/* Transcrição Sidebar */}
      <div className="flex flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto max-h-96 pr-2">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] p-3 rounded-lg",
                msg.role === 'user'
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-100"
              )}>
                <p className="text-sm">{parseMarkdown(msg.content)}</p>
                <span className="text-xs opacity-60 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stop Button */}
        <Button
          onClick={onStop}
          variant="destructive"
          className="mt-4 w-full"
        >
          Encerrar Chamada
        </Button>
      </div>
    </div>
  )
}
