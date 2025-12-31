/**
 * Unified Chat Assistant
 * Componente consolidado que suporta 3 modos:
 * - chat: Chat tradicional com arquivos e áudio
 * - agent-flow: Qualificação de leads com state machine
 * - realtime-voice: Conversa por voz em tempo real (OpenAI Realtime API)
 */

'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

// Types
import type { UnifiedChatAssistantProps, Message, AgentState, QualificationData } from '@/types/chat'
import { DEFAULT_FEATURES } from '@/types/chat'

// Components
import { ChatHeader } from './components/ChatHeader'
import { MessageBubble } from './components/MessageBubble'
import { ChatInput } from './components/ChatInput'
import { QualificationProgress } from './components/QualificationProgress'

// Lazy load heavy components (code splitting)
const RealtimeVoiceAssistant = dynamic(
  () => import('./RealtimeVoiceAssistant').then((mod) => ({ default: mod.RealtimeVoiceAssistant })),
  { ssr: false }
)

// Utils & Hooks
import { generateConversationId, sendMessage, getDefaultModeConfig } from '@/lib/chat'
import { useChatSettings } from './ChatSettings'
import { useAnalytics } from '@/hooks/use-analytics'

export function ChatAssistant({
  productId,
  productName,
  autoOpen = true,
  openDelay = 3000,
  onClose,
  mode = 'chat',
  channel = 'website',
  features: customFeatures,
  onConversationStart,
  onQualificationComplete,
  customSystemPrompt,
  maxFiles = 20,
}: UnifiedChatAssistantProps) {
  // ==================== STATE ====================

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  // Agent-flow specific
  const [conversationId] = useState(() => generateConversationId(channel))
  const [currentState, setCurrentState] = useState<AgentState>('greeting')
  const [qualification, setQualification] = useState<QualificationData | null>(null)

  // Realtime-voice specific
  const [isVideoMode, setIsVideoMode] = useState(false)

  // Settings
  const settingsData = useChatSettings()

  // Analytics
  const { trackChat } = useAnalytics()

  // Convert ChatSettingsData to ChatSettings
  const settings = useMemo(() => {
    if (!settingsData) return undefined
    return {
      ttsEnabled: settingsData.ttsEnabled,
      ttsVoice: settingsData.ttsVoice,
      ttsSpeed: settingsData.ttsSpeed as 1 | 1.5 | 2,
      ttsAutoPlay: settingsData.autoPlayResponses,
      microphoneEnabled: settingsData.microphoneEnabled,
      notificationsEnabled: settingsData.notificationsEnabled,
      soundEffectsEnabled: settingsData.soundEnabled,
    }
  }, [settingsData])

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ==================== COMPUTED ====================

  // Merge features with defaults
  const features = useMemo(() => {
    const defaults = getDefaultModeConfig(mode).features
    return { ...defaults, ...customFeatures }
  }, [mode, customFeatures])

  // ==================== EFFECTS ====================

  // Auto-open after delay
  useEffect(() => {
    if (autoOpen && openDelay > 0) {
      const timer = setTimeout(() => setIsOpen(true), openDelay)
      return () => clearTimeout(timer)
    } else if (autoOpen) {
      setIsOpen(true)
    }
  }, [autoOpen, openDelay])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Notify conversation start (agent-flow)
  useEffect(() => {
    if (mode === 'agent-flow' && isOpen && onConversationStart) {
      onConversationStart(conversationId)
    }
  }, [mode, isOpen, conversationId, onConversationStart])

  // Track chat session (when chat is opened)
  useEffect(() => {
    if (isOpen) {
      const sessionStart = Date.now()

      return () => {
        const sessionDuration = Date.now() - sessionStart
        trackChat({
          messageCount: messages.length,
          sessionDuration,
          assistantUsed: mode,
        })
      }
    }
  }, [isOpen, messages.length, mode, trackChat])

  // Notify qualification complete (agent-flow)
  useEffect(() => {
    if (
      mode === 'agent-flow' &&
      qualification?.isQualified &&
      onQualificationComplete
    ) {
      onQualificationComplete(qualification)
    }
  }, [mode, qualification, onQualificationComplete])

  // ==================== HANDLERS ====================

  const handleSubmit = async () => {
    if ((!input.trim() && selectedFiles.length === 0) || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    // Show typing indicator
    const typingMessage: Message = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    }
    setMessages((prev) => [...prev, typingMessage])

    try {
      const response = await sendMessage({
        mode,
        productId,
        message: userMessage.content,
        messages,
        conversationId,
        channel,
        files: selectedFiles,
      })

      // Remove typing indicator
      setMessages((prev) => prev.filter((m) => m.id !== 'typing'))

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        state: response.state,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Update agent-flow state
      if (mode === 'agent-flow' && response.state) {
        setCurrentState(response.state as AgentState)

        if (response.qualification) {
          setQualification(response.qualification)
        }

        // Add system message if escalated
        if (response.state === 'escalated') {
          const systemMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'system',
            content:
              'Esta conversa foi escalada para um atendente humano. Aguarde um momento.',
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, systemMessage])
        }
      }

      // Clear files after successful send
      setSelectedFiles([])
    } catch (err) {
      console.error('Error sending message:', err)

      // Remove typing indicator
      setMessages((prev) => prev.filter((m) => m.id !== 'typing'))

      // Show error
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao enviar mensagem'
      setError(errorMessage)

      // Add error message
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `Erro: ${errorMessage}. Por favor, tente novamente.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearHistory = () => {
    if (confirm('Deseja limpar todo o histórico de conversas?')) {
      setMessages([])
      setQualification(null)
      setCurrentState('greeting')
      setError(null)
    }
  }

  const handleTranscription = (text: string) => {
    setInput((prev) => (prev ? `${prev} ${text}` : text))
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(files)
  }

  const handleFileRemove = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleOpenVideo = () => {
    setIsVideoMode(true)
  }

  const handleCloseVideo = () => {
    setIsVideoMode(false)
  }

  // ==================== RENDER ====================

  // Realtime Voice Mode (fullscreen)
  if (isVideoMode) {
    return (
      <RealtimeVoiceAssistant
        productId={productId}
        productName={productName}
        onClose={handleCloseVideo}
      />
    )
  }

  return (
    <>
      {/* Floating Button (quando fechado) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="flex flex-col h-[600px] max-h-[calc(100vh-3rem)] shadow-2xl overflow-hidden">
              {/* Header */}
              <ChatHeader
                productName={productName}
                mode={mode}
                currentState={mode === 'agent-flow' ? currentState : undefined}
                showSettingsButton={features.settingsPanel}
                showClearButton={features.historyClearing}
                showVideoButton={features.videoMode}
                onClose={handleClose}
                onClearHistory={handleClearHistory}
                onOpenVideo={handleOpenVideo}
              />

              {/* Qualification Progress (agent-flow only) */}
              {mode === 'agent-flow' &&
                features.qualificationTracking &&
                qualification && (
                  <div className="p-3 border-b bg-muted/30">
                    <QualificationProgress data={qualification} />
                  </div>
                )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/20">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Olá! Como posso ajudar você hoje?</p>
                    {mode === 'agent-flow' && (
                      <p className="mt-2 text-xs">
                        Vou fazer algumas perguntas para entender melhor sua necessidade.
                      </p>
                    )}
                  </div>
                )}

                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    settings={features.textToSpeech ? settings : undefined}
                  />
                ))}

                <div ref={messagesEndRef} />
              </div>

              {/* Error Banner */}
              {error && (
                <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm border-t border-destructive/20">
                  {error}
                </div>
              )}

              {/* Input Area */}
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                selectedFiles={selectedFiles}
                onFilesSelect={handleFilesSelect}
                onFileRemove={handleFileRemove}
                maxFiles={maxFiles}
                features={features}
                onTranscription={handleTranscription}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Export também com o nome antigo para compatibilidade
export { ChatAssistant as UnifiedChatAssistant }
