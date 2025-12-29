# TEMPLATE: QUALIFICATION FLOW (Question Set)

## INSTRUÇÕES DE USO

Este template cria um **fluxo de qualificação** para leads de produtos jurídicos.

**Objetivo:** Coletar informações do cliente para análise jurídica inicial.

**Como usar:**
1. Copie este template
2. Substitua [PLACEHOLDERS]
3. Crie arquivo em `src/lib/ai/qualification/questions/[categoria]-questions.ts`
4. Adicione referência em `agent-product-mapping.ts`

---

## ESTRUTURA TYPESCRIPT

```typescript
import type { QualificationQuestion, ScoringRule } from '../types'
import {
  answerEquals,
  answerGreaterThan,
  answerIn,
  answerContains,
} from '../score-calculator'

// ============================================================================
// [CÓDIGO-PRODUTO]: [NOME DO PRODUTO]
// ============================================================================

export const [PRODUTO_SLUG_UPPER]_QUESTIONS: QualificationQuestion[] = [
  // SEÇÃO 1: IDENTIFICAÇÃO DO CASO
  {
    id: '[campo-1]',
    text: '[PERGUNTA ESPECÍFICA DO PRODUTO]',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'opcao1', label: '[Label Opção 1]', scoreModifier: 25 },
      { value: 'opcao2', label: '[Label Opção 2]', scoreModifier: 20 },
      { value: 'opcao3', label: '[Label Opção 3]', scoreModifier: 15 },
    ],
    helpText: '[TEXTO DE AJUDA OPCIONAL]',
  },

  // SEÇÃO 2: VALORES E PRAZOS
  {
    id: '[campo-valor]',
    text: '[PERGUNTA SOBRE VALOR ENVOLVIDO]',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 5000',
    helpText: 'Valor aproximado em R$',
  },

  {
    id: '[campo-prazo]',
    text: '[PERGUNTA SOBRE QUANDO ACONTECEU]',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'recent', label: 'Há menos de 30 dias', scoreModifier: 25 },
      { value: '1-6m', label: 'Entre 1-6 meses atrás', scoreModifier: 20 },
      { value: '6m-1y', label: 'Entre 6 meses e 1 ano', scoreModifier: 15 },
      { value: '1-3y', label: 'Entre 1 e 3 anos', scoreModifier: 10 },
      { value: '3-5y', label: 'Entre 3 e 5 anos', scoreModifier: 5 },
      { value: '5y+', label: 'Mais de 5 anos', scoreModifier: -40 },
    ],
    helpText: 'Prazo de prescrição: 5 anos',
  },

  // SEÇÃO 3: TENTATIVAS ANTERIORES
  {
    id: 'previous-actions',
    text: 'Você já tentou resolver administrativamente?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'no', label: 'Não, não tentei nada ainda', scoreModifier: 5 },
      { value: 'sac', label: 'Sim, liguei no SAC mas não resolveram', scoreModifier: 20 },
      { value: 'protocol', label: 'Abri protocolo formal mas foi negado', scoreModifier: 25 },
      { value: 'complaint', label: 'Reclamei em órgãos (Procon, etc)', scoreModifier: 30 },
    ],
    helpText: 'Tentativas anteriores reforçam o caso',
  },

  // SEÇÃO 4: DOCUMENTAÇÃO
  {
    id: 'has-documents',
    text: 'Você tem documentos do caso? (contratos, extratos, emails, protocolos)',
    type: 'yes-no',
    priority: 'required',
    helpText: 'Documentação é essencial para análise',
  },

  {
    id: 'documents-list',
    text: 'Quais documentos você possui?',
    type: 'multi-choice',
    priority: 'important',
    dependsOn: { field: 'has-documents', value: true },
    options: [
      { value: 'contract', label: 'Contrato/Proposta', scoreModifier: 20 },
      { value: 'extracts', label: 'Extratos/Comprovantes', scoreModifier: 15 },
      { value: 'emails', label: 'Emails/Mensagens', scoreModifier: 10 },
      { value: 'protocols', label: 'Números de protocolo', scoreModifier: 15 },
      { value: 'receipts', label: 'Recibos de pagamento', scoreModifier: 10 },
      { value: 'photos', label: 'Fotos/Prints de tela', scoreModifier: 5 },
    ],
    helpText: 'Marque todos que você tem',
  },

  // SEÇÃO 5: URGÊNCIA
  {
    id: 'urgency-level',
    text: 'Qual a urgência do seu caso?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'low', label: 'Baixa - Posso aguardar algumas semanas', scoreModifier: 0 },
      { value: 'medium', label: 'Média - Preciso resolver em 15-30 dias', scoreModifier: 5 },
      { value: 'high', label: 'Alta - Preciso resolver esta semana', scoreModifier: 10 },
      { value: 'critical', label: 'Crítica - Preciso resolver hoje/amanhã', scoreModifier: 15 },
    ],
  },

  // SEÇÃO 6: CONTEXTO DETALHADO
  {
    id: 'case-description',
    text: 'Descreva o que aconteceu (quanto mais detalhes, melhor)',
    type: 'text',
    priority: 'required',
    validation: { required: true, minLength: 50 },
    placeholder: 'Ex: No dia XX/XX, ...',
    helpText: 'Mínimo 50 caracteres',
  },
]

// ============================================================================
// SCORING RULES (Regras de Pontuação)
// ============================================================================

export const [PRODUTO_SLUG_UPPER]_SCORING: ScoringRule[] = [
  // REGRA 1: Valor envolvido alto
  {
    productId: '[codigo-produto]',
    condition: answerGreaterThan('[campo-valor]', 5000),
    points: 25,
    reason: 'Valor envolvido significativo (>R$ 5.000)',
  },

  // REGRA 2: Caso recente (prescrição longe)
  {
    productId: '[codigo-produto]',
    condition: answerIn('[campo-prazo]', ['recent', '1-6m', '6m-1y']),
    points: 20,
    reason: 'Caso recente, dentro do prazo legal',
  },

  // REGRA 3: Tentou resolver administrativamente
  {
    productId: '[codigo-produto]',
    condition: answerIn('previous-actions', ['sac', 'protocol', 'complaint']),
    points: 15,
    reason: 'Tentou resolver administrativamente (boa-fé)',
  },

  // REGRA 4: Tem documentação completa
  {
    productId: '[codigo-produto]',
    condition: answerContains('documents-list', ['contract', 'extracts', 'protocols']),
    points: 20,
    reason: 'Documentação robusta',
  },

  // REGRA 5: Urgência alta
  {
    productId: '[codigo-produto]',
    condition: answerIn('urgency-level', ['high', 'critical']),
    points: 10,
    reason: 'Caso urgente, cliente motivado',
  },
]

// ============================================================================
// TRIGGERS (Ações Automatizadas)
// ============================================================================

export const [PRODUTO_SLUG_UPPER]_TRIGGERS = {
  // QUALIFICADO (>70 pontos): Agendar consulta
  qualified: {
    threshold: 70,
    actions: [
      'send-whatsapp-scheduling',
      'notify-lawyer-high-score',
      'send-email-proposal',
    ],
  },

  // MÉDIO (40-69 pontos): Orientação e aguardar
  medium: {
    threshold: 40,
    actions: [
      'send-whatsapp-guidance',
      'request-additional-docs',
    ],
  },

  // REJEITADO (<40 pontos): Declinar educadamente
  rejected: {
    threshold: 0,
    actions: [
      'send-whatsapp-rejection-polite',
      'suggest-alternative-solutions',
    ],
  },
}
```

