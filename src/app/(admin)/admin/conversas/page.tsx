'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Search,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Send,
  AlertTriangle,
  User,
  Bot,
  UserCog,
} from 'lucide-react'

// Types from Supabase schema
type ConversationState =
  | 'greeting'
  | 'identifying'
  | 'classifying'
  | 'qualifying'
  | 'qualified'
  | 'rejected'
  | 'proposing'
  | 'payment_pending'
  | 'paid'
  | 'contract_pending'
  | 'onboarding'
  | 'active_case'
  | 'escalated'
  | 'abandoned'

type Conversation = {
  conversation_id: string
  channel: 'whatsapp' | 'telegram' | 'website'
  status: {
    state: ConversationState
    updated_at: string
    escalation_reason?: string
  }
  lead: {
    full_name: string
    email: string
    phone: string
  }
  classification?: {
    area: string
    product: string
  }
  qualification?: {
    score: number
    status: string
  }
  metadata?: {
    human_takeover?: boolean
    taken_over_at?: string
    taken_over_by?: string
  }
  last_message_at: string
  created_at: string
}

const channelConfig = {
  whatsapp: { label: 'WhatsApp', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
  telegram: { label: 'Telegram', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100' },
  website: { label: 'Website', color: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100' },
}

const stateConfig: Record<ConversationState, { label: string; color: string; icon: any; priority: number }> = {
  escalated: { label: 'Escalada (Atenção!)', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle, priority: 1 },
  qualified: { label: 'Qualificada', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2, priority: 2 },
  payment_pending: { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, priority: 3 },
  contract_pending: { label: 'Aguardando Contrato', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock, priority: 4 },
  onboarding: { label: 'Onboarding', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: User, priority: 5 },
  active_case: { label: 'Caso Ativo', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2, priority: 6 },
  qualifying: { label: 'Qualificando', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Bot, priority: 7 },
  proposing: { label: 'Proposta Enviada', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Mail, priority: 8 },
  paid: { label: 'Pago', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2, priority: 9 },
  rejected: { label: 'Rejeitada', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, priority: 10 },
  abandoned: { label: 'Abandonada', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle, priority: 11 },
  greeting: { label: 'Saudação', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: Bot, priority: 12 },
  identifying: { label: 'Identificando', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: Bot, priority: 13 },
  classifying: { label: 'Classificando', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: Bot, priority: 14 },
}

export default function ConversasPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [stateFilter, setStateFilter] = useState<string>('all')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isTakingOver, setIsTakingOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch conversations
  useEffect(() => {
    fetchConversations()
  }, [stateFilter])

  const fetchConversations = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (stateFilter !== 'all') {
        params.append('state', stateFilter)
      }
      params.append('limit', '100')

      const response = await fetch(`/api/admin/conversations?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }

      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (err) {
      console.error('Error fetching conversations:', err)
      setError(err instanceof Error ? err.message : 'Failed to load conversations')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTakeover = async (conversationId: string) => {
    try {
      setIsTakingOver(true)
      setError(null)

      const response = await fetch(`/api/admin/conversations/${conversationId}/takeover`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to take over conversation')
      }

      // Refresh conversations
      await fetchConversations()

      // Update selected conversation
      if (selectedConversation?.conversation_id === conversationId) {
        const updated = conversations.find((c) => c.conversation_id === conversationId)
        if (updated) {
          setSelectedConversation(updated)
        }
      }

      alert('Conversa assumida com sucesso! Agora você pode responder manualmente.')
    } catch (err) {
      console.error('Error taking over conversation:', err)
      setError(err instanceof Error ? err.message : 'Failed to take over conversation')
    } finally {
      setIsTakingOver(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return

    try {
      // TODO: Implement send message via API
      console.log('Sending message:', messageText)
      setMessageText('')

      // In production, call /api/admin/conversations/[id]/messages
    } catch (err) {
      console.error('Error sending message:', err)
      setError(err instanceof Error ? err.message : 'Failed to send message')
    }
  }

  const filteredConversations = conversations
    .filter((conv) => {
      const matchesSearch =
        conv.lead.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.classification?.product?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSearch
    })
    .sort((a, b) => {
      // Sort by priority (escalated first)
      const aPriority = stateConfig[a.status.state]?.priority || 99
      const bPriority = stateConfig[b.status.state]?.priority || 99

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      // Then by last message time
      return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    })

  // Count conversations by state
  const stateCounts = {
    escalated: conversations.filter((c) => c.status.state === 'escalated').length,
    qualified: conversations.filter((c) => c.status.state === 'qualified').length,
    active: conversations.filter((c) => ['payment_pending', 'contract_pending', 'onboarding', 'active_case'].includes(c.status.state)).length,
    total: conversations.length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Conversas</h2>
          <p className="text-muted-foreground">
            Gerencie conversas escaladas e assumidas manualmente
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchConversations} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow border-red-200 bg-red-50/50"
          onClick={() => setStateFilter('escalated')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{stateCounts.escalated}</div>
                <p className="text-xs text-red-700 font-medium">Escaladas (Urgente)</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setStateFilter('qualified')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stateCounts.qualified}</div>
                <p className="text-xs text-muted-foreground">Qualificadas</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStateFilter('all')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stateCounts.active}</div>
                <p className="text-xs text-muted-foreground">Ativas (Fluxo)</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStateFilter('all')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stateCounts.total}</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou produto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">Todos os Estados</option>
              <option value="escalated">⚠️ Escaladas (Urgente)</option>
              <option value="qualified">✅ Qualificadas</option>
              <option value="payment_pending">⏰ Aguardando Pagamento</option>
              <option value="onboarding">👤 Onboarding</option>
              <option value="active_case">📁 Casos Ativos</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Conversas ({filteredConversations.length})</CardTitle>
              <CardDescription>Clique para ver detalhes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.conversation_id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedConversation?.conversation_id === conv.conversation_id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted'
                      } ${conv.status.state === 'escalated' ? 'border-red-300 bg-red-50/30' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{conv.lead.full_name || 'Lead sem nome'}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(conv.last_message_at).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {conv.status.state === 'escalated' && (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Badge
                          className={`${stateConfig[conv.status.state]?.color || 'bg-gray-100 text-gray-800'}`}
                        >
                          {stateConfig[conv.status.state]?.label || conv.status.state}
                        </Badge>

                        {conv.classification?.product && (
                          <p className="text-sm text-muted-foreground">
                            {conv.classification.product}
                          </p>
                        )}

                        {conv.qualification?.score !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            Score: {conv.qualification.score}/100
                          </p>
                        )}

                        <span className={`inline-block px-2 py-0.5 rounded text-xs ${channelConfig[conv.channel].color}`}>
                          {channelConfig[conv.channel].label}
                        </span>

                        {conv.metadata?.human_takeover && (
                          <Badge variant="outline" className="text-xs">
                            <UserCog className="h-3 w-3 mr-1" />
                            Assumida
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredConversations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma conversa encontrada</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Conversation Detail */}
        <div className="lg:col-span-2">
          <Card className="h-[700px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle>
                    {selectedConversation ? selectedConversation.lead.full_name || 'Lead sem nome' : 'Selecione uma conversa'}
                  </CardTitle>
                  <CardDescription>
                    {selectedConversation && (
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge className={stateConfig[selectedConversation.status.state]?.color}>
                          {stateConfig[selectedConversation.status.state]?.label}
                        </Badge>
                        <span className={`px-2 py-0.5 rounded text-xs ${channelConfig[selectedConversation.channel].color}`}>
                          {channelConfig[selectedConversation.channel].label}
                        </span>
                        <span className="text-xs">{selectedConversation.lead.email}</span>
                        {selectedConversation.metadata?.human_takeover && (
                          <Badge variant="outline">
                            <UserCog className="h-3 w-3 mr-1" />
                            Assumida em{' '}
                            {new Date(selectedConversation.metadata.taken_over_at || '').toLocaleString('pt-BR')}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardDescription>
                </div>
                {selectedConversation && (
                  <div className="flex gap-2">
                    {!selectedConversation.metadata?.human_takeover && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleTakeover(selectedConversation.conversation_id)}
                        disabled={isTakingOver}
                      >
                        {isTakingOver ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Assumindo...
                          </>
                        ) : (
                          <>
                            <UserCog className="h-4 w-4 mr-2" />
                            Assumir Conversa
                          </>
                        )}
                      </Button>
                    )}
                    <Button variant="outline" size="sm" disabled>
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Info Section */}
                  {selectedConversation.status.state === 'escalated' && (
                    <Alert className="mb-4 border-red-300 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Conversa Escalada:</strong>{' '}
                        {selectedConversation.status.escalation_reason ||
                          'Esta conversa precisa de atenção manual'}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Conversation Details */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Produto</p>
                      <p className="text-sm font-medium">
                        {selectedConversation.classification?.product || 'Não classificado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Score</p>
                      <p className="text-sm font-medium">
                        {selectedConversation.qualification?.score || 'N/A'}/100
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Telefone</p>
                      <p className="text-sm font-medium">{selectedConversation.lead.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Criada em</p>
                      <p className="text-sm font-medium">
                        {new Date(selectedConversation.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center text-sm text-muted-foreground py-4">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Histórico de mensagens será carregado aqui</p>
                      <p className="text-xs mt-1">Em desenvolvimento</p>
                    </div>
                  </div>

                  {/* Message Input */}
                  {selectedConversation.metadata?.human_takeover ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Alert>
                      <Bot className="h-4 w-4" />
                      <AlertDescription>
                        Esta conversa está sendo gerenciada pelo agente IA. Clique em "Assumir Conversa" para responder
                        manualmente.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecione uma conversa para visualizar</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
