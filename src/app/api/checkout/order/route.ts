import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const orderId = searchParams.get('order_id')
  const sessionId = searchParams.get('session_id')

  if (!orderId && !sessionId) {
    return NextResponse.json(
      { error: 'Missing order_id or session_id parameter' },
      { status: 400 }
    )
  }

  try {
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
      console.error('Error fetching order:', error)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error fetching checkout order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