---

## EXEMPLO COMPLETO: SEGURO PRESTAMISTA

```typescript
/**
 * Qualification Questions for Seguro Prestamista (Venda Casada)
 * PRODUTO: FIN-010
 */

import type { QualificationQuestion, ScoringRule } from '../types'
import { answerEquals, answerGreaterThan, answerIn } from '../score-calculator'

export const SEGURO_PRESTAMISTA_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'loan-type',
    text: 'Que tipo de empréstimo/financiamento você fez?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'consignado-inss', label: 'Empréstimo consignado INSS', scoreModifier: 25 },
      { value: 'consignado-servidor', label: 'Consignado servidor público', scoreModifier: 25 },
      { value: 'financiamento-veiculo', label: 'Financiamento de veículo', scoreModifier: 20 },
      { value: 'credito-pessoal', label: 'Crédito pessoal', scoreModifier: 15 },
      { value: 'cartao-consignado', label: 'Cartão de crédito consignado', scoreModifier: 20 },
      { value: 'outro', label: 'Outro tipo', scoreModifier: 10 },
    ],
  },

  {
    id: 'insurance-amount',
    text: 'Qual o valor total do seguro cobrado? (aproximado)',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 1500',
    helpText: 'Some todos os seguros se teve mais de um contrato',
  },

  {
    id: 'had-choice',
    text: 'Te deram opção de NÃO contratar o seguro?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'no-choice', label: 'Não, veio embutido/obrigatório', scoreModifier: 40 },
      { value: 'not-informed', label: 'Nem fui informado sobre o seguro', scoreModifier: 45 },
      { value: 'verbal-only', label: 'Só falaram verbalmente, não tive opção real', scoreModifier: 35 },
      { value: 'had-choice', label: 'Sim, me deram escolha por escrito', scoreModifier: -50 },
    ],
    helpText: 'Se foi imposto, é venda casada (ilegal)',
  },

  {
    id: 'discovered-when',
    text: 'Quando você descobriu que tinha seguro no contrato?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'after-signing', label: 'Só depois de assinar', scoreModifier: 25 },
      { value: 'paying', label: 'Quando vi as parcelas sendo debitadas', scoreModifier: 20 },
      { value: 'recently', label: 'Descobri recentemente', scoreModifier: 15 },
      { value: 'before', label: 'Antes de assinar, mas não pude recusar', scoreModifier: 30 },
    ],
  },

  {
    id: 'has-contract',
    text: 'Você tem o contrato do empréstimo?',
    type: 'yes-no',
    priority: 'important',
    helpText: 'Se não tiver, o banco é obrigado a fornecer',
  },

  {
    id: 'contract-status',
    text: 'Situação do contrato:',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'active', label: 'Ainda estou pagando', scoreModifier: 15 },
      { value: 'paid-recently', label: 'Quitei há menos de 1 ano', scoreModifier: 20 },
      { value: 'paid-1-3y', label: 'Quitei entre 1 e 3 anos atrás', scoreModifier: 10 },
      { value: 'paid-3-5y', label: 'Quitei entre 3 e 5 anos atrás', scoreModifier: 5 },
      { value: 'paid-5y+', label: 'Quitei há mais de 5 anos', scoreModifier: -40 },
    ],
    helpText: 'Prazo de 5 anos para processar (prescrição)',
  },

  {
    id: 'case-description',
    text: 'Descreva como foi a contratação do empréstimo e quando descobriu o seguro',
    type: 'text',
    priority: 'required',
    validation: { required: true, minLength: 50 },
    placeholder: 'Ex: Contratei empréstimo consignado em 01/2024 no banco X...',
    helpText: 'Quanto mais detalhes, melhor a análise',
  },
]

export const SEGURO_PRESTAMISTA_SCORING: ScoringRule[] = [
  {
    productId: 'FIN-010',
    condition: answerGreaterThan('insurance-amount', 2000),
    points: 25,
    reason: 'Valor do seguro > R$ 2.000 (alta restituição)',
  },
  {
    productId: 'FIN-010',
    condition: answerIn('had-choice', ['no-choice', 'not-informed']),
    points: 40,
    reason: 'Venda casada clara (STJ Tema 972)',
  },
  {
    productId: 'FIN-010',
    condition: answerIn('loan-type', ['consignado-inss', 'consignado-servidor']),
    points: 20,
    reason: 'Consignado (alta incidência de venda casada)',
  },
  {
    productId: 'FIN-010',
    condition: answerIn('contract-status', ['active', 'paid-recently', 'paid-1-3y']),
    points: 15,
    reason: 'Dentro do prazo de prescrição',
  },
  {
    productId: 'FIN-010',
    condition: answerEquals('has-contract', true),
    points: 15,
    reason: 'Tem contrato (prova documental)',
  },
]

export const SEGURO_PRESTAMISTA_TRIGGERS = {
  qualified: {
    threshold: 75,
    actions: [
      'send-whatsapp-proposal',
      'notify-lawyer-high-score',
      'send-email-proposal',
    ],
  },
  medium: {
    threshold: 40,
    actions: ['send-whatsapp-request-contract', 'schedule-call'],
  },
  rejected: {
    threshold: 0,
    actions: ['send-whatsapp-out-of-deadline', 'suggest-other-products'],
  },
}
```

