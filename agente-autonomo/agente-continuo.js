import Anthropic from '@anthropic-ai/sdk'
import { exec } from 'child_process'
import { promisify } from 'util'
import 'dotenv/config'

const execPromise = promisify(exec)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const ferramentas = [
  {
    name: 'executar_comando',
    description: 'Executa um comando bash/shell',
    input_schema: {
      type: 'object',
      properties: {
        comando: { type: 'string', description: 'Comando a executar' },
      },
      required: ['comando'],
    },
  },
]

async function executarFerramenta(nome, parametros) {
  console.log(`🔧 ${nome}: ${JSON.stringify(parametros)}`)
  try {
    if (nome === 'executar_comando') {
      const { stdout, stderr } = await execPromise(parametros.comando)
      return stdout || stderr
    }
  } catch (erro) {
    return `Erro: ${erro.message}`
  }
}

async function executarTarefa(tarefa) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🎯 Executando: ${tarefa}`)
  console.log(`⏰ ${new Date().toLocaleString('pt-BR')}`)
  console.log('='.repeat(60))

  const mensagens = [{ role: 'user', content: tarefa }]
  let iteracao = 0

  while (iteracao < 5) {
    iteracao++

    const resposta = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      tools: ferramentas,
      messages: mensagens,
    })

    const resultadosFerramentas = []

    for (const bloco of resposta.content) {
      if (bloco.type === 'text') {
        console.log(`\n💭 ${bloco.text}`)
      } else if (bloco.type === 'tool_use') {
        const resultado = await executarFerramenta(bloco.name, bloco.input)
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

  console.log('\n✅ Tarefa concluída!\n')
}

// ========================================
// LOOP CONTÍNUO
// ========================================

async function loopContinuo() {
  console.log('🤖 Agente Contínuo Iniciado!')
  console.log('Pressione Ctrl+C para parar\n')

  // Configuração
  const INTERVALO_MINUTOS = 60 // Executar a cada 60 minutos
  const TAREFA = 'Verifique o git status e me dê um resumo breve'

  while (true) {
    try {
      await executarTarefa(TAREFA)

      // Aguardar próxima execução
      const proximaExecucao = new Date(Date.now() + INTERVALO_MINUTOS * 60 * 1000)
      console.log(`⏸️  Aguardando ${INTERVALO_MINUTOS} minutos...`)
      console.log(`   Próxima execução: ${proximaExecucao.toLocaleString('pt-BR')}`)

      await new Promise((resolve) => setTimeout(resolve, INTERVALO_MINUTOS * 60 * 1000))
    } catch (erro) {
      console.error('❌ Erro na execução:', erro.message)
      console.log('⏸️  Aguardando 5 minutos antes de tentar novamente...')
      await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000))
    }
  }
}

// Executar
loopContinuo().catch(console.error)
