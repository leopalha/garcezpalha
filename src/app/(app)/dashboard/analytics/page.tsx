'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  MessageSquare,
  BarChart3,
  Target,
  Zap,
  Calendar,
  Download,
  Eye,
  MousePointerClick,
  UserCheck,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TimeRange = '7d' | '30d' | '90d' | 'all'

interface MetricCard {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ElementType
  color: string
}

interface ChartData {
  date: string
  leads: number
  conversions: number
  revenue: number
}

interface ProductPerformance {
  id: string
  name: string
  category: string
  views: number
  leads: number
  conversions: number
  revenue: number
  conversionRate: number
  avgTicket: number
}

interface SourcePerformance {
  source: string
  icon: string
  leads: number
  conversions: number
  revenue: number
  conversionRate: number
  cost: number
  roi: number
}

const mockChartData: ChartData[] = [
  { date: '01/01', leads: 12, conversions: 3, revenue: 4500 },
  { date: '02/01', leads: 15, conversions: 4, revenue: 6000 },
  { date: '03/01', leads: 8, conversions: 2, revenue: 3000 },
  { date: '04/01', leads: 18, conversions: 5, revenue: 7500 },
  { date: '05/01', leads: 22, conversions: 6, revenue: 9000 },
  { date: '06/01', leads: 14, conversions: 3, revenue: 4500 },
  { date: '07/01', leads: 25, conversions: 8, revenue: 12000 },
]

const mockProductPerformance: ProductPerformance[] = [
  {
    id: '1',
    name: 'Usucapião Extraordinária',
    category: 'Imobiliário',
    views: 456,
    leads: 45,
    conversions: 12,
    revenue: 42000,
    conversionRate: 26.7,
    avgTicket: 3500,
  },
  {
    id: '2',
    name: 'Desbloqueio de Conta Bancária',
    category: 'Bancário',
    views: 789,
    leads: 78,
    conversions: 18,
    revenue: 27000,
    conversionRate: 23.1,
    avgTicket: 1500,
  },
  {
    id: '3',
    name: 'Plano de Saúde Negado',
    category: 'Saúde',
    views: 623,
    leads: 62,
    conversions: 15,
    revenue: 37500,
    conversionRate: 24.2,
    avgTicket: 2500,
  },
  {
    id: '4',
    name: 'Defesa Criminal',
    category: 'Criminal',
    views: 234,
    leads: 23,
    conversions: 8,
    revenue: 40000,
    conversionRate: 34.8,
    avgTicket: 5000,
  },
]

