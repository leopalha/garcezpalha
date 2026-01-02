import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

const logger = createLogger('api:landing-pages:duplicate')

/**
 * POST /api/landing-pages/[id]/duplicate
 * Duplicate a landing page
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
    const pageId = params.id

    logger.info('Duplicating landing page', { pageId, userId: session.user.id })

    // Get original page
    const { data: originalPage, error: fetchError } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('id', pageId)
      .single()

    if (fetchError || !originalPage) {
      return NextResponse.json({ error: 'Landing page não encontrada' }, { status: 404 })
    }

    // Check ownership
    if (originalPage.created_by !== session.user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Create duplicate
    const duplicateName = `${originalPage.name} (Cópia)`
    const duplicateSlug = `${originalPage.slug}-copy-${Date.now()}`

    const { data: newPage, error: createError } = await supabase
      .from('landing_pages')
      .insert({
        name: duplicateName,
        slug: duplicateSlug,
        title: originalPage.title,
        description: originalPage.description,
        template: originalPage.template,
        content: originalPage.content,
        settings: originalPage.settings,
        seo_title: originalPage.seo_title,
        seo_description: originalPage.seo_description,
        seo_keywords: originalPage.seo_keywords,
        og_image: originalPage.og_image,
        status: 'draft', // Always create as draft
        created_by: session.user.id
      })
      .select()
      .single()

    if (createError) {
      logger.error('Error creating duplicate', createError)
      throw createError
    }

    logger.info('Landing page duplicated successfully', {
      originalId: pageId,
      newId: newPage.id
    })

    return NextResponse.json({
      success: true,
      page: newPage,
      message: 'Landing page duplicada com sucesso'
    })

  } catch (error) {
    logger.error('Error duplicating landing page', error)
    return NextResponse.json({
      error: 'Erro ao duplicar landing page'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
