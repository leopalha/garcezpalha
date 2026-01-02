import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/zod-helpers'

const logger = createLogger('api:white-label')

// Validation schema for white-label configuration
const whiteLabelConfigSchema = z.object({
  // Visual Identity
  logoUrl: z.string().url().optional().or(z.literal('')),
  faviconUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Deve ser uma cor hexadecimal válida (#RRGGBB)').optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Deve ser uma cor hexadecimal válida (#RRGGBB)').optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Deve ser uma cor hexadecimal válida (#RRGGBB)').optional(),
  fontFamily: z.string().min(1).max(100).optional(),

  // Firm Information
  firmName: z.string().min(1, 'Nome do escritório obrigatório').max(255).optional(),
  oabNumber: z.string().max(50).optional().or(z.literal('')),
  cnpj: z.string().max(18).optional().or(z.literal('')),
  tagline: z.string().max(255).optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),

  // Contact Information
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  whatsapp: z.string().max(20).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional().or(z.literal('')),
  zipCode: z.string().max(10).optional().or(z.literal('')),

  // Social Media
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),

  // Custom Domain
  customDomain: z.string().max(255).optional().or(z.literal('')),
  domainConfigured: z.boolean().optional(),
})

/**
 * GET /api/white-label
 * Get white-label configuration for current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    logger.info('Fetching white-label config', { userId: session.user.id })

    // Get or create default config
    const { data: config, error } = await supabase
      .rpc('get_or_create_white_label_config', { p_user_id: session.user.id })

    if (error) {
      logger.error('Error fetching white-label config', error)
      throw error
    }

    // Transform database column names to camelCase for frontend
    const transformedConfig = config ? {
      id: config.id,
      userId: config.user_id,
      logoUrl: config.logo_url || '',
      faviconUrl: config.favicon_url || '',
      primaryColor: config.primary_color || '#0066CC',
      secondaryColor: config.secondary_color || '#003366',
      accentColor: config.accent_color || '#FFB84D',
      fontFamily: config.font_family || 'Inter',
      firmName: config.firm_name || '',
      oabNumber: config.oab_number || '',
      cnpj: config.cnpj || '',
      tagline: config.tagline || '',
      description: config.description || '',
      email: config.email || '',
      phone: config.phone || '',
      whatsapp: config.whatsapp || '',
      address: config.address || '',
      city: config.city || '',
      state: config.state || '',
      zipCode: config.zip_code || '',
      facebook: config.facebook_url || '',
      instagram: config.instagram_url || '',
      linkedin: config.linkedin_url || '',
      twitter: config.twitter_url || '',
      customDomain: config.custom_domain || '',
      domainConfigured: config.domain_configured || false,
      createdAt: config.created_at,
      updatedAt: config.updated_at,
    } : null

    return NextResponse.json({
      success: true,
      config: transformedConfig
    })

  } catch (error) {
    logger.error('Error in GET white-label', error)
    return NextResponse.json({
      error: 'Erro ao buscar configuração'
    }, { status: 500 })
  }
}

/**
 * POST /api/white-label
 * Create or update white-label configuration
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    const body = await request.json()
    const validatedData = whiteLabelConfigSchema.parse(body)

    logger.info('Saving white-label config', { userId: session.user.id })

    // Check if config already exists
    const { data: existingConfig } = await supabase
      .from('white_label_config')
      .select('id')
      .eq('user_id', session.user.id)
      .single()

    // Transform camelCase to snake_case for database
    const dbData = {
      user_id: session.user.id,
      logo_url: validatedData.logoUrl || null,
      favicon_url: validatedData.faviconUrl || null,
      primary_color: validatedData.primaryColor || '#0066CC',
      secondary_color: validatedData.secondaryColor || '#003366',
      accent_color: validatedData.accentColor || '#FFB84D',
      font_family: validatedData.fontFamily || 'Inter',
      firm_name: validatedData.firmName || null,
      oab_number: validatedData.oabNumber || null,
      cnpj: validatedData.cnpj || null,
      tagline: validatedData.tagline || null,
      description: validatedData.description || null,
      email: validatedData.email || null,
      phone: validatedData.phone || null,
      whatsapp: validatedData.whatsapp || null,
      address: validatedData.address || null,
      city: validatedData.city || null,
      state: validatedData.state || null,
      zip_code: validatedData.zipCode || null,
      facebook_url: validatedData.facebook || null,
      instagram_url: validatedData.instagram || null,
      linkedin_url: validatedData.linkedin || null,
      twitter_url: validatedData.twitter || null,
      custom_domain: validatedData.customDomain || null,
      domain_configured: validatedData.domainConfigured || false,
    }

    let savedConfig

    if (existingConfig) {
      // Update existing config
      const { data, error } = await supabase
        .from('white_label_config')
        .update(dbData)
        .eq('user_id', session.user.id)
        .select()
        .single()

      if (error) {
        logger.error('Error updating white-label config', error)
        throw error
      }

      savedConfig = data
      logger.info('White-label config updated', { configId: data.id })
    } else {
      // Insert new config
      const { data, error } = await supabase
        .from('white_label_config')
        .insert(dbData)
        .select()
        .single()

      if (error) {
        logger.error('Error creating white-label config', error)
        throw error
      }

      savedConfig = data
      logger.info('White-label config created', { configId: data.id })
    }

    // Transform back to camelCase for response
    const transformedConfig = {
      id: savedConfig.id,
      userId: savedConfig.user_id,
      logoUrl: savedConfig.logo_url || '',
      faviconUrl: savedConfig.favicon_url || '',
      primaryColor: savedConfig.primary_color,
      secondaryColor: savedConfig.secondary_color,
      accentColor: savedConfig.accent_color,
      fontFamily: savedConfig.font_family,
      firmName: savedConfig.firm_name || '',
      oabNumber: savedConfig.oab_number || '',
      cnpj: savedConfig.cnpj || '',
      tagline: savedConfig.tagline || '',
      description: savedConfig.description || '',
      email: savedConfig.email || '',
      phone: savedConfig.phone || '',
      whatsapp: savedConfig.whatsapp || '',
      address: savedConfig.address || '',
      city: savedConfig.city || '',
      state: savedConfig.state || '',
      zipCode: savedConfig.zip_code || '',
      facebook: savedConfig.facebook_url || '',
      instagram: savedConfig.instagram_url || '',
      linkedin: savedConfig.linkedin_url || '',
      twitter: savedConfig.twitter_url || '',
      customDomain: savedConfig.custom_domain || '',
      domainConfigured: savedConfig.domain_configured,
      createdAt: savedConfig.created_at,
      updatedAt: savedConfig.updated_at,
    }

    return NextResponse.json({
      success: true,
      config: transformedConfig,
      message: 'Configuração salva com sucesso'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: formatZodErrors(error),
      }, { status: 400 })
    }

    logger.error('Error saving white-label config', error)
    return NextResponse.json({
      error: 'Erro ao salvar configuração'
    }, { status: 500 })
  }
}

/**
 * DELETE /api/white-label
 * Reset white-label configuration to defaults
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()

    logger.info('Resetting white-label config', { userId: session.user.id })

    // Delete existing config (will be recreated with defaults on next GET)
    const { error } = await supabase
      .from('white_label_config')
      .delete()
      .eq('user_id', session.user.id)

    if (error) {
      logger.error('Error deleting white-label config', error)
      throw error
    }

    logger.info('White-label config reset', { userId: session.user.id })

    return NextResponse.json({
      success: true,
      message: 'Configuração restaurada para padrão'
    })

  } catch (error) {
    logger.error('Error resetting white-label config', error)
    return NextResponse.json({
      error: 'Erro ao restaurar configuração'
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
