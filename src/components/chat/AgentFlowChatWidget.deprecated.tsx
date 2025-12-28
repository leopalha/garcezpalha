'use client'

/**
 * Agent Flow Chat Widget
 * Integração completa com /api/chat/agent-flow
 * Fluxo: Lead → Chatbot → Agent State Machine → CRM
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  state?: string
}

interface AgentFlowResponse {
  response: string
  state: string
  classification?: {
    area: string
    agent_assigned: string
    confidence: number
  }
  qualification?: {
    status: string
    questions_answered: number
    total_questions: number
    score: number
    flags: string[]
  }
  proposal?: {
    package?: string
    value?: number
    discount?: number
    payment_link?: string
  }
}

interface AgentFlowChatWidgetProps {
  productId?: string
  productName?: string
  autoOpen?: boolean
  openDelay?: number
  channel?: 'website' | 'whatsapp' | 'telegram' | 'email'
  onConversationStart?: (conversationId: string) => void
  onQualificationComplete?: (data: AgentFlowResponse) => void
}

export function AgentFlowChatWidget({
  productId,
  productName,
  autoOpen = false,
  openDelay = 3000,
  channel = 'website',
  onConversationStart,
  onQualificationComplete,
}: AgentFlowChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId] = useState(
    () => `${channel}:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  )
  const [currentState, setCurrentState] = useState<string>('greeting')
  const [qualification, setQualification] = useState<AgentFlowResponse['qualification'] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-open
  useEffect(() => {
    if (autoOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        if (onConversationStart) {
          onConversationStart(conversationId)
        }
      }, openDelay)
      return () => clearTimeout(timer)
    }
  }, [autoOpen, openDelay, conversationId, onConversationStart])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
      },
    ])
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setError(null)

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
      state: currentState,
    })

    setIsLoading(true)

    try {
      // Call agent-flow API
      const response = await fetch('/api/chat/agent-flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          message: userMessage,
          channel,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: AgentFlowResponse = await response.json()

      // Update state
      setCurrentState(data.state)

      // Update qualification data
      if (data.qualification) {
        setQualification(data.qualification)
      }

      // Add assistant response
      addMessage({
        role: 'assistant',
        content: data.response,
        state: data.state,
      })

      // Check if escalated
      if (data.state === 'escalated') {
        addMessage({
          role: 'system',
          content: '🔔 Sua conversa foi encaminhada para um especialista.',
          state: data.state,
        })
      }

      // Check if qualified
      if (data.state === 'qualified' && data.proposal) {
        if (onQualificationComplete) {
          onQualificationComplete(data)
        }
      }
    } catch (err: any) {
      console.error('[AgentFlowChat] Error:', err)
      setError('Erro ao processar mensagem. Tente novamente.')
      addMessage({
        role: 'system',
        content: '❌ Erro ao processar sua mensagem. Por favor, tente novamente.',
        state: currentState,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'greeting':
        return <Sparkles className="w-4 h-4" />
      case 'identifying':
      case 'classifying':
        return <Loader2 className="w-4 h-4 animate-spin" />
      case 'qualifying':
        return <Clock className="w-4 h-4" />
      case 'qualified':
        return <CheckCircle2 className="w-4 h-4" />
      case 'escalated':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Bot className="w-4 h-4" />
    }
  }

  const getStateLabel = (state: string): string => {
    const labels: Record<string, string> = {
      greeting: 'Saudação',
      identifying: 'Identificando',
      classifying: 'Classificando',
      qualifying: 'Qualificando',
      qualified: 'Qualificado',
      rejected: 'Não Qualificado',
      proposing: 'Proposta',
      objection_handling: 'Objeções',
      closing: 'Fechamento',
      payment_pending: 'Aguardando Pagamento',
      paid: 'Pago',
      contract_pending: 'Contrato Pendente',
      onboarding: 'Onboarding',
      active_case: 'Caso Ativo',
      completed: 'Concluído',
      escalated: 'Escalado',
      abandoned: 'Abandonado',
    }
    return labels[state] || state
  }

  const getStateBadgeVariant = (state: string) => {
    if (['qualified', 'paid', 'completed'].includes(state)) return 'default'
    if (['escalated', 'rejected'].includes(state)) return 'destructive'
    if (['qualifying', 'identifying'].includes(state)) return 'secondary'
    return 'outline'
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              className="rounded-full h-16 w-16 shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => {
                setIsOpen(true)
                if (onConversationStart && messages.length === 0) {
                  onConversationStart(conversationId)
                }
              }}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md"
          >
            <Card className="flex flex-col h-[600px] shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">
                      {productName || 'Assistente Garcez Palha'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      {getStateIcon(currentState)}
                      <span>{getStateLabel(currentState)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Qualification Progress */}
              {qualification && (
                <div className="px-4 py-2 bg-slate-50 border-b">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600">Progresso da Qualificação</span>
                    <span className="font-medium">
                      {qualification.questions_answered}/{qualification.total_questions}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          qualification.total_questions > 0
                            ? (qualification.questions_answered / qualification.total_questions) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getStateBadgeVariant(currentState)} className="text-xs">
                      Score: {qualification.score}/100
                    </Badge>
                    {qualification.flags.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {qualification.flags.length} flags
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-2',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role !== 'user' && (
                      <div className="flex-shrink-0">
                        {message.role === 'system' ? (
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-2 break-words',
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.role === 'system'
                          ? 'bg-orange-50 text-orange-900 border border-orange-200'
                          : 'bg-white text-slate-900 shadow-sm'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={cn(
                          'text-xs mt-1',
                          message.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                        )}
                      >
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Error Banner */}
              {error && (
                <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-lg">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
