/**
 * Dashboard Stats API (Real Data)
 * P4-001: Substituir mock data por queries reais do Supabase
 *
 * GET /api/app/dashboard/stats
 * Returns: KPIs do dashboard principal do advogado
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/route-handler'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

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
    averageResponseTime: number // em segundos
    satisfactionScore: number // 0-5
    escalationRate: number // %
  }
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number // %
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // 1. Verificar autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Buscar tenant_id do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', session.user.id)
      .single()

    if (userError || !userData) {
      console.error('[Dashboard Stats] User not found:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const tenantId = userData.tenant_id

    // 3. Buscar stats de produtos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, status')
      .eq('tenant_id', tenantId)

    if (productsError) {
      console.error('[Dashboard Stats] Products error:', productsError)
    }

    const productsStats = {
      total: products?.length || 0,
      published: products?.filter((p) => p.status === 'published').length || 0,
      draft: products?.filter((p) => p.status === 'draft').length || 0,
    }

    // 4. Buscar stats de leads (últimos 30 dias)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, status, created_at')
      .eq('tenant_id', tenantId)
      .gte('created_at', thirtyDaysAgo.toISOString())

    if (leadsError) {
      console.error('[Dashboard Stats] Leads error:', leadsError)
    }

    const totalLeads = leads?.length || 0
    const newLeads = leads?.filter((l) => l.status === 'new').length || 0
    const qualifiedLeads =
      leads?.filter((l) => l.status === 'qualified').length || 0
    const convertedLeads =
      leads?.filter((l) => l.status === 'converted').length || 0

    const leadsStats = {
      total: totalLeads,
      new: newLeads,
      qualified: qualifiedLeads,
      converted: convertedLeads,
      conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0,
    }

    // 5. Buscar stats do Agent IA
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('id, status, created_at, updated_at, satisfaction_rating')
      .eq('tenant_id', tenantId)
      .gte('created_at', thirtyDaysAgo.toISOString())

    if (conversationsError) {
      console.error('[Dashboard Stats] Conversations error:', conversationsError)
    }

    const totalConversations = conversations?.length || 0
    const activeConversations =
      conversations?.filter(
        (c) => c.status === 'bot' || c.status === 'human' || c.status === 'waiting_human'
      ).length || 0

    // Calcular tempo médio de resposta (usando created_at - updated_at como proxy)
    const responseTimes = conversations
      ?.filter((c) => c.updated_at && c.created_at)
      .map((c) => {
        const start = new Date(c.created_at).getTime()
        const end = new Date(c.updated_at).getTime()
        return (end - start) / 1000 // segundos
      }) || []

    const averageResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0

    // Calcular satisfação média
    const ratings = conversations
      ?.filter((c) => c.satisfaction_rating !== null)
      .map((c) => c.satisfaction_rating) || []

    const satisfactionScore =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0

    // Taxa de escalação (% conversas escaladas para humano)
    const escalatedConversations =
      conversations?.filter((c) => c.status === 'waiting_human' || c.status === 'human')
        .length || 0

    const escalationRate =
      totalConversations > 0
        ? (escalatedConversations / totalConversations) * 100
        : 0

    const agentStats = {
      totalConversations,
      activeConversations,
      averageResponseTime: Math.round(averageResponseTime),
      satisfactionScore: Math.round(satisfactionScore * 10) / 10,
      escalationRate: Math.round(escalationRate * 10) / 10,
    }

    // 6. Buscar receita (últimos 2 meses para calcular growth)
    const now = new Date()
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const firstDayTwoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)

    // Buscar pagamentos confirmados
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount, status, created_at')
      .eq('tenant_id', tenantId)
      .eq('status', 'succeeded')
      .gte('created_at', firstDayTwoMonthsAgo.toISOString())

    if (paymentsError) {
      console.error('[Dashboard Stats] Payments error:', paymentsError)
    }

    const totalRevenue =
      payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    const thisMonthRevenue =
      payments
        ?.filter((p) => new Date(p.created_at) >= firstDayThisMonth)
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    const lastMonthRevenue =
      payments
        ?.filter(
          (p) =>
            new Date(p.created_at) >= firstDayLastMonth &&
            new Date(p.created_at) < firstDayThisMonth
        )
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0

    const revenueStats = {
      total: totalRevenue,
      thisMonth: thisMonthRevenue,
      lastMonth: lastMonthRevenue,
      growth: Math.round(revenueGrowth * 10) / 10,
    }

    // 7. Retornar todas as stats
    const stats: DashboardStats = {
      products: productsStats,
      leads: leadsStats,
      agent: agentStats,
      revenue: revenueStats,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('[Dashboard Stats] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
