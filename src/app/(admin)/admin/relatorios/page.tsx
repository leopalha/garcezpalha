'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, FileText, Download, Calendar, Filter, Loader2, Users, Award, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ErrorAlert } from '@/components/ui/error-alert'
import { formatCurrency } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LegalReports {
  period: {
    startDate: string
    endDate: string
  }
  summary: {
    totalCases: number
    completedCases: number
    activeCases: number
    cancelledCases: number
    overallSuccessRate: string
    avgResolutionTime: number
    totalRevenue: number
    expectedRevenue: number
    revenueRealization: string
  }
  successByServiceType: Array<{
    serviceType: string
    total: number
    completed: number
    cancelled: number
    active: number
    successRate: string
  }>
  revenueByServiceType: Array<{
    serviceType: string
    expected: number
    actual: number
    count: number
    realization: string
  }>
  performanceByLawyer: Array<{
    lawyerId: string
    lawyerName: string
    total: number
    completed: number
    active: number
    successRate: string
  }>
  casesByStatus: Array<{
    status: string
    count: number
  }>
  monthlyTrend: Array<{
    month: string
    newCases: number
    completed: number
    revenue: number
  }>
  paymentMetrics: {
    totalInvoiced: number
    totalPaid: number
    totalPending: number
    totalOverdue: number
    defaultRate: string
    paymentRate: string
  }
}

const serviceTypeLabels: Record<string, string> = {
  divorcio: 'Divórcio',
  inventario: 'Inventário',
  pensao_alimenticia: 'Pensão Alimentícia',
  guarda: 'Guarda',
  uniao_estavel: 'União Estável',
  outros: 'Outros',
  unknown: 'Não especificado'
}

const statusLabels: Record<string, string> = {
  aguardando_documentos: 'Aguardando Documentos',
  em_analise: 'Em Análise',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado'
}

export default function RelatoriosPage() {
  const [reports, setReports] = useState<LegalReports | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [exportingType, setExportingType] = useState<string | null>(null)

  // Date filters
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 1)
    return date.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0])

  useEffect(() => {
    loadReports()
  }, [startDate, endDate])

  async function loadReports() {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(
        `/api/admin/reports/legal?start_date=${startDate}&end_date=${endDate}`
      )

      if (!response.ok) {
        throw new Error('Erro ao carregar relatórios')
      }

      const data = await response.json()
      setReports(data)
    } catch (err) {
      console.error('Error loading reports:', err)
      setError(err instanceof Error ? err : new Error('Erro desconhecido'))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExport(reportType: string) {
    try {
      setExportingType(reportType)

      const response = await fetch('/api/admin/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          format: 'csv',
          startDate,
          endDate
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao exportar relatório')
      }

      // Download the file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportType}_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exporting report:', err)
      setError(err instanceof Error ? err : new Error('Erro ao exportar'))
    } finally {
      setExportingType(null)
    }
  }

  function formatMonth(month: string) {
    const [year, monthNum] = month.split('-')
    const date = new Date(parseInt(year), parseInt(monthNum) - 1)
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorAlert error={error.message} retry={loadReports} />
      </div>
    )
  }

  if (!reports) {
    return null
  }

  const { summary, successByServiceType, revenueByServiceType, performanceByLawyer, monthlyTrend, paymentMetrics } = reports

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios e BI</h1>
          <p className="text-muted-foreground mt-1">
            Análises e indicadores de performance do escritório
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="start-date" className="text-sm">De:</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="end-date" className="text-sm">Até:</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Casos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalCases}</div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="text-green-600">{summary.completedCases} concluídos</span>
              <span className="text-blue-600">{summary.activeCases} ativos</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.overallSuccessRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Casos concluídos vs total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgResolutionTime} dias</div>
            <p className="text-xs text-muted-foreground mt-1">
              Resolução de casos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.revenueRealization}% de realização
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Export Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Exportar Relatórios</CardTitle>
          <CardDescription>Baixe dados em formato CSV para análise externa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('cases')}
              disabled={exportingType === 'cases'}
            >
              {exportingType === 'cases' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Casos
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('financial')}
              disabled={exportingType === 'financial'}
            >
              {exportingType === 'financial' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Despesas
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('invoices')}
              disabled={exportingType === 'invoices'}
            >
              {exportingType === 'invoices' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Faturas
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('clients')}
              disabled={exportingType === 'clients'}
            >
              {exportingType === 'clients' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Clientes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Success by Service Type */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Sucesso por Tipo</CardTitle>
            <CardDescription>Performance por tipo de serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {successByServiceType.slice(0, 6).map((item) => (
                <div key={item.serviceType}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {serviceTypeLabels[item.serviceType] || item.serviceType}
                    </span>
                    <span className="text-sm font-bold">{item.successRate}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span>{item.total} total</span>
                    <span>•</span>
                    <span className="text-green-600">{item.completed} concluídos</span>
                    <span>•</span>
                    <span className="text-blue-600">{item.active} ativos</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${item.successRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Service Type */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Tipo de Serviço</CardTitle>
            <CardDescription>Top serviços por receita gerada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByServiceType.slice(0, 6).map((item, idx) => (
                <div key={item.serviceType} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {serviceTypeLabels[item.serviceType] || item.serviceType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.count} {item.count === 1 ? 'caso' : 'casos'} • {item.realization}% realização
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(item.actual)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Lawyer */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Advogado</CardTitle>
          <CardDescription>Estatísticas individuais da equipe</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Advogado</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Concluídos</TableHead>
                <TableHead className="text-center">Ativos</TableHead>
                <TableHead className="text-center">Taxa de Sucesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceByLawyer.slice(0, 10).map((lawyer) => (
                <TableRow key={lawyer.lawyerId}>
                  <TableCell className="font-medium">{lawyer.lawyerName}</TableCell>
                  <TableCell className="text-center">{lawyer.total}</TableCell>
                  <TableCell className="text-center text-green-600">{lawyer.completed}</TableCell>
                  <TableCell className="text-center text-blue-600">{lawyer.active}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{lawyer.successRate}%</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência Mensal</CardTitle>
          <CardDescription>Evolução de casos e receita ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {monthlyTrend.slice(-12).map((month) => (
              <div key={month.month} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm font-medium w-24">
                  {formatMonth(month.month)}
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-600">{month.newCases} novos</span>
                  <span className="text-green-600">{month.completed} concluídos</span>
                  <span className="font-medium">{formatCurrency(month.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Pagamento</CardTitle>
          <CardDescription>Análise de inadimplência e recebimentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Faturado</span>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(paymentMetrics.totalInvoiced)}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Recebido</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(paymentMetrics.totalPaid)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {paymentMetrics.paymentRate}% taxa de pagamento
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Inadimplência</span>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(paymentMetrics.totalOverdue)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {paymentMetrics.defaultRate}% taxa de inadimplência
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
