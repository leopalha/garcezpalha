#!/usr/bin/env node

/**
 * MANUS AUTONOMOUS AGENT
 *
 * Agente autônomo que segue os protocolos do Claude Code (Manus)
 * - Lê tasks.md
 * - Executa tarefas
 * - Atualiza status
 * - Planeja próximas tarefas
 * - Trabalha continuamente até concluir tudo
 */

import Anthropic from '@anthropic-ai/sdk'
import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile, writeFile, access } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const execPromise = promisify(exec)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Caminho para tasks.md (no diretório pai)
const TASKS_FILE = join(__dirname, '..', 'tasks.md')
const PROJETO_DIR = join(__dirname, '..')

// ========================================
// SISTEMA DE PROMPT - MANUS PROTOCOL
// ========================================

const MANUS_SYSTEM_PROMPT = `Você é um agente autônomo de desenvolvimento seguindo os protocolos do Claude Code (Manus).

## MISSÃO PRINCIPAL
Trabalhar continuamente em tasks.md até completar todas as tarefas pendentes.

## PROTOCOLO DE TRABALHO

### 1. Leitura de Tarefas
- Leia tasks.md usando a ferramenta read_file
- Identifique tarefas com status: [ ] (pendente), [x] (concluída), [~] (em progresso)
- Priorize tarefas marcadas como URGENTE ou com prazo

### 2. Execução de Tarefas
- Execute UMA tarefa por vez
- Use as ferramentas disponíveis:
  - bash: Para comandos git, npm, build, etc
  - read_file: Para ler arquivos do projeto
  - write_file: Para criar/modificar arquivos
  - update_tasks: Para atualizar status em tasks.md

### 3. Atualização de Status
- Quando iniciar uma tarefa: [~] Tarefa em progresso
- Quando concluir: [x] Tarefa concluída
- Se bloquear: [!] Tarefa bloqueada (explique o motivo)

### 4. Planejamento Contínuo
- Após concluir tarefas, analise o projeto
- Identifique melhorias necessárias
- Adicione novas tarefas ao tasks.md
- Otimize código, segurança, performance

## FERRAMENTAS DISPONÍVEIS

### bash(comando)
Execute comandos no terminal. Use para:
- git status, git add, git commit
- npm install, npm run build
- Operações de sistema

### read_file(caminho)
Leia arquivos do projeto. Use para:
- Entender código existente
- Verificar configurações
- Analisar tasks.md

### write_file(caminho, conteudo)
Escreva/modifique arquivos. Use para:
- Criar novos arquivos
- Corrigir bugs
- Implementar features

### update_tasks(novoConteudo)
Atualize tasks.md com novo status/tarefas.

## REGRAS IMPORTANTES

1. **Sempre verifique antes de executar**
   - Leia arquivos antes de modificar
   - Entenda o contexto do projeto
   - Não quebre código funcional

2. **Commits frequentes**
   - Commite após cada tarefa concluída
   - Mensagens descritivas e claras
   - Siga padrão: "feat:", "fix:", "docs:", etc

3. **Segurança**
   - NUNCA commite secrets ou API keys
   - Use .env para credenciais
   - Verifique .gitignore

4. **Qualidade**
   - Teste código antes de commitar
   - Mantenha padrões do projeto
   - Documente quando necessário

5. **Comunicação**
   - Explique o que está fazendo
   - Reporte problemas encontrados
   - Sugira melhorias

## WORKFLOW TÍPICO

1. Ler tasks.md
2. Identificar próxima tarefa pendente
3. Marcar como [~] em progresso
4. Executar a tarefa
5. Marcar como [x] concluída
6. Commitar mudanças
7. Repetir até não haver tarefas pendentes
8. Analisar projeto e adicionar novas tarefas
9. Continuar trabalhando

## EXEMPLO DE EXECUÇÃO

Tarefa: "Corrigir bug no login"

1. read_file("tasks.md") → Ver detalhes
2. update_tasks(...) → Marcar [~] em progresso
3. read_file("src/auth/login.ts") → Entender código
4. write_file("src/auth/login.ts", codigo_corrigido)
5. bash("npm run build") → Verificar build
6. update_tasks(...) → Marcar [x] concluída
7. bash("git add . && git commit -m 'fix: corrigir bug no login'")

Agora trabalhe de forma autônoma e eficiente!`

// ========================================
// FERRAMENTAS DISPONÍVEIS
// ========================================

