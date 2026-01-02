import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z, ZodError } from 'zod'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// ============================================================================
// PATCH /api/admin/documents/[id]/review - Review document (approve/reject)
// ============================================================================

const paramsSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

const reviewSchema = z.object({
  status: z.enum(['approved', 'rejected', 'under_review']),
  notes: z.string().max(500).optional().nullable(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Check admin role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || !['admin', 'superadmin'].includes(userData.role)) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Validate params and body
    const validatedParams = paramsSchema.parse(params)
    const body = await request.json()
    const validatedBody = reviewSchema.parse(body)

    // Validate required notes for rejection
    if (validatedBody.status === 'rejected' && !validatedBody.notes) {
      return NextResponse.json(
        { error: 'Motivo da rejeição é obrigatório' },
        { status: 400 }
      )
    }

    // Get document to verify it exists
    const { data: document, error: fetchError } = await supabase
      .from('case_documents')
      .select('*')
      .eq('id', validatedParams.id)
      .single()

    if (fetchError || !document) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Update document status
    const { data: updatedDocument, error: updateError } = await supabase
      .from('case_documents')
      .update({
        status: validatedBody.status,
        review_notes: validatedBody.notes || null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', validatedParams.id)
      .select()
      .single()

    if (updateError) {
      logger.error('[PATCH /api/admin/documents/[id]/review] DB error:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar documento' },
        { status: 500 }
      )
    }

    // TODO: Send notification to client about document review
    // This would integrate with the notification system

    return NextResponse.json({
      document: updatedDocument,
      message: `Documento ${validatedBody.status === 'approved' ? 'aprovado' : validatedBody.status === 'rejected' ? 'rejeitado' : 'marcado como em revisão'} com sucesso`,
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: err.format() },
        { status: 400 }
      )
    }

    logger.error('[PATCH /api/admin/documents/[id]/review] Error:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
