# ARQUITETURA DO SISTEMA DE AGENTES IA

Este documento descreve em detalhes a arquitetura do sistema de agentes de inteligencia artificial da plataforma Garcez Palha.

---

## 1. VISAO GERAL

### 1.1 Arquitetura Multi-Agente

O sistema utiliza uma arquitetura de **5 agentes especializados** + 1 agente geral, coordenados por um **Orchestrator** que roteia as mensagens para o agente mais adequado.

```
                    +------------------+
                    |     Usuario      |
                    +--------+---------+
                             |
                             v
        +--------------------+--------------------+
        |                    |                    |
   +----v----+         +-----v-----+        +-----v-----+
   | Website |         | WhatsApp  |        | Telegram  |
   |  Chat   |         | Cloud API |        |    Bot    |
   +----+----+         +-----+-----+        +-----+-----+
        |                    |                    |
        +--------------------+--------------------+
                             |
                             v
                    +--------+--------+
                    |   /api/chat     |
                    |   Route.ts      |
                    +--------+--------+
                             |
                             v
                    +--------+--------+
                    |     Agent       |
                    |  Orchestrator   |
                    +--------+--------+
                             |
        +----+----+----+----+----+----+
        |    |    |    |    |    |    |
        v    v    v    v    v    v    v
       RE   FO   VA   ME   CR   GE

RE = Real Estate Agent (Imobiliario)
FO = Forensics Agent (Pericia Documental)
VA = Valuation Agent (Avaliacao)
ME = Medical Agent (Pericia Medica)
CR = Criminal Agent (Direito Criminal)
GE = General Agent (Fallback)
```

### 1.2 Localizacao dos Arquivos

```
src/lib/ai/
├── agents/
│   ├── agent-orchestrator.ts     # Coordenador principal
│   ├── base-agent.ts             # Classe base abstrata
│   ├── real-estate-agent.ts      # Agente imobiliario
│   ├── document-forensics-agent.ts
│   ├── property-valuation-agent.ts
│   ├── medical-expertise-agent.ts
│   ├── criminal-law-agent.ts     # Direito criminal
│   ├── types.ts                  # Tipos TypeScript
│   ├── index.ts                  # Exports centralizados
│   └── README.md
├── prompts/
│   ├── base-prompt.ts            # Prompt base OAB-compliant
│   ├── real-estate-prompts.ts
│   ├── forensics-prompts.ts
│   ├── valuation-prompts.ts
│   ├── medical-prompts.ts
│   ├── criminal-law-prompts.ts
│   └── index.ts
├── chatbot.ts                    # Legado (OpenAI Assistants)
├── chatbot-with-agents.ts        # Aprimorado com agentes
└── openai-client.ts              # Cliente OpenRouter
```

---

## 2. COMPONENTES PRINCIPAIS

### 2.1 AgentOrchestrator

O orchestrator e responsavel por:
1. Receber a mensagem do usuario
2. Analisar keywords para determinar o melhor agente
3. Calcular confidence score
4. Rotear para o agente selecionado
5. Retornar resposta com metadados

**Arquivo**: `src/lib/ai/agents/agent-orchestrator.ts`

```typescript
export class AgentOrchestrator {
  private agents: Map<AgentRole, BaseAgent>

  constructor(config?: Partial<AgentConfig>) {
    this.agents = new Map()
    this.agents.set('real-estate', new RealEstateAgent(config))
    this.agents.set('forensics', new DocumentForensicsAgent(config))
    this.agents.set('valuation', new PropertyValuationAgent(config))
    this.agents.set('medical', new MedicalExpertiseAgent(config))
    this.agents.set('criminal', new CriminalLawAgent(config))
    this.agents.set('general', new GeneralAgent(config))
  }

  async process(userMessage: string, history: Message[]): Promise<OrchestratorResponse>
  suggestAgent(input: string): { role: AgentRole; confidence: number }
}
```

### 2.2 BaseAgent

