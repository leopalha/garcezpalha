import { NextRequest, NextResponse } from 'next/server'
import { whatsappCloudAPI } from '@/lib/whatsapp/cloud-api'

/**
 * POST /api/whatsapp-cloud/send
 * Send message via WhatsApp Cloud API (Official Meta/Facebook)
 */
export async function POST(request: NextRequest) {
  try {
    if (!whatsappCloudAPI.isConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'WhatsApp Cloud API not configured. Check environment variables.',
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { to, message } = body

    if (!to || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Fields "to" and "message" are required',
        },
        { status: 400 }
      )
    }

    const success = await whatsappCloudAPI.sendMessage(to, message)

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send message',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message',
        details: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error),
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/whatsapp-cloud/send
 * Check WhatsApp Cloud API status
 */
export async function GET() {
  try {
    const isConfigured = whatsappCloudAPI.isConfigured()

    return NextResponse.json({
      configured: isConfigured,
      message: isConfigured
        ? 'WhatsApp Cloud API configured'
        : 'WhatsApp Cloud API not configured',
    })
  } catch (error) {
    return NextResponse.json(
      {
        configured: false,
        error: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error),
      },
      { status: 500 }
    )
  }
}
