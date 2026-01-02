import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:integrations:google:callback')

export const dynamic = 'force-dynamic'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/integrations/google/callback'

// ============================================================================
// GET /api/integrations/google/callback - Handle Google OAuth callback
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      logger.warn('[Google Callback] User denied access', { error })
      return NextResponse.redirect(
        new URL('/dashboard/configuracoes?error=google_auth_denied', request.url)
      )
    }

    if (!code || !state) {
      return NextResponse.json({ error: 'Missing code or state' }, { status: 400 })
    }

    // Verify state token
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'))
    const { userId } = stateData

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      logger.error('[Google Callback] Token exchange failed', errorData)
      throw new Error('Failed to exchange code for tokens')
    }

    const tokens = await tokenResponse.json()

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    const userInfo = await userInfoResponse.json()

    // Save tokens to database
    const supabase = await createClient()

    const { error: dbError } = await supabase
      .from('integration_credentials')
      .upsert({
        user_id: userId,
        provider: 'google',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        scope: tokens.scope,
        provider_user_id: userInfo.email,
        metadata: {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        },
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,provider',
      })

    if (dbError) {
      logger.error('[Google Callback] Database error', dbError)
      throw new Error('Failed to save credentials')
    }

    logger.info('[Google Callback] Successfully connected', { userId, email: userInfo.email })

    // Redirect back to settings with success
    return NextResponse.redirect(
      new URL('/dashboard/configuracoes?success=google_connected', request.url)
    )
  } catch (error) {
    logger.error('[Google Callback] Error:', error)

    return NextResponse.redirect(
      new URL('/dashboard/configuracoes?error=google_connection_failed', request.url)
    )
  }
}
