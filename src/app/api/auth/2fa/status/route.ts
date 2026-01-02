/**
 * Get 2FA Status API
 * P1-001: MFA/2FA for Admin Users
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

async function handler(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get 2FA status
    const { data } = await supabase
      .from('users')
      .select('two_factor_enabled, two_factor_method, role')
      .eq('id', user.id)
      .single()

    if (!data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      enabled: data.two_factor_enabled || false,
      method: data.two_factor_method || null,
      required: data.role === 'admin', // 2FA is required for admins
    })
  } catch (error: any) {
    logger.error('Get 2FA status error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get 2FA status' },
      { status: 500 }
    )
  }
}

// Apply rate limiting
export const GET = withRateLimit(handler, { type: 'api', limit: 30 })
