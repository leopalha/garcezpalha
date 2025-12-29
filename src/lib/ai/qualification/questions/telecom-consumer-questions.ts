/**
 * Qualification Questions for Telecom + Consumer Products
 * Created: 2025-12-27
 * FASE 4: AGENTES IA - MANUS v6.0
 */

import type { QualificationQuestion, ScoringRule } from '../types'
import { answerEquals, answerGreaterThan, answerIn, answerContains, getAnswerValue } from '../score-calculator'

// ============================================================================
// TEL-001: COBRANÇA INDEVIDA TELEFONIA
// ============================================================================

export const COBRANCA_TELEFONIA_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'telecom-company',
    text: 'Qual operadora?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'vivo', label: 'Vivo', scoreModifier: 15 },
      { value: 'claro', label: 'Claro', scoreModifier: 15 },
      { value: 'tim', label: 'TIM', scoreModifier: 15 },
      { value: 'oi', label: 'Oi', scoreModifier: 10 },
      { value: 'other', label: 'Outra', scoreModifier: 5 },
    ],
  },
  {
    id: 'charge-type',
    text: 'Que tipo de cobrança indevida?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'service-not-ordered', label: 'Serviço que não pedi', scoreModifier: 30 },
      { value: 'cancelled-charging', label: 'Cancelei mas continua cobrando', scoreModifier: 35 },
      { value: 'different-plan', label: 'Plano diferente do contratado', scoreModifier: 25 },
      { value: 'internet-not-delivered', label: 'Internet prometida não entrega', scoreModifier: 20 },
      { value: 'duplicate', label: 'Cobrança duplicada', scoreModifier: 25 },
    ],
  },
  {
    id: 'monthly-overcharge',
    text: 'Valor cobrado a mais por mês?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 50',
  },
  {
    id: 'months-charged',
    text: 'Há quantos meses está sendo cobrado?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: '1-3', label: '1 a 3 meses', scoreModifier: 15 },
      { value: '4-6', label: '4 a 6 meses', scoreModifier: 20 },
      { value: '7-12', label: '7 a 12 meses', scoreModifier: 25 },
      { value: '12+', label: 'Mais de 1 ano', scoreModifier: 30 },
    ],
  },
  {
    id: 'contacted-company',
    text: 'Já reclamou com a operadora?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'multiple-ignored', label: 'Sim, várias vezes, me ignoram', scoreModifier: 30 },
      { value: 'promised-not-solved', label: 'Prometeram resolver, não resolveram', scoreModifier: 25 },
      { value: 'denied', label: 'Negaram a cobrança indevida', scoreModifier: 35 },
      { value: 'no-contact', label: 'Não tentei', scoreModifier: 5 },
    ],
  },
]

export const COBRANCA_TELEFONIA_RULES: ScoringRule[] = [
  {
    id: 'service-not-ordered',
    description: 'Serviço não solicitado - forte',
    condition: (answers) => {
      const types = getAnswerValue(answers, 'charge-type')
      return Array.isArray(types) && types.includes('service-not-ordered')
    },
    impact: { probability: 35, urgency: 25 },
  },
  {
    id: 'long-overcharging',
    description: '6+ meses cobrando - restituição alta',
    condition: (answers) => answerIn(answers, 'months-charged', ['7-12', '12+']),
    impact: { urgency: 30, probability: 20 },
  },
  {
    id: 'company-refuses',
    description: 'Operadora se recusa a resolver',
    condition: (answers) => answerIn(answers, 'contacted-company', ['multiple-ignored', 'denied']),
    impact: { urgency: 25, probability: 30 },
  },
]

// ============================================================================
// TEL-002: MULTA DE FIDELIDADE ABUSIVA
// ============================================================================

export const MULTA_FIDELIDADE_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'fine-reason',
    text: 'Por que a multa é abusiva?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'slow-internet', label: 'Internet lenta (não entrega velocidade)', scoreModifier: 35 },
      { value: 'frequent-drops', label: 'Quedas frequentes de sinal', scoreModifier: 30 },
      { value: 'bad-service', label: 'Serviço de péssima qualidade', scoreModifier: 25 },
      { value: 'no-fidelity-info', label: 'Não me informaram da fidelidade', scoreModifier: 40 },
      { value: 'moving', label: 'Mudei de endereço sem cobertura', scoreModifier: 20 },
    ],
  },
  {
    id: 'fine-amount',
    text: 'Valor da multa?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 300',
  },
  {
    id: 'has-proof',
    text: 'Tem provas do problema (teste velocidade, prints, protocolos)?',
    type: 'yes-no',
    priority: 'important',
    helpText: 'Provas fortalecem muito o caso',
  },
  {
    id: 'anatel-complaint',
    text: 'Já reclamou na Anatel?',
    type: 'yes-no',
    priority: 'optional',
  },
]

