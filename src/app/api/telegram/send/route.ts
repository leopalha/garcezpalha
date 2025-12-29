import { NextRequest, NextResponse } from 'next/server'
import telegramBotService from '@/lib/telegram/bot-service'

/**
 * GET /api/telegram/send
 * Check bot status
 */
export async function GET() {
  try {
    if (!telegramBotService.isConfigured()) {
      return NextResponse.json({
        configured: false,
        status: 'unconfigured',
        error: 'Telegram bot token not configured'
      })
    }

    const botInfo = await telegramBotService.getMe()
    const webhookInfo = await telegramBotService.getWebhookInfo()

    return NextResponse.json({
      configured: true,
      status: 'active',
      bot: botInfo,
      webhook: webhookInfo
    })
  } catch (error) {
    console.error('Error checking Telegram bot status:', error)
    return NextResponse.json({
      configured: true,
      status: 'error',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

/**
 * POST /api/telegram/send
 * Send a message
 */
export async function POST(request: NextRequest) {
  try {
    if (!telegramBotService.isConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Telegram bot token not configured'
      }, { status: 500 })
    }

    const { chatId, text, parseMode } = await request.json()

    if (!chatId || !text) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: chatId and text'
      }, { status: 400 })
    }

    const result = await telegramBotService.sendMessage(chatId, text, {
      parse_mode: parseMode
    })

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error sending Telegram message:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
