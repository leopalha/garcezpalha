'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LeadsTimeSeriesChart,
  CategoryDistributionChart,
} from '@/components/charts/LeadsChart'
import { exportAnalyticsToCSV } from '@/lib/utils/export'
import { Download, FileSpreadsheet } from 'lucide-react'

interface AnalyticsData {
  period: {
    days: number
    startDate: string
    endDate: string
  }
  overview: {
    totalLeads: number
    hotLeads: number
    warmLeads: number
    coldLeads: number
    veryColdLeads: number
    convertedLeads: number
    inProgressLeads: number
    lostLeads: number
    newLeads: number
    conversionRate: number
    hotConversionRate: number
  }
  scores: {
    avgTotalScore: number
    avgUrgency: number
    avgProbability: number
    avgComplexity: number
    distribution: Record<string, number>
  }
  byProduct: Array<{
    productId: string
    productName: string
    total: number
    hot: number
    warm: number
    cold: number
    veryCold: number
    converted: number
    avgScore: number
    conversionRate: number
  }>
  bySource: Array<{
    source: string
    total: number
    converted: number
    avgScore: number
    conversionRate: number
  }>
  timeSeries: Array<{
    date: string
    total: number
    hot: number
    warm: number
    cold: number
    veryCold: number
    converted: number
    avgScore: number
  }>
}

