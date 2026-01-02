import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:admin:marketing:campanhas:id')

const updateCampaignSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().optional(),
  channel: z.string().optional(),
  target_audience: z.string().optional(),
  content: z.record(z.string(), z.any()).optional(),
  settings: z.record(z.string(), z.any()).optional(),
  budget: z.number().optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'cancelled']).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
})

/**
 * GET /api/admin/marketing/campanhas/[id]
 * Get single campaign
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({ campaign })

  } catch (error) {
    logger.error('Error fetching campaign', error)
    return NextResponse.json({ error: 'Erro ao buscar campanha' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/marketing/campanhas/[id]
 * Update campaign
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateCampaignSchema.parse(body)

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      logger.error('Error updating campaign', error)
      throw error
    }

    logger.info('Campaign updated', { campaignId: params.id })

    return NextResponse.json({ campaign })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: formatZodErrors(error),
      }, { status: 400 })
    }

    logger.error('Error updating campaign', error)
    return NextResponse.json({ error: 'Erro ao atualizar campanha' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/marketing/campanhas/[id]
 * Delete campaign
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    logger.info('Deleting campaign', { campaignId: params.id, userId: session.user.id })

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', params.id)

    if (error) {
      logger.error('Error deleting campaign', error)
      throw error
    }

    logger.info('Campaign deleted successfully', { campaignId: params.id })

    return NextResponse.json({
      success: true,
      message: 'Campanha deletada com sucesso'
    })

  } catch (error) {
    logger.error('Error deleting campaign', error)
    return NextResponse.json({
      error: 'Erro ao deletar campanha'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
