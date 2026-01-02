import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'
import { z } from 'zod'

const logger = createLogger('api:integrations:stripe:connect')

export const dynamic = 'force-dynamic'

const STRIPE_CLIENT_ID = process.env.STRIPE_CLIENT_ID
const STRIPE_API_KEY = process.env.STRIPE_API_KEY
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/integrations/stripe/callback'

const connectSchema = z.object({
  apiKey: z.string().min(20).optional(),
})

// ============================================================================
// GET /api/integrations/stripe/connect - Initiate Stripe Connect OAuth
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!STRIPE_CLIENT_ID) {
      return NextResponse.json({ error: 'Stripe Connect não configurado' }, { status: 500 })
    }

    // Generate state for CSRF protection
    const state = Buffer.from(JSON.stringify({ userId: user.id, timestamp: Date.now() })).toString('base64')

    // Build Stripe Connect OAuth URL
    const authUrl = new URL('https://connect.stripe.com/oauth/authorize')
    authUrl.searchParams.set('client_id', STRIPE_CLIENT_ID)
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.set('scope', 'read_write')

    logger.info('[Stripe] Redirecting to Stripe Connect', { userId: user.id })

    return NextResponse.json({
      authUrl: authUrl.toString(),
    })
  } catch (error) {
    logger.error('[Stripe] Error:', error)

    return NextResponse.json(
      { error: 'Erro ao iniciar Stripe Connect' },
      { status: 500 }
    )
  }
}

// ============================================================================
// POST /api/integrations/stripe/connect - Connect with API key (alternative)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = connectSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const { apiKey } = validation.data

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 })
    }

    // Test API key with Stripe
    const testResponse = await fetch('https://api.stripe.com/v1/accounts', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    if (!testResponse.ok) {
      logger.warn('[Stripe] Invalid API key', { userId: user.id })
      return NextResponse.json(
        { error: 'API key inválida' },
        { status: 400 }
      )
    }

    const accountInfo = await testResponse.json()

    // Save credentials
    const { error: dbError } = await supabase
      .from('integration_credentials')
      .upsert({
        user_id: user.id,
        provider: 'stripe',
        access_token: apiKey,
        provider_user_id: accountInfo.data[0]?.id || 'unknown',
        metadata: {
          account_id: accountInfo.data[0]?.id,
          business_name: accountInfo.data[0]?.business_profile?.name,
        },
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,provider',
      })

    if (dbError) {
      logger.error('[Stripe] Database error', dbError)
      throw new Error('Failed to save credentials')
    }

    logger.info('[Stripe] Successfully connected', { userId: user.id })

    return NextResponse.json({
      success: true,
      message: 'Stripe conectado com sucesso',
    })
  } catch (error) {
    logger.error('[Stripe] Error:', error)

    return NextResponse.json(
      { error: 'Erro ao conectar Stripe' },
      { status: 500 }
    )
  }
}

// ============================================================================
// DELETE /api/integrations/stripe/connect - Disconnect Stripe
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
      .eq('provider', 'stripe')

    if (dbError) {
      logger.error('[Stripe] Delete error', dbError)
      throw new Error('Failed to disconnect')
    }

    logger.info('[Stripe] Disconnected', { userId: user.id })

    return NextResponse.json({
      success: true,
      message: 'Stripe desconectado',
    })
  } catch (error) {
    logger.error('[Stripe] Disconnect error:', error)

    return NextResponse.json(
      { error: 'Erro ao desconectar Stripe' },
      { status: 500 }
    )
  }
}
