'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MessageCircle,
  X,
  Send,
  Mic,
  Paperclip,
  Loader2,
  Bot,
  User,
  Volume2,
  Video,
  Image as ImageIcon,
  FileText,
  Play,
  Pause,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RealtimeVoiceAssistant } from './RealtimeVoiceAssistant'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  audioUrl?: string
  attachments?: Array<{
    type: 'image' | 'document' | 'audio' | 'video'
    url: string
    name: string
  }>
}

interface ChatAssistantProps {
  productId: string
  productName: string
  autoOpen?: boolean
  openDelay?: number
  onClose?: () => void
}

export function ChatAssistant({
  productId,
  productName,
  autoOpen = true,
  openDelay = 3000,
  onClose,
}: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVideoMode, setIsVideoMode] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

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
• 🎥 **Vídeo**: Fale comigo ao vivo por vídeo
• 📎 **Documentos**: Envie fotos, PDFs, áudios

Como prefere começar?`,
          timestamp: new Date(),
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

    let finalMessage = input
    let audioFileToSend: File | null = null

    // Se há arquivo de áudio, transcrever primeiro
    const audioFile = selectedFiles.find(f => f.type.startsWith('audio/'))
    if (audioFile) {
      setIsTranscribing(true)
      setTranscriptionError(null)

      try {
        const formData = new FormData()
        formData.append('audio', audioFile)

        console.log('[ChatAssistant] Transcribing audio:', audioFile.name)

        const transcribeRes = await fetch('/api/chat/transcribe', {
          method: 'POST',
          body: formData,
        })

        if (!transcribeRes.ok) {
          const error = await transcribeRes.json()
          throw new Error(error.error || 'Transcription failed')
        }

        const { text } = await transcribeRes.json()
        console.log('[ChatAssistant] Transcription:', text)

        finalMessage = input ? `${input}\n\n[Áudio transcrito]: ${text}` : text
        audioFileToSend = audioFile

      } catch (error: any) {
        console.error('[ChatAssistant] Transcription error:', error)
        setTranscriptionError(error.message)
        setIsTranscribing(false)
        return
      } finally {
        setIsTranscribing(false)
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: finalMessage || '📎 Arquivos anexados',
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
      const response = await fetch('/api/chat/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          message: finalMessage,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        audioUrl: data.audioUrl,
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

  // Gravação de áudio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const file = new File([blob], `audio-${Date.now()}.webm`, {
          type: 'audio/webm',
        })
        setSelectedFiles((prev) => [...prev, file])
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Erro ao gravar:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles((prev) => [...prev, ...files].slice(0, 20)) // Máximo 20 arquivos
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
                </div>
              </div>
              <div className="flex items-center gap-2">
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

                  <div className={cn('max-w-[75%] space-y-2')}>
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-2',
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 shadow-sm'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>

                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((att, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-xs opacity-75"
                            >
                              {att.type === 'image' && <ImageIcon className="h-3 w-3" />}
                              {att.type === 'document' && <FileText className="h-3 w-3" />}
                              <span className="truncate">{att.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {message.audioUrl && (
                        <button className="mt-2 flex items-center gap-2 text-xs opacity-75 hover:opacity-100">
                          <Volume2 className="h-3 w-3" />
                          Ouvir resposta
                        </button>
                      )}

                      <p className={cn(
                        'text-[10px] mt-1',
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      )}>
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
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

            {/* Transcription Feedback */}
            {isTranscribing && (
              <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                <span className="text-sm text-blue-600 dark:text-blue-400">Transcrevendo áudio...</span>
              </div>
            )}

            {transcriptionError && (
              <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t flex items-center gap-2">
                <X className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600 dark:text-red-400">{transcriptionError}</span>
                <button
                  onClick={() => setTranscriptionError(null)}
                  className="ml-auto text-red-600 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

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
              {/* Recording UI */}
              {isRecording && (
                <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">
                      Gravando: {formatTime(recordingTime)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={stopRecording}
                    variant="outline"
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Parar
                  </Button>
                </div>
              )}

              {/* Input Row */}
              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  multiple
                />

                <input
                  ref={audioInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="audio/*,video/*"
                />

                {/* Attach Files */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  title="Anexar arquivos (imagens, PDFs, documentos)"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>

                {/* Record Audio */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={cn(isRecording && 'text-red-600')}
                  title={isRecording ? 'Parar gravação' : 'Gravar áudio'}
                >
                  <Mic className="h-5 w-5" />
                </Button>

                {/* Text Input */}
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                  disabled={isLoading || isRecording}
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
                Assistente IA • Envie até 20 arquivos • Imagens, PDFs, Áudios
              </p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Voice Mode with OpenAI Realtime API */}
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
