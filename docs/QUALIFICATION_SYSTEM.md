# Sistema de Qualificação de Leads G4

Sistema completo de qualificação inteligente de leads para escritórios jurídicos, com 18 produtos jurídicos diferentes.

## 📋 Visão Geral

O sistema de qualificação G4 utiliza IA para fazer perguntas contextuais aos potenciais clientes e calcular automaticamente:

- **Urgência** (0-100): Quão urgente é o caso
- **Probabilidade** (0-100): Chance de sucesso jurídico
- **Complexidade** (0-100): Complexidade técnica do caso
- **Score Total**: Média ponderada (Urgência 40%, Probabilidade 35%, Complexidade 25%)

## 🎯 Produtos Cobertos

### Criminal (2 produtos)
- **Defesa Criminal**: 8 perguntas + 7 regras de pontuação
- **Habeas Corpus**: 8 perguntas + 8 regras de pontuação

### Perícias (3 produtos)
- **Perícia Grafotécnica**: 8 perguntas + 6 regras
- **Avaliação de Imóveis**: 8 perguntas + 7 regras
- **Perícia Médica**: 9 perguntas + 9 regras

### Previdência Social (3 produtos)
- **BPC LOAS**: 7 perguntas + 6 regras
- **Aposentadoria por Invalidez**: 7 perguntas + 6 regras
- **Auxílio-Doença**: 7 perguntas + 7 regras

### Planos de Saúde (3 produtos)
- **Plano de Saúde**: 8 perguntas + 6 regras
- **Cirurgia Bariátrica**: 6 perguntas + 5 regras
- **Tratamento TEA**: 7 perguntas + 6 regras

### Patrimonial (4 produtos)
- **Usucapião**: 8 perguntas + 7 regras
- **Holding Familiar**: 7 perguntas + 6 regras
- **Inventário**: 8 perguntas + 7 regras
- **Regularização de Imóvel**: 7 perguntas + 6 regras

### Proteção Financeira (3 produtos)
- **Desbloqueio de Conta**: 7 perguntas + 6 regras
- **Fraude PIX**: 8 perguntas + 7 regras
- **Negativação Indevida**: 7 perguntas + 7 regras

## 🚀 Como Usar

### 1. Importar o Sistema

```typescript
import {
  // Question Sets
  HABEAS_CORPUS_QUESTIONS,
  HABEAS_CORPUS_RULES,
  PERICIA_MEDICA_QUESTIONS,
  PERICIA_MEDICA_RULES,

  // Engine
  QuestionEngine,
  calculateLeadScore,
  categorizeScore,

  // Types
  QualificationQuestion,
  QuestionAnswer,
  LeadScore,
} from '@/lib/ai/qualification'
```

### 2. Criar uma Sessão de Qualificação

```typescript
// Criar engine para um produto específico
const engine = new QuestionEngine(
  HABEAS_CORPUS_QUESTIONS,
  {
    sessionId: 'unique-session-id',
    source: 'whatsapp', // ou 'website', 'phone', 'email'
    userId: 'user-123', // opcional
  },
  [] // respostas existentes (para retomar sessão)
)
```

### 3. Fazer Perguntas ao Cliente

```typescript
// Obter a próxima pergunta
const nextQuestion = engine.getNextQuestion()

if (nextQuestion) {
  console.log(nextQuestion.text)
  console.log('Tipo:', nextQuestion.type) // 'single-choice' ou 'multi-choice'
  console.log('Prioridade:', nextQuestion.priority) // 'required', 'important', 'optional'
  console.log('Opções:', nextQuestion.options)
}
```

### 4. Registrar Respostas

```typescript
// Quando o cliente responder
engine.addAnswer({
  questionId: 'hc-type',
  value: 'liberatory', // valor da opção escolhida
  timestamp: new Date(),
})

// Verificar progresso
const progress = engine.getProgress()
console.log(`Respondidas: ${progress.answered}/${progress.total}`)
console.log(`Obrigatórias: ${progress.requiredAnswered}/${progress.required}`)
console.log(`Progresso: ${progress.percentage}%`)
```

### 5. Calcular Score Final

```typescript
// Obter todas as respostas
const answers = engine.getAnswers()

// Calcular score
const score = calculateLeadScore(answers, HABEAS_CORPUS_RULES)

console.log('Urgência:', score.urgency)
console.log('Probabilidade:', score.probability)
console.log('Complexidade:', score.complexity)
console.log('Score Total:', score.total)
console.log('Categoria:', score.category) // 'hot', 'warm', 'cold', 'very-cold'
console.log('Raciocínio:', score.reasoning) // array de strings
```

