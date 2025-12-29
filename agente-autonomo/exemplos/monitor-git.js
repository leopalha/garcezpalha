import Anthropic from '@anthropic-ai/sdk'
import { exec } from 'child_process'
import { promisify } from 'util'
import 'dotenv/config'

const execPromise = promisify(exec)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Ferramenta para executar comandos git
const ferramentas = [
  {
    name: 'git_status',
    description: 'Verifica o status do repositório git',
    input_schema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'git_diff',
    description: 'Mostra as mudanças não commitadas',
    input_schema: {
      type: 'object',
      properties: {},
    },
  },
]

async function executarFerramenta(nome) {
  console.log(`🔧 Executando: ${nome}`)

  try {
    if (nome === 'git_status') {
      const { stdout } = await execPromise('git status')
      return stdout
    }

    if (nome === 'git_diff') {
      const { stdout } = await execPromise('git diff')
      return stdout || 'Nenhuma mudança'
    }

    throw new Error(`Ferramenta desconhecida: ${nome}`)
  } catch (erro) {
    return `Erro: ${erro.message}`
  }
}

async function monitorarGit() {
  console.log('🔍 Monitorando repositório Git...\n')

  const mensagens = [
    {
      role: 'user',
      content: `Verifique o status do repositório git e me dê um resumo executivo.

      Se houver mudanças não commitadas, liste:
      - Quantos arquivos foram modificados
      - Quais são os principais arquivos
      - Se há algo que precisa de atenção

      Seja breve e objetivo.`,
    },
  ]

  let iteracao = 0
  const maxIteracoes = 5

  while (iteracao < maxIteracoes) {
    iteracao++

    const resposta = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      tools: ferramentas,
      messages: mensagens,
    })

    const resultadosFerramentas = []

    for (const bloco of resposta.content) {
      if (bloco.type === 'text') {
        console.log('📊 Relatório:')
        console.log(bloco.text)
        console.log('')
      } else if (bloco.type === 'tool_use') {
        const resultado = await executarFerramenta(bloco.name)
        resultadosFerramentas.push({
          type: 'tool_result',
          tool_use_id: bloco.id,
          content: resultado,
        })
      }
    }

    mensagens.push({ role: 'assistant', content: resposta.content })

    if (resposta.stop_reason === 'end_turn') break

    if (resultadosFerramentas.length > 0) {
      mensagens.push({ role: 'user', content: resultadosFerramentas })
    }
  }
}

// Executar
monitorarGit().catch(console.error)
