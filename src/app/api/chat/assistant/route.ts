import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { productId, message, history } = await request.json()

    if (!productId || !message) {
      return NextResponse.json(
        { error: 'productId and message são obrigatórios' },
        { status: 400 }
      )
    }

    // Se for productId genérico (não UUID), usar contexto geral
    let product: any = null
    let systemPrompt = ''

    if (productId === 'geral' || productId === 'general') {
      // Contexto geral sem produto específico
      systemPrompt = `Você é um assistente virtual do escritório de advocacia Garcez Palha.

**SOBRE O ESCRITÓRIO:**
O Garcez Palha é um escritório de advocacia online especializado em diversas áreas do direito, oferecendo soluções jurídicas acessíveis e eficientes para todo o Brasil.

**ÁREAS DE ATUAÇÃO:**
- Direito Bancário (revisão de contratos, seguro prestamista, fraudes)
- Direito do Consumidor (distrato, cobranças indevidas, vícios em produtos)
- Direito Previdenciário (aposentadoria, revisão de benefícios)
- Direito Trabalhista (verbas rescisórias, horas extras)
- Direito para Servidores Públicos (incorporações, diferenças salariais)
- Telecomunicações (cobranças abusivas, portabilidade)
- Energia (cobranças indevidas)
- Educacional (FIES, problemas com instituições)
- Condominial (cobranças, questões de condomínio)

**INSTRUÇÕES DE COMPORTAMENTO:**

1. **Seja consultivo e empático**: Ouça o problema do cliente antes de vender
2. **Qualifique o lead**: Pergunte sobre:
   - Qual é a situação atual?
   - Há quanto tempo enfrenta esse problema?
   - Já tentou resolver antes?
   - Que tipo de serviço precisa?

3. **Direcione para a área correta**: Identifique qual área jurídica se aplica ao caso
4. **Destaque valor, não preço**: Foque nos benefícios e resultados
5. **Conduza à ação**: Quando o lead estiver pronto, diga:
   "Perfeito! Vou te direcionar para nossa página de soluções onde você pode conhecer melhor o serviço. Tem alguma dúvida antes?"

6. **Seja conciso**: Respostas de 2-4 frases, máximo 1 parágrafo
7. **Use emojis ocasionalmente**: Mas sem exagero
8. **Tom**: Profissional mas acessível, como um advogado que é amigo

**NUNCA:**
- Invente informações que não estão no contexto
- Prometa resultados específicos ("vou ganhar seu caso")
- Dê consultoria jurídica gratuita complexa
- Menospreze outros serviços

**SEMPRE:**
- Seja honesto sobre prazos e processos
- Deixe claro que é um assistente IA
- Incentive o cliente a explorar as soluções disponíveis
`
    } else {
      // Buscar produto específico no banco
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          product_packages (
            name,
            description,
            price,
            features,
            is_recommended
          )
        `)
        .eq('id', productId)
        .single()

      if (productError || !productData) {
        console.error('Erro ao buscar produto:', productError)
        return NextResponse.json(
          { error: 'Produto não encontrado' },
          { status: 404 }
        )
      }

      product = productData

      // Construir contexto rico para o GPT
      systemPrompt = `Você é um assistente de vendas especializado em ${product.name}.

**PRODUTO: ${product.name}**
Categoria: ${product.category}
Descrição: ${product.description}

**PROBLEMA QUE RESOLVE:**
${product.hero_problem || 'Não especificado'}

**BENEFÍCIOS:**
${product.benefits ? JSON.parse(product.benefits).join('\n- ') : 'Não especificado'}

**RECURSOS:**
${product.features ? JSON.parse(product.features).join('\n- ') : 'Não especificado'}

**DOCUMENTOS NECESSÁRIOS:**
${product.documents_required ? JSON.parse(product.documents_required).join('\n- ') : 'Não especificado'}

**PACOTES DISPONÍVEIS:**
${product.product_packages?.map((pkg: any) => `
- ${pkg.name} (R$ ${(pkg.price / 100).toFixed(2)})
  ${pkg.is_recommended ? '⭐ RECOMENDADO' : ''}
  ${pkg.description}
  Inclui: ${pkg.features ? JSON.parse(pkg.features).join(', ') : 'N/A'}
`).join('\n') || 'Nenhum pacote disponível'}

**PERGUNTAS FREQUENTES:**
${product.faq_items ? JSON.parse(product.faq_items).map((faq: any) => `
Q: ${faq.question}
A: ${faq.answer}
`).join('\n') : 'Não especificado'}

---

**INSTRUÇÕES DE COMPORTAMENTO:**

1. **Seja consultivo e empático**: Ouça o problema do cliente antes de vender
2. **Qualifique o lead**: Pergunte sobre:
   - Qual é a situação atual dele?
   - Há quanto tempo enfrenta esse problema?
   - Já tentou resolver antes?
   - Tem os documentos necessários?

3. **Destaque valor, não preço**: Foque nos benefícios e resultados
4. **Use prova social**: Mencione casos de sucesso (sem inventar)
5. **Crie urgência sutil**: "Quanto antes resolver, melhor"
6. **Conduza ao checkout**: Quando o lead estiver pronto, diga:
   "Perfeito! Vou te direcionar para o checkout onde você pode finalizar. Tem alguma dúvida antes?"

7. **Seja conciso**: Respostas de 2-4 frases, máximo 1 parágrafo
8. **Use emojis ocasionalmente**: Mas sem exagero
9. **Tom**: Profissional mas acessível, como um advogado que é amigo

**NUNCA:**
- Invente informações que não estão no contexto
- Prometa resultados específicos ("vou ganhar seu caso")
- Dê consultoria jurídica gratuita complexa
- Menospreze outros serviços

**SEMPRE:**
- Seja honesto sobre prazos e processos
- Deixe claro que é um assistente IA
- Incentive o cliente a ir para o checkout quando qualificado
`
    }

    // Chamar OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const assistantMessage = completion.choices[0]?.message?.content ||
      'Desculpe, não consegui processar sua mensagem.'

    // TODO: Gerar áudio com TTS (ElevenLabs ou OpenAI)
    // const audioUrl = await generateTTS(assistantMessage)

    return NextResponse.json({
      message: assistantMessage,
      audioUrl: null, // TODO: Implementar TTS
      productInfo: product ? {
        name: product.name,
        basePrice: product.base_price,
      } : null
    })

  } catch (error: any) {
    console.error('Erro no assistente:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem', details: error.message },
      { status: 500 }
    )
  }
}
