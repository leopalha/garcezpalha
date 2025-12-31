'use client'

import { useState, useEffect } from 'react'
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
  Loader2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

type ClientStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
type ClientSource = 'landing_page' | 'whatsapp' | 'instagram' | 'facebook' | 'google' | 'referral' | 'unknown'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: ClientStatus
  source: ClientSource
  product: string
  score: number
  conversationsCount: number
  totalValue: number
  lastContact: string
  createdAt: string
}

interface ClientStats {
  total: number
  qualified: number
  converted: number
  conversionRate: number
  totalRevenue: number
}


const statusConfig: Record<
  ClientStatus,
  { label: string; color: string; bgColor: string }
> = {
  new: { label: 'Novo Lead', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  contacted: { label: 'Contatado', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  qualified: { label: 'Qualificado', color: 'text-purple-700', bgColor: 'bg-purple-100' },
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
  unknown: { label: 'Desconhecido', icon: '❓' },
}

export default function ClientesPage() {
  const { toast } = useToast()
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState<ClientStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'score' | 'value'>('recent')

  useEffect(() => {
    fetchClients()
  }, [statusFilter, sourceFilter, searchQuery])

  async function fetchClients() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (sourceFilter !== 'all') params.append('source', sourceFilter)
      if (searchQuery) params.append('search', searchQuery)

      const res = await fetch(`/api/app/clients?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch clients')

      const data = await res.json()
      setClients(data.clients || [])
      setStats(data.stats || null)
    } catch (error) {
      console.error('Error fetching clients:', error)
      toast({
        title: 'Erro ao carregar clientes',
        description: 'Não foi possível carregar a lista de clientes.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Client-side sort
  const filteredClients = [...clients].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score
    if (sortBy === 'value') return b.totalValue - a.totalValue
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
                <p className="text-3xl font-bold mt-1">{loading ? '...' : stats?.total || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="text-xs">
                {clients.length} carregados
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Qualificados</p>
                <p className="text-3xl font-bold mt-1">{loading ? '...' : stats?.qualified || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Aguardando proposta</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                <p className="text-3xl font-bold mt-1">{loading ? '...' : `${stats?.conversionRate || 0}%`}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{stats?.converted || 0} clientes fechados</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Gerada</p>
                <p className="text-3xl font-bold mt-1">{loading ? '...' : formatCurrency(stats?.totalRevenue || 0)}</p>
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
                <SelectItem value="new">Novo Lead</SelectItem>
                <SelectItem value="contacted">Contatado</SelectItem>
                <SelectItem value="qualified">Qualificado</SelectItem>
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
            {loading ? 'Carregando...' : `${filteredClients.length} ${filteredClients.length === 1 ? 'Cliente' : 'Clientes'}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
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

                    {/* Product - 3 cols */}
                    <div className="lg:col-span-3 space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Produto</p>
                        <p className="font-medium text-sm">{client.product || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Criado em</p>
                        <p className="text-sm">
                          {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                        </p>
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
                        <p className="text-xs text-muted-foreground">Valor Total</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(client.totalValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Conversas</p>
                        <p className="text-sm font-medium">{client.conversationsCount}x</p>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