---

## PERGUNTAS ESPECÍFICAS POR CATEGORIA

### Bancário
- Qual banco?
- Tipo de conta? (corrente, poupança, salário)
- Há quanto tempo é cliente?
- Valor envolvido?
- Houve comunicação do banco?
- Tem extratos/protocolos?

### Telecom
- Qual operadora?
- Tipo de plano? (pré, pós, combo)
- Número da linha?
- Valor da cobrança indevida?
- Há protocolos abertos?
- Quanto tempo já reclama?

### Consumidor
- Qual empresa?
- Tipo de produto/serviço?
- Valor pago?
- Data da compra?
- Há nota fiscal/comprovante?
- Já entrou em contato com Procon?

### Saúde
- Qual plano de saúde?
- Tipo de plano? (individual, familiar, empresarial)
- Número da carteirinha?
- Qual procedimento negado?
- Há relatório médico?
- Há urgência médica?

### Previdenciário
- Qual benefício? (aposentadoria, auxílio-doença, BPC-LOAS)
- Já deu entrada no INSS?
- Número do processo/protocolo?
- Houve perícia médica?
- Qual a resposta do INSS?
- Tem laudos médicos?

### Trabalhista
- Nome da empresa?
- Tipo de vínculo? (CLT, PJ, estágio)
- Data de admissão/demissão?
- Houve acordo na rescisão?
- Há documentos trabalhistas (CTPS, holerites)?
- Já abriu processo na Justiça do Trabalho?

