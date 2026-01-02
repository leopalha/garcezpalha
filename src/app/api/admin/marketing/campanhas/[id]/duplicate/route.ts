import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

const logger = createLogger('api:admin:marketing:campanhas:duplicate')

/**
 * POST /api/admin/marketing/campanhas/[id]/duplicate
 * Duplicate a marketing campaign
 */
export async function POST(
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

    const campaignId = params.id

    logger.info('Duplicating campaign', { campaignId, userId: session.user.id })

    // Get original campaign
    const { data: originalCampaign, error: fetchError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()

    if (fetchError || !originalCampaign) {
      return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 })
    }

    // Create duplicate
    const duplicateName = `${originalCampaign.name} (Cópia)`

    const { data: newCampaign, error: createError } = await supabase
      .from('campaigns')
      .insert({
        name: duplicateName,
        type: originalCampaign.type,
        channel: originalCampaign.channel,
        target_audience: originalCampaign.target_audience,
        content: originalCampaign.content,
        settings: originalCampaign.settings,
        budget: originalCampaign.budget,
        status: 'draft', // Always create as draft
        start_date: null, // Clear dates
        end_date: null,
        created_by: session.user.id
      })
      .select()
      .single()

    if (createError) {
      logger.error('Error creating duplicate campaign', createError)
      throw createError
    }

    logger.info('Campaign duplicated successfully', {
      originalId: campaignId,
      newId: newCampaign.id
    })

    return NextResponse.json({
      success: true,
      campaign: newCampaign,
      message: 'Campanha duplicada com sucesso'
    })

  } catch (error) {
    logger.error('Error duplicating campaign', error)
    return NextResponse.json({
      error: 'Erro ao duplicar campanha'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