export const MULTA_FIDELIDADE_RULES: ScoringRule[] = [
  {
    id: 'anatel-632',
    description: 'Resolução Anatel 632/2014 - não paga multa se serviço ruim',
    condition: (answers) => {
      const reasons = getAnswerValue(answers, 'fine-reason')
      return Array.isArray(reasons) && (reasons.includes('slow-internet') || reasons.includes('frequent-drops'))
    },
    impact: { probability: 40, complexity: -15 },
  },
  {
    id: 'not-informed',
    description: 'Não informado da fidelidade - multa ilegal',
    condition: (answers) => {
      const reasons = getAnswerValue(answers, 'fine-reason')
      return Array.isArray(reasons) && reasons.includes('no-fidelity-info')
    },
    impact: { probability: 45, urgency: 25 },
  },
]

// ============================================================================
// TEL-003: PORTABILIDADE DE NÚMERO
// ============================================================================

export const PORTABILIDADE_NUMERO_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'delay-days',
    text: 'Há quantos dias está tentando a portabilidade?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: '1-3', label: '1 a 3 dias úteis (dentro do prazo)', scoreModifier: 10 },
      { value: '4-7', label: '4 a 7 dias (prazo estourado)', scoreModifier: 30 },
      { value: '8-15', label: '8 a 15 dias', scoreModifier: 35 },
      { value: '15+', label: 'Mais de 15 dias', scoreModifier: 40 },
    ],
    helpText: 'Prazo legal: 3 dias úteis',
  },
  {
    id: 'urgency-reason',
    text: 'Por que precisa do número urgente?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'work', label: 'Trabalho/profissional', scoreModifier: 25 },
      { value: 'business', label: 'Empresa/clientes', scoreModifier: 30 },
      { value: 'personal', label: 'Pessoal', scoreModifier: 10 },
      { value: 'extreme', label: 'Perdendo clientes/dinheiro', scoreModifier: 40 },
    ],
  },
]

export const PORTABILIDADE_NUMERO_RULES: ScoringRule[] = [
  {
    id: 'legal-deadline-exceeded-port',
    description: 'Prazo de 3 dias excedido',
    condition: (answers) => answerIn(answers, 'delay-days', ['4-7', '8-15', '15+']),
    impact: { probability: 40, urgency: 35 },
  },
]

// ============================================================================
// DIG-004: ASSINATURAS DIGITAIS
// ============================================================================

export const ASSINATURAS_DIGITAIS_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'subscription-type',
    text: 'Qual serviço está te cobrando?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'netflix', label: 'Netflix', scoreModifier: 15 },
      { value: 'spotify', label: 'Spotify', scoreModifier: 15 },
      { value: 'amazon-prime', label: 'Amazon Prime', scoreModifier: 15 },
      { value: 'disney', label: 'Disney+/Star+', scoreModifier: 10 },
      { value: 'apps', label: 'Apps/Software', scoreModifier: 10 },
      { value: 'other', label: 'Outros', scoreModifier: 5 },
    ],
  },
  {
    id: 'problem-type',
    text: 'Qual o problema?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'cancelled-still-charging', label: 'Cancelei mas continua cobrando', scoreModifier: 35 },
      { value: 'trial-auto-renew', label: 'Trial virou cobrança sem avisar', scoreModifier: 30 },
      { value: 'cant-cancel', label: 'Não consigo cancelar', scoreModifier: 25 },
      { value: 'price-increase', label: 'Aumentaram preço sem avisar', scoreModifier: 20 },
      { value: 'never-used', label: 'Nunca assinei/usei', scoreModifier: 40 },
    ],
  },
  {
    id: 'total-charged',
    text: 'Quanto foi cobrado indevidamente (total)?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 200',
  },
]

export const ASSINATURAS_DIGITAIS_RULES: ScoringRule[] = [
  {
    id: 'cancelled-charging',
    description: 'Cancelou mas cobra - CDC Art. 49',
    condition: (answers) => {
      const problems = getAnswerValue(answers, 'problem-type')
      return Array.isArray(problems) && problems.includes('cancelled-still-charging')
    },
    impact: { probability: 40, urgency: 25 },
  },
]

