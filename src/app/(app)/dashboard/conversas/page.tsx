'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MessageSquare,
  Search,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  TrendingUp,
  Zap,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type ConversationStatus = 'active' | 'waiting' | 'resolved' | 'escalated'
type ConversationQuality = 'hot' | 'warm' | 'cold'

interface Conversation {
  id: string
  leadName: string
  leadEmail: string
  product: string
  status: ConversationStatus
  quality: ConversationQuality
  score: number
  messageCount: number
  lastMessage: string
  lastMessageAt: string
  createdAt: string
  agentType: string
  needsAttention: boolean
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    leadName: 'Maria Silva',
    leadEmail: 'maria@email.com',
    product: 'Usucapião Extraordinária',
    status: 'escalated',
    quality: 'hot',
    score: 92,
    messageCount: 12,
    lastMessage: 'Sim, eu tenho todos os documentos necessários. Quando podemos agendar?',
    lastMessageAt: '2024-01-15T14:30:00',
    createdAt: '2024-01-15T10:00:00',
    agentType: 'Imobiliário',
    needsAttention: true,
  },
  {
    id: '2',
    leadName: 'João Pedro',
    leadEmail: 'joao@email.com',
    product: 'Desbloqueio de Conta',
    status: 'active',
    quality: 'warm',
    score: 68,
    messageCount: 8,
    lastMessage: 'Quanto tempo leva esse processo?',
    lastMessageAt: '2024-01-15T13:15:00',
    createdAt: '2024-01-15T09:30:00',
    agentType: 'Bancário',
    needsAttention: false,
  },
  {
    id: '3',
    leadName: 'Ana Costa',
    leadEmail: 'ana@email.com',
    product: 'Plano de Saúde Negado',
    status: 'waiting',
    quality: 'hot',
    score: 85,
    messageCount: 15,
    lastMessage: 'Preciso verificar com meu médico, retorno amanhã.',
    lastMessageAt: '2024-01-15T12:00:00',
    createdAt: '2024-01-14T16:00:00',
    agentType: 'Saúde',
    needsAttention: true,
  },
  {
    id: '4',
    leadName: 'Carlos Mendes',
    leadEmail: 'carlos@email.com',
    product: 'Defesa Criminal',
    status: 'active',
    quality: 'warm',
    score: 72,
    messageCount: 6,
    lastMessage: 'Entendi, vou enviar os detalhes do caso.',
    lastMessageAt: '2024-01-15T11:45:00',
    createdAt: '2024-01-15T08:00:00',
    agentType: 'Criminal',
    needsAttention: false,
  },
  {
    id: '5',
    leadName: 'Patrícia Fernandes',
    leadEmail: 'patricia@email.com',
    product: 'Usucapião Extraordinária',
    status: 'resolved',
    quality: 'hot',
    score: 95,
    messageCount: 18,
    lastMessage: 'Perfeito! Vou fazer o pagamento agora.',
    lastMessageAt: '2024-01-14T17:30:00',
    createdAt: '2024-01-13T14:00:00',
    agentType: 'Imobiliário',
    needsAttention: false,
  },
  {
    id: '6',
    leadName: 'Roberto Almeida',
    leadEmail: 'roberto@email.com',
    product: 'Desbloqueio de Conta',
    status: 'active',
    quality: 'cold',
    score: 42,
    messageCount: 3,
    lastMessage: 'Estou pensando ainda...',
    lastMessageAt: '2024-01-15T10:00:00',
    createdAt: '2024-01-15T09:00:00',
    agentType: 'Bancário',
    needsAttention: false,
  },
]

const statusConfig: Record<
  ConversationStatus,
  { label: string; color: string; bgColor: string; icon: React.ElementType }
> = {
  active: {
    label: 'Ativa',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: MessageSquare,
  },
  waiting: {
    label: 'Aguardando',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: Clock,
  },
  resolved: {
    label: 'Resolvida',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: CheckCircle,
  },
  escalated: {
    label: 'Escalada',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: AlertCircle,
  },
}

const qualityConfig: Record<ConversationQuality, { label: string; color: string }> = {
  hot: { label: 'HOT', color: 'bg-red-500' },
  warm: { label: 'WARM', color: 'bg-yellow-500' },
  cold: { label: 'COLD', color: 'bg-blue-500' },
}

