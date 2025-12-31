/**
 * Clients Management API
 * P4-003: Gestão de clientes do advogado com filtros avançados
 *
 * GET /api/app/clients
 * Query params: status, source, product, search, limit, offset
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/route-handler'

export const dynamic = 'force-dynamic'

// Database types
interface LeadFromDB {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  score: number | null
  status: string
  source: string | null
  product_id: string | null
  created_at: string
  updated_at: string
}

interface PaymentFromDB {
  amount: number
  lead_id?: string
}

interface LeadStats {
  id: string
  status: string
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  score: number
  status: string
  source: string
  product: string
  conversationsCount: number
  totalValue: number
  lastContact: string
  createdAt: string
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient()

    // Autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Buscar tenant_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', session.user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const tenantId = userData.tenant_id

    // Query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const source = searchParams.get('source')
    const productId = searchParams.get('product')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Query base
    let query = supabase
      .from('leads')
      .select(
        `
        id,
        name,
        email,
        phone,
        score,
        status,
        source,
        product_id,
        created_at,
        updated_at
      `,
        { count: 'exact' }
      )
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status)
    }

    if (source) {
      query = query.eq('source', source)
    }

    if (productId) {
      query = query.eq('product_id', productId)
    }

    if (search) {
      // Busca por nome ou email (case insensitive)
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Paginação
    query = query.range(offset, offset + limit - 1)

    const { data: leads, error, count } = await query

    if (error) {
      console.error('[Clients API] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Enriquecer dados com conversas e pagamentos
    const clients: Client[] = await Promise.all(
      (leads || []).map(async (lead: LeadFromDB) => {
        // Buscar conversas do lead
        const { data: conversations } = await supabase
          .from('conversations')
          .select('id')
          .eq('lead_id', lead.id)

        const conversationsCount = conversations?.length || 0

        // Buscar pagamentos do lead
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .eq('lead_id', lead.id)
          .eq('status', 'succeeded')

        const totalValue =
          payments?.reduce((sum: number, p: PaymentFromDB) => sum + (p.amount || 0), 0) || 0

        // Buscar produto nome
        let productName = '-'
        if (lead.product_id) {
          const { data: product } = await supabase
            .from('products')
            .select('name')
            .eq('id', lead.product_id)
            .single()

          productName = product?.name || '-'
        }

        return {
          id: lead.id,
          name: lead.name || 'Sem nome',
          email: lead.email || '',
          phone: lead.phone || '',
          score: lead.score || 0,
          status: lead.status || 'new',
          source: lead.source || 'unknown',
          product: productName,
          conversationsCount,
          totalValue,
          lastContact: lead.updated_at || lead.created_at,
          createdAt: lead.created_at,
        }
      })
    )

    // Calcular stats gerais
    const { data: allLeads } = await supabase
      .from('leads')
      .select('id, status')
      .eq('tenant_id', tenantId)

    const total = allLeads?.length || 0
    const qualified =
      allLeads?.filter((l: LeadStats) => l.status === 'qualified').length || 0
    const converted =
      allLeads?.filter((l: LeadStats) => l.status === 'converted').length || 0

    const { data: allPayments } = await supabase
      .from('payments')
      .select('amount, lead_id')
      .eq('tenant_id', tenantId)
      .eq('status', 'succeeded')

    const totalRevenue =
      allPayments?.reduce((sum: number, p: PaymentFromDB) => sum + (p.amount || 0), 0) || 0

    const stats = {
      total,
      qualified,
      converted,
      conversionRate: total > 0 ? Math.round((converted / total) * 1000) / 10 : 0,
      totalRevenue,
    }

    return NextResponse.json({
      clients,
      total: count || 0,
      limit,
      offset,
      stats,
    })
  } catch (error) {
    console.error('[Clients API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
