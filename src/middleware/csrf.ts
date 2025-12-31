/**
 * CSRF Protection Middleware
 * P0-D5-001: Implement CSRF tokens for all POST/PUT/DELETE requests
 */

import { NextRequest, NextResponse } from 'next/server'
import csrf from 'csrf'

const tokens = new csrf()

// Generate a secret for the app (in production, use env var)
const CSRF_SECRET = process.env.CSRF_SECRET || 'your-csrf-secret-change-in-production'

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return tokens.create(CSRF_SECRET)
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string): boolean {
  return tokens.verify(CSRF_SECRET, token)
}

/**
 * CSRF Middleware for API routes
 * Usage: Wrap API handlers with this middleware
 */
export function withCSRFProtection(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const method = req.method

    // Only protect state-changing methods
    if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      return handler(req)
    }

    // Skip CSRF for API routes that use other auth (webhooks, etc)
    const pathname = req.nextUrl.pathname
    const skipRoutes = [
      '/api/webhooks/',
      '/api/auth/',
      '/api/cron/',
    ]

    if (skipRoutes.some(route => pathname.startsWith(route))) {
      return handler(req)
    }

    // Get CSRF token from header or body
    const csrfToken =
      req.headers.get('x-csrf-token') ||
      req.headers.get('csrf-token')

    if (!csrfToken) {
      return NextResponse.json(
        { error: 'CSRF token missing' },
        { status: 403 }
      )
    }

    // Verify token
    if (!verifyCSRFToken(csrfToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }

    // Token valid, proceed with request
    return handler(req)
  }
}

/**
 * Client-side hook to get CSRF token
 */
export async function getCSRFToken(): Promise<string> {
  // First check if token exists in meta tag
  if (typeof window !== 'undefined') {
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (metaToken) return metaToken
  }

  // Otherwise fetch from API
  const res = await fetch('/api/csrf-token')
  const data = await res.json()
  return data.token
}
