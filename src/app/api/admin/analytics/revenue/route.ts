import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyticsRevenueQuerySchema } from '@/lib/validations/admin-schemas'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

interface RevenueStats {
  total: number
  byMonth: Array<{
    month: string
    revenue: number
    orders: number
  }>
  byProduct: Array<{
    product: string
    revenue: number
    count: number
  }>
  averageTicket: number
  growth: {
    current: number
    previous: number
    rate: number
  }
  projections: {
    nextMonth: number
    nextQuarter: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Validate query parameters with Zod
    const queryParams = analyticsRevenueQuerySchema.parse({
      months: searchParams.get('months') || '12'
    })

    const months = parseInt(queryParams.months)

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    // Get all successful payments
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('status', 'succeeded')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Calculate total revenue
    const total = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    // Group by month
    const revenueByMonth: Record<string, { revenue: number; orders: number }> = {}
    payments?.forEach((payment) => {
      const date = new Date(payment.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      if (!revenueByMonth[monthKey]) {
        revenueByMonth[monthKey] = { revenue: 0, orders: 0 }
      }

      revenueByMonth[monthKey].revenue += payment.amount || 0
      revenueByMonth[monthKey].orders += 1
    })

    const byMonth = Object.entries(revenueByMonth)
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Get orders to calculate by product
    const { data: orders } = await supabase
      .from('checkout_orders')
      .select('product_id, amount')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())

    // Group by product
    const revenueByProduct: Record<string, { revenue: number; count: number }> = {}
    orders?.forEach((order) => {
      const productId = order.product_id || 'unknown'

      if (!revenueByProduct[productId]) {
        revenueByProduct[productId] = { revenue: 0, count: 0 }
      }

      revenueByProduct[productId].revenue += order.amount || 0
      revenueByProduct[productId].count += 1
    })

    const byProduct = Object.entries(revenueByProduct)
      .map(([product, data]) => ({
        product,
        revenue: data.revenue,
        count: data.count,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10) // Top 10 products

    // Calculate average ticket
    const averageTicket = payments && payments.length > 0 ? total / payments.length : 0

    // Calculate growth (current month vs previous month)
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const prevMonth = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`

    const currentRevenue = revenueByMonth[currentMonth]?.revenue || 0
    const previousRevenue = revenueByMonth[prevMonth]?.revenue || 0
    const growthRate =
      previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0

    // Simple projections (average of last 3 months × growth rate)
    const lastThreeMonths = byMonth.slice(-3)
    const avgLastThree =
      lastThreeMonths.reduce((sum, m) => sum + m.revenue, 0) / (lastThreeMonths.length || 1)
    const growthMultiplier = 1 + growthRate / 100

    const stats: RevenueStats = {
      total,
      byMonth,
      byProduct,
      averageTicket,
      growth: {
        current: currentRevenue,
        previous: previousRevenue,
        rate: growthRate,
      },
      projections: {
        nextMonth: avgLastThree * growthMultiplier,
        nextQuarter: avgLastThree * growthMultiplier * 3,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    console.error('Error fetching revenue stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue stats' },
      { status: 500 }
    )
  }
}
