import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withRateLimit } from '@/lib/rate-limit'
import { createClient } from '@supabase/supabase-js'
import { PerformanceTimer, trackApiCall, trackError, trackConversion } from '@/lib/monitoring/observability'

// Supabase admin client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
  service: z.string().optional(),
  source: z.string().optional(),
})

async function handleContact(request: NextRequest) {
  const timer = new PerformanceTimer('POST /api/contact')

  try {
    const body = await request.json()

    // Validate input
    const validatedData = contactSchema.parse(body)

    // Get client info
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'
    const userAgent = request.headers.get('user-agent') || ''

    // Map service to category for the leads table
    const serviceToCategory: Record<string, string> = {
      'financeiro': 'financeiro',
      'imobiliario': 'imobiliario',
      'trabalhista': 'trabalhista',
      'previdenciario': 'previdenciario',
      'criminal': 'criminal',
      'consumidor': 'consumidor',
      'pericia': 'imobiliario',
    }

    // Save lead to database
    const { data: lead, error: insertError } = await supabaseAdmin
      .from('leads')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        message: validatedData.message,
        source: validatedData.source || 'website_contact',
        status: 'new',
        priority: 'medium',
        category: serviceToCategory[validatedData.service || ''] || 'geral',
        ip_address: ip,
        user_agent: userAgent,
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Error saving lead to database:', insertError)
      // Continue even if database save fails - don't lose the lead
    }

    const leadId = lead?.id || `temp-${Date.now()}`

    console.log('New lead created:', leadId)

    // Log analytics event (server-side)
    console.log('[Analytics] Lead captured:', {
      leadId,
      source: validatedData.source || 'website',
      service: validatedData.service,
    })

    // Track performance and conversion
    const duration = timer.end()
    trackApiCall('/api/contact', duration, 201, { leadId })
    trackConversion('contact_form_submitted', undefined, {
      service: validatedData.service,
      source: validatedData.source,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        leadId,
      },
      { status: 201 }
    )
  } catch (error) {
    timer.end()

    if (error instanceof z.ZodError) {
      trackError(error as Error, {
        endpoint: '/api/contact',
        type: 'validation',
      })
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    trackError(error as Error, {
      endpoint: '/api/contact',
      method: 'POST',
    })

    console.error('Contact form error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    )
  }
}

// Apply rate limiting: 3 requests per hour per IP
export const POST = withRateLimit(handleContact, { type: 'contact', limit: 3 })
