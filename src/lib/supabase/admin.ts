/**
 * Supabase Admin Client for Server-Side Operations
 * Uses service role key for full access
 */

import { createClient } from '@supabase/supabase-js'

// Create a single instance
let adminClient: ReturnType<typeof createClient> | null = null

export function getSupabaseAdmin() {
  if (adminClient) return adminClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return adminClient
}