export default function ConversasPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [qualityFilter, setQualityFilter] = useState<string>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const stats = {
    total: conversations.length,
    active: conversations.filter((c) => c.status === 'active').length,
    escalated: conversations.filter((c) => c.status === 'escalated').length,
    avgScore: (
      conversations.reduce((acc, c) => acc + c.score, 0) / conversations.length
    ).toFixed(0),
    needsAttention: conversations.filter((c) => c.needsAttention).length,
  }

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.leadEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.product.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || conversation.status === statusFilter
    const matchesQuality = qualityFilter === 'all' || conversation.quality === qualityFilter

    return matchesSearch && matchesStatus && matchesQuality
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes} min atrás`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            Conversas com IA
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe as conversas do seu Agent IA com leads
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
          <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Zap className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Escaladas</p>
                <p className="text-2xl font-bold">{stats.escalated}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score Médio</p>
                <p className="text-2xl font-bold">{stats.avgScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Necessita Atenção</p>
                <p className="text-2xl font-bold">{stats.needsAttention}</p>
              </div>
              <Sparkles className="h-8 w-8 text-yellow-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou produto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="waiting">Aguardando</SelectItem>
                <SelectItem value="resolved">Resolvidas</SelectItem>
                <SelectItem value="escalated">Escaladas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Qualidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Qualidades</SelectItem>
                <SelectItem value="hot">HOT</SelectItem>
                <SelectItem value="warm">WARM</SelectItem>
                <SelectItem value="cold">COLD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <div className="space-y-4">
        {filteredConversations.map((conversation) => {
          const StatusIcon = statusConfig[conversation.status].icon
          return (
            <Card
              key={conversation.id}
              className={cn(
                'hover:shadow-md transition-shadow',
                conversation.needsAttention && 'border-l-4 border-l-yellow-500'
              )}
            >
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Lead Info - 4 cols */}
                  <div className="lg:col-span-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{conversation.leadName}</h3>
                          {conversation.needsAttention && (
                            <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-300">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Atenção
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{conversation.leadEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs',
                          statusConfig[conversation.status].bgColor,
                          statusConfig[conversation.status].color
                        )}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[conversation.status].label}
                      </Badge>
                      <Badge
                        className={cn(
                          'text-xs text-white',
                          qualityConfig[conversation.quality].color
                        )}
                      >
                        {qualityConfig[conversation.quality].label}
                      </Badge>
                    </div>
                  </div>

                  {/* Product & Agent - 3 cols */}
                  <div className="lg:col-span-3 space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Produto</p>
                      <p className="font-medium text-sm">{conversation.product}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Agent IA</p>
                      <p className="text-sm flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-primary" />
                        {conversation.agentType}
                      </p>
                    </div>
                  </div>

                  {/* Last Message - 3 cols */}
                  <div className="lg:col-span-3 space-y-1">
                    <p className="text-xs text-muted-foreground">Última Mensagem</p>
                    <p className="text-sm line-clamp-2">{conversation.lastMessage}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(conversation.lastMessageAt)}
                    </p>
                  </div>

                  {/* Stats & Actions - 2 cols */}
                  <div className="lg:col-span-2 flex flex-col items-end justify-between gap-2">
                    <div className="text-right space-y-1">
                      <p className="text-xs text-muted-foreground">Score</p>
                      <p className={cn('text-2xl font-bold', getScoreColor(conversation.score))}>
                        {conversation.score}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {conversation.messageCount} mensagens
                      </p>
                    </div>

                    <Button size="sm" asChild>
                      <Link href={`/app/dashboard/conversas/${conversation.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Chat
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredConversations.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma conversa encontrada</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tente ajustar os filtros ou aguarde novos leads
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Como funciona o Agent IA?
              </p>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Conversas com score ≥ 80% são automaticamente escaladas para você</li>
                <li>• Leads HOT (vermelho) têm alta probabilidade de conversão</li>
                <li>• Você pode assumir qualquer conversa manualmente a qualquer momento</li>
                <li>• O Agent aprende com cada interação para melhorar continuamente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
