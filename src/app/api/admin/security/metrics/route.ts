/**
 * Security Metrics API
 * P1-012: Security Audit Dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

async function handler(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication and admin role
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role, tenant_id')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '24h' // 24h, 7d, 30d

    // Calculate time range
    const now = new Date()
    const since = new Date()
    switch (period) {
      case '7d':
        since.setDate(now.getDate() - 7)
        break
      case '30d':
        since.setDate(now.getDate() - 30)
        break
      case '24h':
      default:
        since.setHours(now.getHours() - 24)
    }

    // Get security metrics
    const [
      { count: totalEvents },
      { count: failedLogins },
      { count: suspiciousRequests },
      { count: twoFactorEvents },
      { count: successfulActions },
      { count: failedActions },
      { data: recentSecurityEvents },
      { data: topFailedUsers },
    ] = await Promise.all([
      // Total events in period
      supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', userData.tenant_id)
        .gte('created_at', since.toISOString()),

      // Failed login attempts
      supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', userData.tenant_id)
        .eq('event_type', 'auth.login')
        .eq('success', false)
        .gte('created_at', since.toISOString()),

      // Suspicious requests (rate limit violations, invalid tokens, etc.)
      supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', userData.tenant_id)
        .in('event_type', [
          'security.rate_limit_exceeded',
          'security.invalid_token',
          'security.suspicious_activity',
        ])
        .gte('created_at', since.toISOString()),

      // 2FA events
      supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', userData.tenant_id)
        .like('event_type', 'auth.2fa%')
        .gte('created_at', since.toISOString()),

      // Successful actions
      supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', userData.tenant_id)
        .eq('success', true)
        .gte('created_at', since.toISOString()),

      // Failed actions
      supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', userData.tenant_id)
        .eq('success', false)
        .gte('created_at', since.toISOString()),

      // Recent security events
      supabase
        .from('audit_logs')
        .select('*')
        .eq('tenant_id', userData.tenant_id)
        .in('event_type', [
          'auth.login',
          'auth.logout',
          'auth.2fa_enabled',
          'auth.2fa_disabled',
          'auth.2fa_verified',
          'security.rate_limit_exceeded',
          'security.invalid_token',
        ])
        .eq('success', false)
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false })
        .limit(10),

      // Top users with failed attempts
      supabase.rpc('get_top_failed_users', {
        p_tenant_id: userData.tenant_id,
        p_since: since.toISOString(),
        p_limit: 5,
      }),
    ])

    // Get 2FA adoption rate
    const { data: usersData } = await supabase
      .from('users')
      .select('two_factor_enabled, role')
      .eq('tenant_id', userData.tenant_id)

    const totalUsers = usersData?.length || 0
    const users2FAEnabled = usersData?.filter((u) => u.two_factor_enabled).length || 0
    const adminsTotal = usersData?.filter((u) => u.role === 'admin').length || 0
    const admins2FAEnabled =
      usersData?.filter((u) => u.role === 'admin' && u.two_factor_enabled).length || 0

    return NextResponse.json({
      period,
      since: since.toISOString(),
      metrics: {
        totalEvents: totalEvents || 0,
        failedLogins: failedLogins || 0,
        suspiciousRequests: suspiciousRequests || 0,
        twoFactorEvents: twoFactorEvents || 0,
        successfulActions: successfulActions || 0,
        failedActions: failedActions || 0,
        successRate:
          totalEvents && totalEvents > 0
            ? ((successfulActions || 0) / totalEvents) * 100
            : 100,
      },
      twoFactorAdoption: {
        totalUsers,
        users2FAEnabled,
        adoptionRate: totalUsers > 0 ? (users2FAEnabled / totalUsers) * 100 : 0,
        adminsTotal,
        admins2FAEnabled,
        adminAdoptionRate: adminsTotal > 0 ? (admins2FAEnabled / adminsTotal) * 100 : 0,
      },
      recentSecurityEvents: recentSecurityEvents || [],
      topFailedUsers: topFailedUsers || [],
    })
  } catch (error: any) {
    logger.error('Security metrics API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// Apply rate limiting
export const GET = withRateLimit(handler, { type: 'api', limit: 50 })
