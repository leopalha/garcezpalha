import { NextRequest, NextResponse } from 'next/server'
import { getDIDKey } from '@/lib/api/keys-manager'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source_url } = body

    // Get and validate D-ID API key (with automatic caching and validation)
    const apiKey = await getDIDKey()

    const response = await fetch('https://api.d-id.com/talks/streams', {
      method: 'POST',
      headers: {
        'Authorization': apiKey, // Already includes "Basic " prefix from keys-manager
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url,
        driver_url: 'bank://lively',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[D-ID] Create session error:', error)
      return NextResponse.json(
        { error: 'Failed to create D-ID session' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[D-ID] Create session error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
