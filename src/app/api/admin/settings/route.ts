import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

/**
 * User Settings API
 * GET: Retrieve user settings
 * PUT: Update user settings
 */

export interface UserSettings {
  id: string
  user_id: string

  // Profile
  full_name?: string
  phone?: string
  bio?: string

  // Notifications
  notify_new_leads: boolean
  notify_client_messages: boolean
  notify_invoices_due: boolean
  notify_appointments: boolean
  notify_newsletter: boolean

  // Notification Channels
  channel_email: boolean
  channel_push: boolean
  channel_sms: boolean

  // Appearance
  theme: 'dark' | 'light' | 'auto'
  accent_color: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink'
  compact_mode: boolean
  animations_enabled: boolean
  sidebar_collapsed: boolean

  // Integrations (JSON)
  integrations: Record<string, any>

  // Metadata
  created_at: string
  updated_at: string
}

/**
 * GET /api/admin/settings
 * Retrieve current user's settings
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user settings
    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // If no settings exist, create default settings
    if (error && error.code === 'PGRST116') {
      const { data: newSettings, error: insertError } = await supabase
        .from('user_settings')
        .insert([
          {
            user_id: user.id,
            full_name: user.user_metadata?.name || user.email?.split('@')[0],
          },
        ])
        .select()
        .single()

      if (insertError) {
        console.error('Error creating default settings:', insertError)
        return NextResponse.json(
          { error: 'Failed to create settings' },
          { status: 500 }
        )
      }

      return NextResponse.json(newSettings)
    }

    if (error) {
      console.error('Error fetching settings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      )
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error in GET /api/admin/settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/settings
 * Update current user's settings
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate theme if provided
    if (body.theme && !['dark', 'light', 'auto'].includes(body.theme)) {
      return NextResponse.json(
        { error: 'Invalid theme value' },
        { status: 400 }
      )
    }

    // Validate accent_color if provided
    if (
      body.accent_color &&
      !['blue', 'purple', 'green', 'orange', 'red', 'pink'].includes(
        body.accent_color
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid accent_color value' },
        { status: 400 }
      )
    }

    // Update settings
    const { data: settings, error } = await supabase
      .from('user_settings')
      .update({
        full_name: body.full_name,
        phone: body.phone,
        bio: body.bio,
        notify_new_leads: body.notify_new_leads,
        notify_client_messages: body.notify_client_messages,
        notify_invoices_due: body.notify_invoices_due,
        notify_appointments: body.notify_appointments,
        notify_newsletter: body.notify_newsletter,
        channel_email: body.channel_email,
        channel_push: body.channel_push,
        channel_sms: body.channel_sms,
        theme: body.theme,
        accent_color: body.accent_color,
        compact_mode: body.compact_mode,
        animations_enabled: body.animations_enabled,
        sidebar_collapsed: body.sidebar_collapsed,
        integrations: body.integrations,
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating settings:', error)
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      settings,
      message: 'Settings updated successfully',
    })
  } catch (error) {
    console.error('Error in PUT /api/admin/settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
