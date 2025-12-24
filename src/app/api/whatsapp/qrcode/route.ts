import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.EVOLUTION_API_URL || 'https://unique-delight-production-affb.up.railway.app'
const API_KEY = process.env.EVOLUTION_API_KEY || 'garcezpalha-evolution-api-key-2025'
const INSTANCE_NAME = 'garcezpalha-session'

export async function GET(request: NextRequest) {
  try {
    // Try to connect the instance first
    const connectResponse = await fetch(`${API_URL}/instance/connect/${INSTANCE_NAME}`, {
      method: 'GET',
      headers: {
        'apikey': API_KEY,
      },
    })

    if (!connectResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to connect to instance' },
        { status: connectResponse.status }
      )
    }

    const data = await connectResponse.json()

    // Check if we got a QR code
    if (data.base64) {
      return NextResponse.json({
        success: true,
        qrCode: data.base64,
        type: 'base64',
      })
    }

    if (data.code) {
      return NextResponse.json({
        success: true,
        qrCode: data.code,
        type: 'code',
      })
    }

    if (data.pairingCode) {
      return NextResponse.json({
        success: true,
        pairingCode: data.pairingCode,
        type: 'pairing',
      })
    }

    // No QR code yet, might need to wait
    return NextResponse.json({
      success: false,
      message: 'QR code not ready yet',
      count: data.count || 0,
    })

  } catch (error) {
    console.error('Error fetching QR code:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action

    if (action === 'restart') {
      // Delete and recreate instance
      await fetch(`${API_URL}/instance/delete/${INSTANCE_NAME}`, {
        method: 'DELETE',
        headers: {
          'apikey': API_KEY,
        },
      })

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Recreate
      const createResponse = await fetch(`${API_URL}/instance/create`, {
        method: 'POST',
        headers: {
          'apikey': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instanceName: INSTANCE_NAME,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS',
        }),
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        return NextResponse.json(
          { error: 'Failed to recreate instance', details: errorData },
          { status: createResponse.status }
        )
      }

      const data = await createResponse.json()
      return NextResponse.json({
        success: true,
        message: 'Instance restarted successfully',
        data,
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
