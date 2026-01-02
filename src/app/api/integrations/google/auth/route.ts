import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:integrations:google:auth')

export const dynamic = 'force-dynamic'

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/integrations/google/callback'

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/userinfo.email',
].join(' ')

// ============================================================================
// GET /api/integrations/google/auth - Initiate Google OAuth flow
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json({ error: 'Google OAuth não configurado' }, { status: 500 })
    }

    // Generate state token for CSRF protection
    const state = Buffer.from(JSON.stringify({ userId: user.id, timestamp: Date.now() })).toString('base64')

    // Build Google OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID)
    authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', SCOPES)
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('prompt', 'consent')
    authUrl.searchParams.set('state', state)

    logger.info('[Google OAuth] Redirecting to Google auth', { userId: user.id })

    return NextResponse.json({
      authUrl: authUrl.toString(),
    })
  } catch (error) {
    logger.error('[Google OAuth] Error:', error)

    return NextResponse.json(
      {
        error: 'Erro ao iniciar autenticação Google',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
