import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function postHandler(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, voice = 'alloy', speed = 1.0 } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate text length (max 4096 characters for OpenAI TTS)
    if (text.length > 4096) {
      return NextResponse.json(
        { error: 'Text too long (max 4096 characters)' },
        { status: 413 }
      )
    }

    // Validate voice
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
    if (!validVoices.includes(voice)) {
      return NextResponse.json(
        { error: `Invalid voice. Valid voices: ${validVoices.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate speed (0.25 to 4.0)
    if (speed < 0.25 || speed > 4.0) {
      return NextResponse.json(
        { error: 'Speed must be between 0.25 and 4.0' },
        { status: 400 }
      )
    }

    console.log(`[TTS API] Generating speech for ${text.length} characters, voice: ${voice}, speed: ${speed}`)

    // Call OpenAI TTS API
    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1', // or 'tts-1-hd' for higher quality
      voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      input: text,
      speed: speed,
    })

    // Convert response to buffer
    const buffer = Buffer.from(await mp3Response.arrayBuffer())

    console.log(`[TTS API] Speech generated successfully: ${buffer.length} bytes`)

    // Return audio file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })

  } catch (error) {
    console.error('[TTS API] Error:', error)

    // Handle specific OpenAI errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OpenAI quota exceeded. Please check your billing.' },
        { status: 429 }
      )
    }

    if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Text-to-speech failed', details: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error) },
      { status: 500 }
    )
  }
}

// Apply rate limiting (30 req/window to control OpenAI API costs)
export const POST = withRateLimit(postHandler, { type: 'api', limit: 30 })

// Config for Next.js 14 App Router
export const runtime = 'nodejs'
export const maxDuration = 30 // 30 seconds timeout
