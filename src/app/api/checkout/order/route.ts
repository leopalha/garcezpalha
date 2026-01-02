import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withRateLimit } from '@/lib/rate-limit'
import { createClient } from '@supabase/supabase-js'
import { formatZodErrors } from '@/lib/zod-helpers'
import { logger } from '@/lib/logger'

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Query params schema
const orderQuerySchema = z.object({
  order_id: z.string().uuid('ID do pedido inválido').optional(),
  session_id: z.string().min(1, 'Session ID inválido').optional(),
}).refine(
  (data) => data.order_id || data.session_id,
  { message: 'É necessário fornecer order_id ou session_id' }
)

async function getHandler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryParams = {
      order_id: searchParams.get('order_id') || undefined,
      session_id: searchParams.get('session_id') || undefined,
    }

    // Validate query params
    const validatedParams = orderQuerySchema.parse(queryParams)
    const orderId = validatedParams.order_id
    const sessionId = validatedParams.session_id

    let query = supabaseAdmin
      .from('checkout_orders')
      .select('id, service_name, amount, customer_name, customer_email, status, created_at, paid_at')

    if (orderId) {
      query = query.eq('id', orderId)
    } else if (sessionId) {
      query = query.eq('stripe_session_id', sessionId)
    }

    const { data: order, error } = await query.single()

    if (error) {
      logger.error('Error fetching order:', error)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Parâmetros inválidos',
          details: formatZodErrors(error),
        },
        { status: 400 }
      )
    }

    logger.error('Error fetching checkout order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Apply rate limiting
export const GET = withRateLimit(getHandler, { type: 'api', limit: 50 })
