import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { agentConfigUpdateSchema } from '@/lib/validations/admin-schemas'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agentId = params.id

    // Get agent config from database
    const { data: agentConfig, error } = await supabase
      .from('agent_configs')
      .select('*')
      .eq('id', agentId)
      .single()

    if (error || !agentConfig) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(agentConfig)
  } catch (error) {
    console.error('Error fetching agent config:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agentId = params.id
    const rawBody = await req.json()

    // Validate request body with Zod
    const body = agentConfigUpdateSchema.parse(rawBody)

    // Update agent config
    const { data, error } = await supabase
      .from('agent_configs')
      .upsert({
        id: agentId,
        role: body.role,
        category: body.category,
        name: body.name,
        description: body.description,
        system_prompt: body.systemPrompt,
        user_prompt: body.userPrompt,
        model: body.model,
        temperature: body.temperature,
        max_tokens: body.maxTokens,
        top_p: body.topP,
        frequency_penalty: body.frequencyPenalty,
        presence_penalty: body.presencePenalty,
        enabled: body.enabled,
        requires_approval: body.requiresApproval,
        tools: body.tools || [],
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving agent config:', error)
      return NextResponse.json(
        { error: 'Failed to save config' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    console.error('Error updating agent config:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