Classe abstrata que todos os agentes herdam:

**Arquivo**: `src/lib/ai/agents/base-agent.ts`

```typescript
export abstract class BaseAgent {
  protected systemPrompt: string
  protected config: Required<AgentConfig>

  async chat(
    userMessage: string,
    conversationHistory: Message[],
    context?: AgentContext
  ): Promise<AgentResponse>

  async processTask(
    taskPrompt: string,
    userInput: string
  ): Promise<AgentResponse>

  abstract isRelevant(input: string): boolean
  abstract get name(): string
}
```

### 2.3 Tipos (types.ts)

```typescript
export type AgentRole =
  | 'real-estate'
  | 'forensics'
  | 'valuation'
  | 'medical'
  | 'criminal'
  | 'general'

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AgentResponse {
  content: string
  tokensUsed?: number
  model?: string
  finishReason?: string
}

export interface AgentConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

// Defaults
export const DEFAULT_MODEL = 'openai/gpt-4-turbo-preview'
export const DEFAULT_TEMPERATURE = 0.7
export const DEFAULT_MAX_TOKENS = 4000
```

---

## 3. AGENTES ESPECIALIZADOS

### 3.1 RealEstateAgent (Direito Imobiliario)

**Keywords de Roteamento**:
- imovel, imovel, casa, apartamento, compra, venda
- contrato, locacao, locacao, usucapiao, usucapiao
- itbi, iptu, matricula, matricula, despejo

**Funcionalidades**:
- Analise de contratos de compra e venda
- Verificacao de matricula e certidoes
- Calculo de ITBI e custos cartorarios
- Analise de usucapiao
- Contratos de locacao

**Prompt**: 174+ linhas com legislacao detalhada

### 3.2 DocumentForensicsAgent (Pericia Grafotecnica)

**Keywords de Roteamento**:
- assinatura, falsificacao, falsificacao, grafotecnica
- autenticidade, pericia, pericia, laudo, documento
- reconhecimento de firma, adulteracao

**Funcionalidades**:
- Analise de autenticidade de assinaturas
- Deteccao de adulteracoes em documentos
- Comparacao grafotecnica
- Laudos tecnicos periciais

### 3.3 PropertyValuationAgent (Avaliacao de Imoveis)

**Keywords de Roteamento**:
- avaliacao, avaliacao, valor, preco, preco
- quanto vale, nbr, 14653, mercado
- depreciacao, depreciacão, comparativo

**Funcionalidades**:
- Avaliacoes conforme NBR 14653
- Analise de mercado (comparables)
- Calculo de depreciacao
- Laudos de avaliacao

### 3.4 MedicalExpertiseAgent (Pericia Medica)

**Keywords de Roteamento**:
- medico, medico, acidente de trabalho, lesao, lesao
- incapacidade, inss, auxilio, auxilio, dpvat
- invalidez, sequela, laudo medico, erro medico

**Funcionalidades**:
- Analise de acidentes de trabalho
- Avaliacao de incapacidade
- Nexo causal
- Laudos para INSS/DPVAT

### 3.5 CriminalLawAgent (Direito Criminal)

**Keywords de Roteamento**:
- criminal, penal, crime, prisao, prisao
- flagrante, habeas corpus, habeas, delegacia
- furto, roubo, homicidio, homicidio, trafico, trafico
- defesa criminal, advogado criminal, denuncia

**Funcionalidades**:
- Analise de casos criminais
- Avaliacao de Habeas Corpus
- Estrategias de defesa
- Calculo de pena provavel

### 3.6 GeneralAgent (Fallback)

Usado quando nenhum agente especializado e selecionado ou confidence < threshold.

---

## 4. FLUXO DE ROTEAMENTO

### 4.1 Algoritmo de Selecao