// ============================================================================
// CDC-001: PRODUTO COM VÍCIO
// ============================================================================

export const PRODUTO_VICIO_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'product-type',
    text: 'Que tipo de produto?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'cellphone', label: 'Celular/smartphone', scoreModifier: 25 },
      { value: 'appliance', label: 'Eletrodoméstico (geladeira, TV, etc)', scoreModifier: 30 },
      { value: 'electronics', label: 'Eletrônicos', scoreModifier: 20 },
      { value: 'furniture', label: 'Móveis', scoreModifier: 15 },
      { value: 'vehicle', label: 'Veículo', scoreModifier: 35 },
    ],
  },
  {
    id: 'defect-situation',
    text: 'Situação do defeito:',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'within-warranty', label: 'Produto na garantia', scoreModifier: 25 },
      { value: 'repair-failed', label: 'Assistência não consertou em 30 dias', scoreModifier: 35 },
      { value: 'store-refuses', label: 'Loja não quer trocar', scoreModifier: 30 },
      { value: 'repeat-defect', label: 'Defeito se repete após conserto', scoreModifier: 30 },
      { value: 'essential', label: 'Produto essencial parado', scoreModifier: 25 },
    ],
  },
  {
    id: 'product-value',
    text: 'Valor do produto?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 2500',
  },
]

export const PRODUTO_VICIO_RULES: ScoringRule[] = [
  {
    id: 'art-18-cdc',
    description: 'Art. 18 CDC - 30 dias para consertar',
    condition: (answers) => {
      const situations = getAnswerValue(answers, 'defect-situation')
      return Array.isArray(situations) && situations.includes('repair-failed')
    },
    impact: { probability: 40, complexity: -15 },
  },
  {
    id: 'essential-product',
    description: 'Produto essencial - danos morais certos',
    condition: (answers) => {
      const situations = getAnswerValue(answers, 'defect-situation')
      const type = getAnswerValue(answers, 'product-type')
      return (Array.isArray(situations) && situations.includes('essential')) || type === 'appliance'
    },
    impact: { urgency: 30, probability: 25 },
  },
]

// ============================================================================
// CDC-002: ATRASO NA ENTREGA
// ============================================================================

export const ATRASO_ENTREGA_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'purchase-type',
    text: 'O que comprou?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'gift-missed-date', label: 'Presente para data específica (perdeu)', scoreModifier: 40 },
      { value: 'furniture', label: 'Móveis', scoreModifier: 20 },
      { value: 'appliance', label: 'Eletrodoméstico', scoreModifier: 25 },
      { value: 'essential', label: 'Produto essencial/urgente', scoreModifier: 30 },
      { value: 'other', label: 'Outro produto', scoreModifier: 10 },
    ],
  },
  {
    id: 'delay-time',
    text: 'Quanto tempo de atraso?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'weeks', label: 'Semanas', scoreModifier: 20 },
      { value: 'months', label: 'Meses', scoreModifier: 30 },
      { value: 'not-arrived', label: 'Nunca chegou', scoreModifier: 35 },
    ],
  },
  {
    id: 'purchase-value',
    text: 'Valor da compra?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 1500',
  },
]

export const ATRASO_ENTREGA_RULES: ScoringRule[] = [
  {
    id: 'gift-missed-date',
    description: 'Presente perdeu data - danos morais altos',
    condition: (answers) => answerEquals(answers, 'purchase-type', 'gift-missed-date'),
    impact: { urgency: 40, probability: 35 },
  },
  {
    id: 'art-35-cdc',
    description: 'Art. 35 CDC - cancelamento + devolução garantidos',
    condition: (answers) => true,
    impact: { probability: 35, complexity: -20 },
  },
]

// ============================================================================
// AER-001: OVERBOOKING/VOO
// ============================================================================

