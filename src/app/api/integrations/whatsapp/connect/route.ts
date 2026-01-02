import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'
import { z } from 'zod'

const logger = createLogger('api:integrations:whatsapp:connect')

export const dynamic = 'force-dynamic'

const connectSchema = z.object({
  phoneNumber: z.string().min(10).max(20),
  apiToken: z.string().min(20),
  businessAccountId: z.string().optional(),
})

// ============================================================================
// POST /api/integrations/whatsapp/connect - Connect WhatsApp Business API
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate request body
    const body = await request.json()
    const validation = connectSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { phoneNumber, apiToken, businessAccountId } = validation.data

    // Test connection with WhatsApp API
    const testResponse = await fetch('https://graph.facebook.com/v18.0/me', {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    })

    if (!testResponse.ok) {
      logger.warn('[WhatsApp] Invalid API token', { userId: user.id })
      return NextResponse.json(
        { error: 'Token de API inválido. Verifique suas credenciais.' },
        { status: 400 }
      )
    }

    const accountInfo = await testResponse.json()

    // Save credentials
    const { error: dbError } = await supabase
      .from('integration_credentials')
      .upsert({
        user_id: user.id,
        provider: 'whatsapp',
        access_token: apiToken,
        provider_user_id: phoneNumber,
        metadata: {
          phone_number: phoneNumber,
          business_account_id: businessAccountId || accountInfo.id,
          account_name: accountInfo.name,
        },
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,provider',
      })

    if (dbError) {
      logger.error('[WhatsApp] Database error', dbError)
      throw new Error('Failed to save credentials')
    }

    logger.info('[WhatsApp] Successfully connected', { userId: user.id, phoneNumber })

    return NextResponse.json({
      success: true,
      message: 'WhatsApp Business conectado com sucesso',
      phoneNumber,
    })
  } catch (error) {
    logger.error('[WhatsApp] Error:', error)

    return NextResponse.json(
      {
        error: 'Erro ao conectar WhatsApp Business',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// DELETE /api/integrations/whatsapp/connect - Disconnect WhatsApp
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error: dbError } = await supabase
      .from('integration_credentials')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', 'whatsapp')

    if (dbError) {
      logger.error('[WhatsApp] Delete error', dbError)
      throw new Error('Failed to disconnect')
    }

    logger.info('[WhatsApp] Disconnected', { userId: user.id })

    return NextResponse.json({
      success: true,
      message: 'WhatsApp Business desconectado',
    })
  } catch (error) {
    logger.error('[WhatsApp] Disconnect error:', error)

    return NextResponse.json(
      { error: 'Erro ao desconectar WhatsApp' },
      { status: 500 }
    )
  }
}
