/**
 * Supabase Route Handler Client
 *
 * Utility to create Supabase client in API Route Handlers
 * Compatible with @supabase/ssr (latest approach)
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

export function createRouteHandlerClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // Cookie setting can fail in middleware/edge runtime
            // This is expected and can be ignored
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, '', options)
          } catch (error) {
            // Cookie removal can fail in middleware/edge runtime
            // This is expected and can be ignored
          }
        },
      },
    }
  )
}

/**
 * For backward compatibility with old code
 * @deprecated Use createRouteHandlerClient instead
 */
export { createRouteHandlerClient as createRouteHandler }
