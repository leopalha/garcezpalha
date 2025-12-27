import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a']
    if (!validTypes.includes(audioFile.type)) {
      return NextResponse.json(
        { error: `Invalid audio type: ${audioFile.type}. Supported: webm, mp3, wav, m4a` },
        { status: 400 }
      )
    }

    // Validate file size (max 25MB - OpenAI Whisper limit)
    const maxSize = 25 * 1024 * 1024
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: 'Audio file too large (max 25MB)' },
        { status: 413 }
      )
    }

    console.log(`[Transcribe API] Processing audio: ${audioFile.size} bytes, ${audioFile.type}`)

    // Call OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'pt', // Português
      response_format: 'json',
    })

    console.log(`[Transcribe API] Transcription successful: ${transcription.text.substring(0, 50)}...`)

    return NextResponse.json({
      text: transcription.text,
    })

  } catch (error: any) {
    console.error('[Transcribe API] Error:', error)

    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OpenAI quota exceeded. Please check your billing.' },
        { status: 429 }
      )
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Transcription failed', details: error.message },
      { status: 500 }
    )
  }
}

// Config for Next.js 14 App Router
export const runtime = 'nodejs'
export const maxDuration = 30 // 30 seconds timeout
