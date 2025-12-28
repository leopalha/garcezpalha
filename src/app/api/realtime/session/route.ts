import { NextResponse } from 'next/server'

/**
 * POST /api/realtime/session
 * Creates an ephemeral token for OpenAI Realtime API
 */
export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const { productId } = await request.json()

    // Create ephemeral token via OpenAI API
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'alloy',
        instructions: `Você é um assistente jurídico especializado em ${productId || 'serviços jurídicos'}.
Seja educado, profissional e objetivo.
Responda em português brasileiro.
Pergunte detalhes quando necessário para qualificar o lead.
Seja conciso e claro nas suas respostas.`,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        },
        temperature: 0.8,
        max_response_output_tokens: 4096,
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[Realtime API] Error creating session:', error)
      return NextResponse.json(
        { error: 'Failed to create realtime session' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      client_secret: data.client_secret.value,
      expires_at: data.client_secret.expires_at,
    })
  } catch (error: any) {
    console.error('[Realtime API] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
