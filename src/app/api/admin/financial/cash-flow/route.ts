import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

const logger = createLogger('api:admin:financial:cash-flow')

/**
 * GET /api/admin/financial/cash-flow
 * Get cash flow report with income, expenses, and balance
 */
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logger.warn('Unauthorized access attempt')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Check if user is admin or lawyer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['admin', 'lawyer'].includes(profile.role)) {
      logger.warn('Unauthorized role tried to access cash flow', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const groupBy = searchParams.get('group_by') || 'month' // 'day', 'week', 'month', 'year'

    // Validate dates
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'start_date e end_date são obrigatórios' },
        { status: 400 }
      )
    }

    logger.info('Fetching cash flow report', {
      userId: session.user.id,
      startDate,
      endDate,
      groupBy
    })

    // Use the database function to calculate cash flow
    const { data: cashFlowData, error: cashFlowError } = await supabase
      .rpc('calculate_cash_flow', {
        p_start_date: startDate,
        p_end_date: endDate
      })

    if (cashFlowError) {
      logger.error('Error calculating cash flow', { error: cashFlowError })
      throw new Error('Failed to calculate cash flow')
    }

    const cashFlow = cashFlowData?.[0] || {
      total_income: 0,
      total_expenses: 0,
      net_cash_flow: 0
    }

    // Get detailed transactions for the period
    const { data: transactions } = await supabase
      .from('financial_transactions')
      .select('*')
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate)
      .order('transaction_date', { ascending: true })

    // Group transactions by period
    const groupedData: Record<string, any> = {}

    transactions?.forEach(transaction => {
      const date = new Date(transaction.transaction_date)
      let key: string

      if (groupBy === 'day') {
        key = date.toISOString().split('T')[0]
      } else if (groupBy === 'week') {
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
      } else if (groupBy === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      } else if (groupBy === 'year') {
        key = String(date.getFullYear())
      } else {
        key = date.toISOString().split('T')[0]
      }

      if (!groupedData[key]) {
        groupedData[key] = {
          period: key,
          income: 0,
          expenses: 0,
          netCashFlow: 0,
          transactions: []
        }
      }

      const amount = parseFloat(transaction.amount.toString())

      if (transaction.transaction_type === 'income') {
        groupedData[key].income += amount
      } else if (transaction.transaction_type === 'expense') {
        groupedData[key].expenses += amount
      }

      groupedData[key].netCashFlow = groupedData[key].income - groupedData[key].expenses
      groupedData[key].transactions.push({
        id: transaction.id,
        type: transaction.transaction_type,
        category: transaction.category,
        description: transaction.description,
        amount: amount,
        date: transaction.transaction_date
      })
    })

    // Convert to array and sort
    const periodData = Object.values(groupedData).sort((a: any, b: any) =>
      a.period.localeCompare(b.period)
    )

    // Calculate cumulative balance
    let cumulativeBalance = 0
    const periodDataWithBalance = periodData.map((period: any) => {
      cumulativeBalance += period.netCashFlow
      return {
        ...period,
        cumulativeBalance
      }
    })

    // Get expense breakdown by category using database function
    const { data: expenseSummary, error: summaryError } = await supabase
      .rpc('get_expense_summary_by_category', {
        p_start_date: startDate,
        p_end_date: endDate
      })

    if (summaryError) {
      logger.warn('Error getting expense summary', { error: summaryError })
    }

    // Calculate income breakdown (placeholder - will be replaced with actual income tracking)
    const incomeBreakdown = [
      {
        category: 'Honorários',
        total: parseFloat(cashFlow.total_income.toString()) * 0.7,
        count: 0
      },
      {
        category: 'Consultas',
        total: parseFloat(cashFlow.total_income.toString()) * 0.2,
        count: 0
      },
      {
        category: 'Outros',
        total: parseFloat(cashFlow.total_income.toString()) * 0.1,
        count: 0
      }
    ]

    // Format expense summary
    const expenseBreakdown = (expenseSummary || []).map((exp: any) => ({
      category: exp.category,
      total: parseFloat(exp.total_amount.toString()),
      count: parseInt(exp.transaction_count.toString())
    }))

    const response = {
      period: {
        startDate,
        endDate,
        groupBy
      },
      summary: {
        totalIncome: parseFloat(cashFlow.total_income.toString()),
        totalExpenses: parseFloat(cashFlow.total_expenses.toString()),
        netCashFlow: parseFloat(cashFlow.net_cash_flow.toString()),
        finalBalance: cumulativeBalance
      },
      periodData: periodDataWithBalance,
      breakdown: {
        income: incomeBreakdown,
        expenses: expenseBreakdown
      },
      metrics: {
        averageMonthlyIncome: parseFloat(cashFlow.total_income.toString()) / periodData.length || 0,
        averageMonthlyExpenses: parseFloat(cashFlow.total_expenses.toString()) / periodData.length || 0,
        profitMargin: parseFloat(cashFlow.total_income.toString()) > 0
          ? ((parseFloat(cashFlow.net_cash_flow.toString()) / parseFloat(cashFlow.total_income.toString())) * 100).toFixed(2)
          : '0'
      }
    }

    logger.info('Cash flow report retrieved successfully', {
      userId: session.user.id,
      startDate,
      endDate,
      netCashFlow: cashFlow.net_cash_flow
    })

    return NextResponse.json(response)

  } catch (error) {
    logger.error('Error in cash flow GET', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório de fluxo de caixa' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
