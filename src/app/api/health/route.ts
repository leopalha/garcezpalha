import { NextResponse } from 'next/server'

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  services: {
    database: ServiceStatus
    openai: ServiceStatus
    stripe: ServiceStatus
    mercadopago: ServiceStatus
    resend: ServiceStatus
    whatsapp: ServiceStatus
  }
  environment: string
  uptime: number
}

interface ServiceStatus {
  status: 'configured' | 'not_configured' | 'error'
  message?: string
}

export async function GET() {
  const startTime = process.hrtime()

  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    services: {
      database: checkDatabaseConfig(),
      openai: checkOpenAIConfig(),
      stripe: checkStripeConfig(),
      mercadopago: checkMercadoPagoConfig(),
      resend: checkResendConfig(),
      whatsapp: checkWhatsAppConfig(),
    },
  }

  // Determine overall health
  const serviceStatuses = Object.values(healthStatus.services)
  const hasError = serviceStatuses.some((s) => s.status === 'error')
  const hasNotConfigured = serviceStatuses.some((s) => s.status === 'not_configured')

  if (hasError) {
    healthStatus.status = 'unhealthy'
  } else if (hasNotConfigured) {
    healthStatus.status = 'degraded'
  }

  const [seconds, nanoseconds] = process.hrtime(startTime)
  const responseTimeMs = (seconds * 1000 + nanoseconds / 1000000).toFixed(2)

  return NextResponse.json(
    {
      ...healthStatus,
      responseTimeMs: parseFloat(responseTimeMs),
    },
    {
      status: healthStatus.status === 'unhealthy' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  )
}

function checkDatabaseConfig(): ServiceStatus {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      status: 'not_configured',
      message: 'Supabase credentials not set',
    }
  }

  if (supabaseUrl.includes('your-project') || supabaseKey.includes('your-anon')) {
    return {
      status: 'not_configured',
      message: 'Using placeholder credentials',
    }
  }

  return {
    status: 'configured',
    message: 'Supabase connection configured',
  }
}

function checkOpenAIConfig(): ServiceStatus {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return {
      status: 'not_configured',
      message: 'OpenAI API key not set',
    }
  }

  if (apiKey === 'your-openai-api-key' || !apiKey.startsWith('sk-')) {
    return {
      status: 'not_configured',
      message: 'Invalid OpenAI API key format',
    }
  }

  return {
    status: 'configured',
    message: 'OpenAI API configured',
  }
}

function checkStripeConfig(): ServiceStatus {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY

  if (!secretKey || !publishableKey) {
    return {
      status: 'not_configured',
      message: 'Stripe keys not set',
    }
  }

  if (
    secretKey === 'your-stripe-secret-key' ||
    !secretKey.startsWith('sk_') ||
    !publishableKey.startsWith('pk_')
  ) {
    return {
      status: 'not_configured',
      message: 'Invalid Stripe key format',
    }
  }

  return {
    status: 'configured',
    message: 'Stripe API configured',
  }
}

function checkMercadoPagoConfig(): ServiceStatus {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

  if (!accessToken) {
    return {
      status: 'not_configured',
      message: 'MercadoPago access token not set',
    }
  }

  if (accessToken === 'your-mercadopago-token' || !accessToken.startsWith('APP_USR')) {
    return {
      status: 'not_configured',
      message: 'Invalid MercadoPago token format',
    }
  }

  return {
    status: 'configured',
    message: 'MercadoPago API configured',
  }
}

function checkResendConfig(): ServiceStatus {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return {
      status: 'not_configured',
      message: 'Resend API key not set',
    }
  }

  if (apiKey === 'your-resend-api-key' || !apiKey.startsWith('re_')) {
    return {
      status: 'not_configured',
      message: 'Invalid Resend API key format',
    }
  }

  return {
    status: 'configured',
    message: 'Resend email service configured',
  }
}

function checkWhatsAppConfig(): ServiceStatus {
  const sessionDir = process.env.WHATSAPP_SESSION_DIR

  if (!sessionDir) {
    return {
      status: 'not_configured',
      message: 'WhatsApp session directory not set',
    }
  }

  return {
    status: 'configured',
    message: 'WhatsApp session configured',
  }
}
