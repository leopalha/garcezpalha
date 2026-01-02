import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'

const logger = createLogger('lgpd-middleware')

export const CURRENT_TERMS_VERSION = 'v1.0'
export const CURRENT_PRIVACY_VERSION = 'v1.0'

export interface ConsentRequirements {
  requireTermsOfService?: boolean
  requirePrivacyPolicy?: boolean
  requireMarketing?: boolean
  requireDataSharing?: boolean
  requireCookies?: boolean
}

/**
 * Check if user has given required consents
 */
export async function checkConsents(
  userId: string,
  requirements: ConsentRequirements = {
    requireTermsOfService: true,
    requirePrivacyPolicy: true
  }
): Promise<{
  valid: boolean
  missingConsents: string[]
  outdatedConsents: string[]
}> {
  try {
    const supabase = await createClient()

    const missingConsents: string[] = []
    const outdatedConsents: string[] = []

    // Check terms of service
    if (requirements.requireTermsOfService) {
      const { data: termsConsent } = await supabase
        .from('user_consent')
        .select('*')
        .eq('user_id', userId)
        .eq('consent_type', 'terms_of_service')
        .eq('consent_given', true)
        .eq('revoked', false)
        .single()

      if (!termsConsent) {
        missingConsents.push('terms_of_service')
      } else if (termsConsent.consent_version !== CURRENT_TERMS_VERSION) {
        outdatedConsents.push('terms_of_service')
      }
    }

    // Check privacy policy
    if (requirements.requirePrivacyPolicy) {
      const { data: privacyConsent } = await supabase
        .from('user_consent')
        .select('*')
        .eq('user_id', userId)
        .eq('consent_type', 'privacy_policy')
        .eq('consent_given', true)
        .eq('revoked', false)
        .single()

      if (!privacyConsent) {
        missingConsents.push('privacy_policy')
      } else if (privacyConsent.consent_version !== CURRENT_PRIVACY_VERSION) {
        outdatedConsents.push('privacy_policy')
      }
    }

    // Check marketing consent
    if (requirements.requireMarketing) {
      const { data: marketingConsent } = await supabase
        .from('user_consent')
        .select('*')
        .eq('user_id', userId)
        .eq('consent_type', 'marketing')
        .eq('consent_given', true)
        .eq('revoked', false)
        .single()

      if (!marketingConsent) {
        missingConsents.push('marketing')
      }
    }

    // Check data sharing consent
    if (requirements.requireDataSharing) {
      const { data: dataSharingConsent } = await supabase
        .from('user_consent')
        .select('*')
        .eq('user_id', userId)
        .eq('consent_type', 'data_sharing')
        .eq('consent_given', true)
        .eq('revoked', false)
        .single()

      if (!dataSharingConsent) {
        missingConsents.push('data_sharing')
      }
    }

    // Check cookies consent
    if (requirements.requireCookies) {
      const { data: cookiesConsent } = await supabase
        .from('user_consent')
        .select('*')
        .eq('user_id', userId)
        .eq('consent_type', 'cookies')
        .eq('consent_given', true)
        .eq('revoked', false)
        .single()

      if (!cookiesConsent) {
        missingConsents.push('cookies')
      }
    }

    const valid = missingConsents.length === 0 && outdatedConsents.length === 0

    if (!valid) {
      logger.warn('User missing or outdated consents', {
        userId,
        missingConsents,
        outdatedConsents
      })
    }

    return {
      valid,
      missingConsents,
      outdatedConsents
    }

  } catch (error) {
    logger.error('Error checking consents', error)
    return {
      valid: false,
      missingConsents: [],
      outdatedConsents: []
    }
  }
}

/**
 * Middleware to require consents for API routes
 */
export async function requireConsents(
  request: NextRequest,
  requirements?: ConsentRequirements
): Promise<NextResponse | null> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const consentCheck = await checkConsents(session.user.id, requirements)

    if (!consentCheck.valid) {
      return NextResponse.json(
        {
          error: 'Consentimentos necessários não foram fornecidos',
          missingConsents: consentCheck.missingConsents,
          outdatedConsents: consentCheck.outdatedConsents,
          requiresConsent: true
        },
        { status: 403 }
      )
    }

    // All consents valid
    return null

  } catch (error) {
    logger.error('Error in requireConsents middleware', error)
    return NextResponse.json(
      { error: 'Erro ao verificar consentimentos' },
      { status: 500 }
    )
  }
}

/**
 * Check if user has privacy settings configured
 */
export async function ensurePrivacySettings(userId: string): Promise<void> {
  try {
    const supabase = await createClient()

    const { data: settings } = await supabase
      .from('privacy_settings')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!settings) {
      // Create default privacy settings
      await supabase
        .from('privacy_settings')
        .insert({
          user_id: userId,
          allow_marketing_emails: false,
          allow_product_updates: true,
          allow_notifications: true,
          allow_analytics: true,
          allow_third_party_sharing: false,
          profile_visibility: 'private'
        })

      logger.info('Created default privacy settings for user', { userId })
    }

  } catch (error) {
    logger.error('Error ensuring privacy settings', error)
  }
}

/**
 * Anonymize sensitive data in logs
 */
export function anonymizeForLogging(data: Record<string, any>): Record<string, any> {
  const sensitiveFields = [
    'password',
    'cpf',
    'cnpj',
    'cpf_cnpj',
    'credit_card',
    'card_number',
    'cvv',
    'phone',
    'address',
    'zip_code'
  ]

  const anonymized: Record<string, any> = {}

  for (const [key, value] of Object.entries(data)) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      anonymized[key] = '[REDACTED]'
    } else if (key.toLowerCase().includes('email')) {
      // Partially redact email
      if (typeof value === 'string' && value.includes('@')) {
        const [local, domain] = value.split('@')
        anonymized[key] = `${local.substring(0, 2)}***@${domain}`
      } else {
        anonymized[key] = value
      }
    } else if (typeof value === 'object' && value !== null) {
      anonymized[key] = anonymizeForLogging(value)
    } else {
      anonymized[key] = value
    }
  }

  return anonymized
}

/**
 * Check if data retention period has expired
 */
export async function checkDataRetention(
  dataType: string,
  createdAt: Date
): Promise<{
  expired: boolean
  action: 'archive' | 'anonymize' | 'delete' | null
}> {
  try {
    const supabase = await createClient()

    const { data: policy } = await supabase
      .from('data_retention_policies')
      .select('*')
      .eq('data_type', dataType)
      .eq('is_active', true)
      .single()

    if (!policy) {
      return { expired: false, action: null }
    }

    const retentionMs = policy.retention_days * 24 * 60 * 60 * 1000
    const expirationDate = new Date(createdAt.getTime() + retentionMs)
    const expired = new Date() > expirationDate

    return {
      expired,
      action: expired ? policy.action_after_retention : null
    }

  } catch (error) {
    logger.error('Error checking data retention', error)
    return { expired: false, action: null }
  }
}

/**
 * LGPD compliance helper
 */
export const LGPD = {
  checkConsents,
  requireConsents,
  ensurePrivacySettings,
  anonymizeForLogging,
  checkDataRetention,
  CURRENT_TERMS_VERSION,
  CURRENT_PRIVACY_VERSION
}

export default LGPD
