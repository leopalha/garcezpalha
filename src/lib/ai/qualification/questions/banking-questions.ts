/**
 * Qualification Questions for Banking Products (New Niches)
 * Created: 2025-12-27
 * FASE 4: AGENTES IA - MANUS v6.0
 */

import type { QualificationQuestion, ScoringRule } from '../types'
import {
  answerEquals,
  answerGreaterThan,
  answerIn,
  answerContains,
} from '../score-calculator'

// ============================================================================
// FIN-010: SEGURO PRESTAMISTA (Venda Casada)
// ============================================================================

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
    id: 'multiple-contracts',
    text: 'Tem mais de um empréstimo com seguro embutido?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: '1', label: '1 contrato', scoreModifier: 0 },
      { value: '2', label: '2 contratos', scoreModifier: 20 },
      { value: '3', label: '3 contratos', scoreModifier: 30 },
      { value: '4+', label: '4 ou mais contratos', scoreModifier: 40 },
    ],
    helpText: 'Quanto mais contratos, maior a restituição',
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
]

export const SEGURO_PRESTAMISTA_RULES: ScoringRule[] = [
  {
    id: 'clear-tied-sale',
    description: 'Venda casada clara - sem opção de escolha',
    condition: (answers) => answerIn(answers, 'had-choice', ['no-choice', 'not-informed', 'verbal-only']),
    impact: { probability: 40, urgency: 30 },
  },
  {
    id: 'high-value-insurance',
    description: 'Valor alto de seguro (>= R$ 2.000)',
    condition: (answers) => answerGreaterThan(answers, 'insurance-amount', 2000),
    impact: { urgency: 25, probability: 20 },
  },
  {
    id: 'multiple-contracts-boost',
    description: '3+ contratos - valor de restituição multiplicado',
    condition: (answers) => answerIn(answers, 'multiple-contracts', ['3', '4+']),
    impact: { urgency: 30, probability: 25 },
  },
  {
    id: 'consignado-target',
    description: 'Consignado INSS/Servidor - público-alvo perfeito',
    condition: (answers) => answerIn(answers, 'loan-type', ['consignado-inss', 'consignado-servidor']),
    impact: { probability: 20, urgency: 15 },
  },
  {
    id: 'active-contract',
    description: 'Contrato ativo - urgência maior',
    condition: (answers) => answerEquals(answers, 'contract-status', 'active'),
    impact: { urgency: 20 },
  },
  {
    id: 'within-prescription',
    description: 'Dentro do prazo de prescrição (5 anos)',
    condition: (answers) => !answerEquals(answers, 'contract-status', 'paid-5y+'),
    impact: { probability: 30 },
  },
  {
    id: 'tema-972-stj',
    description: 'STJ Tema 972 - jurisprudência consolidada',
    condition: (answers) => answerIn(answers, 'had-choice', ['no-choice', 'not-informed']),
    impact: { probability: 35, complexity: -20 },
  },
]

// ============================================================================
// FIN-011: REVISÃO DE CONTRATO BANCÁRIO
// ============================================================================

