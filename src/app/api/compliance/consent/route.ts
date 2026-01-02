import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:compliance:consent')

const giveConsentSchema = z.object({
  consent_type: z.enum(['terms_of_service', 'privacy_policy', 'marketing', 'data_sharing', 'cookies']),
  consent_given: z.boolean(),
  consent_version: z.string().min(1, 'Versão do consentimento obrigatória'),
  ip_address: z.string().optional(),
  user_agent: z.string().optional()
})

/**
 * POST /api/compliance/consent
 * Record user consent (LGPD compliance)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const body = await request.json()
    const validatedData = giveConsentSchema.parse(body)

    // Get IP and User Agent from request if not provided
    const ipAddress = validatedData.ip_address ||
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const userAgent = validatedData.user_agent || request.headers.get('user-agent') || 'unknown'

    // Get consent text (should be from a versioned terms/policy table in real implementation)
    const consentText = getConsentText(validatedData.consent_type, validatedData.consent_version)

    logger.info('Recording user consent', {
      userId: session.user.id,
      consentType: validatedData.consent_type,
      consentGiven: validatedData.consent_given,
      version: validatedData.consent_version
    })

    // Check if consent already exists
    const { data: existingConsent } = await supabase
      .from('user_consent')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('consent_type', validatedData.consent_type)
      .eq('consent_version', validatedData.consent_version)
      .single()

    if (existingConsent) {
      // Update existing consent
      const { data: consent, error: updateError } = await supabase
        .from('user_consent')
        .update({
          consent_given: validatedData.consent_given,
          ip_address: ipAddress,
          user_agent: userAgent,
          consent_date: new Date().toISOString(),
          revoked: !validatedData.consent_given,
          revoked_at: !validatedData.consent_given ? new Date().toISOString() : null
        })
        .eq('id', existingConsent.id)
        .select()
        .single()

      if (updateError) throw updateError

      return NextResponse.json({ consent }, { status: 200 })
    }

    // Create new consent
    const { data: consent, error: consentError } = await supabase
      .from('user_consent')
      .insert({
        user_id: session.user.id,
        consent_type: validatedData.consent_type,
        consent_given: validatedData.consent_given,
        consent_text: consentText,
        consent_version: validatedData.consent_version,
        ip_address: ipAddress,
        user_agent: userAgent,
        revoked: !validatedData.consent_given
      })
      .select()
      .single()

    if (consentError) {
      logger.error('Error creating consent', consentError)
      throw consentError
    }

    // Log audit event
    await supabase.rpc('log_audit_event', {
      p_user_id: session.user.id,
      p_action: 'create',
      p_resource_type: 'consent',
      p_resource_id: consent.id,
      p_new_values: consent,
      p_ip_address: ipAddress,
      p_user_agent: userAgent
    })

    logger.info('Consent recorded successfully', { consentId: consent.id })

    return NextResponse.json({ consent }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: formatZodErrors(error),
      }, { status: 400 })
    }

    logger.error('Error in consent', error)
    return NextResponse.json({ error: 'Erro ao registrar consentimento' }, { status: 500 })
  }
}

/**
 * GET /api/compliance/consent
 * Get user's consent history
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const consentType = searchParams.get('consent_type')

    let query = supabase
      .from('user_consent')
      .select('*')
      .eq('user_id', session.user.id)
      .order('consent_date', { ascending: false })

    if (consentType) {
      query = query.eq('consent_type', consentType)
    }

    const { data: consents, error } = await query

    if (error) throw error

    return NextResponse.json({ consents: consents || [] })

  } catch (error) {
    logger.error('Error fetching consents', error)
    return NextResponse.json({ error: 'Erro ao buscar consentimentos' }, { status: 500 })
  }
}

/**
 * Helper function to get consent text by type and version
 * In production, this should fetch from a versioned policy table
 */
function getConsentText(type: string, version: string): string {
  const texts: Record<string, string> = {
    terms_of_service: `Termos de Serviço ${version} - Ao aceitar estes termos, você concorda com as condições de uso da plataforma Garcez Palha...`,
    privacy_policy: `Política de Privacidade ${version} - Informações sobre como coletamos, usamos e protegemos seus dados pessoais conforme LGPD...`,
    marketing: `Consentimento de Marketing ${version} - Autorizo o recebimento de comunicações de marketing, newsletters e ofertas promocionais...`,
    data_sharing: `Compartilhamento de Dados ${version} - Autorizo o compartilhamento de meus dados com parceiros conforme descrito na política de privacidade...`,
    cookies: `Política de Cookies ${version} - Ao aceitar, você permite o uso de cookies para melhorar sua experiência na plataforma...`
  }

  return texts[type] || `Consentimento ${type} versão ${version}`
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
