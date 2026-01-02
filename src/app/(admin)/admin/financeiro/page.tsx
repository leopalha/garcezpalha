'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, CreditCard, AlertCircle, Calendar, Download, Filter, Loader2 } from 'lucide-react'
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
import { ErrorAlert } from '@/components/ui/error-alert'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

interface FinancialDashboard {
  period: string
  dateRange: {
    start: string
    end: string
  }
  summary: {
    totalExpenses: number
    paidExpenses: number
    pendingExpenses: number
    totalChange: number
    estimatedIncome: number
    netCashFlow: number
    totalReimbursable: number
    expenseCount: number
  }
  breakdown: {
    byType: Array<{
      type: string
      total: number
      count: number
      percentage: string
    }>
    byCategory: Array<{
      category: string
      total: number
      count: number
      percentage: string
    }>
  }
  timeline: Array<{
    date: string
    amount: number
  }>
  upcomingExpenses: Array<{
    id: string
    description: string
    amount: number
    due_date: string
    category: string
    case: { case_number: string } | null
  }>
  recentExpenses: Array<{
    id: string
    description: string
    amount: number
    expense_date: string
    payment_status: string
    type: string
    category: string
    responsible: { full_name: string } | null
  }>
}

const typeLabels: Record<string, string> = {
  court_costs: 'Custas Processuais',
  travel: 'Viagens',
  office: 'Escritório',
  professional_fees: 'Honorários Profissionais',
  other: 'Outros'
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Pago', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800' }
}

export default function FinanceiroPage() {
  const [dashboard, setDashboard] = useState<FinancialDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [period, setPeriod] = useState<string>('month')

  useEffect(() => {
    loadDashboard()
  }, [period])

  async function loadDashboard() {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/financial/dashboard?period=${period}`)

      if (!response.ok) {
        throw new Error('Erro ao carregar dashboard financeiro')
      }

      const data = await response.json()
      setDashboard(data)
    } catch (err) {
      console.error('Error loading dashboard:', err)
      setError(err instanceof Error ? err : new Error('Erro desconhecido'))
    } finally {
      setIsLoading(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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
        <ErrorAlert error={error.message} retry={loadDashboard} />
      </div>
    )
  }

  if (!dashboard) {
    return null
  }

  const { summary, breakdown, upcomingExpenses, recentExpenses } = dashboard

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral das finanças do escritório
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>

          <Link href="/admin/despesas">
            <Button>Ver Todas Despesas</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalExpenses)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {summary.totalChange >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1 text-red-600" />
                  <span className="text-red-600">+{summary.totalChange.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-green-600">{summary.totalChange.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Pagas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.paidExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.expenseCount} despesas registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.pendingExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fluxo de Caixa Líquido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(summary.netCashFlow)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Receita estimada: {formatCurrency(summary.estimatedIncome)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Expenses by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Tipo</CardTitle>
            <CardDescription>Distribuição por categoria de despesa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {breakdown.byType.slice(0, 5).map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {typeLabels[item.type] || item.type}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-4 text-sm font-medium">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Principais Categorias</CardTitle>
            <CardDescription>Top 5 categorias com mais despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {breakdown.byCategory.map((item, idx) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.count} {item.count === 1 ? 'despesa' : 'despesas'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming and Recent Expenses */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Vencimentos</CardTitle>
            <CardDescription>Despesas pendentes com data de vencimento</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma despesa pendente com vencimento próximo
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingExpenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {expense.category}
                        </Badge>
                        {expense.case && (
                          <span className="text-xs text-muted-foreground">
                            Caso: {expense.case.case_number}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Vence em {formatDate(expense.due_date)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold ml-2">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Despesas Recentes</CardTitle>
            <CardDescription>Últimas despesas registradas</CardDescription>
          </CardHeader>
          <CardContent>
            {recentExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma despesa registrada
              </p>
            ) : (
              <div className="space-y-3">
                {recentExpenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{expense.description}</p>
                        <Badge
                          variant="secondary"
                          className={statusConfig[expense.payment_status]?.color}
                        >
                          {statusConfig[expense.payment_status]?.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {typeLabels[expense.type]} • {expense.category}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(expense.expense_date)} • {expense.responsible?.full_name || 'N/A'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold ml-2">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reimbursable Expenses Alert */}
      {summary.totalReimbursable > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900">
                  Despesas Reembolsáveis Pendentes
                </h3>
                <p className="text-sm text-amber-800 mt-1">
                  Há {formatCurrency(summary.totalReimbursable)} em despesas reembolsáveis aguardando processamento.
                </p>
              </div>
              <Link href="/admin/despesas?filter=reimbursable">
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