---

## TIPOS DE CAMPO DISPONÍVEIS

```typescript
type QuestionType =
  | 'text'          // Texto livre curto
  | 'textarea'      // Texto longo (>100 chars)
  | 'email'         // Email validado
  | 'phone'         // Telefone brasileiro
  | 'cpf'           // CPF validado
  | 'currency'      // Valor em R$ (number)
  | 'number'        // Número genérico
  | 'date'          // Data (DD/MM/AAAA)
  | 'yes-no'        // Sim/Não (boolean)
  | 'single-choice' // Radio buttons (uma escolha)
  | 'multi-choice'  // Checkboxes (múltiplas)
  | 'select'        // Dropdown
  | 'file'          // Upload de arquivo
```

---

## VALIDAÇÕES COMUNS

```typescript
// String mínimo
validation: { required: true, minLength: 3 }

// Email
type: 'email'

// Telefone (BR)
type: 'phone'

// CPF
type: 'cpf'

// Valor monetário
type: 'currency'
validation: { required: true, min: 0, max: 1000000 }

// Data
type: 'date'
validation: { required: true }

// Número
type: 'number'
validation: { required: true, min: 0, max: 100 }
```

---

## CAMPOS CONDICIONAIS

```typescript
{
  id: 'campo-condicional',
  text: 'Esta pergunta só aparece se X = Y',
  type: 'text',
  priority: 'important',
  dependsOn: {
    field: 'campoX',        // Campo que controla visibilidade
    value: true,            // Valor que ativa o campo
    // Ou array de valores: value: ['valor1', 'valor2']
  },
}

// Exemplo real:
{
  id: 'documents-list',
  text: 'Quais documentos você possui?',
  type: 'multi-choice',
  priority: 'important',
  dependsOn: { field: 'has-documents', value: true },
  options: [
    { value: 'contract', label: 'Contrato', scoreModifier: 20 },
    { value: 'extracts', label: 'Extratos', scoreModifier: 15 },
  ],
}
```

---

## SCORING FUNCTIONS

```typescript
// answerEquals - Valor exato
answerEquals('campo', valor)
// Ex: answerEquals('has-contract', true)

// answerIn - Valor em array
answerIn('campo', [valores])
// Ex: answerIn('urgency', ['high', 'critical'])

// answerGreaterThan - Maior que
answerGreaterThan('campo', numero)
// Ex: answerGreaterThan('insurance-amount', 5000)

// answerLessThan - Menor que
answerLessThan('campo', numero)
// Ex: answerLessThan('contract-status', 3)

// answerContains - Array contém valor
answerContains('campo', [valores])
// Ex: answerContains('documents-list', ['contract', 'extracts'])
```

---

## CHECKLIST FINAL

Antes de usar o question set:

- [ ] Schema Zod criado com validações (se aplicável)
- [ ] Todos os campos obrigatórios marcados como `required: true`
- [ ] Perguntas claras e objetivas (máximo 15 palavras)
- [ ] Placeholders úteis em todos os campos de texto
- [ ] HelpText quando necessário
- [ ] Campos condicionais configurados corretamente
- [ ] Scoring rules definidas (mínimo 3-5 regras)
- [ ] Triggers configurados (qualified, medium, rejected)
- [ ] Testado manualmente com casos reais
- [ ] Adicionado em `agent-product-mapping.ts`
- [ ] ScoreModifiers balanceados (total ~100 pontos possível)
- [ ] Threshold de qualificação configurado (recomendado: 70+)

---

**Criado por:** MANUS v7.0
**Data:** 29/12/2025
**Versão:** 1.0
**Linhas:** ~310
