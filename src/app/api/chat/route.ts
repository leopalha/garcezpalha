import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withRateLimit } from '@/lib/rate-limit'
import { withValidation } from '@/lib/validations/api-middleware'
import { createClient } from '@supabase/supabase-js'
import { wrapWithDisclaimer } from '@/lib/ai/disclaimer'

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Chat message schema
const chatMessageSchema = z.object({
  message: z.string().min(1, 'Mensagem não pode estar vazia').max(2000, 'Mensagem muito longa'),
  threadId: z.string().optional(),
  context: z.record(z.string(), z.unknown()).optional(),
})

async function handleChat(request: NextRequest) {
  try {
    const { message, threadId } = (request as any).validatedData

    // Check if AI is configured (OpenAI or OpenRouter)
    const aiConfigured = Boolean(
      (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) ||
      (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.startsWith('sk-or-'))
    )

    if (!aiConfigured) {
      // Demo mode - return predefined responses
      const demoResponses: Record<string, string> = {
        default:
          'Olá! Sou o assistente virtual do escritório Garcez Palha. Como posso ajudá-lo hoje? Posso fornecer informações sobre nossos serviços jurídicos, agendar consultas ou esclarecer dúvidas gerais.',
        direito:
          'Oferecemos serviços especializados em Direito Imobiliário, Perícia Documental, Avaliação de Imóveis e Perícia Médica. Qual área você tem interesse?',
        consulta:
          'Você pode agendar uma consulta através do nosso formulário de contato ou ligando para (21) 2220-0000. A primeira consulta é gratuita!',
        preço:
          'Os valores variam conforme o tipo de serviço. Oferecemos uma avaliação inicial gratuita para entender melhor sua necessidade. Gostaria de agendar?',
        horário:
          'Nosso horário de atendimento é de segunda a sexta, das 9h às 18h. Também oferecemos atendimento online para sua conveniência.',
      }

      // Simple keyword matching for demo
      let response = demoResponses.default
      const lowerMessage = message.toLowerCase()

      if (lowerMessage.includes('direito') || lowerMessage.includes('serviço')) {
        response = demoResponses.direito
      } else if (lowerMessage.includes('consulta') || lowerMessage.includes('agendar')) {
        response = demoResponses.consulta
      } else if (lowerMessage.includes('preço') || lowerMessage.includes('custo') || lowerMessage.includes('valor')) {
        response = demoResponses.preço
      } else if (lowerMessage.includes('horário') || lowerMessage.includes('quando')) {
        response = demoResponses.horário
      }

      // Add OAB disclaimer to demo responses (P1-009)
      const responseWithDisclaimer = wrapWithDisclaimer(response, { mode: 'chat' })

      return NextResponse.json({
        reply: responseWithDisclaimer,
        threadId: threadId || `demo-thread-${Date.now()}`,
        suggestions: [
          'Quais serviços vocês oferecem?',
          'Como agendar uma consulta?',
          'Qual o horário de atendimento?',
        ],
        mode: 'demo',
      })
    }

    // Production mode - use Agent Orchestrator with specialized agents
    try {
      const { getOrchestrator } = await import('@/lib/ai/agents')
      const { getCacheKey, getCachedResponse, setCachedResponse } = await import('@/lib/ai/cache')

      const orchestrator = getOrchestrator()

      const currentThreadId = threadId || `thread-${Date.now()}`

      // Retrieve conversation history from database
      const { data: historyData } = await supabaseAdmin
        .from('chat_messages')
        .select('role, content')
        .eq('thread_id', currentThreadId)
        .order('created_at', { ascending: true })

      const conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> =
        historyData || []

      // Try cache first
      const messagesForCache = [...conversationHistory, { role: 'user' as const, content: message }]
      const cacheKey = getCacheKey(messagesForCache, 'chat-general')
      const cachedReply = getCachedResponse(cacheKey)

      if (cachedReply) {
        // Store user message in database
        await supabaseAdmin.from('chat_messages').insert({
          thread_id: currentThreadId,
          role: 'user',
          content: message,
        })

        // Store cached response in database
        await supabaseAdmin.from('chat_messages').insert({
          thread_id: currentThreadId,
          role: 'assistant',
          content: cachedReply,
          agent_used: 'cache',
        })

        return NextResponse.json({
          reply: cachedReply,
          threadId: currentThreadId,
          agentUsed: 'cache',
          cached: true,
          mode: 'production',
        })
      }

      // Store user message in database
      await supabaseAdmin.from('chat_messages').insert({
        thread_id: currentThreadId,
        role: 'user',
        content: message,
      })

      const result = await orchestrator.process(message, conversationHistory, {
        sessionData: { threadId: currentThreadId }
      })

      // Cache the response
      setCachedResponse(cacheKey, result.content)

      // Store assistant response in database
      await supabaseAdmin.from('chat_messages').insert({
        thread_id: currentThreadId,
        role: 'assistant',
        content: result.content,
        agent_used: result.agentUsed,
        agent_confidence: result.confidence,
      })

      console.log(`[Chat API] Routed to ${result.agentUsed} agent (confidence: ${(result.confidence * 100).toFixed(0)}%)`)

      return NextResponse.json({
        reply: result.content,
        threadId: currentThreadId,
        agentUsed: result.agentUsed,
        confidence: result.confidence,
        suggestions: [],
        mode: 'production',
      })
    } catch (aiError) {
      console.error('AI Agent error:', aiError)

      // Fallback to demo mode on error
      return NextResponse.json({
        reply:
          'Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente em alguns instantes ou entre em contato pelo telefone (21) 2220-0000.',
        threadId: threadId || `fallback-${Date.now()}`,
        suggestions: ['Tentar novamente', 'Ver serviços', 'Contato direto'],
        mode: 'fallback',
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    )
  }
}

// Apply validation, sanitization, and rate limiting
export const POST = withRateLimit(
  withValidation(chatMessageSchema, handleChat, { sanitize: true }),
  { type: 'chat', limit: 20 }
)
