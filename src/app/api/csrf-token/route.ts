/**
 * CSRF Token Generation Endpoint
 * GET /api/csrf-token
 */

import { NextResponse } from 'next/server'
import { generateCSRFToken } from '@/middleware/csrf'

export async function GET() {
  const token = generateCSRFToken()

  return NextResponse.json({ token }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }
  })
}
