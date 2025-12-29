import Anthropic from '@anthropic-ai/sdk'
import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile, writeFile } from 'fs/promises'
import 'dotenv/config'

const execPromise = promisify(exec)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ========================================
// FERRAMENTAS DISPONÍVEIS
// ========================================

const ferramentas = [
  {
    name: 'executar_comando',
    description: 'Executa um comando bash/shell no sistema.',
    input_schema: {
      type: 'object',
      properties: {
        comando: {
          type: 'string',
          description: 'O comando a ser executado (ex: "ls -la", "git status")',
        },
      },
      required: ['comando'],
    },
  },
  {
    name: 'ler_arquivo',
    description: 'Lê o conteúdo de um arquivo.',
    input_schema: {
      type: 'object',
      properties: {
        caminho: {
          type: 'string',
          description: 'Caminho do arquivo a ser lido',
        },
      },
      required: ['caminho'],
    },
  },
  {
    name: 'escrever_arquivo',
    description: 'Escreve conteúdo em um arquivo.',
    input_schema: {
      type: 'object',
      properties: {
        caminho: {
          type: 'string',
          description: 'Caminho do arquivo a ser escrito',
        },
        conteudo: {
          type: 'string',
          description: 'Conteúdo a ser escrito no arquivo',
        },
      },
      required: ['caminho', 'conteudo'],
    },
  },
]

// ========================================
// EXECUTAR FERRAMENTAS
// ========================================

async function executarFerramenta(nome, parametros) {
  console.log(`\n🔧 Executando: ${nome}`)
  console.log(`   Parâmetros:`, JSON.stringify(parametros, null, 2))

  try {
    switch (nome) {
      case 'executar_comando': {
        const { stdout, stderr } = await execPromise(parametros.comando)
        const resultado = stdout || stderr
        console.log(`   ✅ Resultado: ${resultado.substring(0, 200)}...`)
        return resultado
      }

      case 'ler_arquivo': {
        const conteudo = await readFile(parametros.caminho, 'utf-8')
        console.log(`   ✅ Arquivo lido: ${conteudo.length} caracteres`)
        return conteudo
      }

      case 'escrever_arquivo': {
        await writeFile(parametros.caminho, parametros.conteudo, 'utf-8')
        console.log(`   ✅ Arquivo escrito com sucesso`)
        return 'Arquivo escrito com sucesso'
      }

      default:
        throw new Error(`Ferramenta desconhecida: ${nome}`)
    }
  } catch (erro) {
    console.error(`   ❌ Erro:`, erro.message)
    return `Erro ao executar ${nome}: ${erro.message}`
  }
}

// ========================================
// LOOP DO AGENTE
// ========================================

async function agente(tarefaInicial, maxIteracoes = 10) {
  console.log('🤖 Iniciando agente autônomo...')
  console.log(`📋 Tarefa: ${tarefaInicial}\n`)

  const mensagens = [
    {
      role: 'user',
      content: tarefaInicial,
    },
  ]

  let iteracao = 0

  while (iteracao < maxIteracoes) {
    iteracao++
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Iteração ${iteracao}/${maxIteracoes}`)
    console.log('='.repeat(60))

    // 1. Enviar mensagem para Claude
    const resposta = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      tools: ferramentas,
      messages: mensagens,
    })

    console.log(`\n💭 Claude (${resposta.stop_reason}):`)

    // 2. Processar resposta
    const resultadosFerramentas = []

    for (const bloco of resposta.content) {
      if (bloco.type === 'text') {
        console.log(bloco.text)
      } else if (bloco.type === 'tool_use') {
        // Claude quer usar uma ferramenta
        const resultado = await executarFerramenta(bloco.name, bloco.input)

        resultadosFerramentas.push({
          type: 'tool_result',
          tool_use_id: bloco.id,
          content: resultado,
        })
      }
    }

    // 3. Adicionar resposta do Claude ao histórico
    mensagens.push({
      role: 'assistant',
      content: resposta.content,
    })

    // 4. Se Claude terminou (não pediu ferramentas), parar
    if (resposta.stop_reason === 'end_turn') {
      console.log('\n✅ Agente concluiu a tarefa!')
      break
    }

    // 5. Enviar resultados das ferramentas de volta
    if (resultadosFerramentas.length > 0) {
      mensagens.push({
        role: 'user',
        content: resultadosFerramentas,
      })
    }
  }

  if (iteracao === maxIteracoes) {
    console.log('\n⚠️ Limite de iterações atingido!')
  }

  return mensagens
}

// ========================================
// EXECUTAR
// ========================================

// Exemplo de uso:
const tarefa = process.argv[2] || 'Crie um arquivo teste.txt com a data atual usando comandos bash.'

agente(tarefa, 10)
  .then(() => {
    console.log('\n🎉 Agente finalizado!')
    process.exit(0)
  })
  .catch((erro) => {
    console.error('\n❌ Erro:', erro)
    process.exit(1)
  })
