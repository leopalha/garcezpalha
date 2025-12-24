'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Target,
  Percent,
  AlertCircle,
  Clock,
  FileText,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardStats {
  leads: { total: number; change: number; hot: number; warm: number; cold: number }
  clients: { total: number; change: number; active: number }
  revenue: { mrr: number; change: number; projected: number }
  conversion: { rate: number; change: number }
  cac: number
  ltv: number
  appointments: { today: number; pending: number }
  documents: { pending: number; approved: number }
  deadlines: { urgent: number; upcoming: number }
}

interface RecentLead {
  id: string
  name: string
  email: string
  product: string
  category: string
  status: string
  createdAt: string
}

interface RecentActivity {
  id: string
  type: 'lead' | 'payment' | 'document' | 'deadline'
  description: string
  time: string
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  nurturing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  hot: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  warm: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  cold: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  converted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  lost: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
}

const statusLabels: Record<string, string> = {
  active: 'Ativo',
  nurturing: 'Nutrição',
  hot: 'Quente',
  warm: 'Morno',
  cold: 'Frio',
  converted: 'Convertido',
  lost: 'Perdido',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([])
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboardData = async () => {
    try {
      // Fetch stats from API
      const [statsRes, leadsRes] = await Promise.all([
        fetch('/api/admin/leads/stats'),
        fetch('/api/admin/leads?limit=5')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        // Map API response to our interface
        setStats({
          leads: {
            total: statsData.total || 0,
            change: statsData.changePercent || 0,
            hot: statsData.byCategory?.hot || 0,
            warm: statsData.byCategory?.warm || 0,
            cold: statsData.byCategory?.cold || 0
          },
          clients: {
            total: statsData.converted || 0,
            change: 8,
            active: statsData.converted || 0
          },
          revenue: {
            mrr: statsData.estimatedRevenue || 0,
            change: 15,
            projected: (statsData.estimatedRevenue || 0) * 1.2
          },
          conversion: {
            rate: statsData.total > 0 ? ((statsData.converted || 0) / statsData.total) * 100 : 0,
            change: 2.3
          },
          cac: 150,
          ltv: 2500,
          appointments: { today: 5, pending: 12 },
          documents: { pending: statsData.byStatus?.pending_review || 0, approved: statsData.byStatus?.approved || 0 },
          deadlines: { urgent: 3, upcoming: 8 }
        })
      }

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json()
        setRecentLeads((leadsData.leads || []).slice(0, 5).map((l: any) => ({
          id: l.id,
          name: l.name || 'Cliente',
          email: l.email || '',
          product: l.product_name || l.product || 'Consulta',
          category: l.category || 'geral',
          status: l.status || 'active',
          createdAt: l.created_at || new Date().toISOString()
        })))
      }

      // Mock activities for now
      setActivities([
        { id: '1', type: 'lead', description: 'Novo lead qualificado: Desbloqueio de Conta', time: '5 min' },
        { id: '2', type: 'payment', description: 'Pagamento recebido: R$ 1.500', time: '32 min' },
        { id: '3', type: 'document', description: 'Peticao aprovada e enviada', time: '1h' },
        { id: '4', type: 'deadline', description: 'Prazo vencendo: Processo 123456', time: '2h' }
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set default values on error
      setStats({
        leads: { total: 0, change: 0, hot: 0, warm: 0, cold: 0 },
        clients: { total: 0, change: 0, active: 0 },
        revenue: { mrr: 0, change: 0, projected: 0 },
        conversion: { rate: 0, change: 0 },
        cac: 0,
        ltv: 0,
        appointments: { today: 0, pending: 0 },
        documents: { pending: 0, approved: 0 },
        deadlines: { urgent: 0, upcoming: 0 }
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Executivo</h2>
          <p className="text-muted-foreground">
            Metricas e KPIs - Garcez Palha
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Executive Metrics - Row 1 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR (Receita Mensal)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.revenue.mrr || 0)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {(stats?.revenue.change || 0) >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={(stats?.revenue.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                {stats?.revenue.change || 0}%
              </span>
              vs. mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.leads.total || 0}</div>
            <div className="flex gap-2 mt-1">
              <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                {stats?.leads.hot || 0} hot
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200">
                {stats?.leads.warm || 0} warm
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                {stats?.leads.cold || 0} cold
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversao</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.conversion.rate || 0).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {(stats?.conversion.change || 0) >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={(stats?.conversion.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                +{stats?.conversion.change || 0}%
              </span>
              pontos percentuais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.clients.active || 0}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">+{stats?.clients.change || 0}%</span>
              vs. mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Executive Metrics - Row 2 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CAC (Custo Aquisicao)</CardTitle>
            <Percent className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.cac || 0)}</div>
            <p className="text-xs text-muted-foreground">Custo por cliente</p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LTV (Valor Vitalicio)</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.ltv || 0)}</div>
            <p className="text-xs text-muted-foreground">
              LTV/CAC: {stats?.cac ? ((stats?.ltv || 0) / stats.cac).toFixed(1) : 0}x
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.documents.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              pendentes de revisao ({stats?.documents.approved || 0} aprovados)
            </p>
          </CardContent>
        </Card>

        <Card className={stats?.deadlines.urgent ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prazos Urgentes</CardTitle>
            <AlertCircle className={`h-4 w-4 ${stats?.deadlines.urgent ? 'text-red-600' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats?.deadlines.urgent ? 'text-red-600' : ''}`}>
              {stats?.deadlines.urgent || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.deadlines.upcoming || 0} vencendo em 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Recentes</CardTitle>
            <CardDescription>Ultimos leads qualificados pelo sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum lead recente</p>
              ) : (
                recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.product}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[lead.status] || statusColors.active}`}>
                        {statusLabels[lead.status] || lead.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(lead.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Ultimas acoes no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'lead' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
                    activity.type === 'payment' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
                    activity.type === 'document' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' :
                    'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {activity.type === 'lead' && <Users className="h-4 w-4" />}
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                    {activity.type === 'document' && <FileText className="h-4 w-4" />}
                    {activity.type === 'deadline' && <Clock className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acoes Rapidas</CardTitle>
          <CardDescription>Tarefas comuns do dia a dia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <a
              href="/admin/leads"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors"
            >
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Leads</p>
                <p className="text-sm text-muted-foreground">Gerenciar</p>
              </div>
            </a>
            <a
              href="/admin/documentos"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors"
            >
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Documentos</p>
                <p className="text-sm text-muted-foreground">Revisar</p>
              </div>
            </a>
            <a
              href="/admin/agendamentos"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors"
            >
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Agenda</p>
                <p className="text-sm text-muted-foreground">Ver hoje</p>
              </div>
            </a>
            <a
              href="/admin/analytics"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors"
            >
              <Target className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Analytics</p>
                <p className="text-sm text-muted-foreground">Detalhado</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
