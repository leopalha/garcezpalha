'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  UserPlus,
  Eye,
  MessageSquare,
  FileText,
  MoreVertical,
  Star,
  ArrowUpDown,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type ClientStatus = 'lead' | 'qualified' | 'proposal_sent' | 'converted' | 'lost'
type ClientSource = 'landing_page' | 'whatsapp' | 'instagram' | 'facebook' | 'google' | 'referral'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: ClientStatus
  source: ClientSource
  product: string
  productId: string
  score: number
  lastContact: string
  createdAt: string
  conversationCount: number
  proposalSent: boolean
  estimatedValue: number
  tags: string[]
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Maria Silva Santos',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    status: 'qualified',
    source: 'landing_page',
    product: 'Usucapião Extraordinária',
    productId: '1',
    score: 85,
    lastContact: '2024-01-15T10:30:00',
    createdAt: '2024-01-10T08:00:00',
    conversationCount: 5,
    proposalSent: false,
    estimatedValue: 3500,
    tags: ['Urgente', 'Documentação Completa'],
  },
  {
    id: '2',
    name: 'João Pedro Oliveira',
    email: 'joao.oliveira@email.com',
    phone: '(11) 97654-3210',
    status: 'proposal_sent',
    source: 'whatsapp',
    product: 'Desbloqueio de Conta Bancária',
    productId: '2',
    score: 92,
    lastContact: '2024-01-14T16:45:00',
    createdAt: '2024-01-08T14:20:00',
    conversationCount: 8,
    proposalSent: true,
    estimatedValue: 1500,
    tags: ['Hot Lead', 'Responde Rápido'],
  },
  {
    id: '3',
    name: 'Ana Paula Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 96543-2109',
    status: 'converted',
    source: 'instagram',
    product: 'Plano de Saúde Negado',
    productId: '3',
    score: 98,
    lastContact: '2024-01-13T09:15:00',
    createdAt: '2024-01-05T11:30:00',
    conversationCount: 12,
    proposalSent: true,
    estimatedValue: 2500,
    tags: ['Cliente Ativo'],
  },
  {
    id: '4',
    name: 'Carlos Eduardo Mendes',
    email: 'carlos.mendes@email.com',
    phone: '(11) 95432-1098',
    status: 'lead',
    source: 'google',
    product: 'Defesa Criminal',
    productId: '4',
    score: 45,
    lastContact: '2024-01-12T14:00:00',
    createdAt: '2024-01-12T13:45:00',
    conversationCount: 1,
    proposalSent: false,
    estimatedValue: 5000,
    tags: ['Novo'],
  },
  {
    id: '5',
    name: 'Patrícia Fernandes',
    email: 'patricia.f@email.com',
    phone: '(11) 94321-0987',
    status: 'qualified',
    source: 'facebook',
    product: 'Usucapião Extraordinária',
    productId: '1',
    score: 78,
    lastContact: '2024-01-11T11:20:00',
    createdAt: '2024-01-07T09:00:00',
    conversationCount: 4,
    proposalSent: false,
    estimatedValue: 3500,
    tags: ['Documentação Pendente'],
  },
  {
    id: '6',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@email.com',
    phone: '(11) 93210-9876',
    status: 'lost',
    source: 'landing_page',
    product: 'Desbloqueio de Conta Bancária',
    productId: '2',
    score: 35,
    lastContact: '2024-01-10T15:30:00',
    createdAt: '2024-01-04T10:15:00',
    conversationCount: 2,
    proposalSent: true,
    estimatedValue: 1500,
    tags: ['Preço Alto'],
  },
  {
    id: '7',
    name: 'Juliana Rodrigues',
    email: 'juliana.r@email.com',
    phone: '(11) 92109-8765',
    status: 'qualified',
    source: 'referral',
    product: 'Plano de Saúde Negado',
    productId: '3',
    score: 88,
    lastContact: '2024-01-15T08:45:00',
    createdAt: '2024-01-09T16:00:00',
    conversationCount: 6,
    proposalSent: false,
    estimatedValue: 2500,
    tags: ['Indicação', 'Confiável'],
  },
  {
    id: '8',
    name: 'Fernando Santos',
    email: 'fernando.santos@email.com',
    phone: '(11) 91098-7654',
    status: 'proposal_sent',
    source: 'whatsapp',
    product: 'Defesa Criminal',
    productId: '4',
    score: 72,
    lastContact: '2024-01-14T12:00:00',
    createdAt: '2024-01-06T14:30:00',
    conversationCount: 7,
    proposalSent: true,
    estimatedValue: 5000,
    tags: ['Urgente', 'Aguardando Resposta'],
  },
]

