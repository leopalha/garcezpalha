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
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'admin'
  content: string
  created_at: string
}

interface Conversation {
  id: string
  lead_id: string
  lead_name: string
  lead_email: string
  lead_phone: string
  state: string
  qualification_score: number
  messages: Message[]
  created_at: string
}

export default function ConversationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminMessage, setAdminMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [hasAssumed, setHasAssumed] = useState(false)

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
      // Fetch conversation details
      const convRes = await fetch(`/api/admin/conversations/${conversationId}`)
      if (!convRes.ok) throw new Error('Failed to fetch conversation')

      const convData = await convRes.json()

      // Fetch messages
      const msgRes = await fetch(`/api/admin/conversations/${conversationId}/messages`)
      if (!msgRes.ok) throw new Error('Failed to fetch messages')

      const msgData = await msgRes.json()

      // Build conversation object
      const conv: Conversation = {
        id: conversationId,
        lead_id: convData.conversation?.lead_id || convData.conversation?.user_id || '',
        lead_name: convData.conversation?.lead_name || convData.conversation?.metadata?.name || 'Lead sem nome',
        lead_email: convData.conversation?.lead_email || convData.conversation?.metadata?.email || '',
        lead_phone: convData.conversation?.lead_phone || convData.conversation?.metadata?.phone || '',
        state: convData.conversation?.status?.state || convData.conversation?.state || 'identifying',
        qualification_score: convData.conversation?.status?.qualification_score || convData.conversation?.qualification_score || 0,
        created_at: convData.conversation?.created_at || new Date().toISOString(),
        messages: msgData.messages || [],
      }

      setConversation(conv)

      // Check if already assumed
      if (conv.state === 'admin_active') {
        setHasAssumed(true)
      }
    } catch (error) {
      console.error('Error fetching conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssumeConversation = async () => {
    try {
      const res = await fetch(`/api/admin/conversations/${conversationId}/takeover`, {
        method: 'POST',
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to assume conversation')
      }

      setHasAssumed(true)
      await fetchConversation() // Refresh to show system message
    } catch (error) {
      console.error('Error assuming conversation:', error)
      alert('Erro ao assumir conversa. Tente novamente.')
    }
  }

  const handleSendMessage = async () => {
    if (!adminMessage.trim() || !conversation) return

    setSending(true)
    try {
      const res = await fetch(`/api/admin/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: adminMessage,
          humanTakeover: true,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to send message')
      }

      // Clear input and refresh messages
      setAdminMessage('')
      await fetchConversation()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setSending(false)
    }
  }

  const handleFinishHandoff = async () => {
    try {
      // Update conversation back to agent_active
      const res = await fetch(`/api/admin/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: { state: 'agent_active' },
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to finish handoff')
      }

      alert('Handoff finalizado! Conversa retornou para o agente.')
      router.push('/admin/conversations')
    } catch (error) {
      console.error('Error finishing handoff:', error)
      alert('Erro ao finalizar handoff. Tente novamente.')
    }
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
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
            <Button onClick={() => router.push('/admin/conversations')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Conversas
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isEscalated = conversation.state === 'escalated'

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/conversations')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{conversation.lead_name}</h1>
              <Badge
                variant="outline"
                className={
                  conversation.qualification_score >= 80
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                }
              >
                SCORE: {conversation.qualification_score}
              </Badge>
              {isEscalated && (
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  AGUARDANDO HANDOFF
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span>{conversation.lead_email}</span>
              <span>•</span>
              <span>{conversation.lead_phone}</span>
            </div>
          </div>
        </div>

        {isEscalated && !hasAssumed && (
          <Button size="lg" onClick={handleAssumeConversation} variant="destructive">
            <AlertCircle className="w-5 h-5 mr-2" />
            Assumir Conversa
          </Button>
        )}

        {hasAssumed && (
          <Button size="lg" onClick={handleFinishHandoff} variant="outline">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Finalizar Handoff
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[calc(100vh-250px)]">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Conversa</CardTitle>
                {hasAssumed && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Você assumiu esta conversa
                  </Badge>
                )}
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversation.messages.map((message) => {
                const isUser = message.role === 'user'
                const isAdmin = message.role === 'admin'
                const isBot = message.role === 'assistant'

                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isUser
                          ? 'bg-primary text-white'
                          : isAdmin
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isUser ? (
                        <User className="w-4 h-4" />
                      ) : isAdmin ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isUser
                            ? 'bg-primary text-white'
                            : isAdmin
                              ? 'bg-green-100 border border-green-200'
                              : 'bg-gray-100'
                        }`}
                      >
                        {isAdmin && (
                          <p className="text-xs font-semibold text-green-700 mb-1">
                            Você (Admin)
                          </p>
                        )}
                        {isBot && (
                          <p className="text-xs font-semibold text-gray-600 mb-1">Assistente IA</p>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isUser ? 'text-white/70' : 'text-muted-foreground'
                          }`}
                        >
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            {hasAssumed && (
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={adminMessage}
                    onChange={(e) => setAdminMessage(e.target.value)}
                    placeholder="Digite sua mensagem para o cliente..."
                    rows={3}
                    className="resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sending || !adminMessage.trim()}
                    size="lg"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Pressione Enter para enviar, Shift+Enter para nova linha
                </p>
              </div>
            )}

            {!hasAssumed && isEscalated && (
              <div className="border-t p-4 bg-red-50">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">
                    Clique em "Assumir Conversa" no canto superior direito para responder ao
                    cliente
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right - Conversation Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conversa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  {conversation.state.toUpperCase()}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Score de Qualificação</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full"
                      style={{ width: `${conversation.qualification_score}%` }}
                    />
                  </div>
                  <span className="font-bold text-lg">{conversation.qualification_score}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Mensagens</p>
                <p className="font-medium">{conversation.messages.length}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Iniciada em</p>
                <p className="font-medium">
                  {new Date(conversation.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Avaliar urgência e complexidade do caso</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Solicitar documentos necessários</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Agendar consulta presencial/online</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Enviar proposta comercial</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