const tools = [
  {
    name: 'bash',
    description: 'Executa comandos bash/shell no terminal. Use para git, npm, builds, etc.',
    input_schema: {
      type: 'object',
      properties: {
        comando: {
          type: 'string',
          description: 'Comando a ser executado (ex: "git status", "npm run build")',
        },
      },
      required: ['comando'],
    },
  },
  {
    name: 'read_file',
    description: 'Lê o conteúdo de um arquivo do projeto.',
    input_schema: {
      type: 'object',
      properties: {
        caminho: {
          type: 'string',
          description: 'Caminho relativo do arquivo (ex: "src/components/Header.tsx")',
        },
      },
      required: ['caminho'],
    },
  },
  {
    name: 'write_file',
    description: 'Escreve/modifica um arquivo do projeto.',
    input_schema: {
      type: 'object',
      properties: {
        caminho: {
          type: 'string',
          description: 'Caminho relativo do arquivo',
        },
        conteudo: {
          type: 'string',
          description: 'Conteúdo completo do arquivo',
        },
      },
      required: ['caminho', 'conteudo'],
    },
  },
  {
    name: 'update_tasks',
    description: 'Atualiza o arquivo tasks.md com novo conteúdo (status, novas tarefas, etc).',
    input_schema: {
      type: 'object',
      properties: {
        conteudo: {
          type: 'string',
          description: 'Conteúdo completo atualizado do tasks.md',
        },
      },
      required: ['conteudo'],
    },
  },
  {
    name: 'list_files',
    description: 'Lista arquivos em um diretório.',
    input_schema: {
      type: 'object',
      properties: {
        diretorio: {
          type: 'string',
          description: 'Diretório a listar (ex: "src/components")',
        },
      },
      required: ['diretorio'],
    },
  },
]

// ========================================
// EXECUTOR DE FERRAMENTAS
// ========================================

async function executeTool(name, input) {
  console.log(`\n🔧 ${name}`)
  console.log(`   Input: ${JSON.stringify(input).substring(0, 100)}...`)

  try {
    switch (name) {
      case 'bash': {
        const { stdout, stderr } = await execPromise(input.comando, {
          cwd: PROJETO_DIR,
          maxBuffer: 10 * 1024 * 1024, // 10MB
        })
        const resultado = (stdout + stderr).trim()
        console.log(`   ✅ Output: ${resultado.substring(0, 200)}${resultado.length > 200 ? '...' : ''}`)
        return resultado || 'Comando executado com sucesso (sem output)'
      }

      case 'read_file': {
        const filePath = join(PROJETO_DIR, input.caminho)
        const conteudo = await readFile(filePath, 'utf-8')
        console.log(`   ✅ Lido: ${conteudo.length} caracteres`)
        return conteudo
      }

      case 'write_file': {
        const filePath = join(PROJETO_DIR, input.caminho)
        await writeFile(filePath, input.conteudo, 'utf-8')
        console.log(`   ✅ Escrito: ${input.conteudo.length} caracteres`)
        return `Arquivo ${input.caminho} escrito com sucesso`
      }

      case 'update_tasks': {
        await writeFile(TASKS_FILE, input.conteudo, 'utf-8')
        console.log(`   ✅ tasks.md atualizado`)
        return 'tasks.md atualizado com sucesso'
      }

      case 'list_files': {
        const { stdout } = await execPromise(`ls -la "${input.diretorio}"`, {
          cwd: PROJETO_DIR,
        })
        console.log(`   ✅ Listado`)
        return stdout
      }

      default:
        throw new Error(`Ferramenta desconhecida: ${name}`)
    }
  } catch (erro) {
    const mensagemErro = `Erro em ${name}: ${erro.message}`
    console.error(`   ❌ ${mensagemErro}`)
    return mensagemErro
  }
}

// ========================================
// CICLO DE TRABALHO DO AGENTE
// ========================================

async function workCycle() {
  console.log('\n' + '='.repeat(70))
  console.log('🤖 MANUS AGENT - Iniciando ciclo de trabalho')
  console.log(`⏰ ${new Date().toLocaleString('pt-BR')}`)
  console.log('='.repeat(70))

  const messages = [
    {
      role: 'user',
      content: `Inicie seu trabalho autônomo:

1. Leia o arquivo tasks.md
2. Identifique tarefas pendentes [ ]
3. Execute uma tarefa por vez
4. Atualize o status conforme progride
5. Quando não houver mais tarefas pendentes:
   - Analise o projeto
   - Identifique melhorias
   - Adicione novas tarefas
   - Continue trabalhando

Trabalhe de forma contínua e autônoma até que eu te peça para parar.
Seja proativo, eficiente e mantenha alta qualidade.`,
    },
  ]

  let iteration = 0
  const MAX_ITERATIONS = 50 // Limite de segurança

  while (iteration < MAX_ITERATIONS) {
    iteration++

    console.log(`\n${'─'.repeat(70)}`)
    console.log(`Iteração ${iteration}/${MAX_ITERATIONS}`)
    console.log('─'.repeat(70))

    // Chamar Claude
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 4096,
      system: MANUS_SYSTEM_PROMPT,
      tools: tools,
      messages: messages,
    })

    console.log(`\n💭 Claude (${response.stop_reason}):`)

    // Processar resposta
    const toolResults = []
    let hasText = false

    for (const block of response.content) {
      if (block.type === 'text') {
        hasText = true
        console.log('\n' + block.text)
      } else if (block.type === 'tool_use') {
        const result = await executeTool(block.name, block.input)
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: result,
        })
      }
    }

    // Adicionar resposta do Claude ao histórico
    messages.push({
      role: 'assistant',
      content: response.content,
    })

    // Se Claude terminou sem pedir ferramentas, perguntar se deve continuar
    if (response.stop_reason === 'end_turn' && toolResults.length === 0) {
      console.log('\n⏸️  Claude finalizou este ciclo')

      // Pedir para verificar se há mais trabalho
      messages.push({
        role: 'user',
        content: 'Verifique se há mais tarefas pendentes em tasks.md. Se sim, continue trabalhando. Se não, analise o projeto e adicione novas tarefas de otimização/melhoria.',
      })

      continue
    }

    // Enviar resultados das ferramentas de volta
    if (toolResults.length > 0) {
      messages.push({
        role: 'user',
        content: toolResults,
      })
    }

    // Pequeno delay para não sobrecarregar API
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.log('\n⚠️  Limite de iterações atingido!')
  return messages
}

