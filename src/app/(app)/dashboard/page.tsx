'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Package,
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  ArrowUpRight,
  Eye,
  MousePointerClick,
  CheckCircle,
  Sparkles,
  BarChart3,
  Clock,
} from 'lucide-react'
import Link from 'next/link'

// Mock data
const dashboardData = {
  totalProducts: 8,
  activeProducts: 6,
  totalLeads: 127,
  newLeadsToday: 12,
  conversionRate: 23.5,
  totalConversations: 483,
  activeConversations: 24,

  recentProducts: [
    {
      id: '1',
      name: 'Usucapião Extraordinária',
      status: 'active',
      leads: 45,
      conversion: 28.5,
      revenue: 12500,
    },
    {
      id: '2',
      name: 'Regularização de Imóvel',
      status: 'active',
      leads: 38,
      conversion: 21.2,
      revenue: 9800,
    },
    {
      id: '3',
      name: 'Holding Familiar',
      status: 'draft',
      leads: 0,
      conversion: 0,
      revenue: 0,
    },
  ],

  recentActivity: [
    {
      id: '1',
      type: 'lead',
      message: 'Novo lead qualificado: Maria Silva',
      time: '5 minutos atrás',
      icon: Users,
    },
    {
      id: '2',
      type: 'conversation',
      message: 'Agent IA finalizou atendimento com João Santos',
      time: '15 minutos atrás',
      icon: MessageSquare,
    },
    {
      id: '3',
      type: 'product',
      message: 'Produto "Usucapião" recebeu nova visualização',
      time: '1 hora atrás',
      icon: Eye,
    },
    {
      id: '4',
      type: 'conversion',
      message: 'Cliente convertido: Ana Costa - R$ 3.500',
      time: '2 horas atrás',
      icon: CheckCircle,
    },
  ],

  agentStats: {
    totalConversations: 483,
    averageResponseTime: '2.3s',
    satisfactionRate: 94.5,
    resolvedWithoutHuman: 78.2,
  },
}

export default function AppDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral do seu escritório digital
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/app/dashboard/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Relatórios
            </Link>
          </Button>
          <Button asChild>
            <Link href="/app/dashboard/produtos/novo">
              <Package className="h-4 w-4 mr-2" />
              Novo Produto
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.activeProducts}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.totalProducts} no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Totais</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalLeads}</div>
            <p className="text-xs text-green-600">
              +{dashboardData.newLeadsToday} hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas IA</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalConversations}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.activeConversations} ativas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <CardTitle>Desempenho do Agent IA</CardTitle>
          </div>
          <CardDescription>Estatísticas do seu assistente automatizado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total de Conversas</p>
              <p className="text-2xl font-bold">{dashboardData.agentStats.totalConversations}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tempo Médio de Resposta</p>
              <p className="text-2xl font-bold">{dashboardData.agentStats.averageResponseTime}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Taxa de Satisfação</p>
              <p className="text-2xl font-bold text-green-600">{dashboardData.agentStats.satisfactionRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Resolvido sem Humano</p>
              <p className="text-2xl font-bold text-blue-600">{dashboardData.agentStats.resolvedWithoutHuman}%</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link href="/app/dashboard/agent">
                Ver Configurações do Agent
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Products Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos em Destaque</CardTitle>
            <CardDescription>Performance dos seus principais produtos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{product.name}</p>
                      {product.status === 'active' ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          Ativo
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          Rascunho
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {product.leads} leads
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {product.conversion}% conversão
                      </span>
                      {product.revenue > 0 && (
                        <span className="font-semibold text-green-600">
                          R$ {product.revenue.toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/app/dashboard/produtos/${product.id}`}>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/app/dashboard/produtos">Ver Todos os Produtos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas atualizações da plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow group" asChild>
          <Link href="/app/dashboard/produtos/novo">
            <CardContent className="pt-6 text-center">
              <Package className="h-10 w-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
              <p className="font-semibold mb-1">Criar Novo Produto</p>
              <p className="text-xs text-muted-foreground">
                Configure perguntas, propostas e landing page
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow group" asChild>
          <Link href="/app/dashboard/landing-pages">
            <CardContent className="pt-6 text-center">
              <FileText className="h-10 w-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
              <p className="font-semibold mb-1">Gerenciar Landing Pages</p>
              <p className="text-xs text-muted-foreground">
                Edite páginas de captura e VSLs
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow group" asChild>
          <Link href="/app/dashboard/agent">
            <CardContent className="pt-6 text-center">
              <Sparkles className="h-10 w-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
              <p className="font-semibold mb-1">Configurar Agent IA</p>
              <p className="text-xs text-muted-foreground">
                Personalize o comportamento do assistente
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
