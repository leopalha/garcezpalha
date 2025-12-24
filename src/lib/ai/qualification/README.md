# Sistema de Qualificação de Leads

Sistema completo para qualificação automatizada de leads através de perguntas estruturadas e scoring inteligente.

## 📋 Visão Geral

O sistema de qualificação permite:
- ✅ Criar fluxos de perguntas personalizados por produto
- ✅ Validar respostas automaticamente
- ✅ Calcular score de qualidade do lead (0-100)
- ✅ Categorizar leads (hot, warm, cold, unqualified)
- ✅ Recomendar próximas ações automaticamente
- ✅ Estimar valor do caso e honorários
- ✅ Salvar/restaurar estado da qualificação

## 🏗️ Arquitetura

```
qualification/
├── types.ts                    # Tipos TypeScript
├── agent-product-mapping.ts    # Mapeamento agente → produto
├── score-calculator.ts         # Cálculo de score
├── question-engine.ts          # Motor de perguntas
├── lead-qualifier.ts           # Orchestrator principal
├── questions/
│   └── financial-protection-questions.ts  # Perguntas financeiras
└── index.ts                    # Exports
```

## 🚀 Uso Básico

### 1. Criar uma Qualificação

```typescript
import {
  createLeadQualifier,
  ACCOUNT_UNBLOCKING_QUESTIONS,
  ACCOUNT_UNBLOCKING_RULES,
} from '@/lib/ai/qualification'

// Configuração do produto
const config = {
  productId: 'desbloqueio-conta',
  agentRole: 'financial-protection' as const,
  questions: ACCOUNT_UNBLOCKING_QUESTIONS,
  scoringRules: ACCOUNT_UNBLOCKING_RULES,
}

// Contexto da qualificação
const context = {
  sessionId: 'sess_123',
  source: 'website' as const,
  initialMessage: 'Minha conta foi bloqueada',
}

// Criar qualifier
const qualifier = createLeadQualifier(config, context, 150000) // R$ 1.500 base price

// Obter primeira pergunta
const firstQuestion = qualifier.getNextQuestion()
console.log(firstQuestion)
// {
//   id: 'account-type',
//   text: 'Qual tipo de conta foi bloqueada?',
//   type: 'single-choice',
//   priority: 'required',
//   options: [...]
// }
```

### 2. Submeter Respostas

```typescript
// Responder pergunta 1
await qualifier.submitAnswer('account-type', 'salary')

// Responder pergunta 2
await qualifier.submitAnswer('blocked-amount', 5000)

// Responder pergunta 3
await qualifier.submitAnswer('urgency-level', 'extreme')

// Verificar progresso
const progress = qualifier.getProgress()
console.log(progress)
// {
//   answered: 3,
//   total: 6,
//   required: 5,
//   requiredAnswered: 3,
//   percentage: 50
// }

// Obter próxima pergunta
const nextQuestion = qualifier.getNextQuestion()
```

### 3. Obter Resultado

```typescript
// Quando isComplete() === true
const result = qualifier.getResult()

console.log(result.score)
// {
//   total: 85,
//   urgency: 90,
//   probability: 85,
//   complexity: 75,
//   category: 'hot',
//   reasoning: [
//     'Conta salário bloqueada - urgência máxima',
//     'Cliente sem recursos para subsistência',
//     'Valor bloqueado alto (> R$ 10.000)'
//   ]
// }

console.log(result.recommendedAction)
// {
//   type: 'schedule-consultation',
//   priority: 'immediate',
//   message: 'Cliente altamente qualificado com urgência extrema...',
//   estimatedValue: 15000,
//   estimatedFee: 1950
// }
```

### 4. Salvar/Restaurar Estado

```typescript
// Salvar estado (para persistir em DB)
const state = qualifier.exportState()
localStorage.setItem('qualification', JSON.stringify(state))

// Restaurar mais tarde
const savedState = JSON.parse(localStorage.getItem('qualification')!)
const restoredQualifier = resumeLeadQualification(savedState, config)
```

## 📊 Sistema de Scoring

### Componentes do Score

- **Urgency (40%)** - Quão urgente é o caso
- **Probability (35%)** - Chance de conversão
- **Complexity (25%)** - Complexidade do caso

### Categorias de Lead

| Categoria | Score | Ação Recomendada | Prazo |
|-----------|-------|------------------|-------|
| **Hot** | 80-100 | Agendar consulta imediata | 2-4h |
| **Warm** | 60-79 | Enviar proposta | 24-48h |
| **Cold** | 40-59 | Nutrição de lead | 1-2 semanas |
| **Unqualified** | 0-39 | Desqualificar | N/A |

### Regras de Pontuação

```typescript
const rule: ScoringRule = {
  id: 'salary-account-urgency',
  description: 'Conta salário bloqueada - urgência máxima',
  condition: (answers) => answerEquals(answers, 'account-type', 'salary'),
  impact: { urgency: 40, probability: 30 },
}
```

## 🎯 Produtos Disponíveis

### Financial Protection (4 produtos)

**Desbloqueio de Conta**
- 6 perguntas, 6 regras
- Foco: urgência, valor bloqueado, tipo de conta

**Golpe do PIX**
- 7 perguntas, 7 regras
- Foco: prazo MED (7 dias), tipo de golpe, provas

**Negativação Indevida**
- 6 perguntas, 6 regras
- Foco: motivo, prescrição, documentação

## 📝 Criando Novas Perguntas

