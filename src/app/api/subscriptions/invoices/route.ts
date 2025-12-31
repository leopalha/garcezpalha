import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/subscriptions/invoices
 * Lista todas as faturas do usuário logado
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's subscriptions to find all related invoices
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', session.user.id)

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ invoices: [] })
    }

    const subscriptionIds = subscriptions.map((s) => s.id)

    // Get all invoices for these subscriptions
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .in('subscription_id', subscriptionIds)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      invoices: invoices || [],
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}
