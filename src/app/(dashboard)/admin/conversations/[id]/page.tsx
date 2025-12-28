/**
 * Conversation Detail Page
 * View conversation history and take over from agent
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Send,
  User,
  Bot,
  AlertTriangle,
  CheckCircle2,
  UserCircle,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

interface ConversationDetail {
  conversation_id: string
  channel: string
  client: {
    name?: string
    email?: string
    phone?: string
    cpf?: string
  }
  status: {
    state: string
    updated_at: string
    escalation_reason?: string
  }
  classification: {
    area: string
    product?: string
    agent_assigned: string
    confidence: number
  }
  qualification: {
    status: string
    score: number
    questions_answered: number
    total_questions: number
    flags: string[]
  }
  proposal?: {
    package?: string
    value?: number
    discount?: number
    payment_link?: string
    payment_status?: string
    clicksign_sign_url?: string
  }
  created_at: string
  last_message_at: string
}

export default function ConversationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string

  const [conversation, setConversation] = useState<ConversationDetail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [humanTakeover, setHumanTakeover] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadConversation()
    loadMessages()
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Real-time subscription for new messages
  useEffect(() => {
    const { createClient } = require('@/lib/supabase/client')
    const supabase = createClient()

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          console.log('[Real-time] New message:', payload.new)
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  const loadConversation = async () => {
    try {
      const response = await fetch(`/api/admin/conversations/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setConversation(data.conversation)
        setHumanTakeover(data.conversation.status.state === 'escalated')
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/admin/conversations/${conversationId}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleTakeover = async () => {
    try {
      const response = await fetch(`/api/admin/conversations/${conversationId}/takeover`, {
        method: 'POST',
      })

      if (response.ok) {
        setHumanTakeover(true)
        loadConversation()
      }
    } catch (error) {
      console.error('Error taking over conversation:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || sending) return

    setSending(true)
    const userMessage = input.trim()
    setInput('')

    try {
      // Add message to UI optimistically
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, newMessage])

      // Send to API
      const response = await fetch(`/api/admin/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          humanTakeover,
        }),
      })

      if (response.ok) {
        // Reload messages to get agent response
        loadMessages()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const getStateBadgeVariant = (state: string) => {
    if (['qualified', 'paid', 'completed'].includes(state)) return 'default'
    if (['escalated', 'rejected'].includes(state)) return 'destructive'
    return 'secondary'
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p>Carregando conversa...</p>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p>Conversa não encontrada</p>
          <Link href="/admin/conversations">
            <Button variant="outline" className="mt-4">
              Voltar
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/conversations">
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar para conversas
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {conversation.client.name || 'Cliente Anônimo'}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant={getStateBadgeVariant(conversation.status.state)}>
                {conversation.status.state}
              </Badge>
              <Badge variant="outline">Score: {conversation.qualification.score}/100</Badge>
              <Badge variant="outline">{conversation.channel}</Badge>
            </div>
          </div>

          {!humanTakeover && (
            <Button onClick={handleTakeover} variant="default" className="gap-2">
              <UserCircle className="w-4 h-4" />
              Assumir Conversa
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chat */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[600px]">
            <div className="p-4 border-b bg-slate-50">
              <h3 className="font-semibold">Conversa</h3>
              {humanTakeover && (
                <p className="text-sm text-green-600">✓ Você está controlando esta conversa</p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString('pt-BR')}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  disabled={sending}
                />
                <Button type="submit" disabled={sending} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Client Info */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Informações do Cliente</h3>
            <div className="space-y-3 text-sm">
              {conversation.client.name && (
                <div className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-slate-400" />
                  <span>{conversation.client.name}</span>
                </div>
              )}
              {conversation.client.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{conversation.client.email}</span>
                </div>
              )}
              {conversation.client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{conversation.client.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Criado: {new Date(conversation.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </Card>

          {/* Qualification */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Qualificação</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Score:</span>
                <span className="font-semibold">{conversation.qualification.score}/100</span>
              </div>
              <div className="flex justify-between">
                <span>Perguntas:</span>
                <span>
                  {conversation.qualification.questions_answered}/{conversation.qualification.total_questions}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant="outline" className="text-xs">
                  {conversation.qualification.status}
                </Badge>
              </div>
              {conversation.qualification.flags.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-slate-600 mb-2">Flags:</p>
                  <div className="flex flex-wrap gap-1">
                    {conversation.qualification.flags.map((flag) => (
                      <Badge key={flag} variant="secondary" className="text-xs">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Proposal */}
          {conversation.proposal && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Proposta</h3>
              <div className="space-y-2 text-sm">
                {conversation.proposal.value && (
                  <div className="flex items-center justify-between">
                    <span>Valor:</span>
                    <span className="font-semibold">
                      R$ {(conversation.proposal.value / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                {conversation.proposal.payment_status && (
                  <div className="flex items-center justify-between">
                    <span>Pagamento:</span>
                    <Badge
                      variant={conversation.proposal.payment_status === 'paid' ? 'default' : 'secondary'}
                    >
                      {conversation.proposal.payment_status}
                    </Badge>
                  </div>
                )}
                {conversation.proposal.payment_link && (
                  <a
                    href={conversation.proposal.payment_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Ver link de pagamento →
                  </a>
                )}
                {conversation.proposal.clicksign_sign_url && (
                  <a
                    href={conversation.proposal.clicksign_sign_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Ver contrato ClickSign →
                  </a>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
