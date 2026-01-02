import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:compliance:privacy-settings')

const updatePrivacySettingsSchema = z.object({
  allow_marketing_emails: z.boolean().optional(),
  allow_product_updates: z.boolean().optional(),
  allow_notifications: z.boolean().optional(),
  allow_analytics: z.boolean().optional(),
  allow_third_party_sharing: z.boolean().optional(),
  profile_visibility: z.enum(['public', 'private', 'contacts_only']).optional(),
  prefer_data_deletion_days: z.number().int().positive().optional()
})

/**
 * GET /api/compliance/privacy-settings
 * Get user's privacy settings
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: settings, error } = await supabase
      .from('privacy_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw error
    }

    // If no settings exist, create default
    if (!settings) {
      const { data: newSettings, error: createError } = await supabase
        .from('privacy_settings')
        .insert({
          user_id: session.user.id,
          allow_marketing_emails: false,
          allow_product_updates: true,
          allow_notifications: true,
          allow_analytics: true,
          allow_third_party_sharing: false,
          profile_visibility: 'private'
        })
        .select()
        .single()

      if (createError) throw createError

      return NextResponse.json({ settings: newSettings })
    }

    return NextResponse.json({ settings })

  } catch (error) {
    logger.error('Error fetching privacy settings', error)
    return NextResponse.json({ error: 'Erro ao buscar configurações de privacidade' }, { status: 500 })
  }
}

/**
 * PATCH /api/compliance/privacy-settings
 * Update user's privacy settings
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const body = await request.json()
    const validatedData = updatePrivacySettingsSchema.parse(body)

    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    logger.info('Updating privacy settings', {
      userId: session.user.id,
      changes: Object.keys(validatedData)
    })

    // Get current settings
    const { data: currentSettings } = await supabase
      .from('privacy_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    let updatedSettings

    if (!currentSettings) {
      // Create new settings
      const { data: newSettings, error: createError } = await supabase
        .from('privacy_settings')
        .insert({
          user_id: session.user.id,
          ...validatedData
        })
        .select()
        .single()

      if (createError) throw createError
      updatedSettings = newSettings
    } else {
      // Update existing settings
      const { data: updated, error: updateError } = await supabase
        .from('privacy_settings')
        .update(validatedData)
        .eq('user_id', session.user.id)
        .select()
        .single()

      if (updateError) throw updateError
      updatedSettings = updated
    }

    // Log audit event
    await supabase.rpc('log_audit_event', {
      p_user_id: session.user.id,
      p_action: currentSettings ? 'update' : 'create',
      p_resource_type: 'privacy_settings',
      p_resource_id: updatedSettings.id,
      p_old_values: currentSettings || {},
      p_new_values: updatedSettings,
      p_ip_address: ipAddress,
      p_user_agent: userAgent
    })

    logger.info('Privacy settings updated successfully', {
      userId: session.user.id
    })

    return NextResponse.json({ settings: updatedSettings })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: formatZodErrors(error),
      }, { status: 400 })
    }

    logger.error('Error updating privacy settings', error)
    return NextResponse.json({ error: 'Erro ao atualizar configurações de privacidade' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
