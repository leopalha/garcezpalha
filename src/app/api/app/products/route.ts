/**
 * Products API - List & Create
 * P4-002: CRUD completo de produtos jurídicos
 *
 * GET /api/app/products - Lista produtos do tenant
 * POST /api/app/products - Cria novo produto
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/route-handler'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// Database types
interface LeadFromDB {
  status: string
}

interface PaymentFromDB {
  amount: number
}

interface LandingPageConfig {
  hero?: unknown
  features?: unknown[]
  faq?: unknown[]
  [key: string]: unknown
}

interface QualificationQuestion {
  id?: string
  question: string
  type: string
  options?: string[]
  [key: string]: unknown
}

interface Product {
  id: string
  tenant_id: string
  name: string
  category: string
  price: number
  description: string
  questions: QualificationQuestion[]
  proposal_template: string
  landing_page_config: LandingPageConfig
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

// GET: Lista produtos
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
    const { data: userData } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', session.user.id)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const tenantId = (userData as any).tenant_id

    // Query params para filtros
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Buscar produtos
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data: products, error, count } = await query

    if (error) {
      logger.error('[Products API] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calcular stats por produto (leads, conversão, receita)
    const productsWithStats = await Promise.all(
      (products || []).map(async (product) => {
        // Buscar leads deste produto
        const { data: leads } = await supabase
          .from('leads')
          .select('status')
          .eq('product_id', product.id)

        const totalLeads = leads?.length || 0
        const convertedLeads =
          leads?.filter((l) => l.status === 'converted').length || 0
        const conversionRate =
          totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

        // Buscar receita deste produto
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .eq('product_id', product.id)
          .eq('status', 'succeeded')

        const revenue = payments?.reduce((sum: number, p: PaymentFromDB) => sum + (p.amount || 0), 0) || 0

        return {
          ...product,
          stats: {
            leads: totalLeads,
            converted: convertedLeads,
            conversionRate: Math.round(conversionRate * 10) / 10,
            revenue,
          },
        }
      })
    )

    return NextResponse.json({
      products: productsWithStats,
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    logger.error('[Products API] GET Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Criar produto
export async function POST(request: NextRequest) {
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
    const { data: userData } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', session.user.id)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const tenantId = (userData as any).tenant_id

    // Parse body
    const body = await request.json()

    // Validações
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // Criar slug do nome
    const slug = body.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Criar produto
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        tenant_id: tenantId,
        name: body.name,
        slug,
        category: body.category,
        price: body.price || 0,
        description: body.description || '',
        questions: body.questions || [],
        proposal_template: body.proposal_template || '',
        landing_page_config: body.landing_page_config || {},
        status: body.status || 'draft',
      } as any)
      .select()
      .single()

    if (error) {
      logger.error('[Products API] Create error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    logger.error('[Products API] POST Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
