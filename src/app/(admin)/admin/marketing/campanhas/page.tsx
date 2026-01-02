'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Mail,
  Plus,
  Search,
  Play,
  Pause,
  Copy,
  Edit,
  Trash2,
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'

interface Campaign {
  id: string
  name: string
  description: string
  type: 'email_sequence' | 'one_time' | 'ab_test'
  status: 'draft' | 'active' | 'paused' | 'completed'
  stats: {
    subscribers: number
    sent: number
    opened: number
    clicked: number
    converted: number
    openRate: number
    clickRate: number
    conversionRate: number
  }
  schedule: {
    startDate: string
    endDate?: string
  }
  created_at: string
  updated_at: string
}

const statusConfig = {
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Edit },
  active: { label: 'Ativa', color: 'bg-green-100 text-green-700 border-green-200', icon: Play },
  paused: { label: 'Pausada', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Pause },
  completed: { label: 'Finalizada', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2 },
}

const typeConfig = {
  email_sequence: { label: 'Sequência', icon: Mail },
  one_time: { label: 'Envio Único', icon: Mail },
  ab_test: { label: 'Teste A/B', icon: BarChart3 },
}

export default function CampanhasPage() {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | Campaign['status']>('all')

  useEffect(() => {
    fetchCampaigns()
  }, [])

  async function fetchCampaigns() {
    try {
      setLoading(true)
      const res = await fetch('/api/marketing/campaigns')
      if (!res.ok) throw new Error('Failed to fetch campaigns')
      const data = await res.json()
      setCampaigns(data.campaigns || [])
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      toast({
        title: 'Erro ao carregar campanhas',
        description: 'Não foi possível carregar a lista de campanhas.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDuplicateCampaign(campaignId: string) {
    try {
      const res = await fetch(`/api/admin/marketing/campanhas/${campaignId}/duplicate`, {
        method: 'POST',
      })

      if (!res.ok) throw new Error('Failed to duplicate campaign')

      const data = await res.json()

      toast({
        title: 'Campanha duplicada!',
        description: `"${data.campaign.name}" foi criada com sucesso.`,
      })

      fetchCampaigns() // Refresh list
    } catch (error) {
      toast({
        title: 'Erro ao duplicar campanha',
        description: 'Não foi possível duplicar a campanha.',
        variant: 'destructive',
      })
    }
  }

  async function handleDeleteCampaign(campaignId: string, campaignName: string) {
    if (!confirm(`Tem certeza que deseja excluir a campanha "${campaignName}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/marketing/campanhas/${campaignId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete campaign')

      toast({
        title: 'Campanha excluída!',
        description: `"${campaignName}" foi excluída com sucesso.`,
      })

      fetchCampaigns() // Refresh list
    } catch (error) {
      toast({
        title: 'Erro ao excluir campanha',
        description: 'Não foi possível excluir a campanha.',
        variant: 'destructive',
      })
    }
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    totalSubscribers: campaigns.reduce((sum, c) => sum + (c.stats?.subscribers || 0), 0),
    totalSent: campaigns.reduce((sum, c) => sum + (c.stats?.sent || 0), 0),
    avgOpenRate: campaigns.filter(c => c.status !== 'draft').length > 0
      ? campaigns.filter(c => c.status !== 'draft').reduce((sum, c) => sum + (c.stats?.openRate || 0), 0) / campaigns.filter(c => c.status !== 'draft').length
      : 0,
    avgConversion: campaigns.filter(c => c.status !== 'draft').length > 0
      ? campaigns.filter(c => c.status !== 'draft').reduce((sum, c) => sum + (c.stats?.conversionRate || 0), 0) / campaigns.filter(c => c.status !== 'draft').length
      : 0,
  }

  async function toggleCampaignStatus(campaignId: string, currentStatus: Campaign['status']) {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active'
      const res = await fetch(`/api/marketing/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error('Failed to update campaign')

      toast({
        title: newStatus === 'active' ? 'Campanha ativada' : 'Campanha pausada',
        description: `A campanha foi ${newStatus === 'active' ? 'ativada' : 'pausada'} com sucesso.`,
      })

      fetchCampaigns()
    } catch (error) {
      toast({
        title: 'Erro ao atualizar campanha',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campanhas de Marketing</h2>
          <p className="text-muted-foreground">
            Gerencie e monitore suas campanhas de email marketing
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/marketing/campanhas/nova">
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inscritos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalSubscribers}</div>
            <p className="text-xs text-green-600">
              Todas as campanhas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Abertura Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : `${stats.avgOpenRate.toFixed(1)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimas campanhas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversão Média</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : `${stats.avgConversion.toFixed(1)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Campanhas ativas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar campanhas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                Todas
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
              >
                Ativas
              </Button>
              <Button
                variant={filterStatus === 'paused' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('paused')}
              >
                Pausadas
              </Button>
              <Button
                variant={filterStatus === 'draft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('draft')}
              >
                Rascunhos
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {campaigns.length === 0 ? 'Nenhuma campanha criada ainda' : 'Nenhuma campanha encontrada'}
                  </p>
                  {campaigns.length === 0 ? (
                    <Button asChild className="mt-4">
                      <Link href="/admin/marketing/campanhas/nova">Criar Primeira Campanha</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
                      Limpar filtros
                    </Button>
                  )}
                </div>
              ) : (
                filteredCampaigns.map((campaign) => {
                  const StatusIcon = statusConfig[campaign.status].icon
                  const TypeIcon = typeConfig[campaign.type].icon

                  return (
                    <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          {/* Campaign Icon */}
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <TypeIcon className="h-6 w-6 text-primary" />
                          </div>

                          {/* Campaign Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-lg">{campaign.name}</h3>
                                  <Badge
                                    variant="outline"
                                    className={statusConfig[campaign.status].color}
                                  >
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusConfig[campaign.status].label}
                                  </Badge>
                                  <Badge variant="outline">
                                    {typeConfig[campaign.type].label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {campaign.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Início: {new Date(campaign.schedule.startDate).toLocaleDateString('pt-BR')}
                                  </span>
                                  {campaign.schedule.endDate && (
                                    <span className="flex items-center gap-1">
                                      Término: {new Date(campaign.schedule.endDate).toLocaleDateString('pt-BR')}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/admin/marketing/campanhas/${campaign.id}`}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Editar
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/admin/marketing/campanhas/${campaign.id}/analytics`}>
                                      <BarChart3 className="h-4 w-4 mr-2" />
                                      Analytics
                                    </Link>
                                  </DropdownMenuItem>
                                  {campaign.status !== 'draft' && campaign.status !== 'completed' && (
                                    <DropdownMenuItem onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}>
                                      {campaign.status === 'active' ? (
                                        <>
                                          <Pause className="h-4 w-4 mr-2" />
                                          Pausar
                                        </>
                                      ) : (
                                        <>
                                          <Play className="h-4 w-4 mr-2" />
                                          Ativar
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => handleDuplicateCampaign(campaign.id)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteCampaign(campaign.id, campaign.name)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 pt-4 border-t">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Inscritos</p>
                                <p className="text-sm font-semibold">
                                  {campaign.stats?.subscribers || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Enviados</p>
                                <p className="text-sm font-semibold">
                                  {campaign.stats?.sent || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Taxa Abertura</p>
                                <p className="text-sm font-semibold text-blue-600">
                                  {campaign.stats?.openRate?.toFixed(1) || 0}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Taxa Cliques</p>
                                <p className="text-sm font-semibold text-purple-600">
                                  {campaign.stats?.clickRate?.toFixed(1) || 0}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Conversões</p>
                                <p className="text-sm font-semibold text-green-600">
                                  {campaign.stats?.converted || 0} ({campaign.stats?.conversionRate?.toFixed(1) || 0}%)
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
