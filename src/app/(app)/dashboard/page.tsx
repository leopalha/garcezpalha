'use client'

import { useState, useEffect } from 'react'
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
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

interface DashboardStats {
  products: {
    total: number
    published: number
    draft: number
  }
  leads: {
    total: number
    new: number
    qualified: number
    converted: number
    conversionRate: number
  }
  agent: {
    totalConversations: number
    activeConversations: number
    averageResponseTime: number
    satisfactionScore: number
    escalationRate: number
  }
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
}

interface Product {
  id: string
  name: string
  status: string
  stats: {
    leads: number
    conversionRate: number
    revenue: number
  }
}

export default function AppDashboard() {
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)

      // Fetch dashboard stats
      const statsRes = await fetch('/api/dashboard/stats')
      if (!statsRes.ok) throw new Error('Failed to fetch stats')
      const statsData = await statsRes.json()
      setStats(statsData)

      // Fetch top 3 products
      const productsRes = await fetch('/api/app/products?limit=3&status=published')
      if (!productsRes.ok) throw new Error('Failed to fetch products')
      const productsData = await productsRes.json()
      setProducts(productsData.products || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar os dados do dashboard.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Erro ao carregar dados do dashboard</p>
      </div>
    )
  }
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
            <Link href="/dashboard/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Relatórios
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/produtos/novo">
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
            <div className="text-2xl font-bold">{stats.products.published}</div>
            <p className="text-xs text-muted-foreground">
              {stats.products.total} no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Totais</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leads.total}</div>
            <p className="text-xs text-green-600">
              +{stats.leads.new} novos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leads.conversionRate.toFixed(1)}%</div>
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
            <div className="text-2xl font-bold">{stats.agent.totalConversations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.agent.activeConversations} ativas
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
              <p className="text-2xl font-bold">{stats.agent.totalConversations}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tempo Médio de Resposta</p>
              <p className="text-2xl font-bold">{stats.agent.averageResponseTime}s</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Taxa de Satisfação</p>
              <p className="text-2xl font-bold text-green-600">{stats.agent.satisfactionScore.toFixed(1)}/5.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Taxa de Escalação</p>
              <p className="text-2xl font-bold text-blue-600">{stats.agent.escalationRate.toFixed(1)}%</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link href="/dashboard/agent">
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
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{product.name}</p>
                        {product.status === 'published' ? (
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
                          {product.stats?.leads || 0} leads
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {product.stats?.conversionRate?.toFixed(1) || 0}% conversão
                        </span>
                        {product.stats?.revenue > 0 && (
                          <span className="font-semibold text-green-600">
                            R$ {product.stats.revenue.toLocaleString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/produtos/${product.id}`}>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum produto criado ainda</p>
                  <Button variant="outline" asChild className="mt-4">
                    <Link href="/dashboard/produtos/novo">Criar Primeiro Produto</Link>
                  </Button>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/produtos">Ver Todos os Produtos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity - Temporarily disabled */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas atualizações da plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Em breve você verá suas atividades recentes aqui</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/produtos/novo">
          <Card className="cursor-pointer hover:shadow-md transition-shadow group">
            <CardContent className="pt-6 text-center">
              <Package className="h-10 w-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
              <p className="font-semibold mb-1">Criar Novo Produto</p>
              <p className="text-xs text-muted-foreground">
                Configure perguntas, propostas e landing page
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/landing-pages">
          <Card className="cursor-pointer hover:shadow-md transition-shadow group">
            <CardContent className="pt-6 text-center">
              <FileText className="h-10 w-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
              <p className="font-semibold mb-1">Gerenciar Landing Pages</p>
              <p className="text-xs text-muted-foreground">
                Edite páginas de captura e VSLs
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/agent">
          <Card className="cursor-pointer hover:shadow-md transition-shadow group">
            <CardContent className="pt-6 text-center">
              <Sparkles className="h-10 w-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
              <p className="font-semibold mb-1">Configurar Agent IA</p>
              <p className="text-xs text-muted-foreground">
                Personalize o comportamento do assistente
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
