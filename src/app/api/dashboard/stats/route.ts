/**
 * Dashboard Stats API (Real Data)
 * P4-001: Substituir mock data por queries reais do Supabase
 *
 * GET /api/dashboard/stats
 * Returns: KPIs do dashboard principal do advogado
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/route-handler'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// Database types
type ProductStatus = 'published' | 'draft'
type LeadStatus = 'new' | 'qualified' | 'converted'
type ConversationStatus = 'bot' | 'human' | 'waiting_human' | 'completed'

interface Product {
  id: string
  status: ProductStatus
}

interface Lead {
  id: string
  status: LeadStatus
  created_at: string
}

interface Conversation {
  id: string
  status: ConversationStatus
  created_at: string
  updated_at: string
  satisfaction_rating: number | null
}

interface Payment {
  amount: number
  status: string
  created_at: string
}

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
    const supabase = createRouteHandlerClient()

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
      logger.error('[Dashboard Stats] User not found:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const tenantId = (userData as any).tenant_id

    // 3. Buscar stats de produtos
    const { data: products, error: productsError } = await (supabase as any)
      .from('products')
      .select('id, status')
      .eq('tenant_id', tenantId)

    if (productsError) {
      logger.error('[Dashboard Stats] Products error:', productsError)
    }

    const productsStats = {
      total: products?.length || 0,
      published: products?.filter((p: Product) => p.status === 'published').length || 0,
      draft: products?.filter((p: Product) => p.status === 'draft').length || 0,
    }

    // 4. Buscar stats de leads (últimos 30 dias)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: leads, error: leadsError } = await (supabase as any)
      .from('leads')
      .select('id, status, created_at')
      .eq('tenant_id', tenantId)
      .gte('created_at', thirtyDaysAgo.toISOString())

    if (leadsError) {
      logger.error('[Dashboard Stats] Leads error:', leadsError)
    }

    const totalLeads = leads?.length || 0
    const newLeads = leads?.filter((l: Lead) => l.status === 'new').length || 0
    const qualifiedLeads =
      leads?.filter((l: Lead) => l.status === 'qualified').length || 0
    const convertedLeads =
      leads?.filter((l: Lead) => l.status === 'converted').length || 0

    const leadsStats = {
      total: totalLeads,
      new: newLeads,
      qualified: qualifiedLeads,
      converted: convertedLeads,
      conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0,
    }

    // 5. Buscar stats do Agent IA
    const { data: conversations, error: conversationsError } = await (supabase as any)
      .from('conversations')
      .select('id, status, created_at, updated_at, satisfaction_rating')
      .eq('tenant_id', tenantId)
      .gte('created_at', thirtyDaysAgo.toISOString())

    if (conversationsError) {
      logger.error('[Dashboard Stats] Conversations error:', conversationsError)
    }

    const totalConversations = conversations?.length || 0
    const activeConversations =
      conversations?.filter(
        (c: Conversation) => c.status === 'bot' || c.status === 'human' || c.status === 'waiting_human'
      ).length || 0

    // Calcular tempo médio de resposta (usando created_at - updated_at como proxy)
    const responseTimes = conversations
      ?.filter((c: Conversation) => c.updated_at && c.created_at)
      .map((c: Conversation) => {
        const start = new Date(c.created_at).getTime()
        const end = new Date(c.updated_at).getTime()
        return (end - start) / 1000 // segundos
      }) || []

    const averageResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length
        : 0

    // Calcular satisfação média
    const ratings = conversations
      ?.filter((c: Conversation) => c.satisfaction_rating !== null)
      .map((c: Conversation) => c.satisfaction_rating as number) || []

    const satisfactionScore =
      ratings.length > 0
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
        : 0

    // Taxa de escalação (% conversas escaladas para humano)
    const escalatedConversations =
      conversations?.filter((c: Conversation) => c.status === 'waiting_human' || c.status === 'human')
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
    const { data: payments, error: paymentsError } = await (supabase as any)
      .from('payments')
      .select('amount, status, created_at')
      .eq('tenant_id', tenantId)
      .eq('status', 'succeeded')
      .gte('created_at', firstDayTwoMonthsAgo.toISOString())

    if (paymentsError) {
      logger.error('[Dashboard Stats] Payments error:', paymentsError)
    }

    const totalRevenue =
      payments?.reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0) || 0

    const thisMonthRevenue =
      payments
        ?.filter((p: Payment) => new Date(p.created_at) >= firstDayThisMonth)
        .reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0) || 0

    const lastMonthRevenue =
      payments
        ?.filter(
          (p: Payment) =>
            new Date(p.created_at) >= firstDayLastMonth &&
            new Date(p.created_at) < firstDayThisMonth
        )
        .reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0) || 0

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
    logger.error('[Dashboard Stats] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