export default function ConversaoAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')
  const [groupBy, setGroupBy] = useState('day')

  useEffect(() => {
    fetchAnalytics()
  }, [period, groupBy])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/admin/analytics/leads?period=${period}&groupBy=${groupBy}`
      )
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportSummary = () => {
    if (!data) return

    exportAnalyticsToCSV(
      {
        totalLeads: data.overview.totalLeads,
        hotLeads: data.overview.hotLeads,
        warmLeads: data.overview.warmLeads,
        coldLeads: data.overview.coldLeads,
        convertedLeads: data.overview.convertedLeads,
        avgScore: data.scores.avgTotalScore,
        conversionRate: data.overview.conversionRate,
        period: `Últimos ${period} dias`,
      },
      `analytics-resumo-${period}d-${new Date().toISOString().split('T')[0]}.csv`
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="text-muted-foreground">Carregando analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Erro ao carregar dados</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics de Conversão de Leads</h1>
          <p className="text-muted-foreground">
            Análise detalhada de leads qualificados dos últimos {period} dias
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="365">Último ano</option>
          </select>

          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="day">Por dia</option>
            <option value="week">Por semana</option>
            <option value="month">Por mês</option>
          </select>

          <Button onClick={fetchAnalytics} variant="outline">
            Atualizar
          </Button>

          <Button onClick={handleExportSummary} variant="outline" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Exportar Resumo
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-2xl font-bold">{data.overview.totalLeads}</div>
          <div className="text-sm text-muted-foreground">Total de Leads</div>
        </Card>

        <Card className="p-6 bg-red-50 dark:bg-red-950/20">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {data.overview.hotLeads}
          </div>
          <div className="text-sm text-muted-foreground">Leads Quentes</div>
        </Card>

        <Card className="p-6 bg-green-50 dark:bg-green-950/20">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {data.overview.convertedLeads}
          </div>
          <div className="text-sm text-muted-foreground">Convertidos</div>
        </Card>

        <Card className="p-6 bg-blue-50 dark:bg-blue-950/20">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {data.overview.conversionRate.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Distribuição por Categoria</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visual Chart */}
          <div className="flex items-center justify-center">
            <CategoryDistributionChart
              data={[
                {
                  name: '🔥 Quente',
                  value: data.overview.hotLeads,
                  percentage: data.overview.totalLeads > 0
                    ? parseFloat(((data.overview.hotLeads / data.overview.totalLeads) * 100).toFixed(1))
                    : 0
                },
                {
                  name: '☀️ Morno',
                  value: data.overview.warmLeads,
                  percentage: data.overview.totalLeads > 0
                    ? parseFloat(((data.overview.warmLeads / data.overview.totalLeads) * 100).toFixed(1))
                    : 0
                },
                {
                  name: '❄️ Frio',
                  value: data.overview.coldLeads,
                  percentage: data.overview.totalLeads > 0
                    ? parseFloat(((data.overview.coldLeads / data.overview.totalLeads) * 100).toFixed(1))
                    : 0
                },
                {
                  name: '🧊 Muito Frio',
                  value: data.overview.veryColdLeads,
                  percentage: data.overview.totalLeads > 0
                    ? parseFloat(((data.overview.veryColdLeads / data.overview.totalLeads) * 100).toFixed(1))
                    : 0
                },
              ]}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{data.overview.hotLeads}</div>
              <div className="text-sm text-muted-foreground">🔥 Quente</div>
              <div className="text-xs text-muted-foreground">
                {data.overview.totalLeads > 0
                  ? ((data.overview.hotLeads / data.overview.totalLeads) * 100).toFixed(1)
                  : 0}
                %
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{data.overview.warmLeads}</div>
              <div className="text-sm text-muted-foreground">☀️ Morno</div>
              <div className="text-xs text-muted-foreground">
                {data.overview.totalLeads > 0
                  ? ((data.overview.warmLeads / data.overview.totalLeads) * 100).toFixed(1)
                  : 0}
                %
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{data.overview.coldLeads}</div>
              <div className="text-sm text-muted-foreground">❄️ Frio</div>
              <div className="text-xs text-muted-foreground">
                {data.overview.totalLeads > 0
                  ? ((data.overview.coldLeads / data.overview.totalLeads) * 100).toFixed(1)
                  : 0}
                %
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">{data.overview.veryColdLeads}</div>
              <div className="text-sm text-muted-foreground">🧊 Muito Frio</div>
              <div className="text-xs text-muted-foreground">
                {data.overview.totalLeads > 0
                  ? ((data.overview.veryColdLeads / data.overview.totalLeads) * 100).toFixed(1)
                  : 0}
                %
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Score Stats */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Scores Médios</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold">{data.scores.avgTotalScore.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Score Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {data.scores.avgUrgency.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Urgência</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {data.scores.avgProbability.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Probabilidade</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {data.scores.avgComplexity.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Complexidade</div>
          </div>
        </div>
      </Card>

      {/* By Product */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Performance por Produto</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3">Produto</th>
                <th className="pb-3 text-center">Total</th>
                <th className="pb-3 text-center">🔥</th>
                <th className="pb-3 text-center">☀️</th>
                <th className="pb-3 text-center">Score</th>
                <th className="pb-3 text-center">Conversão</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.byProduct.map((product) => (
                <tr key={product.productId} className="border-b hover:bg-muted/50">
                  <td className="py-3 font-medium">{product.productName}</td>
                  <td className="py-3 text-center">{product.total}</td>
                  <td className="py-3 text-center text-red-600">{product.hot}</td>
                  <td className="py-3 text-center text-orange-600">{product.warm}</td>
                  <td className="py-3 text-center">{product.avgScore.toFixed(1)}</td>
                  <td className="py-3 text-center">
                    <span
                      className={
                        product.conversionRate >= 20
                          ? 'text-green-600 font-semibold'
                          : product.conversionRate >= 10
                            ? 'text-orange-600'
                            : 'text-gray-600'
                      }
                    >
                      {product.conversionRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* By Source */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Performance por Origem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.bySource.map((source) => (
            <div
              key={source.source}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="text-lg font-semibold capitalize">{source.source}</div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{source.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Convertidos:</span>
                  <span className="font-medium text-green-600">{source.converted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa:</span>
                  <span className="font-medium">{source.conversionRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Score:</span>
                  <span className="font-medium">{source.avgScore.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Time Series Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Evolução Temporal</h2>

        {/* Visual Chart */}
        <div className="mb-6">
          <LeadsTimeSeriesChart
            data={data.timeSeries.map(item => ({
              ...item,
              date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            }))}
            type="line"
          />
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3">Data</th>
                <th className="pb-3 text-center">Total</th>
                <th className="pb-3 text-center">🔥 Quente</th>
                <th className="pb-3 text-center">☀️ Morno</th>
                <th className="pb-3 text-center">❄️ Frio</th>
                <th className="pb-3 text-center">Convertidos</th>
                <th className="pb-3 text-center">Score Médio</th>
              </tr>
            </thead>
            <tbody>
              {data.timeSeries.map((item) => (
                <tr key={item.date} className="border-b hover:bg-muted/50">
                  <td className="py-2 font-medium">
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-2 text-center">{item.total}</td>
                  <td className="py-2 text-center text-red-600">{item.hot}</td>
                  <td className="py-2 text-center text-orange-600">{item.warm}</td>
                  <td className="py-2 text-center text-blue-600">{item.cold}</td>
                  <td className="py-2 text-center text-green-600">{item.converted}</td>
                  <td className="py-2 text-center">{item.avgScore.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
