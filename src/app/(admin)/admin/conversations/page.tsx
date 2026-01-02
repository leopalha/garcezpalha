'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  User,
  Clock,
  AlertCircle,
  TrendingUp,
  Filter,
  Loader2,
  ChevronRight,
} from 'lucide-react'
import { ErrorAlert } from '@/components/ui/error-alert'
import { EmptyState } from '@/components/ui/empty-state'

interface Conversation {
  id: string
  lead_id: string
  lead_name: string
  lead_email: string
  state: string
  qualification_score: number
  last_message: string
  last_message_at: string
  created_at: string
  message_count: number
}

type FilterType = 'all' | 'hot' | 'warm' | 'cold' | 'escalated'

export default function ConversationsPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/conversations?limit=100')
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()

      // Map API response to component interface
      const mapped: Conversation[] = (data.conversations || []).map((conv: any) => ({
        id: conv.id,
        lead_id: conv.lead_id || conv.user_id,
        lead_name: conv.lead_name || conv.metadata?.name || 'Lead sem nome',
        lead_email: conv.lead_email || conv.metadata?.email || '',
        state: conv.status?.state || conv.state || 'identifying',
        qualification_score: conv.status?.qualification_score || conv.qualification_score || 0,
        last_message: conv.last_message || conv.metadata?.last_message || 'Sem mensagens',
        last_message_at: conv.last_message_at || conv.updated_at || new Date().toISOString(),
        created_at: conv.created_at || new Date().toISOString(),
        message_count: conv.message_count || 0,
      }))

      setConversations(mapped)
    } catch (err) {
      console.error('Error fetching conversations:', err)
      setError(err instanceof Error ? err : new Error('Erro ao carregar conversas'))
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    switch (filter) {
      case 'hot':
        return conv.qualification_score >= 80
      case 'warm':
        return conv.qualification_score >= 50 && conv.qualification_score < 80
      case 'cold':
        return conv.qualification_score < 50
      case 'escalated':
        return conv.state === 'escalated'
      default:
        return true
    }
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800 border-red-200'
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'HOT'
    if (score >= 50) return 'WARM'
    return 'COLD'
  }

  const getStateLabel = (state: string) => {
    const states: Record<string, { label: string; color: string }> = {
      greeting: { label: 'Saudação', color: 'bg-gray-100 text-gray-800' },
      identifying: { label: 'Identificando', color: 'bg-blue-100 text-blue-800' },
      classifying: { label: 'Classificando', color: 'bg-purple-100 text-purple-800' },
      qualified: { label: 'Qualificado', color: 'bg-green-100 text-green-800' },
      proposing: { label: 'Propondo', color: 'bg-indigo-100 text-indigo-800' },
      escalated: { label: 'AGUARDANDO HANDOFF', color: 'bg-red-100 text-red-800' },
      payment_pending: { label: 'Aguardando Pagto', color: 'bg-yellow-100 text-yellow-800' },
    }
    return states[state] || { label: state, color: 'bg-gray-100 text-gray-800' }
  }

  const formatTimeAgo = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    return `${diffDays}d atrás`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Conversas</h2>
        <p className="text-muted-foreground">
          Gerencie conversas em andamento e assuma leads qualificados
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{conversations.length}</div>
            <p className="text-xs text-muted-foreground">Total de Conversas</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-700">
              {conversations.filter((c) => c.state === 'escalated').length}
            </div>
            <p className="text-xs text-red-600 font-medium">Aguardando Handoff</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-700">
              {conversations.filter((c) => c.qualification_score >= 80).length}
            </div>
            <p className="text-xs text-orange-600 font-medium">Leads HOT (80+)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {conversations.filter((c) => c.qualification_score >= 50).length}
            </div>
            <p className="text-xs text-muted-foreground">Leads WARM (50+)</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <CardTitle className="text-base">Filtros</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchConversations}>
              <Loader2 className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas ({conversations.length})
            </Button>
            <Button
              variant={filter === 'escalated' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('escalated')}
              className={filter === 'escalated' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              <AlertCircle className="w-3 h-3 mr-1" />
              Escaladas ({conversations.filter((c) => c.state === 'escalated').length})
            </Button>
            <Button
              variant={filter === 'hot' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('hot')}
              className={filter === 'hot' ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              HOT 80+ ({conversations.filter((c) => c.qualification_score >= 80).length})
            </Button>
            <Button
              variant={filter === 'warm' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('warm')}
            >
              WARM 50-79 (
              {
                conversations.filter((c) => c.qualification_score >= 50 && c.qualification_score < 80)
                  .length
              }
              )
            </Button>
            <Button
              variant={filter === 'cold' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('cold')}
            >
              COLD {'<'}50 ({conversations.filter((c) => c.qualification_score < 50).length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <CardTitle>Conversas ({filteredConversations.length})</CardTitle>
          <CardDescription>Clique em uma conversa para assumir o atendimento</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <ErrorAlert
              error={error}
              retry={fetchConversations}
              title="Erro ao carregar conversas"
            />
          ) : filteredConversations.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="Nenhuma conversa encontrada"
              description={filter !== 'all' ?
                `Nenhuma conversa no estado "${filter}".` :
                "Não há conversas no momento. Elas aparecerão aqui quando clientes iniciarem conversas com o chatbot."
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredConversations.map((conv) => {
                const stateInfo = getStateLabel(conv.state)
                const isEscalated = conv.state === 'escalated'

                return (
                  <div
                    key={conv.id}
                    onClick={() => router.push(`/admin/conversations/${conv.id}`)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      isEscalated ? 'border-red-300 bg-red-50/50' : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{conv.lead_name}</p>
                            <Badge
                              variant="outline"
                              className={`${getScoreColor(conv.qualification_score)} text-xs font-bold`}
                            >
                              {getScoreLabel(conv.qualification_score)} {conv.qualification_score}
                            </Badge>
                            <Badge variant="outline" className={`${stateInfo.color} text-xs`}>
                              {stateInfo.label}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">{conv.lead_email}</p>

                          <div className="bg-white p-2 rounded border">
                            <p className="text-sm text-gray-700 line-clamp-2">{conv.last_message}</p>
                          </div>

                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(conv.last_message_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {conv.message_count} mensagens
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {isEscalated && (
                          <Button size="sm" variant="destructive">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Assumir Agora
                          </Button>
                        )}
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
