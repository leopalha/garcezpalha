import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Groq from 'groq-sdk'

export const dynamic = 'force-dynamic'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Default configs for agents (fallback if not in DB)
const DEFAULT_CONFIGS: Record<string, any> = {
  'real-estate': {
    systemPrompt: `Você é um especialista em Direito Imobiliário com profundo conhecimento em contratos, usucapião, e registro de imóveis.

IMPORTANTE:
- Sempre cite a legislação aplicável (Código Civil, Lei de Registros Públicos)
- Verifique prazos prescricionais
- Alerte sobre necessidade de certidões
- Inclua disclaimer OAB em todas as respostas

AVISO LEGAL: Este conteúdo é de caráter informativo e educacional, não constituindo aconselhamento jurídico específico.
Para análise do seu caso particular, consulte um advogado.
Garcez Palha Advocacia - OAB/RJ.`,
    temperature: 0.3,
    model: 'llama-3.3-70b-versatile',
  },
  'criminal': {
    systemPrompt: `Você é um especialista em Direito Penal com expertise em crimes, defesa criminal e análise processual.

METODOLOGIA:
1. Identificar o tipo penal
2. Verificar elementos do crime
3. Analisar circunstâncias
4. Calcular pena base
5. Avaliar possibilidade de defesa

SEMPRE:
- Cite artigos do Código Penal
- Presunção de inocência
- Disclaimer OAB

AVISO LEGAL: Este conteúdo é informativo. Consulte um advogado para seu caso específico.`,
    temperature: 0.3,
    model: 'llama-3.3-70b-versatile',
  },
  'content': {
    systemPrompt: `Você é especialista em criação de conteúdo jurídico educativo.

ESTILO:
- Tom acessível mas profissional
- Evitar juridiquês excessivo
- Usar exemplos práticos
- Incluir CTAs estratégicos

COMPLIANCE:
- Sempre incluir disclaimer OAB
- Não fazer promessas de resultado
- Citar fontes legais

AVISO LEGAL: Conteúdo educativo. Para aconselhamento jurídico, consulte um advogado.`,
    temperature: 0.8,
    model: 'llama-3.3-70b-versatile',
  },
}

export async function POST(
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
    const body = await req.json()
    const { message, history = [] } = body

    // Get agent config from database or use default
    let agentConfig = DEFAULT_CONFIGS[agentId]

    const { data: dbConfig } = await supabase
      .from('agent_configs')
      .select('*')
      .eq('id', agentId)
      .single()

    if (dbConfig) {
      agentConfig = {
        systemPrompt: dbConfig.system_prompt,
        temperature: dbConfig.temperature,
        model: dbConfig.model || 'llama-3.3-70b-versatile',
      }
    }

    if (!agentConfig) {
      return NextResponse.json(
        { error: 'Agent config not found' },
        { status: 404 }
      )
    }

    // Build messages array
    const messages: any[] = [
      {
        role: 'system',
        content: agentConfig.systemPrompt,
      },
    ]

    // Add conversation history
    history.forEach((msg: any) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      })
    })

    // Add current message
    messages.push({
      role: 'user',
      content: message,
    })

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: agentConfig.model,
      messages,
      temperature: agentConfig.temperature,
      max_tokens: 4000,
    })

    const response = completion.choices[0]?.message?.content || 'Sem resposta'

    // Log the interaction
    await supabase.from('agent_interactions').insert({
      agent_id: agentId,
      user_id: user.id,
      prompt: message,
      response,
      tokens_used: completion.usage?.total_tokens || 0,
      model: agentConfig.model,
      temperature: agentConfig.temperature,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      content: response,
      tokensUsed: completion.usage?.total_tokens || 0,
      model: agentConfig.model,
    })
  } catch (error) {
    console.error('Error testing agent:', error)
    return NextResponse.json(
      { error: 'Failed to get response from agent' },
      { status: 500 }
    )
  }
}
