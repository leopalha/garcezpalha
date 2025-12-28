import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id } = body

    const apiKey = process.env.DID_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DID_API_KEY not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(`https://api.d-id.com/talks/streams/${session_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[D-ID] Delete session error:', error)
      return NextResponse.json(
        { error: 'Failed to delete D-ID session' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[D-ID] Delete session error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
