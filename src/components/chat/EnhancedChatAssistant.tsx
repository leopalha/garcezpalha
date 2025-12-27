'use client'

/**
 * Enhanced Chat Assistant
 * Versão melhorada com AudioRecorder, VoicePlayer, ChatSettings e Agent State Machine
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  Loader2,
  Bot,
  User,
  Video,
  FileText,
  Image as ImageIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RealtimeVoiceAssistant } from './RealtimeVoiceAssistant'
import { AudioRecorder } from './AudioRecorder'
import { VoicePlayer } from './VoicePlayer'
import { ChatSettings, useChatSettings } from './ChatSettings'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  state?: string // Agent state when message was sent
  attachments?: Array<{
    type: 'image' | 'document' | 'audio' | 'video'
    url: string
    name: string
  }>
}

interface EnhancedChatAssistantProps {
  productId: string
  productName: string
  autoOpen?: boolean
  openDelay?: number
  onClose?: () => void
  useStateMachine?: boolean // Toggle to use new state machine API
}

export function EnhancedChatAssistant({
  productId,
  productName,
  autoOpen = true,
  openDelay = 3000,
  onClose,
  useStateMachine = true,
}: EnhancedChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVideoMode, setIsVideoMode] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [conversationId] = useState(() => `website:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const [currentState, setCurrentState] = useState<string>('greeting')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const settings = useChatSettings()

  // Auto-open
  useEffect(() => {
    if (autoOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        addMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: `Olá! 👋 Sou o assistente especializado em **${productName}**.

Posso te ajudar de várias formas:
• 💬 **Chat**: Converse comigo por texto
• 🎤 **Voz**: Grave mensagens de voz
• 🎥 **Vídeo**: Fale comigo ao vivo
• 📎 **Documentos**: Envie fotos, PDFs

Como prefere começar?`,
          timestamp: new Date(),
          state: 'greeting',
        })
      }, openDelay)
      return () => clearTimeout(timer)
    }
  }, [autoOpen, openDelay, productName])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  const handleSend = async () => {
    if (!input.trim() && selectedFiles.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || '📎 Arquivos anexados',
      timestamp: new Date(),
      attachments: selectedFiles.map((file) => ({
        type: file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('audio/')
          ? 'audio'
          : file.type.startsWith('video/')
          ? 'video'
          : 'document',
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    }

    addMessage(userMessage)
    setInput('')
    setSelectedFiles([])
    setIsLoading(true)

    try {
      // Use State Machine API if enabled, otherwise fallback to original
      const apiUrl = useStateMachine ? '/api/chat/agent-flow' : '/api/chat/assistant'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(useStateMachine ? {
            conversationId,
            message: input,
            channel: 'website',
          } : {
            productId,
            message: input,
            history: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        }),
      })

      const data = await response.json()

      // Update current state if using state machine
      if (useStateMachine && data.state) {
        setCurrentState(data.state)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: useStateMachine ? data.response : data.message,
        timestamp: new Date(),
        state: useStateMachine ? data.state : undefined,
      }

      addMessage(assistantMessage)
    } catch (error) {
      console.error('Erro:', error)
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Pode tentar novamente?',
        timestamp: new Date(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTranscription = (text: string) => {
    setInput(text)
    // Auto-send after transcription (optional)
    // setTimeout(() => handleSend(), 100)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles((prev) => [...prev, ...files].slice(0, 20))
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-24 z-40"
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Bot className="h-6 w-6" />
        </Button>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 text-xs px-3 py-1 rounded-full shadow-lg whitespace-nowrap animate-bounce">
          Assistente IA 🤖
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-24 z-40 w-[420px] max-w-[calc(100vw-8rem)]"
        >
          <Card className="flex flex-col h-[650px] max-h-[calc(100vh-5rem)] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Assistente IA</p>
                  <p className="text-xs opacity-90">{productName}</p>
                  {useStateMachine && (
                    <p className="text-[10px] opacity-75">
                      Estado: {currentState}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChatSettings />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsVideoMode(true)}
                  className="text-white hover:bg-white/20"
                  title="Vídeo Chamada"
                >
                  <Video className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsOpen(false)
                    onClose?.()
                  }}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}

                  <div className={cn(
                    'max-w-[75%] space-y-2',
                    message.role === 'user' && 'items-end'
                  )}>
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3 shadow-sm',
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {message.attachments.map((att, idx) => (
                            <div key={idx} className="relative">
                              {att.type === 'image' ? (
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  className="rounded-lg w-full h-auto"
                                />
                              ) : (
                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="text-xs truncate">{att.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Voice Player for assistant messages */}
                    {message.role === 'assistant' && settings.ttsEnabled && (
                      <VoicePlayer
                        text={message.content}
                        voice={settings.ttsVoice}
                        speed={settings.ttsSpeed}
                        autoPlay={settings.autoPlayResponses}
                        className="ml-2"
                      />
                    )}

                    <p className={cn(
                      'text-[10px] text-gray-500 px-2',
                      message.role === 'user' && 'text-right'
                    )}>
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t flex gap-2 overflow-x-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 group"
                  >
                    <div className="w-16 h-16 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center border">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FileText className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t space-y-3">
              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx"
                  multiple
                />

                {/* Attach Files */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  title="Anexar arquivos"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>

                {/* Audio Recorder */}
                {settings.microphoneEnabled && (
                  <AudioRecorder
                    onTranscription={handleTranscription}
                  />
                )}

                {/* Text Input */}
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                  disabled={isLoading}
                />

                {/* Send */}
                <Button
                  onClick={handleSend}
                  disabled={(!input.trim() && selectedFiles.length === 0) || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <p className="text-[10px] text-gray-500 text-center">
                Assistente IA com State Machine • Voz & Texto • Garcez Palha
              </p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Voice Mode */}
      {isVideoMode && (
        <RealtimeVoiceAssistant
          productId={productId}
          productName={productName}
          onClose={() => setIsVideoMode(false)}
        />
      )}
    </>
  )
}