### 6. Categorizar o Lead

```typescript
const category = categorizeScore(score.total)

switch (category) {
  case 'hot':
    console.log('🔥 Lead quente - Contato imediato!')
    break
  case 'warm':
    console.log('☀️ Lead morno - Acompanhamento próximo')
    break
  case 'cold':
    console.log('❄️ Lead frio - Nurturing necessário')
    break
  case 'very-cold':
    console.log('🧊 Lead muito frio - Baixa prioridade')
    break
}
```

## 📊 Exemplo Completo: Habeas Corpus

```typescript
import {
  HABEAS_CORPUS_QUESTIONS,
  HABEAS_CORPUS_RULES,
  QuestionEngine,
  calculateLeadScore,
} from '@/lib/ai/qualification'

async function qualifyHabeasCorpusLead() {
  // 1. Criar engine
  const engine = new QuestionEngine(
    HABEAS_CORPUS_QUESTIONS,
    {
      sessionId: 'hc-session-123',
      source: 'whatsapp',
      userId: 'client-456',
    }
  )

  // 2. Fazer perguntas (simulação)
  const simulatedAnswers = [
    { questionId: 'hc-type', value: 'liberatory' },
    { questionId: 'detention-type', value: 'preventive' },
    { questionId: 'illegality-ground', value: 'excess-deadline' },
    { questionId: 'detention-duration', value: 'long' },
    { questionId: 'crime-category', value: 'non-violent' },
    { questionId: 'defendant-profile', value: 'primary-good' },
    { questionId: 'has-fixed-address', value: 'yes-strong' },
    { questionId: 'hc-urgency', value: 'very-high' },
  ]

  // 3. Adicionar respostas
  for (const answer of simulatedAnswers) {
    engine.addAnswer({
      ...answer,
      timestamp: new Date(),
    })
  }

  // 4. Calcular score
  const score = calculateLeadScore(
    engine.getAnswers(),
    HABEAS_CORPUS_RULES
  )

  // 5. Resultado
  console.log('=== QUALIFICAÇÃO HABEAS CORPUS ===')
  console.log(`Score Total: ${score.total}/100`)
  console.log(`Urgência: ${score.urgency}/100`)
  console.log(`Probabilidade: ${score.probability}/100`)
  console.log(`Complexidade: ${score.complexity}/100`)
  console.log(`Categoria: ${score.category.toUpperCase()}`)
  console.log('\nRaciocínio:')
  score.reasoning.forEach((reason, i) => {
    console.log(`${i + 1}. ${reason}`)
  })

  return score
}

// Executar
qualifyHabeasCorpusLead()
```

### Saída Esperada:

```
=== QUALIFICAÇÃO HABEAS CORPUS ===
Score Total: 87/100
Urgência: 95/100
Probabilidade: 85/100
Complexidade: 75/100
Categoria: HOT

Raciocínio:
1. Pessoa já presa tem urgência máxima
2. Excesso de prazo é fundamento forte para HC
3. Réu primário em crime leve tem alta chance de HC
4. Vínculos sociais fortes favorecem concessão do HC
```

## 🔄 Persistência de Sessões

```typescript
// Exportar estado para salvar no banco
const state = engine.exportState()
await saveToDatabase({
  sessionId: state.context.sessionId,
  questions: state.questions,
  answers: state.answers,
  context: state.context,
})

// Restaurar sessão depois
const savedState = await loadFromDatabase(sessionId)
const resumedEngine = QuestionEngine.importState(savedState)

// Continuar de onde parou
const nextQuestion = resumedEngine.getNextQuestion()
```

## 🎨 Integração com UI

### React Component Example

