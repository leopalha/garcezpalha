import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

const logger = createLogger('api:admin:financial:dashboard')

/**
 * GET /api/admin/financial/dashboard
 * Get financial dashboard data with metrics and summaries
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
      logger.warn('Unauthorized role tried to access financial dashboard', {
        userId: session.user.id,
        role: profile?.role
      })
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Get query parameters for date range
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // 'week', 'month', 'quarter', 'year'

    // Calculate date ranges
    const now = new Date()
    const currentPeriodStart = new Date()
    const previousPeriodStart = new Date()
    const previousPeriodEnd = new Date()

    if (period === 'week') {
      currentPeriodStart.setDate(now.getDate() - 7)
      previousPeriodStart.setDate(now.getDate() - 14)
      previousPeriodEnd.setDate(now.getDate() - 7)
    } else if (period === 'month') {
      currentPeriodStart.setMonth(now.getMonth() - 1)
      previousPeriodStart.setMonth(now.getMonth() - 2)
      previousPeriodEnd.setMonth(now.getMonth() - 1)
    } else if (period === 'quarter') {
      currentPeriodStart.setMonth(now.getMonth() - 3)
      previousPeriodStart.setMonth(now.getMonth() - 6)
      previousPeriodEnd.setMonth(now.getMonth() - 3)
    } else if (period === 'year') {
      currentPeriodStart.setFullYear(now.getFullYear() - 1)
      previousPeriodStart.setFullYear(now.getFullYear() - 2)
      previousPeriodEnd.setFullYear(now.getFullYear() - 1)
    }

    logger.info('Fetching financial dashboard', {
      userId: session.user.id,
      period,
      dateRange: {
        start: currentPeriodStart.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      }
    })

    // Get current period expenses
    const { data: currentExpenses } = await supabase
      .from('expenses')
      .select('amount, payment_status, type, category, expense_date')
      .gte('expense_date', currentPeriodStart.toISOString().split('T')[0])
      .lte('expense_date', now.toISOString().split('T')[0])
      .neq('payment_status', 'cancelled')

    // Get previous period expenses for comparison
    const { data: previousExpenses } = await supabase
      .from('expenses')
      .select('amount, payment_status')
      .gte('expense_date', previousPeriodStart.toISOString().split('T')[0])
      .lte('expense_date', previousPeriodEnd.toISOString().split('T')[0])
      .neq('payment_status', 'cancelled')

    // Calculate current period metrics
    const currentTotal = currentExpenses?.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0) || 0
    const currentPending = currentExpenses
      ?.filter(exp => exp.payment_status === 'pending')
      .reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0) || 0
    const currentPaid = currentExpenses
      ?.filter(exp => exp.payment_status === 'paid')
      .reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0) || 0

    // Calculate previous period metrics for comparison
    const previousTotal = previousExpenses?.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0) || 0

    // Calculate percentage changes
    const totalChange = previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0

    // Group expenses by type
    const expensesByType = currentExpenses?.reduce((acc: any, exp) => {
      const type = exp.type
      if (!acc[type]) {
        acc[type] = { total: 0, count: 0 }
      }
      acc[type].total += parseFloat(exp.amount.toString())
      acc[type].count += 1
      return acc
    }, {}) || {}

    // Group expenses by category
    const expensesByCategory = currentExpenses?.reduce((acc: any, exp) => {
      const category = exp.category
      if (!acc[category]) {
        acc[category] = { total: 0, count: 0 }
      }
      acc[category].total += parseFloat(exp.amount.toString())
      acc[category].count += 1
      return acc
    }, {}) || {}

    // Get top 5 categories by amount
    const topCategories = Object.entries(expensesByCategory)
      .map(([category, data]: [string, any]) => ({
        category,
        total: data.total,
        count: data.count
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

    // Calculate daily expenses for chart
    const dailyExpenses: Record<string, number> = {}
    currentExpenses?.forEach(exp => {
      const date = exp.expense_date
      if (!dailyExpenses[date]) {
        dailyExpenses[date] = 0
      }
      dailyExpenses[date] += parseFloat(exp.amount.toString())
    })

    // Convert to array and sort by date
    const expenseTimeline = Object.entries(dailyExpenses)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Get pending expenses (upcoming payments)
    const { data: upcomingExpenses } = await supabase
      .from('expenses')
      .select(`
        id,
        description,
        amount,
        due_date,
        category,
        case:cases(case_number)
      `)
      .eq('payment_status', 'pending')
      .not('due_date', 'is', null)
      .gte('due_date', now.toISOString().split('T')[0])
      .order('due_date', { ascending: true })
      .limit(10)

    // Get recent expenses
    const { data: recentExpenses } = await supabase
      .from('expenses')
      .select(`
        id,
        description,
        amount,
        expense_date,
        payment_status,
        type,
        category,
        responsible:profiles!expenses_responsible_id_fkey(full_name)
      `)
      .order('expense_date', { ascending: false })
      .limit(10)

    // Calculate cash flow (income - expenses)
    // For now, we'll use a placeholder for income
    // TODO: Implement proper income tracking
    const estimatedIncome = currentTotal * 2.5 // Placeholder: assume income is 2.5x expenses
    const netCashFlow = estimatedIncome - currentPaid

    // Get reimbursable expenses
    const { data: reimbursableExpenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('is_reimbursable', true)
      .eq('reimbursed', false)
      .neq('payment_status', 'cancelled')

    const totalReimbursable = reimbursableExpenses?.reduce((sum, exp) =>
      sum + parseFloat(exp.amount.toString()), 0) || 0

    const response = {
      period,
      dateRange: {
        start: currentPeriodStart.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      },
      summary: {
        totalExpenses: currentTotal,
        paidExpenses: currentPaid,
        pendingExpenses: currentPending,
        totalChange: parseFloat(totalChange.toFixed(2)),
        estimatedIncome, // Placeholder
        netCashFlow,
        totalReimbursable,
        expenseCount: currentExpenses?.length || 0
      },
      breakdown: {
        byType: Object.entries(expensesByType).map(([type, data]: [string, any]) => ({
          type,
          total: data.total,
          count: data.count,
          percentage: ((data.total / currentTotal) * 100).toFixed(1)
        })),
        byCategory: topCategories.map(cat => ({
          ...cat,
          percentage: ((cat.total / currentTotal) * 100).toFixed(1)
        }))
      },
      timeline: expenseTimeline,
      upcomingExpenses: upcomingExpenses || [],
      recentExpenses: recentExpenses || []
    }

    logger.info('Financial dashboard data retrieved successfully', {
      userId: session.user.id,
      period,
      totalExpenses: currentTotal
    })

    return NextResponse.json(response)

  } catch (error) {
    logger.error('Error in financial dashboard GET', error)
    return NextResponse.json(
      { error: 'Erro ao carregar dashboard financeiro' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
