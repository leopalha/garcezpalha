import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// Cash Flow Forecasting - AI-Powered Predictions
// ============================================================================

type CashFlowForecast = {
  period: string
  startDate: string
  endDate: string
  currentBalance: number
  projectedIncome: number
  projectedExpenses: number
  projectedBalance: number
  confidence: number
  breakdown: {
    confirmedIncome: number
    estimatedIncome: number
    recurringExpenses: number
    projectedExpenses: number
    contingency: number
  }
  timeline: Array<{
    date: string
    balance: number
    income: number
    expenses: number
  }>
  risks: Array<{
    type: string
    description: string
    impact: number
    probability: string
  }>
  recommendations: string[]
}

// ============================================================================
// GET /api/admin/financial/cash-flow/forecast
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // month, quarter, year
    const bankAccount = searchParams.get('bankAccount')

    // Calculate date range
    const today = new Date()
    const startDate = new Date(today)
    const endDate = new Date(today)

    if (period === 'month') {
      endDate.setMonth(endDate.getMonth() + 1)
    } else if (period === 'quarter') {
      endDate.setMonth(endDate.getMonth() + 3)
    } else if (period === 'year') {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }

    // Get current balance from latest bank transaction
    let currentBalance = 0
    if (bankAccount) {
      const { data: latestTransaction } = await supabase
        .from('bank_transactions')
        .select('balance')
        .eq('bank_account', bankAccount)
        .order('transaction_date', { ascending: false })
        .limit(1)
        .single()

      currentBalance = latestTransaction?.balance || 0
    }

    // Get confirmed future income (paid invoices with future payment dates)
    const { data: confirmedInvoices } = await supabase
      .from('invoices')
      .select('total_amount, payment_date')
      .eq('status', 'pending')
      .gte('payment_date', startDate.toISOString())
      .lte('payment_date', endDate.toISOString())

    const confirmedIncome = (confirmedInvoices || []).reduce((sum, inv) => sum + inv.total_amount, 0)

    // Estimate recurring income based on historical data
    const { data: historicalInvoices } = await supabase
      .from('invoices')
      .select('total_amount, created_at')
      .eq('status', 'paid')
      .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())

    const avgMonthlyIncome =
      (historicalInvoices || []).reduce((sum, inv) => sum + inv.total_amount, 0) /
      (historicalInvoices?.length || 1)

    const monthsInPeriod = period === 'month' ? 1 : period === 'quarter' ? 3 : 12
    const estimatedIncome = avgMonthlyIncome * monthsInPeriod * 0.8 // 80% conservative estimate

    // Get confirmed future expenses
    const { data: confirmedExpenses } = await supabase
      .from('expenses')
      .select('amount, due_date')
      .eq('payment_status', 'pending')
      .gte('due_date', startDate.toISOString())
      .lte('due_date', endDate.toISOString())

    const recurringExpenses = (confirmedExpenses || []).reduce((sum, exp) => sum + exp.amount, 0)

    // Estimate variable expenses based on historical data
    const { data: historicalExpenses } = await supabase
      .from('expenses')
      .select('amount, expense_date')
      .eq('payment_status', 'paid')
      .gte('expense_date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())

    const avgMonthlyExpenses =
      (historicalExpenses || []).reduce((sum, exp) => sum + exp.amount, 0) /
      (historicalExpenses?.length || 1)

    const projectedExpenses = avgMonthlyExpenses * monthsInPeriod * 1.1 // 110% buffer

    // Calculate contingency (10% of expenses)
    const contingency = projectedExpenses * 0.1

    // Calculate projections
    const totalIncome = confirmedIncome + estimatedIncome
    const totalExpenses = recurringExpenses + projectedExpenses + contingency
    const projectedBalance = currentBalance + totalIncome - totalExpenses

    // Generate timeline (daily for month, weekly for quarter, monthly for year)
    const timeline: Array<{ date: string; balance: number; income: number; expenses: number }> = []
    const timelinePoints = period === 'month' ? 30 : period === 'quarter' ? 12 : 12
    const daysPerPoint = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) / timelinePoints)

    let runningBalance = currentBalance
    for (let i = 0; i <= timelinePoints; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i * daysPerPoint)

      const dayIncome = totalIncome / timelinePoints
      const dayExpenses = totalExpenses / timelinePoints

      runningBalance += dayIncome - dayExpenses

      timeline.push({
        date: date.toISOString(),
        balance: Math.round(runningBalance),
        income: Math.round(dayIncome),
        expenses: Math.round(dayExpenses),
      })
    }

    // Identify risks
    const risks = []

    if (projectedBalance < 0) {
      risks.push({
        type: 'cash_shortage',
        description: 'Fluxo de caixa negativo projetado',
        impact: Math.abs(projectedBalance),
        probability: 'high',
      })
    }

    if (confirmedIncome < totalExpenses * 0.5) {
      risks.push({
        type: 'low_confirmed_revenue',
        description: 'Receita confirmada insuficiente para cobrir despesas',
        impact: totalExpenses - confirmedIncome,
        probability: 'medium',
      })
    }

    if (timeline.some((t) => t.balance < currentBalance * 0.2)) {
      risks.push({
        type: 'low_balance',
        description: 'Saldo pode cair abaixo de 20% do atual',
        impact: currentBalance * 0.2,
        probability: 'medium',
      })
    }

    // Generate recommendations
    const recommendations = []

    if (projectedBalance < 0) {
      recommendations.push('Considere renegociar prazos de pagamento ou buscar capital de giro')
    }

    if (confirmedIncome < totalExpenses) {
      recommendations.push('Intensifique a cobrança de clientes inadimplentes')
      recommendations.push('Revise despesas não essenciais para redução de custos')
    }

    if (risks.length === 0) {
      recommendations.push('Fluxo de caixa saudável - considere investir excedentes')
    }

    recommendations.push('Atualize previsões semanalmente para maior precisão')

    // Calculate confidence score
    const dataPoints = (historicalInvoices?.length || 0) + (historicalExpenses?.length || 0)
    const confidence = Math.min(95, 50 + dataPoints * 2) // Max 95% confidence

    const forecast: CashFlowForecast = {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      currentBalance,
      projectedIncome: Math.round(totalIncome),
      projectedExpenses: Math.round(totalExpenses),
      projectedBalance: Math.round(projectedBalance),
      confidence,
      breakdown: {
        confirmedIncome: Math.round(confirmedIncome),
        estimatedIncome: Math.round(estimatedIncome),
        recurringExpenses: Math.round(recurringExpenses),
        projectedExpenses: Math.round(projectedExpenses),
        contingency: Math.round(contingency),
      },
      timeline,
      risks,
      recommendations,
    }

    return NextResponse.json({ forecast })
  } catch (err) {
    logger.error('[GET /api/admin/financial/cash-flow/forecast] Error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