export const REVISAO_CONTRATO_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'loan-type-revisao',
    text: 'Que tipo de contrato bancário você quer revisar?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'personal-loan', label: 'Empréstimo pessoal', scoreModifier: 15 },
      { value: 'consignado', label: 'Consignado', scoreModifier: 10 },
      { value: 'vehicle-finance', label: 'Financiamento de veículo', scoreModifier: 20 },
      { value: 'credit-card', label: 'Cartão de crédito', scoreModifier: 25 },
      { value: 'overdraft', label: 'Cheque especial', scoreModifier: 30 },
      { value: 'real-estate', label: 'Financiamento imobiliário', scoreModifier: 15 },
    ],
    helpText: 'Pode marcar vários',
  },
  {
    id: 'total-debt',
    text: 'Qual o valor total da dívida atual?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 25000',
  },
  {
    id: 'abusive-fees',
    text: 'Quais cobranças abusivas você identificou?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'tac', label: 'TAC - Tarifa Abertura de Crédito', scoreModifier: 25 },
      { value: 'tec', label: 'TEC - Tarifa Emissão de Carnê', scoreModifier: 25 },
      { value: 'iof-financed', label: 'IOF financiado (juros sobre IOF)', scoreModifier: 30 },
      { value: 'excessive-interest', label: 'Juros acima da taxa BACEN', scoreModifier: 20 },
      { value: 'capitalization', label: 'Capitalização de juros ilegal', scoreModifier: 15 },
      { value: 'insurance-tied', label: 'Seguro embutido', scoreModifier: 20 },
      { value: 'other-fees', label: 'Outras tarifas estranhas', scoreModifier: 10 },
    ],
    helpText: 'Marque todas que se aplicam',
  },
  {
    id: 'payment-difficulty',
    text: 'Como está a situação do pagamento?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'paying-hard', label: 'Pagando com dificuldade', scoreModifier: 20 },
      { value: 'delayed', label: 'Atrasado', scoreModifier: 25 },
      { value: 'negotiating', label: 'Tentando negociar', scoreModifier: 15 },
      { value: 'paying-forever', label: 'Parcela nunca diminui', scoreModifier: 30 },
      { value: 'default', label: 'Inadimplente', scoreModifier: 10 },
    ],
  },
  {
    id: 'has-contract-doc',
    text: 'Você tem cópia do contrato completo?',
    type: 'yes-no',
    priority: 'important',
  },
  {
    id: 'contract-age',
    text: 'Quando foi assinado o contrato?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'last-year', label: 'Últimos 12 meses', scoreModifier: 20 },
      { value: '1-3-years', label: '1 a 3 anos atrás', scoreModifier: 15 },
      { value: '3-5-years', label: '3 a 5 anos atrás', scoreModifier: 10 },
      { value: '5-10-years', label: '5 a 10 anos atrás', scoreModifier: 5 },
      { value: '10y+', label: 'Mais de 10 anos', scoreModifier: -10 },
    ],
  },
]

export const REVISAO_CONTRATO_RULES: ScoringRule[] = [
  {
    id: 'multiple-abuses',
    description: '3+ cobranças abusivas identificadas',
    condition: (answers) => {
      const fees = answers['abusive-fees']
      return Array.isArray(fees) && fees.length >= 3
    },
    impact: { probability: 30, urgency: 25 },
  },
  {
    id: 'tac-tec-illegal',
    description: 'TAC/TEC - Resolução BACEN 3.919/2010 proíbe',
    condition: (answers) => {
      const fees = answers['abusive-fees']
      return Array.isArray(fees) && (fees.includes('tac') || fees.includes('tec'))
    },
    impact: { probability: 35, complexity: -15 },
  },
  {
    id: 'high-debt-value',
    description: 'Dívida alta (>= R$ 20.000) - restituição significativa',
    condition: (answers) => answerGreaterThan(answers, 'total-debt', 20000),
    impact: { urgency: 25, probability: 20 },
  },
  {
    id: 'revolving-debt',
    description: 'Dívida rotativa (cartão/cheque especial) - juros abusivos',
    condition: (answers) => {
      const types = answers['loan-type-revisao']
      return Array.isArray(types) && (types.includes('credit-card') || types.includes('overdraft'))
    },
    impact: { urgency: 30, probability: 25 },
  },
  {
    id: 'eternal-installments',
    description: 'Parcela que nunca diminui - anatocismo provável',
    condition: (answers) => answerEquals(answers, 'payment-difficulty', 'paying-forever'),
    impact: { urgency: 25, probability: 20 },
  },
]

// ============================================================================
// FIN-012: PORTABILIDADE DE CRÉDITO
// ============================================================================

