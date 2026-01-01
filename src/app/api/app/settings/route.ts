/**
 * User Settings API
 * P4-005: Salvar configurações do usuário
 *
 * GET /api/dashboard/configuracoes/seguranca - Buscar settings atuais
 * PATCH /api/dashboard/configuracoes/seguranca - Atualizar settings
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/route-handler'

export const dynamic = 'force-dynamic'

interface UserSettings {
  profile: {
    name: string
    email: string
    phone: string
    avatar: string
    bio: string
    oab: string
    specialization: string
  }
  notifications: {
    emailNewLeads: boolean
    emailConversations: boolean
    emailPayments: boolean
    whatsappNotifications: boolean
    desktopNotifications: boolean
    weeklyReport: boolean
  }
  integrations: {
    googleCalendarConnected: boolean
    gmailConnected: boolean
    whatsappConnected: boolean
    stripeConnected: boolean
  }
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
  }
}

// GET: Buscar settings
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient()

    // Autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Buscar dados do usuário
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (userError || !user) {
      console.error('[Settings API] User error:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userAny = user as any

    // Buscar settings
    const { data: settings, error: settingsError } = await (supabase as any)
      .from('user_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    // Se não existir, criar settings padrão
    let userSettings = settings
    if (!settings) {
      const defaultSettings = {
        user_id: session.user.id,
        notifications: {
          emailNewLeads: true,
          emailConversations: true,
          emailPayments: true,
          whatsappNotifications: false,
          desktopNotifications: false,
          weeklyReport: true,
        },
        integrations: {
          googleCalendarConnected: false,
          gmailConnected: false,
          whatsappConnected: false,
          stripeConnected: false,
        },
        security: {
          twoFactorEnabled: false,
          lastPasswordChange: new Date().toISOString(),
        },
      }

      const { data: newSettings } = await (supabase as any)
        .from('user_settings')
        .insert(defaultSettings)
        .select()
        .single()

      userSettings = newSettings
    }

    const settingsAny = userSettings as any

    // Montar response
    const response: UserSettings = {
      profile: {
        name: user.name || session.user.email?.split('@')[0] || '',
        email: session.user.email || '',
        phone: user.phone || '',
        avatar: user.avatar_url || '',
        bio: userAny.bio || '',
        oab: userAny.oab_number || '',
        specialization: userAny.specialization || '',
      },
      notifications: settingsAny?.notifications || {},
      integrations: settingsAny?.integrations || {},
      security: settingsAny?.security || {},
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[Settings API] GET Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH: Atualizar settings
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient()

    // Autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse body
    const body = await request.json()

    // Atualizar profile na tabela users
    if (body.profile) {
      const profileUpdate: any = {}

      if (body.profile.name !== undefined) profileUpdate.name = body.profile.name
      if (body.profile.phone !== undefined)
        profileUpdate.phone = body.profile.phone
      if (body.profile.avatar !== undefined)
        profileUpdate.avatar_url = body.profile.avatar
      if (body.profile.bio !== undefined) profileUpdate.bio = body.profile.bio
      if (body.profile.oab !== undefined)
        profileUpdate.oab_number = body.profile.oab
      if (body.profile.specialization !== undefined)
        profileUpdate.specialization = body.profile.specialization

      if (Object.keys(profileUpdate).length > 0) {
        const { error } = await supabase
          .from('users')
          .update(profileUpdate)
          .eq('id', session.user.id)

        if (error) {
          console.error('[Settings API] Profile update error:', error)
        }
      }
    }

    // Atualizar settings na tabela user_settings
    const settingsUpdate: any = {}

    if (body.notifications !== undefined) {
      settingsUpdate.notifications = body.notifications
    }

    if (body.integrations !== undefined) {
      settingsUpdate.integrations = body.integrations
    }

    if (body.security !== undefined) {
      settingsUpdate.security = body.security
    }

    if (Object.keys(settingsUpdate).length > 0) {
      settingsUpdate.updated_at = new Date().toISOString()

      // Verificar se existe settings
      const { data: existing } = await (supabase as any)
        .from('user_settings')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      if (existing) {
        // Update
        const { error } = await (supabase as any)
          .from('user_settings')
          .update(settingsUpdate)
          .eq('user_id', session.user.id)

        if (error) {
          console.error('[Settings API] Settings update error:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }
      } else {
        // Insert
        const { error } = await (supabase as any).from('user_settings').insert({
          user_id: session.user.id,
          ...settingsUpdate,
        })

        if (error) {
          console.error('[Settings API] Settings insert error:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }
      }
    }

    // Buscar settings atualizados
    const updated = await GET(request)
    return updated
  } catch (error) {
    console.error('[Settings API] PATCH Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
