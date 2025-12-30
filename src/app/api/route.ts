import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({ 
    message: 'API is working',
    routes: [
      '/api/health',
      '/api/email/sequences/cron',
      '/api/process-monitor/cron',
      '/api/test-vercel-build'
    ]
  })
}