```typescript
// 1. Definir perguntas
export const MY_PRODUCT_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'question-1',
    text: 'Qual sua situação?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'urgent', label: 'Urgente', scoreModifier: 30 },
      { value: 'normal', label: 'Normal', scoreModifier: 0 },
    ],
  },
  // ...
]

// 2. Definir regras de scoring
export const MY_PRODUCT_RULES: ScoringRule[] = [
  {
    id: 'urgent-case',
    description: 'Caso urgente',
    condition: (answers) => answerEquals(answers, 'question-1', 'urgent'),
    impact: { urgency: 40, probability: 20 },
  },
  // ...
]

// 3. Usar na configuração
const config = {
  productId: 'my-product',
  agentRole: 'my-agent',
  questions: MY_PRODUCT_QUESTIONS,
  scoringRules: MY_PRODUCT_RULES,
}
```

## 🔧 Tipos de Pergunta

- `text` - Input de texto livre
- `number` - Input numérico
- `currency` - Valor em dinheiro
- `date` - Seletor de data
- `single-choice` - Escolha única (radio)
- `multi-choice` - Escolha múltipla (checkbox)
- `yes-no` - Pergunta booleana
- `file-upload` - Upload de arquivo

## ⚙️ Validação

```typescript
validation: {
  required: true,        // Obrigatório?
  min: 0,               // Valor mínimo (number/currency)
  max: 1000000,         // Valor máximo
  pattern: '^\\d{11}$', // Regex (text)
}
```

## 🔀 Perguntas Condicionais

```typescript
{
  id: 'follow-up-question',
  text: 'Qual foi a resposta?',
  type: 'text',
  priority: 'optional',
  conditionalOn: {
    questionId: 'contacted',
    expectedValue: 'yes'  // Só aparece se respondeu "yes" em 'contacted'
  }
}
```

## 📈 Helpers de Score

```typescript
import {
  answerEquals,
  answerIn,
  answerGreaterThan,
  answerContains,
} from '@/lib/ai/qualification'

// Checar igualdade
answerEquals(answers, 'type', 'urgent')

// Checar se está em lista
answerIn(answers, 'option', ['a', 'b', 'c'])

// Checar valor numérico
answerGreaterThan(answers, 'amount', 10000)

// Checar se contém texto
answerContains(answers, 'description', 'bloqueio')
```

## 🎨 Exemplo Completo: Fluxo de Qualificação

```typescript
// 1. Setup
const config = {
  productId: 'desbloqueio-conta',
  agentRole: 'financial-protection',
  questions: ACCOUNT_UNBLOCKING_QUESTIONS,
  scoringRules: ACCOUNT_UNBLOCKING_RULES,
}

const context = {
  sessionId: 'abc123',
  source: 'whatsapp',
  userId: 'user_456',
}

const qualifier = createLeadQualifier(config, context, 150000)

// 2. Loop de perguntas
let question = qualifier.getNextQuestion()

while (question && !qualifier.isComplete()) {
  // Mostrar pergunta ao usuário
  console.log(question.text)

  // Receber resposta (simulado)
  const answer = await getUserAnswer(question)

  // Submeter resposta
  const result = await qualifier.submitAnswer(question.id, answer)

  if (!result.success) {
    console.error(result.error)
    continue
  }

  // Próxima pergunta
  question = result.nextQuestion || null
}

// 3. Resultado final
if (qualifier.isComplete()) {
  const result = qualifier.getResult()

  console.log(`
    Lead ID: ${result.leadId}
    Score: ${result.score.total}/100
    Categoria: ${result.score.category}
    Próxima ação: ${result.recommendedAction.type}
    Valor estimado: R$ ${result.recommendedAction.estimatedValue / 100}
  `)

  // Executar ação recomendada
  switch (result.recommendedAction.type) {
    case 'schedule-consultation':
      await scheduleUrgentConsultation(result)
      break
    case 'send-proposal':
      await sendProposal(result)
      break
    case 'request-documents':
      await requestDocuments(result)
      break
    // ...
  }
}
```

## 🔄 Integração com Chatbot

```typescript
// No handler do chat
async function handleChatMessage(message: string, sessionId: string) {
  // 1. Identificar produto pelo agente
  const orchestrator = getOrchestrator()
  const suggestion = orchestrator.suggestAgent(message)

  // 2. Iniciar qualificação
  const productId = getProductIdForAgent(suggestion.role)
  const config = getQualificationConfigFor(productId)

  const qualifier = createLeadQualifier(config, {
    sessionId,
    source: 'website',
    initialMessage: message,
  }, getProductPrice(productId))

  // 3. Primeira pergunta
  const question = qualifier.getNextQuestion()
  return formatQuestionForChat(question)
}

// No callback de resposta
async function handleQuestionAnswer(sessionId: string, answer: any) {
  const qualifier = await restoreQualifier(sessionId)

  await qualifier.submitAnswer(question.id, answer)

  if (qualifier.isComplete()) {
    const result = qualifier.getResult()
    return formatCompletionMessage(result)
  }

  const nextQuestion = qualifier.getNextQuestion()
  return formatQuestionForChat(nextQuestion)
}
```

## 📚 Recursos Adicionais

- [Types Reference](./types.ts) - Todos os tipos TypeScript
- [Agent Mapping](./agent-product-mapping.ts) - Mapeamento agente-produto
- [Score Calculator](./score-calculator.ts) - Lógica de pontuação
- [Question Engine](./question-engine.ts) - Motor de perguntas

## 🚀 Roadmap

- [ ] Perguntas para todos os 22 produtos
- [ ] UI components (React)
- [ ] Analytics de conversão
- [ ] A/B testing de perguntas
- [ ] Machine learning para otimizar scoring
- [ ] Integração com CRM
- [ ] Relatórios de qualificação

---

**Desenvolvido por Garcez Palha - Sistema G4**
*Última atualização: 23/12/2024*
