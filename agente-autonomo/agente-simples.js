import Anthropic from '@anthropic-ai/sdk'
import 'dotenv/config'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Agente mais simples possível
async function agenteSimples() {
  console.log('🤖 Iniciando agente...\n')

  const mensagens = []

  // 1. Primeira mensagem
  mensagens.push({
    role: 'user',
    content: 'Liste 3 tarefas simples que você poderia fazer.'
  })

  // 2. Enviar para Claude
  const resposta = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: mensagens,
  })

  // 3. Mostrar resposta
  console.log('Claude disse:')
  console.log(resposta.content[0].text)
}

// Executar
agenteSimples().catch(console.error)