```tsx
'use client'

import { useState, useEffect } from 'react'
import { QuestionEngine, HABEAS_CORPUS_QUESTIONS } from '@/lib/ai/qualification'

export function QualificationFlow() {
  const [engine, setEngine] = useState<QuestionEngine | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [progress, setProgress] = useState({ answered: 0, total: 0, percentage: 0 })

  useEffect(() => {
    const newEngine = new QuestionEngine(
      HABEAS_CORPUS_QUESTIONS,
      {
        sessionId: `session-${Date.now()}`,
        source: 'website',
      }
    )
    setEngine(newEngine)
    setCurrentQuestion(newEngine.getNextQuestion())
    setProgress(newEngine.getProgress())
  }, [])

  const handleAnswer = (value: string) => {
    if (!engine || !currentQuestion) return

    engine.addAnswer({
      questionId: currentQuestion.id,
      value,
      timestamp: new Date(),
    })

    const next = engine.getNextQuestion()
    setCurrentQuestion(next)
    setProgress(engine.getProgress())

    if (!next) {
      // Qualificação completa - calcular score
      onQualificationComplete()
    }
  }

  const onQualificationComplete = async () => {
    const answers = engine!.getAnswers()
    const score = calculateLeadScore(answers, HABEAS_CORPUS_RULES)

    // Enviar para API
    await fetch('/api/leads', {
      method: 'POST',
      body: JSON.stringify({
        answers,
        score,
        sessionId: engine!.exportState().context.sessionId,
      }),
    })
  }

  if (!currentQuestion) {
    return <div>Qualificação completa! ✅</div>
  }

  return (
    <div className="qualification-flow">
      <div className="progress">
        <div className="progress-bar" style={{ width: `${progress.percentage}%` }} />
        <span>{progress.answered}/{progress.total}</span>
      </div>

      <div className="question">
        <h3>{currentQuestion.text}</h3>
        {currentQuestion.helpText && <p className="help">{currentQuestion.helpText}</p>}

        <div className="options">
          {currentQuestion.options?.map(option => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="option-button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

## 📡 API Integration

### POST /api/chat/qualify

```typescript
// Client-side
const response = await fetch('/api/chat/qualify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'session-123',
    message: 'Meu marido está preso há 3 meses',
    source: 'whatsapp',
    clientInfo: {
      name: 'Maria Silva',
      phone: '11999999999',
    },
  }),
})

const data = await response.json()
console.log(data.message) // Resposta da IA com próxima pergunta
console.log(data.type) // 'question', 'qualification_complete', etc.
```

## 🧪 Testes

Sistema possui **28 testes automatizados** cobrindo:

- ✅ Validação de todas as 18 categorias de produtos
- ✅ Integração do Question Engine
- ✅ Cálculo de scores
- ✅ Aplicação de regras de pontuação
- ✅ Validação de IDs únicos

```bash
# Rodar testes
npm test -- src/lib/ai/qualification/__tests__/integration.test.ts

# Rodar com coverage
npm run test:coverage
```

## 📈 Estatísticas do Sistema

- **18 produtos jurídicos**
- **129 perguntas** no total
- **121 regras de pontuação**
- **2,916 linhas** de código
- **28 testes** automatizados
- **100% de cobertura** dos produtos

## 🔧 Estrutura de Arquivos

```
src/lib/ai/qualification/
├── index.ts                          # Exportações principais
├── types.ts                          # TypeScript interfaces
├── question-engine.ts                # Motor de perguntas
├── score-calculator.ts               # Cálculo de scores
├── lead-qualifier.ts                 # Qualificador de leads
├── agent-product-mapping.ts          # Mapeamento de produtos
├── questions/
│   ├── criminal-questions.ts         # Defesa Criminal + HC
│   ├── expertise-questions.ts        # Perícias
│   ├── social-security-questions.ts  # Previdência
│   ├── health-insurance-questions.ts # Planos de Saúde
│   ├── patrimonial-questions.ts      # Patrimonial
│   └── financial-protection-questions.ts # Proteção Financeira
└── __tests__/
    └── integration.test.ts           # Testes de integração
```

## 🎯 Melhores Práticas

1. **Sempre validar respostas** antes de adicionar ao engine
2. **Persistir sessões** no banco de dados para não perder progresso
3. **Usar os helpers** de score para interpretação correta
4. **Implementar timeout** em sessões inativas (recomendado: 24h)
5. **Logar interações** para análise posterior
6. **Mostrar progresso** ao usuário para melhor UX
7. **Calcular score** somente quando tiver perguntas obrigatórias respondidas

## 🚦 Categorias de Lead

| Categoria | Score | Ação Recomendada |
|-----------|-------|------------------|
| 🔥 Hot | 75-100 | Contato imediato (< 2h) |
| ☀️ Warm | 50-74 | Contato no mesmo dia |
| ❄️ Cold | 25-49 | Nurturing por 7 dias |
| 🧊 Very Cold | 0-24 | Nurturing por 30 dias |

## 📞 Suporte

Para dúvidas ou problemas:
- Email: dev@garcezpalha.com.br
- Documentação: `/docs`
- Issues: GitHub Issues

---

**Versão**: 1.0.0
**Última atualização**: Dezembro 2024
**Desenvolvido por**: Garcez Palha - 364 anos de tradição
