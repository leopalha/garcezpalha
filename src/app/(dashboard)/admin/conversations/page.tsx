/**
 * Admin Conversations Page
 * Human Handoff UI - Monitor and take over agent conversations
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MessageCircle,
  UserCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

interface Conversation {
  conversation_id: string
  channel: 'website' | 'whatsapp' | 'telegram' | 'email'
  client: {
    name?: string
    email?: string
    phone?: string
  }
  status: {
    state: string
    updated_at: string
    escalation_reason?: string
  }
  classification: {
    area: string
    agent_assigned: string
    confidence: number
  }
  qualification: {
    status: string
    score: number
    questions_answered: number
    total_questions: number
  }
  created_at: string
  last_message_at: string
}

export default function AdminConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [stateFilter, setStateFilter] = useState<string>('all')

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    filterConversations()
  }, [searchQuery, stateFilter, conversations])

  // Real-time subscription for conversation updates
  useEffect(() => {
    const { createClient } = require('@/lib/supabase/client')
    const supabase = createClient()

    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        (payload: { eventType: string; new: Conversation; old: Conversation }) => {
          console.log('[Real-time] Conversation changed:', payload)

          if (payload.eventType === 'INSERT') {
            setConversations((prev) => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setConversations((prev) =>
              prev.map((c) =>
                c.conversation_id === payload.new.conversation_id ? payload.new : c
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setConversations((prev) =>
              prev.filter((c) => c.conversation_id !== payload.old.conversation_id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadConversations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterConversations = () => {
    let filtered = conversations

    // Filter by state
    if (stateFilter !== 'all') {
      filtered = filtered.filter((c) => c.status.state === stateFilter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.conversation_id.toLowerCase().includes(query) ||
          c.client.name?.toLowerCase().includes(query) ||
          c.client.email?.toLowerCase().includes(query) ||
          c.client.phone?.includes(query)
      )
    }

    setFilteredConversations(filtered)
  }

  const getStateBadgeVariant = (state: string) => {
    if (['qualified', 'paid', 'completed'].includes(state)) return 'default'
    if (['escalated', 'rejected'].includes(state)) return 'destructive'
    if (['qualifying', 'identifying'].includes(state)) return 'secondary'
    return 'outline'
  }

  const getStateLabel = (state: string): string => {
    const labels: Record<string, string> = {
      greeting: 'Saudação',
      identifying: 'Identificando',
      classifying: 'Classificando',
      qualifying: 'Qualificando',
      qualified: 'Qualificado',
      rejected: 'Rejeitado',
      proposing: 'Proposta',
      objection_handling: 'Objeções',
      closing: 'Fechamento',
      payment_pending: 'Aguardando Pag.',
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

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return '💬'
      case 'telegram':
        return '✈️'
      case 'email':
        return '📧'
      default:
        return '🌐'
    }
  }

  const groupedByState = filteredConversations.reduce((acc, conv) => {
    const state = conv.status.state
    if (!acc[state]) {
      acc[state] = []
    }
    acc[state].push(conv)
    return acc
  }, {} as Record<string, Conversation[]>)

  const escalatedCount = conversations.filter((c) => c.status.state === 'escalated').length
  const activeCount = conversations.filter((c) =>
    ['qualifying', 'qualified', 'proposing', 'closing'].includes(c.status.state)
  ).length
  const completedCount = conversations.filter((c) =>
    ['paid', 'completed'].includes(c.status.state)
  ).length

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Conversas em Andamento</h1>
        <p className="text-slate-600">
          Monitore e assuma conversas gerenciadas pelos agentes autônomos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Escaladas</p>
              <p className="text-2xl font-bold text-orange-600">{escalatedCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Ativas</p>
              <p className="text-2xl font-bold text-blue-600">{activeCount}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pagas</p>
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total</p>
              <p className="text-2xl font-bold">{conversations.length}</p>
            </div>
            <UserCircle className="w-8 h-8 text-slate-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome, email, telefone ou ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            variant="outline"
            onClick={loadConversations}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" value={stateFilter} onValueChange={setStateFilter}>
        <TabsList>
          <TabsTrigger value="all">
            Todas ({conversations.length})
          </TabsTrigger>
          <TabsTrigger value="escalated">
            Escaladas ({escalatedCount})
          </TabsTrigger>
          <TabsTrigger value="qualifying">Qualificando</TabsTrigger>
          <TabsTrigger value="qualified">Qualificados</TabsTrigger>
          <TabsTrigger value="payment_pending">Aguardando Pag.</TabsTrigger>
          <TabsTrigger value="paid">Pagos</TabsTrigger>
        </TabsList>

        <TabsContent value={stateFilter} className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600">Carregando conversas...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-600">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConversations.map((conversation) => (
                <Card key={conversation.conversation_id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {getChannelIcon(conversation.channel)}
                        </span>
                        <div>
                          <h3 className="font-semibold">
                            {conversation.client.name || 'Cliente Anônimo'}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {conversation.client.email || conversation.client.phone || conversation.conversation_id}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant={getStateBadgeVariant(conversation.status.state)}>
                          {getStateLabel(conversation.status.state)}
                        </Badge>

                        <Badge variant="outline">
                          Score: {conversation.qualification.score}/100
                        </Badge>

                        <Badge variant="outline">
                          {conversation.classification.area || 'Não classificado'}
                        </Badge>

                        {conversation.status.escalation_reason && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {conversation.status.escalation_reason}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            Última msg: {new Date(conversation.last_message_at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div>
                          Perguntas: {conversation.qualification.questions_answered}/{conversation.qualification.total_questions}
                        </div>
                      </div>
                    </div>

                    <Link href={`/admin/conversations/${conversation.conversation_id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        Ver Conversa
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
