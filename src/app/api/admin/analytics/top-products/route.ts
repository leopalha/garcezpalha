import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyticsTopProductsQuerySchema } from '@/lib/validations/admin-schemas'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

interface ProductStats {
  productId: string
  productName: string
  totalSales: number
  totalRevenue: number
  averageValue: number
  conversionRate: number
  leadsCount: number
  trend: 'up' | 'down' | 'stable'
}

interface TopProductsResponse {
  products: ProductStats[]
  summary: {
    totalProducts: number
    totalRevenue: number
    totalSales: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Validate query parameters with Zod
    const queryParams = analyticsTopProductsQuerySchema.parse({
      days: searchParams.get('days') || '30',
      limit: searchParams.get('limit') || '10'
    })

    const days = parseInt(queryParams.days)
    const limit = parseInt(queryParams.limit)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get completed orders with product info
    const { data: orders, error } = await supabase
      .from('checkout_orders')
      .select('*')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())

    if (error) {
      throw error
    }

    // Get all leads to calculate conversion rate
    const { data: leads } = await supabase
      .from('leads')
      .select('service_interest')
      .gte('created_at', startDate.toISOString())

    // Group by product
    const productMap: Record<string, {
      sales: number
      revenue: number
      leads: number
    }> = {}

    orders?.forEach((order) => {
      const productId = order.product_id || 'unknown'

      if (!productMap[productId]) {
        productMap[productId] = { sales: 0, revenue: 0, leads: 0 }
      }

      productMap[productId].sales += 1
      productMap[productId].revenue += order.amount || 0
    })

    // Count leads by product (using service_interest as proxy)
    leads?.forEach((lead) => {
      const productId = lead.service_interest || 'unknown'

      if (productMap[productId]) {
        productMap[productId].leads += 1
      }
    })

    // Convert to array and calculate stats
    const products: ProductStats[] = Object.entries(productMap)
      .map(([productId, data]) => {
        const conversionRate = data.leads > 0 ? (data.sales / data.leads) * 100 : 0
        const averageValue = data.sales > 0 ? data.revenue / data.sales : 0

        // Simple trend calculation (would need historical data for accuracy)
        const trend: 'up' | 'down' | 'stable' =
          conversionRate > 15 ? 'up' :
          conversionRate < 5 ? 'down' :
          'stable'

        return {
          productId,
          productName: formatProductName(productId),
          totalSales: data.sales,
          totalRevenue: data.revenue,
          averageValue,
          conversionRate,
          leadsCount: data.leads,
          trend,
        }
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit)

    const summary = {
      totalProducts: Object.keys(productMap).length,
      totalRevenue: products.reduce((sum, p) => sum + p.totalRevenue, 0),
      totalSales: products.reduce((sum, p) => sum + p.totalSales, 0),
    }

    const response: TopProductsResponse = {
      products,
      summary,
    }

    return NextResponse.json(response)
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

    console.error('Error fetching top products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top products' },
      { status: 500 }
    )
  }
}

function formatProductName(productId: string): string {
  // Map product IDs to readable names
  const nameMap: Record<string, string> = {
    'direito-imobiliario': 'Direito Imobiliário',
    'pericia-medica': 'Perícia Médica',
    'avaliacao-imoveis': 'Avaliação de Imóveis',
    'pericia-documental': 'Perícia Documental',
    'secretaria-remota': 'Secretária Remota',
    'unknown': 'Não Especificado',
  }

  return nameMap[productId] || productId
}