```typescript
private selectAgent(input: string): { role: AgentRole; confidence: number } {
  const scores: Array<{ role: AgentRole; score: number }> = []

  // Para cada agente especializado
  for (const [role, agent] of this.agents) {
    if (role === 'general') continue

    // Verifica se agente e relevante
    if (agent.isRelevant(input)) {
      // Conta matches de keywords
      const keywords = this.getKeywordsForAgent(role)
      let matchCount = 0

      for (const keyword of keywords) {
        if (input.toLowerCase().includes(keyword)) {
          matchCount++
        }
      }

      scores.push({ role, score: matchCount })
    }
  }

  // Ordena por score e seleciona maior
  scores.sort((a, b) => b.score - a.score)

  if (scores.length > 0 && scores[0].score > 0) {
    const confidence = Math.min(scores[0].score / 5, 1) // Normaliza 0-1
    return { role: scores[0].role, confidence }
  }

  // Fallback para general
  return { role: 'general', confidence: 0.5 }
}
```

### 4.2 Confidence Score

O confidence score e calculado como:

```
confidence = min(keyword_matches / 5, 1.0)
```

| Matches | Confidence |
|---------|------------|
| 0 | 0.5 (fallback) |
| 1 | 0.2 |
| 2 | 0.4 |
| 3 | 0.6 |
| 4 | 0.8 |
| 5+ | 1.0 |

---

## 5. PROMPTS E COMPLIANCE

### 5.1 Estrutura do Prompt Base

**Arquivo**: `src/lib/ai/prompts/base-prompt.ts`

```typescript
export const BASE_PROMPT = `
Voce e um assistente especializado do escritorio Garcez Palha...

## PRINCIPIOS FUNDAMENTAIS

### Etica Profissional (OAB)
- SEMPRE respeite o sigilo profissional
- NUNCA forneca orientacoes que violem Codigo de Etica OAB
- SEMPRE esclareca que orientacoes nao substituem consulta formal
- NUNCA garanta resultados de processos judiciais
- SEMPRE recomende consulta presencial para casos complexos

### Responsabilidade Tecnica
- Baseie analises em legislacao vigente
- Cite fontes legais (leis, codigos)
- Seja transparente sobre limitacoes

### Limites de Atuacao
- NAO forneca orientacoes sobre:
  - Crimes contra a vida
  - Evasao fiscal
  - Praticas ilegais

## FORMATO DE RESPOSTA PADRAO
1. Resumo Executivo (2-3 linhas)
2. Analise Detalhada
3. Base Legal
4. Recomendacoes
5. Alertas

## DISCLAIMERS OBRIGATORIOS
[Incluidos automaticamente]
`
```

### 5.2 Disclaimers

Todas as respostas incluem:

1. **Disclaimer Legal**:
   > As informacoes fornecidas tem carater orientativo e nao substituem consulta juridica formal.

2. **Para consultas presenciais**:
   > Para analise detalhada, agende consulta pelo site ou telefones.

3. **Para casos urgentes**:
   > Em casos urgentes (prisao, intimacao, despejo), contate pelo WhatsApp.

---

## 6. INTEGRACAO COM API

### 6.1 Endpoint /api/chat

**Arquivo**: `src/app/api/chat/route.ts`

```typescript
async function handleChat(request: NextRequest) {
  const { message, threadId } = await request.json()

  // Verifica se AI esta configurada
  if (!aiConfigured) {
    return demoMode()
  }

  // Usa orchestrator
  const orchestrator = getOrchestrator()
  const result = await orchestrator.process(message, history)

  return {
    reply: result.content,
    agentUsed: result.agentUsed,
    confidence: result.confidence,
    mode: 'production'
  }
}

// Rate limiting: 20 msg/min
export const POST = withRateLimit(handleChat, { type: 'chat', limit: 20 })
```

### 6.2 tRPC Router

**Arquivo**: `src/lib/trpc/routers/chat.ts`

