import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

/**
 * GET /api/user/export
 * Export all user data (LGPD compliance)
 */
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

    // Fetch all user data from various tables
    const [
      profileData,
      casesData,
      conversationsData,
      documentsData,
      invoicesData,
      tasksData,
    ] = await Promise.all([
      // User profile
      supabase.from('users').select('*').eq('id', user.id).single(),

      // Cases
      supabase.from('cases').select('*').eq('client_id', user.id),

      // Conversations
      supabase.from('conversations').select('*, messages(*)').eq('user_id', user.id),

      // Documents
      supabase.from('client_documents').select('*').eq('user_id', user.id),

      // Invoices
      supabase.from('invoices').select('*').eq('user_id', user.id),

      // Tasks (if user is assigned)
      supabase.from('tasks').select('*').eq('assigned_to', user.id),
    ])

    // Compile all data
    const exportData = {
      _metadata: {
        export_date: new Date().toISOString(),
        user_id: user.id,
        email: user.email,
        format: 'JSON',
        version: '1.0',
      },
      profile: profileData.data || null,
      cases: casesData.data || [],
      conversations: conversationsData.data || [],
      documents: documentsData.data || [],
      invoices: invoicesData.data || [],
      tasks: tasksData.data || [],
      auth: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        metadata: user.user_metadata,
      },
    }

    // Log export event for audit trail
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'data_export',
      table_name: 'all',
      new_data: { export_type: 'full_user_data' },
    })

    // Return JSON with download headers
    const filename = `garcez-palha-dados-${user.email}-${new Date().toISOString().split('T')[0]}.json`

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    logger.error('[GET /api/user/export] Error:', err)
    return NextResponse.json({ error: 'Erro ao exportar dados' }, { status: 500 })
  }
}
