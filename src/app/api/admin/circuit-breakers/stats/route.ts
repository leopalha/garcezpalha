/**
 * Circuit Breaker Monitoring API
 * GET /api/admin/circuit-breakers/stats
 * Returns real-time stats for all circuit breakers
 */

import { NextResponse } from 'next/server'

// Force dynamic to prevent build-time execution
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  // Lazy import to avoid build-time initialization
  const { getCircuitBreakerStats } = await import('@/lib/resilience/circuit-breaker')
  const { gpt4Breaker, gpt35Breaker, groqBreaker } = await import('@/lib/resilience/openai-breaker')
  const { stripeCheckoutBreaker, mercadoPagoCheckoutBreaker } = await import('@/lib/resilience/payment-breaker')
  const { whatsappCloudBreaker, twilioBreaker, baileysBreaker } = await import('@/lib/resilience/whatsapp-breaker')

  try {
    const stats = {
      timestamp: new Date().toISOString(),
      llm: {
        gpt4: getCircuitBreakerStats(gpt4Breaker),
        gpt35: getCircuitBreakerStats(gpt35Breaker),
        groq: groqBreaker ? getCircuitBreakerStats(groqBreaker) : null,
      },
      payment: {
        stripe: getCircuitBreakerStats(stripeCheckoutBreaker),
        mercadopago: getCircuitBreakerStats(mercadoPagoCheckoutBreaker),
      },
      messaging: {
        whatsappCloud: getCircuitBreakerStats(whatsappCloudBreaker),
        twilio: getCircuitBreakerStats(twilioBreaker),
        baileys: getCircuitBreakerStats(baileysBreaker),
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching circuit breaker stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch circuit breaker stats' },
      { status: 500 }
    )
  }
}
