import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createRouteHandlerClient } from '@/lib/supabase/route-handler'
import { createLogger } from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const logger = createLogger('api:admin:proposals:generate')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Pricing table por tipo de caso
const PRICING_TABLE: Record<string, { fixed: number; successFee?: number }> = {
  // Bancário
  'seguro prestamista': { fixed: 1500, successFee: 30 },
  'revisão contrato bancário': { fixed: 2000, successFee: 25 },
  'portabilidade crédito': { fixed: 1500 },
  'fraude consignado': { fixed: 2500, successFee: 30 },

  // Previdenciário
  'revisão aposentadoria': { fixed: 3000, successFee: 25 },
  'benefício negado': { fixed: 2500 },
  'auxílio-acidente': { fixed: 2000, successFee: 20 },

  // Servidor Público
  'incorporação gratificação': { fixed: 3500, successFee: 20 },

  // Educacional
  'fies renegociação': { fixed: 2500 },

  // Padrão
  default: { fixed: 2000, successFee: 20 },
}

function getPricing(caseType: string) {
  const normalized = caseType.toLowerCase()
  return PRICING_TABLE[normalized] || PRICING_TABLE.default
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId, caseType, clientName } = body

    logger.info('Proposal generation request received', { leadId, caseType, clientName })

    if (!leadId || !caseType || !clientName) {
      logger.warn('Proposal generation failed - missing required fields', { leadId, caseType, clientName })
      return NextResponse.json(
        { error: 'leadId, caseType e clientName são obrigatórios' },
        { status: 400 }
      )
    }

    // Get pricing for case type
    const pricing = getPricing(caseType)
    logger.info('Pricing determined for case type', { leadId, caseType, pricing })

    // Generate proposal with GPT-4
    logger.info('Generating proposal with AI', { leadId, caseType, clientName })
    const proposalText = await generateProposalWithAI({
      clientName,
      caseType,
      pricing,
    })
    logger.info('Proposal text generated', { leadId, proposalLength: proposalText.length })

    // Save proposal to database
    const supabase = createRouteHandlerClient()

    const { data: proposal, error: dbError } = await supabase
      .from('proposals')
      .insert({
        lead_id: leadId,
        proposal_text: proposalText,
        pricing_fixed: pricing.fixed,
        pricing_success_fee: pricing.successFee || null,
        status: 'draft',
        created_at: new Date().toISOString(),
      } as any)
      .select()
      .single()

    if (dbError) {
      logger.error('Database error creating proposal', dbError, { leadId, caseType })
      return NextResponse.json({ error: 'Erro ao salvar proposta' }, { status: 500 })
    }

    logger.info('Proposal generated and saved successfully', { leadId, proposalId: proposal.id, status: 200 })

    return NextResponse.json({
      id: proposal.id,
      text: proposalText,
      pricing,
    })
  } catch (error) {
    logger.error('Proposal generation request failed', error)
    return NextResponse.json({ error: 'Erro ao gerar proposta' }, { status: 500 })
  }
}

async function generateProposalWithAI(data: {
  clientName: string
  caseType: string
  pricing: { fixed: number; successFee?: number }
}) {
  const successFeeText = data.pricing.successFee
    ? ` + ${data.pricing.successFee}% sobre valores recuperados`
    : ''

  const prompt = `Você é um advogado especializado em ${data.caseType}.

Redija uma proposta comercial profissional para o cliente ${data.clientName}.

IMPORTANTE:
- Use tom profissional, confiante e empático
- Foque nos benefícios para o cliente
- Seja específico sobre o serviço
- Mencione prazo estimado
- Liste próximos passos claramente
- NÃO faça promessas de resultado (OAB compliance)
- Use "podemos" ao invés de "vamos garantir"

ESTRUTURA:
1. Saudação e contexto (1 parágrafo)
2. Análise preliminar do caso (2 parágrafos)
3. Serviços incluídos (lista de 4-6 itens)
4. Prazo estimado de conclusão
5. Investimento: R$ ${data.pricing.fixed.toLocaleString('pt-BR')}${successFeeText}
6. Próximos passos (lista de 3-4 itens)
7. Encerramento profissional

Tamanho: 300-400 palavras
Tom: Profissional, direto, sem juridiquês excessivo

Redija APENAS o texto da proposta, sem assunto ou rodapé.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content:
          'Você é um advogado experiente que redige propostas comerciais profissionais e convincentes, sempre em compliance com o Código de Ética da OAB.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  return completion.choices[0].message.content || ''
}
