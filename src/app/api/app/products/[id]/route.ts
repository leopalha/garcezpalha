/**
 * Product Detail API
 * P4-002: CRUD completo - GET/PATCH/DELETE individual
 *
 * GET /api/app/products/[id] - Detalhes do produto
 * PATCH /api/app/products/[id] - Edita produto
 * DELETE /api/app/products/[id] - Remove produto
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Helper: Verificar ownership do produto
async function verifyProductOwnership(
  supabase: any,
  productId: string,
  userId: string
) {
  // Buscar tenant do usuário
  const { data: userData } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', userId)
    .single()

  if (!userData) {
    return { authorized: false, tenantId: null }
  }

  // Verificar se produto pertence ao tenant
  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('id', productId)
    .eq('tenant_id', userData.tenant_id)
    .single()

  return {
    authorized: !!product,
    tenantId: userData.tenant_id,
  }
}

// GET: Detalhes do produto
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar ownership
    const { authorized } = await verifyProductOwnership(
      supabase,
      params.id,
      session.user.id
    )

    if (!authorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Buscar produto
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('[Product Detail] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Buscar stats detalhados
    const { data: leads } = await supabase
      .from('leads')
      .select('status, created_at')
      .eq('product_id', params.id)

    const totalLeads = leads?.length || 0
    const convertedLeads =
      leads?.filter((l) => l.status === 'converted').length || 0

    const { data: payments } = await supabase
      .from('payments')
      .select('amount, created_at')
      .eq('product_id', params.id)
      .eq('status', 'succeeded')

    const revenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    // Leads por status
    const leadsByStatus = {
      new: leads?.filter((l) => l.status === 'new').length || 0,
      contacted: leads?.filter((l) => l.status === 'contacted').length || 0,
      qualified: leads?.filter((l) => l.status === 'qualified').length || 0,
      converted: convertedLeads,
      lost: leads?.filter((l) => l.status === 'lost').length || 0,
    }

    // Timeline de leads (últimos 30 dias)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentLeads = leads?.filter(
      (l) => new Date(l.created_at) >= thirtyDaysAgo
    )

    const timeline = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const dateStr = date.toISOString().split('T')[0]

      const count =
        recentLeads?.filter(
          (l) => l.created_at.split('T')[0] === dateStr
        ).length || 0

      return { date: dateStr, count }
    })

    return NextResponse.json({
      ...product,
      stats: {
        leads: totalLeads,
        converted: convertedLeads,
        conversionRate:
          totalLeads > 0
            ? Math.round((convertedLeads / totalLeads) * 1000) / 10
            : 0,
        revenue,
        leadsByStatus,
        timeline,
      },
    })
  } catch (error) {
    console.error('[Product Detail] GET Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH: Editar produto
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar ownership
    const { authorized } = await verifyProductOwnership(
      supabase,
      params.id,
      session.user.id
    )

    if (!authorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse body
    const body = await request.json()

    // Campos permitidos para atualização
    const allowedFields = [
      'name',
      'category',
      'price',
      'description',
      'questions',
      'proposal_template',
      'landing_page_config',
      'status',
    ]

    const updateData: any = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Atualizar slug se nome mudou
    if (body.name) {
      updateData.slug = body.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    updateData.updated_at = new Date().toISOString()

    // Atualizar produto
    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('[Product Detail] Update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('[Product Detail] PATCH Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Remover produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar ownership
    const { authorized } = await verifyProductOwnership(
      supabase,
      params.id,
      session.user.id
    )

    if (!authorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verificar se há leads associados
    const { data: leads } = await supabase
      .from('leads')
      .select('id')
      .eq('product_id', params.id)

    if (leads && leads.length > 0) {
      // Soft delete: arquivar ao invés de deletar
      const { error } = await supabase
        .from('products')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('id', params.id)

      if (error) {
        console.error('[Product Detail] Archive error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({
        message: 'Product archived (has associated leads)',
        archived: true,
      })
    }

    // Hard delete se não há leads
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('[Product Detail] Delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    console.error('[Product Detail] DELETE Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