export const OVERBOOKING_VOO_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'flight-problem',
    text: 'O que aconteceu?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'overbooking', label: 'Overbooking - não embarcou', scoreModifier: 35 },
      { value: 'cancelled', label: 'Voo cancelado', scoreModifier: 30 },
      { value: 'delay-4h', label: 'Atraso superior a 4h', scoreModifier: 25 },
      { value: 'baggage-lost', label: 'Bagagem extraviada/danificada', scoreModifier: 20 },
      { value: 'missed-event', label: 'Perdeu compromisso importante', scoreModifier: 40 },
    ],
  },
  {
    id: 'company-help',
    text: 'A companhia deu assistência (hotel, alimentação)?',
    type: 'yes-no',
    priority: 'important',
    helpText: 'Se não deu, aumenta indenização',
  },
  {
    id: 'event-missed',
    text: 'Que tipo de compromisso perdeu?',
    type: 'single-choice',
    priority: 'optional',
    options: [
      { value: 'wedding', label: 'Casamento', scoreModifier: 40 },
      { value: 'work', label: 'Reunião/trabalho', scoreModifier: 30 },
      { value: 'medical', label: 'Consulta médica', scoreModifier: 25 },
      { value: 'other', label: 'Outro', scoreModifier: 15 },
    ],
  },
]

export const OVERBOOKING_VOO_RULES: ScoringRule[] = [
  {
    id: 'overbooking-severe',
    description: 'Overbooking - jurisprudência consolidada',
    condition: (answers) => {
      const problems = getAnswerValue(answers, 'flight-problem')
      return Array.isArray(problems) && problems.includes('overbooking')
    },
    impact: { probability: 40, urgency: 30 },
  },
  {
    id: 'missed-important-event',
    description: 'Perdeu compromisso importante - danos morais altos',
    condition: (answers) => {
      const problems = getAnswerValue(answers, 'flight-problem')
      return Array.isArray(problems) && problems.includes('missed-event')
    },
    impact: { urgency: 40, probability: 30 },
  },
  {
    id: 'anac-400',
    description: 'Resolução ANAC 400 - direitos claros',
    condition: (answers) => true,
    impact: { probability: 35, complexity: -15 },
  },
]

// ============================================================================
// IMO-001: DISTRATO IMOBILIÁRIO
// ============================================================================

export const DISTRATO_IMOBILIARIO_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'reason-withdrawal',
    text: 'Por que quer desistir?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'work-delayed', label: 'Obra atrasou anos', scoreModifier: 40 },
      { value: 'financial', label: 'Perdi condição financeira', scoreModifier: 20 },
      { value: 'moved-plans', label: 'Mudei de cidade/planos', scoreModifier: 15 },
      { value: 'project-changed', label: 'Construtora alterou projeto', scoreModifier: 35 },
      { value: 'judicial-recovery', label: 'Construtora em recuperação judicial', scoreModifier: 45 },
    ],
  },
  {
    id: 'amount-paid',
    text: 'Quanto já pagou?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 80000',
  },
  {
    id: 'has-contract',
    text: 'Tem contrato de compra e venda?',
    type: 'yes-no',
    priority: 'required',
  },
  {
    id: 'builder-fault',
    text: 'Pode provar culpa da construtora?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'yes-clear', label: 'Sim, tenho provas claras', scoreModifier: 40 },
      { value: 'partial', label: 'Tenho algumas provas', scoreModifier: 25 },
      { value: 'no', label: 'Não tenho provas (culpa minha)', scoreModifier: 0 },
    ],
    helpText: 'Com culpa dela: 100% devolução. Sem culpa: 75%',
  },
]

export const DISTRATO_IMOBILIARIO_RULES: ScoringRule[] = [
  {
    id: 'lei-13786',
    description: 'Lei 13.786/2018 - mínimo 75% devolução',
    condition: (answers) => true,
    impact: { probability: 35, complexity: -10 },
  },
  {
    id: 'builder-fault-100',
    description: 'Culpa construtora - 100% devolução',
    condition: (answers) => answerIn(answers, 'reason-withdrawal', ['work-delayed', 'project-changed', 'judicial-recovery']),
    impact: { probability: 40, urgency: 30 },
  },
  {
    id: 'high-value-real-estate',
    description: 'Valor alto (>= R$ 50.000) - restituição significativa',
    condition: (answers) => answerGreaterThan(answers, 'amount-paid', 50000),
    impact: { urgency: 35, probability: 25 },
  },
  {
    id: 'judicial-recovery',
    description: 'Construtora em recuperação - urgência máxima',
    condition: (answers) => {
      const reasons = getAnswerValue(answers, 'reason-withdrawal')
      return Array.isArray(reasons) && reasons.includes('judicial-recovery')
    },
    impact: { urgency: 45, probability: 30 },
  },
]
