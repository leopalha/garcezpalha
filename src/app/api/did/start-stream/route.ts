import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id, sdp } = body

    const apiKey = process.env.DID_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DID_API_KEY not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(`https://api.d-id.com/talks/streams/${session_id}/sdp`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer: sdp,
        session_id,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[D-ID] Start stream error:', error)
      return NextResponse.json(
        { error: 'Failed to start D-ID stream' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[D-ID] Start stream error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