export const PORTABILIDADE_CREDITO_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'portability-type',
    text: 'Que tipo de portabilidade você quer fazer?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'consignado', label: 'Empréstimo consignado', scoreModifier: 25 },
      { value: 'personal', label: 'Empréstimo pessoal', scoreModifier: 20 },
      { value: 'vehicle', label: 'Financiamento de veículo', scoreModifier: 15 },
      { value: 'real-estate', label: 'Financiamento imobiliário', scoreModifier: 10 },
    ],
  },
  {
    id: 'current-debt',
    text: 'Qual o saldo devedor atual?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 15000',
  },
  {
    id: 'interest-diff',
    text: 'Qual a diferença de juros entre os bancos?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'big-diff', label: 'Mais de 5% ao ano de diferença', scoreModifier: 30 },
      { value: 'medium-diff', label: '3% a 5% de diferença', scoreModifier: 20 },
      { value: 'small-diff', label: '1% a 3% de diferença', scoreModifier: 10 },
      { value: 'unknown', label: 'Não sei calcular', scoreModifier: 5 },
    ],
    helpText: 'Quanto maior a economia, mais urgente',
  },
  {
    id: 'bank-obstacle',
    text: 'Qual o obstáculo que o banco está criando?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'delay', label: 'Enrolando, não responde em 5 dias úteis', scoreModifier: 25 },
      { value: 'high-fee', label: 'Cobrando tarifa abusiva para liberar', scoreModifier: 30 },
      { value: 'impossible-docs', label: 'Pedindo documentos impossíveis', scoreModifier: 25 },
      { value: 'denies', label: 'Negando sem motivo', scoreModifier: 35 },
      { value: 'contract-issue', label: 'Alegando problema no contrato', scoreModifier: 20 },
    ],
    helpText: 'Todos esses obstáculos são ILEGAIS',
  },
  {
    id: 'new-bank-approved',
    text: 'O novo banco já aprovou sua portabilidade?',
    type: 'yes-no',
    priority: 'required',
    helpText: 'Aprovação do banco novo é essencial',
  },
  {
    id: 'deadline-pressure',
    text: 'Qual a urgência?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'extreme', label: 'Urgentíssimo - perdendo proposta', scoreModifier: 40 },
      { value: 'high', label: 'Alta - preciso economizar logo', scoreModifier: 25 },
      { value: 'medium', label: 'Média - gostaria de resolver', scoreModifier: 10 },
    ],
  },
  {
    id: 'time-trying',
    text: 'Há quanto tempo está tentando a portabilidade?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'recent', label: 'Menos de 5 dias úteis', scoreModifier: 10 },
      { value: '5-15-days', label: '5 a 15 dias (prazo legal estourado)', scoreModifier: 30 },
      { value: '15-30-days', label: '15 a 30 dias', scoreModifier: 25 },
      { value: '30d+', label: 'Mais de 30 dias', scoreModifier: 35 },
    ],
    helpText: 'Prazo legal é 5 dias úteis (Resolução BACEN 4.292/2013)',
  },
]

export const PORTABILIDADE_CREDITO_RULES: ScoringRule[] = [
  {
    id: 'legal-deadline-exceeded',
    description: 'Prazo legal de 5 dias úteis excedido',
    condition: (answers) => answerIn(answers, 'time-trying', ['5-15-days', '15-30-days', '30d+']),
    impact: { probability: 35, urgency: 30 },
  },
  {
    id: 'new-bank-approved',
    description: 'Novo banco já aprovou - caso forte',
    condition: (answers) => answerEquals(answers, 'new-bank-approved', true),
    impact: { probability: 30, urgency: 20 },
  },
  {
    id: 'big-savings',
    description: 'Economia significativa (>5% juros)',
    condition: (answers) => answerEquals(answers, 'interest-diff', 'big-diff'),
    impact: { urgency: 25, probability: 15 },
  },
  {
    id: 'high-debt-portability',
    description: 'Saldo alto (>= R$ 10.000) - economia relevante',
    condition: (answers) => answerGreaterThan(answers, 'current-debt', 10000),
    impact: { urgency: 20, probability: 15 },
  },
  {
    id: 'bank-denies-illegally',
    description: 'Banco negando sem motivo - ilegal',
    condition: (answers) => {
      const obstacles = answers['bank-obstacle']
      return Array.isArray(obstacles) && obstacles.includes('denies')
    },
    impact: { probability: 35, urgency: 30 },
  },
  {
    id: 'abusive-fee',
    description: 'Cobrando tarifa abusiva - Resolução BACEN proíbe',
    condition: (answers) => {
      const obstacles = answers['bank-obstacle']
      return Array.isArray(obstacles) && obstacles.includes('high-fee')
    },
    impact: { probability: 30, urgency: 25 },
  },
]

// ============================================================================
// FIN-013: FRAUDE EM EMPRÉSTIMO CONSIGNADO
// ============================================================================

