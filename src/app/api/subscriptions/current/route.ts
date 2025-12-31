import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/subscriptions/current
 * Retorna a assinatura ativa do usuário logado
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

    // Get user's active subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .in('status', ['active', 'trialing', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    // Get usage stats from usage_tracking
    const now = new Date()
    const currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const { data: usageData } = await supabase
      .from('usage_tracking')
      .select('metric, quantity')
      .eq('user_id', session.user.id)
      .gte('period_start', currentPeriodStart.toISOString())

    // Aggregate usage by metric
    const usage: Record<string, number> = {}
    usageData?.forEach((record) => {
      usage[record.metric] = (usage[record.metric] || 0) + record.quantity
    })

    // Get plan limits
    const planId = subscription?.plan_id || 'free'
    const { data: limits } = await supabase
      .from('plan_limits')
      .select('*')
      .eq('plan_id', planId)
      .single()

    return NextResponse.json({
      subscription: subscription || null,
      usage: {
        leads: usage.leads || 0,
        conversations: usage.conversations || 0,
        emails: usage.emails || 0,
        products: usage.products || 0,
      },
      limits: limits || {
        max_leads: 10,
        max_conversations: 50,
        max_emails_per_month: 100,
        max_products: 1,
        max_team_members: 1,
      },
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}