// ========================================
// VERIFICAR TASKS.MD
// ========================================

async function checkTasksFile() {
  try {
    await access(TASKS_FILE)
    console.log(`✅ tasks.md encontrado: ${TASKS_FILE}`)
  } catch {
    console.log('⚠️  tasks.md não encontrado, criando arquivo inicial...')

    const initialTasks = `# 📋 Tarefas do Projeto

## ⚡ Tarefas Urgentes

## 📝 Tarefas Pendentes
[ ] Analisar estrutura do projeto e identificar melhorias
[ ] Verificar segurança (secrets, .gitignore)
[ ] Otimizar performance
[ ] Atualizar documentação

## 🔄 Em Progresso

## ✅ Concluídas

## 🚫 Bloqueadas

---

**Legenda:**
- [ ] Pendente
- [~] Em progresso
- [x] Concluída
- [!] Bloqueada
- ⚡ Urgente

**Última atualização:** ${new Date().toLocaleString('pt-BR')}
`

    await writeFile(TASKS_FILE, initialTasks, 'utf-8')
    console.log('✅ tasks.md criado com tarefas iniciais')
  }
}

// ========================================
// LOOP CONTÍNUO
// ========================================

async function continuousLoop() {
  console.log('🚀 MANUS AUTONOMOUS AGENT - CLAUDE OPUS 4')
  console.log('━'.repeat(70))
  console.log('Modelo: Claude Opus 4 (Mais Avançado)')
  console.log('Modo: Trabalho contínuo autônomo')
  console.log('Arquivo: tasks.md')
  console.log('Protocolo: Claude Code (Manus)')
  console.log('━'.repeat(70))
  console.log('\nPressione Ctrl+C para parar\n')

  // Verificar tasks.md
  await checkTasksFile()

  let cycleCount = 0
  const CYCLE_INTERVAL_MINUTES = 2 // Intervalo entre ciclos (reduzido para 2 min)

  while (true) {
    cycleCount++

    console.log(`\n${'═'.repeat(70)}`)
    console.log(`CICLO ${cycleCount}`)
    console.log('═'.repeat(70))

    try {
      await workCycle()

      // Após ciclo completo, aguardar um pouco antes do próximo
      console.log(`\n✅ Ciclo ${cycleCount} concluído!`)
      console.log(`\n${'🎯'.repeat(35)}`)
      console.log('📊 RESUMO DO CICLO:')
      console.log(`   ⏰ Horário: ${new Date().toLocaleString('pt-BR')}`)
      console.log(`   🔄 Ciclos completados: ${cycleCount}`)
      console.log(`   📋 Verifique tasks.md para ver progresso`)
      console.log('🎯'.repeat(35))
      console.log(`\n⏸️  Aguardando ${CYCLE_INTERVAL_MINUTES} minutos antes do próximo ciclo...`)
      console.log(`   ⏰ Próximo ciclo: ${new Date(Date.now() + CYCLE_INTERVAL_MINUTES * 60 * 1000).toLocaleString('pt-BR')}\n`)

      await new Promise((resolve) => setTimeout(resolve, CYCLE_INTERVAL_MINUTES * 60 * 1000))

    } catch (error) {
      console.error('\n❌ Erro no ciclo:', error.message)
      console.log('   Stack:', error.stack)
      console.log('\n⏸️  Aguardando 2 minutos antes de tentar novamente...')
      await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000))
    }
  }
}

// ========================================
// MODO ÚNICO (para testes)
// ========================================

async function singleRun() {
  console.log('🚀 MANUS AUTONOMOUS AGENT - Modo Único')
  console.log('━'.repeat(70))

  await checkTasksFile()
  await workCycle()

  console.log('\n✅ Execução única concluída!')
}

// ========================================
// EXECUTAR
// ========================================

const mode = process.argv[2] || 'continuous'

if (mode === 'single' || mode === 'test') {
  singleRun()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Erro fatal:', error)
      process.exit(1)
    })
} else {
  continuousLoop().catch((error) => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })
}
