import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getOpenAIKey } from '@/lib/api/keys-manager'

/**
 * GET /api/diagnostic/openai
 * Tests OpenAI API connectivity and quota
 */
export async function GET() {
  try {
    // Get and validate OpenAI API key (with automatic caching and validation)
    const apiKey = await getOpenAIKey()

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey })

    // Test with a simple model list request (free operation)
    try {
      const models = await openai.models.list()
      const modelsList = Array.from(models.data).slice(0, 5).map(m => m.id)

      return NextResponse.json({
        status: 'success',
        message: 'OpenAI API is working correctly',
        configured: true,
        validFormat: true,
        connection: 'successful',
        availableModels: modelsList,
        whisperAvailable: modelsList.some(m => m.includes('whisper')),
        ttsAvailable: modelsList.some(m => m.includes('tts')),
      })
    } catch (apiError: any) {
      return NextResponse.json({
        status: 'error',
        message: 'OpenAI API request failed',
        configured: true,
        validFormat: true,
        connection: 'failed',
        error: apiError.message,
        code: apiError.code,
        statusCode: apiError.status,
      })
    }

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}
