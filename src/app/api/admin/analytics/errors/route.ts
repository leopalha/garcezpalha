import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface ErrorSummary {
  total: number
  critical: number
  warning: number
  info: number
  recentErrors: Array<{
    id: string
    message: string
    timestamp: string
    severity: 'critical' | 'warning' | 'info'
  }>
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Query agent_alerts table for errors
    const { data: alerts, error } = await supabase
      .from('agent_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    // Classify alerts by severity
    const critical = alerts?.filter((a: any) => a.severity === 'critical').length || 0
    const warning = alerts?.filter((a: any) => a.severity === 'high' || a.severity === 'medium').length || 0
    const info = alerts?.filter((a: any) => a.severity === 'low').length || 0

    // Get recent unresolved errors
    const recentErrors =
      alerts
        ?.filter((a: any) => !a.resolved)
        .slice(0, 10)
        .map((alert: any) => ({
          id: alert.id,
          message: alert.message,
          timestamp: alert.created_at,
          severity: mapSeverity(alert.severity),
        })) || []

    const errorSummary: ErrorSummary = {
      total: alerts?.length || 0,
      critical,
      warning,
      info,
      recentErrors,
    }

    return NextResponse.json(errorSummary)
  } catch (error) {
    console.error('Error fetching error summary:', error)

    // Return empty summary instead of crashing
    return NextResponse.json({
      total: 0,
      critical: 0,
      warning: 0,
      info: 0,
      recentErrors: [],
    })
  }
}

function mapSeverity(
  severity: string
): 'critical' | 'warning' | 'info' {
  if (severity === 'critical') return 'critical'
  if (severity === 'high' || severity === 'medium') return 'warning'
  return 'info'
}