const statusConfig: Record<
  ClientStatus,
  { label: string; color: string; bgColor: string }
> = {
  lead: { label: 'Novo Lead', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  qualified: { label: 'Qualificado', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  proposal_sent: { label: 'Proposta Enviada', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  converted: { label: 'Convertido', color: 'text-green-700', bgColor: 'bg-green-100' },
  lost: { label: 'Perdido', color: 'text-red-700', bgColor: 'bg-red-100' },
}

const sourceConfig: Record<ClientSource, { label: string; icon: string }> = {
  landing_page: { label: 'Landing Page', icon: '🌐' },
  whatsapp: { label: 'WhatsApp', icon: '💬' },
  instagram: { label: 'Instagram', icon: '📸' },
  facebook: { label: 'Facebook', icon: '👥' },
  google: { label: 'Google', icon: '🔍' },
  referral: { label: 'Indicação', icon: '👋' },
}

export default function ClientesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [productFilter, setProductFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'score' | 'value'>('recent')

  // Calculate stats
  const stats = {
    total: mockClients.length,
    newLeads: mockClients.filter((c) => c.status === 'lead').length,
    qualified: mockClients.filter((c) => c.status === 'qualified').length,
    converted: mockClients.filter((c) => c.status === 'converted').length,
    conversionRate: (
      (mockClients.filter((c) => c.status === 'converted').length / mockClients.length) *
      100
    ).toFixed(1),
    avgScore: (
      mockClients.reduce((acc, c) => acc + c.score, 0) / mockClients.length
    ).toFixed(0),
    totalValue: mockClients
      .filter((c) => c.status === 'converted')
      .reduce((acc, c) => acc + c.estimatedValue, 0),
  }

  // Filter and sort clients
  const filteredClients = mockClients
    .filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery)
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter
      const matchesSource = sourceFilter === 'all' || client.source === sourceFilter
      const matchesProduct = productFilter === 'all' || client.productId === productFilter

      return matchesSearch && matchesStatus && matchesSource && matchesProduct
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score
      if (sortBy === 'value') return b.estimatedValue - a.estimatedValue
      return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime()
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    } else if (diffInHours < 48) {
      return `Ontem às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes & Leads</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os seus leads e clientes em um só lugar
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Manualmente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="text-xs">
                {stats.newLeads} novos hoje
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Qualificados</p>
                <p className="text-3xl font-bold mt-1">{stats.qualified}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Score médio: {stats.avgScore}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                <p className="text-3xl font-bold mt-1">{stats.conversionRate}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{stats.converted} clientes fechados</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Gerada</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(stats.totalValue)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>De clientes convertidos</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="lead">Novo Lead</SelectItem>
                <SelectItem value="qualified">Qualificado</SelectItem>
                <SelectItem value="proposal_sent">Proposta Enviada</SelectItem>
                <SelectItem value="converted">Convertido</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Origens</SelectItem>
                <SelectItem value="landing_page">Landing Page</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="referral">Indicação</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais Recente</SelectItem>
                <SelectItem value="score">Maior Score</SelectItem>
                <SelectItem value="value">Maior Valor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {filteredClients.length} {filteredClients.length === 1 ? 'Cliente' : 'Clientes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Client Info - 4 cols */}
                    <div className="lg:col-span-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{client.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className={cn(
                                'text-xs',
                                statusConfig[client.status].bgColor,
                                statusConfig[client.status].color
                              )}
                            >
                              {statusConfig[client.status].label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {sourceConfig[client.source].icon} {sourceConfig[client.source].label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span>{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{client.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Product & Tags - 3 cols */}
                    <div className="lg:col-span-3 space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Produto</p>
                        <p className="font-medium text-sm">{client.product}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {client.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Metrics - 3 cols */}
                    <div className="lg:col-span-3 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Score</p>
                        <p className={cn('text-2xl font-bold', getScoreColor(client.score))}>
                          {client.score}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Valor Estimado</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(client.estimatedValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Conversas</p>
                        <p className="text-sm font-medium">{client.conversationCount}x</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Último Contato</p>
                        <p className="text-sm font-medium">{formatDate(client.lastContact)}</p>
                      </div>
                    </div>

                    {/* Actions - 2 cols */}
                    <div className="lg:col-span-2 flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Enviar Proposta
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Ligar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Marcar como Perdido
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum cliente encontrado</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tente ajustar os filtros ou adicionar um novo cliente
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