const mockSourcePerformance: SourcePerformance[] = [
  {
    source: 'Landing Page Orgânica',
    icon: '🌐',
    leads: 85,
    conversions: 22,
    revenue: 45000,
    conversionRate: 25.9,
    cost: 0,
    roi: Infinity,
  },
  {
    source: 'Google Ads',
    icon: '🔍',
    leads: 42,
    conversions: 12,
    revenue: 28000,
    conversionRate: 28.6,
    cost: 8500,
    roi: 229.4,
  },
  {
    source: 'Instagram Ads',
    icon: '📸',
    leads: 38,
    conversions: 8,
    revenue: 15000,
    conversionRate: 21.1,
    cost: 5200,
    roi: 188.5,
  },
  {
    source: 'Facebook Ads',
    icon: '👥',
    leads: 28,
    conversions: 6,
    revenue: 12000,
    conversionRate: 21.4,
    cost: 4100,
    roi: 192.7,
  },
  {
    source: 'WhatsApp Direto',
    icon: '💬',
    leads: 15,
    conversions: 5,
    revenue: 9500,
    conversionRate: 33.3,
    cost: 0,
    roi: Infinity,
  },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const metrics: MetricCard[] = [
    {
      title: 'Total de Leads',
      value: '208',
      change: 12.5,
      changeLabel: 'vs. período anterior',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Taxa de Conversão',
      value: '25.5%',
      change: 3.2,
      changeLabel: 'vs. período anterior',
      icon: Target,
      color: 'green',
    },
    {
      title: 'Receita Total',
      value: formatCurrency(146500),
      change: 18.7,
      changeLabel: 'vs. período anterior',
      icon: DollarSign,
      color: 'yellow',
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(2759),
      change: -2.1,
      changeLabel: 'vs. período anterior',
      icon: BarChart3,
      color: 'purple',
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string }> = {
      blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', icon: 'text-blue-600' },
      green: { bg: 'bg-green-100 dark:bg-green-900/30', icon: 'text-green-600' },
      yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: 'text-yellow-600' },
      purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', icon: 'text-purple-600' },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o desempenho da sua plataforma em tempo real
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="all">Todo o período</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const colors = getColorClasses(metric.color)
          return (
            <Card key={metric.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <div className={cn('h-10 w-10 rounded-full flex items-center justify-center', colors.bg)}>
                    <Icon className={cn('h-5 w-5', colors.icon)} />
                  </div>
                </div>
                <p className="text-3xl font-bold">{metric.value}</p>
                <div className="flex items-center gap-2 mt-2">
                  {metric.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      metric.change > 0 ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {metric.change > 0 ? '+' : ''}
                    {metric.change}%
                  </span>
                  <span className="text-xs text-muted-foreground">{metric.changeLabel}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Chart - Simplified bar visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Leads e Conversões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Conversões</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-muted-foreground">Receita</span>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              {mockChartData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground w-16">{data.date}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 flex gap-1">
                        <div
                          className="bg-blue-500 rounded h-8 transition-all hover:opacity-80 flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${(data.leads / 25) * 100}%`, minWidth: '40px' }}
                        >
                          {data.leads}
                        </div>
                      </div>
                      <div className="flex-1 flex gap-1">
                        <div
                          className="bg-green-500 rounded h-8 transition-all hover:opacity-80 flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${(data.conversions / 8) * 100}%`, minWidth: '30px' }}
                        >
                          {data.conversions}
                        </div>
                      </div>
                      <div className="flex-1 flex gap-1">
                        <div
                          className="bg-yellow-500 rounded h-8 transition-all hover:opacity-80 flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${(data.revenue / 12000) * 100}%`, minWidth: '60px' }}
                        >
                          {formatCurrency(data.revenue)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance by Product */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
              <div className="col-span-2">Produto</div>
              <div className="text-center">Views</div>
              <div className="text-center">Leads</div>
              <div className="text-center">Conversões</div>
              <div className="text-center">Taxa</div>
              <div className="text-right">Ticket Médio</div>
              <div className="text-right">Receita</div>
            </div>

            {mockProductPerformance.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-8 gap-4 items-center py-3 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="col-span-2">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{product.views}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-3 w-3 text-blue-600" />
                    <span className="text-sm font-medium">{product.leads}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <UserCheck className="h-3 w-3 text-green-600" />
                    <span className="text-sm font-medium">{product.conversions}</span>
                  </div>
                </div>
                <div className="text-center">
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      product.conversionRate >= 30
                        ? 'text-green-600'
                        : product.conversionRate >= 20
                          ? 'text-blue-600'
                          : 'text-yellow-600'
                    )}
                  >
                    {formatPercent(product.conversionRate)}
                  </span>
                </div>
                <div className="text-right text-sm">{formatCurrency(product.avgTicket)}</div>
                <div className="text-right text-sm font-semibold">
                  {formatCurrency(product.revenue)}
                </div>
              </div>
            ))}

            <div className="grid grid-cols-8 gap-4 items-center pt-4 border-t font-semibold">
              <div className="col-span-2">Total</div>
              <div className="text-center">
                {mockProductPerformance.reduce((acc, p) => acc + p.views, 0)}
              </div>
              <div className="text-center">
                {mockProductPerformance.reduce((acc, p) => acc + p.leads, 0)}
              </div>
              <div className="text-center">
                {mockProductPerformance.reduce((acc, p) => acc + p.conversions, 0)}
              </div>
              <div className="text-center">
                {formatPercent(
                  (mockProductPerformance.reduce((acc, p) => acc + p.conversions, 0) /
                    mockProductPerformance.reduce((acc, p) => acc + p.leads, 0)) *
                    100
                )}
              </div>
              <div className="text-right">
                {formatCurrency(
                  mockProductPerformance.reduce((acc, p) => acc + p.revenue, 0) /
                    mockProductPerformance.reduce((acc, p) => acc + p.conversions, 0)
                )}
              </div>
              <div className="text-right">
                {formatCurrency(mockProductPerformance.reduce((acc, p) => acc + p.revenue, 0))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance by Source */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Origem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
              <div className="col-span-2">Origem</div>
              <div className="text-center">Leads</div>
              <div className="text-center">Conversões</div>
              <div className="text-center">Taxa</div>
              <div className="text-right">Custo</div>
              <div className="text-right">Receita</div>
              <div className="text-right">ROI</div>
            </div>

            {mockSourcePerformance.map((source, index) => (
              <div
                key={index}
                className="grid grid-cols-8 gap-4 items-center py-3 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{source.icon}</span>
                    <span className="font-medium">{source.source}</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium">{source.leads}</span>
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium">{source.conversions}</span>
                </div>
                <div className="text-center">
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      source.conversionRate >= 30
                        ? 'text-green-600'
                        : source.conversionRate >= 20
                          ? 'text-blue-600'
                          : 'text-yellow-600'
                    )}
                  >
                    {formatPercent(source.conversionRate)}
                  </span>
                </div>
                <div className="text-right text-sm">
                  {source.cost === 0 ? (
                    <span className="text-green-600 font-medium">Grátis</span>
                  ) : (
                    formatCurrency(source.cost)
                  )}
                </div>
                <div className="text-right text-sm font-semibold">
                  {formatCurrency(source.revenue)}
                </div>
                <div className="text-right">
                  {source.roi === Infinity ? (
                    <span className="text-green-600 font-semibold text-sm">∞</span>
                  ) : (
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        source.roi >= 200 ? 'text-green-600' : 'text-yellow-600'
                      )}
                    >
                      {source.roi.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            ))}

            <div className="grid grid-cols-8 gap-4 items-center pt-4 border-t font-semibold">
              <div className="col-span-2">Total</div>
              <div className="text-center">
                {mockSourcePerformance.reduce((acc, s) => acc + s.leads, 0)}
              </div>
              <div className="text-center">
                {mockSourcePerformance.reduce((acc, s) => acc + s.conversions, 0)}
              </div>
              <div className="text-center">
                {formatPercent(
                  (mockSourcePerformance.reduce((acc, s) => acc + s.conversions, 0) /
                    mockSourcePerformance.reduce((acc, s) => acc + s.leads, 0)) *
                    100
                )}
              </div>
              <div className="text-right">
                {formatCurrency(mockSourcePerformance.reduce((acc, s) => acc + s.cost, 0))}
              </div>
              <div className="text-right">
                {formatCurrency(mockSourcePerformance.reduce((acc, s) => acc + s.revenue, 0))}
              </div>
              <div className="text-right">
                {formatPercent(
                  ((mockSourcePerformance.reduce((acc, s) => acc + s.revenue, 0) -
                    mockSourcePerformance.reduce((acc, s) => acc + s.cost, 0)) /
                    mockSourcePerformance.reduce((acc, s) => acc + s.cost, 0)) *
                    100
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Melhor Produto</p>
                <p className="font-semibold">Defesa Criminal</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Taxa de conversão de 34.8% e ticket médio de R$ 5.000
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <MousePointerClick className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Melhor Canal</p>
                <p className="font-semibold">WhatsApp Direto</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Taxa de conversão de 33.3% com custo zero de aquisição
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
                <p className="font-semibold">3.2 dias</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Entre primeiro contato e conversão em cliente
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