export const FRAUDE_CONSIGNADO_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'victim-profile',
    text: 'Qual seu perfil?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'inss-retiree', label: 'Aposentado/pensionista INSS', scoreModifier: 30 },
      { value: 'public-servant', label: 'Servidor público', scoreModifier: 25 },
      { value: 'clt-worker', label: 'Trabalhador CLT', scoreModifier: 15 },
      { value: 'other', label: 'Outro', scoreModifier: 10 },
    ],
    helpText: 'Aposentados são vítimas mais frequentes',
  },
  {
    id: 'fraud-amount',
    text: 'Qual o valor do empréstimo fraudulento?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 8000',
  },
  {
    id: 'how-discovered',
    text: 'Como você descobriu a fraude?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'salary-deduction', label: 'Vi desconto no contracheque/benefício', scoreModifier: 25 },
      { value: 'bank-statement', label: 'Vi crédito estranho na conta', scoreModifier: 20 },
      { value: 'collection-call', label: 'Recebi ligação de cobrança', scoreModifier: 15 },
      { value: 'score-drop', label: 'Vi no Serasa/SPC', scoreModifier: 10 },
    ],
  },
  {
    id: 'fraud-timing',
    text: 'Quando descobriu?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'this-month', label: 'Este mês', scoreModifier: 35 },
      { value: '1-3-months', label: '1 a 3 meses atrás', scoreModifier: 30 },
      { value: '3-6-months', label: '3 a 6 meses atrás', scoreModifier: 20 },
      { value: '6-12-months', label: '6 meses a 1 ano', scoreModifier: 10 },
      { value: '1y+', label: 'Mais de 1 ano', scoreModifier: -10 },
    ],
    helpText: 'Quanto antes agir, melhor',
  },
  {
    id: 'contacted-bank',
    text: 'Já entrou em contato com o banco?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'yes-denied', label: 'Sim, mas negaram responsabilidade', scoreModifier: 30 },
      { value: 'yes-analyzing', label: 'Sim, estão analisando', scoreModifier: 15 },
      { value: 'yes-ignored', label: 'Sim, mas me ignoraram', scoreModifier: 25 },
      { value: 'no', label: 'Não entrei em contato', scoreModifier: 10 },
    ],
  },
  {
    id: 'police-report',
    text: 'Registrou Boletim de Ocorrência (B.O.)?',
    type: 'yes-no',
    priority: 'important',
    helpText: 'B.O. é fundamental - posso orientar',
  },
  {
    id: 'financial-impact',
    text: 'Qual o impacto financeiro?',
    type: 'multi-choice',
    priority: 'important',
    options: [
      { value: 'salary-reduced', label: 'Salário/benefício reduzido', scoreModifier: 25 },
      { value: 'cant-pay-bills', label: 'Sem dinheiro para pagar contas', scoreModifier: 30 },
      { value: 'negativated', label: 'Fui negativado', scoreModifier: 20 },
      { value: 'psychological', label: 'Sofrimento psicológico', scoreModifier: 15 },
    ],
  },
  {
    id: 'received-money',
    text: 'Você recebeu algum valor na conta?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'no-money', label: 'Não recebi nada', scoreModifier: 30 },
      { value: 'partial', label: 'Recebi parte (golpe)', scoreModifier: 25 },
      { value: 'received-used', label: 'Recebi e já usei', scoreModifier: -20 },
    ],
    helpText: 'Se não recebeu, é fraude evidente',
  },
]

export const FRAUDE_CONSIGNADO_RULES: ScoringRule[] = [
  {
    id: 'elderly-victim',
    description: 'Aposentado INSS - vítima típica, maior proteção',
    condition: (answers) => answerEquals(answers, 'victim-profile', 'inss-retiree'),
    impact: { urgency: 35, probability: 30 },
  },
  {
    id: 'recent-discovery',
    description: 'Descobriu recentemente (até 3 meses) - urgência máxima',
    condition: (answers) => answerIn(answers, 'fraud-timing', ['this-month', '1-3-months']),
    impact: { urgency: 40, probability: 25 },
  },
  {
    id: 'no-money-received',
    description: 'Não recebeu o dinheiro - fraude evidente',
    condition: (answers) => answerEquals(answers, 'received-money', 'no-money'),
    impact: { probability: 40, urgency: 30 },
  },
  {
    id: 'bank-denied',
    description: 'Banco já negou - pronto para judicial',
    condition: (answers) => answerEquals(answers, 'contacted-bank', 'yes-denied'),
    impact: { urgency: 30, probability: 25 },
  },
  {
    id: 'extreme-hardship',
    description: 'Sem dinheiro para subsistência',
    condition: (answers) => {
      const impacts = answers['financial-impact']
      return Array.isArray(impacts) && impacts.includes('cant-pay-bills')
    },
    impact: { urgency: 40, probability: 20 },
  },
  {
    id: 'high-fraud-value',
    description: 'Valor alto (>= R$ 5.000)',
    condition: (answers) => answerGreaterThan(answers, 'fraud-amount', 5000),
    impact: { urgency: 25, probability: 20 },
  },
  {
    id: 'sumula-479-stj',
    description: 'Súmula 479 STJ - banco responde objetivamente',
    condition: (answers) => true, // Always applies
    impact: { probability: 35, complexity: -20 },
  },
]
