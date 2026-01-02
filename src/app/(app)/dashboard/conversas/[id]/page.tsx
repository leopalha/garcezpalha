'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Send,
  User,
  Bot,
  Loader2,
  MessageSquare,
  Calendar,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'admin'
  content: string
  created_at: string
}

interface Conversation {
  id: string
  product: string
  status: string
  quality: string
  score: number
  messages: Message[]
  created_at: string
  agent_type: string
}

export default function ConversationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [userMessage, setUserMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchConversation()
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversation = async () => {
    setLoading(true)
    try {
      // Mock data - in production this would fetch from API
      const mockConversation: Conversation = {
        id: conversationId,
        product: 'Usucapião Extraordinária',
        status: 'active',
        quality: 'hot',
        score: 92,
        agent_type: 'Imobiliário',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        messages: [
          {
            id: '1',
            role: 'assistant',
            content:
              'Olá! Sou a assistente virtual da Garcez Palha Advocacia. Como posso ajudá-lo hoje?',
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '2',
            role: 'user',
            content:
              'Oi! Preciso de ajuda com um caso de usucapião. Já moro no imóvel há 15 anos.',
            created_at: new Date(Date.now() - 86340000).toISOString(),
          },
          {
            id: '3',
            role: 'assistant',
            content:
              'Entendo, casos de usucapião são nossa especialidade. Para te ajudar melhor, pode me informar se você tem algum documento do imóvel?',
            created_at: new Date(Date.now() - 86280000).toISOString(),
          },
          {
            id: '4',
            role: 'user',
            content: 'Tenho alguns comprovantes de água e luz no meu nome.',
            created_at: new Date(Date.now() - 86220000).toISOString(),
          },
          {
            id: '5',
            role: 'assistant',
            content:
              'Perfeito! Esses documentos são importantes. Vou conectá-lo com um advogado especializado para avaliar detalhadamente seu caso.',
            created_at: new Date(Date.now() - 7200000).toISOString(),
          },
        ],
      }

      setConversation(mockConversation)
    } catch (error) {
      console.error('Error fetching conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !conversation) return

    setSending(true)
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        created_at: new Date().toISOString(),
      }

      setConversation({
        ...conversation,
        messages: [...conversation.messages, newMessage],
      })

      setUserMessage('')

      // TODO: In production, this would call the API to send the message
      // and get a response from the AI agent
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Conversa não encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard/conversas')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Conversas
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const qualityColors = {
    hot: 'bg-red-100 text-red-800 border-red-200',
    warm: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cold: 'bg-blue-100 text-blue-800 border-blue-200',
  }

  const statusLabels = {
    active: 'Ativa',
    waiting: 'Aguardando',
    resolved: 'Resolvida',
    escalated: 'Escalada',
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/conversas')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                {conversation.product}
              </h1>
              <Badge variant="outline" className={qualityColors[conversation.quality as keyof typeof qualityColors]}>
                {conversation.quality.toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {statusLabels[conversation.status as keyof typeof statusLabels]}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Iniciada em {formatDate(conversation.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Conversation Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conversa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Agente</p>
              <p className="font-semibold">{conversation.agent_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Score de Qualificação</p>
              <p className="font-semibold">{conversation.score}/100</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Mensagens</p>
              <p className="font-semibold">{conversation.messages.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-semibold">{statusLabels[conversation.status as keyof typeof statusLabels]}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="flex flex-col h-[600px]">
        <CardHeader>
          <CardTitle>Histórico de Mensagens</CardTitle>
          <CardDescription>Conversa com o agente de IA e equipe jurídica</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : message.role === 'admin'
                    ? 'bg-blue-500 text-white'
                    : 'bg-secondary'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.role === 'admin'
                      ? 'bg-blue-50 text-blue-900 border border-blue-200'
                      : 'bg-secondary'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(message.created_at)}
                  {message.role === 'admin' && ' • Equipe Jurídica'}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Digite sua mensagem..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="min-h-[60px] resize-none"
            />
            <Button
              onClick={handleSendMessage}
              disabled={sending || !userMessage.trim()}
              size="lg"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Pressione Enter para enviar, Shift+Enter para quebrar linha
          </p>
        </div>
      </Card>
    </div>
  )
}