```typescript
// Endpoint com agentes especializados
sendMessageWithAgents: publicProcedure
  .input(z.object({
    conversation_id: z.string().uuid(),
    message: z.string().min(1),
    useSpecializedAgents: z.boolean().default(true),
  }))
  .mutation(async ({ ctx, input }) => {
    const chatbot = new EnhancedLegalChatbot(input.conversation_id, {
      useSpecializedAgents: input.useSpecializedAgents,
    })
    return chatbot.sendMessage(input.message)
  })

// Sugestao de agente (sem processar)
suggestAgent: publicProcedure
  .input(z.object({ query: z.string() }))
  .query(async ({ input }) => {
    const orchestrator = getOrchestrator()
    return orchestrator.suggestAgent(input.query)
  })
```

---

## 7. MODELO E CONFIGURACAO

### 7.1 Provider: OpenRouter

**Arquivo**: `src/lib/ai/openai-client.ts`

```typescript
import OpenAI from 'openai'

export function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY

  if (apiKey?.startsWith('sk-or-')) {
    // OpenRouter
    return new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    })
  }

  // OpenAI direto
  return new OpenAI({ apiKey })
}
```

### 7.2 Parametros

| Parametro | Valor | Descricao |
|-----------|-------|-----------|
| Model | openai/gpt-4-turbo-preview | Modelo via OpenRouter |
| Temperature | 0.7 | Equilibrio criatividade/precisao |
| Max Tokens | 4000 | Resposta maxima |
| Stream | false | Sem streaming (simplicidade) |

---

## 8. PERSISTENCIA E METRICAS

### 8.1 Salvamento de Mensagens

```typescript
// EnhancedLegalChatbot.saveMessage()
await supabase.from('messages').insert({
  conversation_id: this.conversationId,
  sender_type: role === 'user' ? 'client' : 'ai',
  content,
  message_type: 'text',
})
```

### 8.2 Metricas Disponiveis

A resposta da API inclui:
- `agentUsed`: Qual agente processou
- `confidence`: Score de confianca (0-1)
- `tokensUsed`: Tokens consumidos
- `model`: Modelo utilizado

### 8.3 Logging

```typescript
console.log(`[Orchestrator] Routing to ${role} agent (confidence: ${confidence}%)`)
console.log(`[EnhancedChatbot] Routed to ${agentUsed} agent`)
```

---

## 9. MELHORIAS FUTURAS

### 9.1 Historico de Conversacao Persistente

```typescript
// TODO: Implementar em /api/chat
const conversationHistory = await getHistoryFromDatabase(threadId)
```

### 9.2 Metodos Especializados nos Agentes

```typescript
// RealEstateAgent
async analyzeContract(contract: string): Promise<ContractAnalysis>
async checkProperty(matricula: string): Promise<PropertyCheck>
async calculateCosts(value: number, city: string): Promise<CostEstimate>
```

### 9.3 Roteamento Semantico

Usar embeddings para melhor classificacao:
```typescript
const embedding = await getEmbedding(userMessage)
const similarities = agents.map(a => cosineSimilarity(embedding, a.embedding))
```

### 9.4 Dashboard de Metricas

- Taxa de acerto por agente
- Tempo medio de resposta
- Tokens usados por conversa
- Conversoes por agente

---

## 10. EXEMPLO DE USO

### 10.1 Direto via API

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Estou comprando um apartamento, quais os custos?"}'
```

Resposta:
```json
{
  "reply": "## Resumo Executivo\nAlem do valor do imovel...",
  "agentUsed": "real-estate",
  "confidence": 0.8,
  "mode": "production"
}
```

### 10.2 Via tRPC

```typescript
const result = await trpc.chat.sendMessageWithAgents.mutate({
  conversation_id: 'uuid',
  message: 'Preciso verificar uma assinatura',
  useSpecializedAgents: true,
})

console.log(result.agentUsed) // 'forensics'
console.log(result.confidence) // 0.6
```

### 10.3 Sugestao de Agente

```typescript
const suggestion = await trpc.chat.suggestAgent.query({
  query: 'Fui preso em flagrante'
})

// { agent: 'criminal', confidence: 0.8, agentName: 'Direito Criminal' }
```
