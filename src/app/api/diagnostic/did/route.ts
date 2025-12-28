import { NextResponse } from 'next/server'

/**
 * GET /api/diagnostic/did
 * Tests D-ID API connectivity and authentication
 */
export async function GET() {
  try {
    const apiKey = process.env.DID_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        status: 'error',
        message: 'DID_API_KEY not configured',
        configured: false,
      })
    }

    // Test D-ID API with credits check endpoint
    try {
      const response = await fetch('https://api.d-id.com/credits', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        return NextResponse.json({
          status: 'error',
          message: 'D-ID API request failed',
          configured: true,
          connection: 'failed',
          statusCode: response.status,
          error: errorText,
        })
      }

      const data = await response.json()

      return NextResponse.json({
        status: 'success',
        message: 'D-ID API is working correctly',
        configured: true,
        connection: 'successful',
        credits: data,
      })
    } catch (apiError: any) {
      return NextResponse.json({
        status: 'error',
        message: 'D-ID API request failed',
        configured: true,
        connection: 'failed',
        error: apiError.message,
      })
    }

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      error: error.message,
    }, { status: 500 })
  }
}
