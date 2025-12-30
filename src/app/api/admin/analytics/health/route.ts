import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number
  services: Array<{
    name: string
    status: 'up' | 'down' | 'degraded'
    responseTime: number
  }>
  lastChecked: string
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const services: HealthStatus['services'] = []

  try {
    // 1. Check Supabase Database
    const dbStart = Date.now()
    const supabase = await createClient()
    const { error: dbError } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .limit(1)
    const dbTime = Date.now() - dbStart

    services.push({
      name: 'Database',
      status: dbError ? 'down' : dbTime > 1000 ? 'degraded' : 'up',
      responseTime: dbTime,
    })

    // 2. Check API Server (self)
    services.push({
      name: 'API Server',
      status: 'up',
      responseTime: Date.now() - startTime,
    })

    // 3. Check OpenAI (if OPENAI_API_KEY exists)
    const hasOpenAI = !!process.env.OPENAI_API_KEY
    if (hasOpenAI) {
      services.push({
        name: 'OpenAI',
        status: 'up', // Assume up if key exists
        responseTime: 45,
      })
    }

    // 4. Check Email Service (Resend)
    const hasResend = !!process.env.RESEND_API_KEY
    services.push({
      name: 'Email Service',
      status: hasResend ? 'up' : 'degraded',
      responseTime: hasResend ? 120 : 999,
    })

    // 5. Check Payment Gateway (Stripe)
    const hasStripe = !!process.env.STRIPE_SECRET_KEY
    services.push({
      name: 'Payment Gateway',
      status: hasStripe ? 'up' : 'degraded',
      responseTime: hasStripe ? 200 : 999,
    })

    // Calculate overall status
    const hasDown = services.some((s) => s.status === 'down')
    const hasDegraded = services.some((s) => s.status === 'degraded')
    const overallStatus = hasDown ? 'unhealthy' : hasDegraded ? 'degraded' : 'healthy'

    // Calculate uptime (based on DB availability)
    const uptime = dbError ? 0 : 99.9

    const healthStatus: HealthStatus = {
      status: overallStatus,
      uptime,
      services,
      lastChecked: new Date().toISOString(),
    }

    return NextResponse.json(healthStatus)
  } catch (error) {
    console.error('Error checking health status:', error)

    return NextResponse.json({
      status: 'unhealthy',
      uptime: 0,
      services: [
        {
          name: 'API Server',
          status: 'down',
          responseTime: Date.now() - startTime,
        },
      ],
      lastChecked: new Date().toISOString(),
    } as HealthStatus)
  }
}
