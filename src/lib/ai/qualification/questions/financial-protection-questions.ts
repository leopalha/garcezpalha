/**
 * Qualification Questions for Financial Protection Products
 */

import type { QualificationQuestion, ScoringRule } from '../types'
import {
  answerEquals,
  answerGreaterThan,
  answerIn,
  answerContains,
} from '../score-calculator'

/**
 * Questions for Account Unblocking (Desbloqueio de Conta)
 */
export const ACCOUNT_UNBLOCKING_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'account-type',
    text: 'Qual tipo de conta foi bloqueada?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'salary', label: 'Conta salário', scoreModifier: 30 },
      { value: 'savings', label: 'Conta poupança', scoreModifier: 20 },
      { value: 'checking', label: 'Conta corrente', scoreModifier: 10 },
      { value: 'business', label: 'Conta empresarial', scoreModifier: 15 },
    ],
    helpText: 'Contas salário têm proteção legal especial',
  },
  {
    id: 'blocked-amount',
    text: 'Qual o valor bloqueado aproximado?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 5000',
    helpText: 'Valor em reais (R$)',
  },
  {
    id: 'block-reason',
    text: 'Você sabe o motivo do bloqueio?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'judicial', label: 'Bloqueio judicial (SISBAJUD)', scoreModifier: 0 },
      { value: 'debt', label: 'Dívida/execução', scoreModifier: -10 },
      { value: 'fraud-suspicion', label: 'Suspeita de fraude', scoreModifier: 10 },
      { value: 'unknown', label: 'Não sei', scoreModifier: 5 },
    ],
  },
  {
    id: 'has-notification',
    text: 'Você recebeu alguma notificação sobre o bloqueio?',
    type: 'yes-no',
    priority: 'important',
    helpText: 'Ofício judicial, email do banco, etc.',
  },
  {
    id: 'urgency-level',
    text: 'Qual a urgência do desbloqueio?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'extreme', label: 'Extrema - Sem recursos para subsistência', scoreModifier: 40 },
      { value: 'high', label: 'Alta - Preciso pagar contas essenciais', scoreModifier: 25 },
      { value: 'medium', label: 'Média - Gostaria de resolver logo', scoreModifier: 10 },
      { value: 'low', label: 'Baixa - Posso aguardar', scoreModifier: 0 },
    ],
  },
  {
    id: 'block-duration',
    text: 'Há quanto tempo a conta está bloqueada?',
    type: 'single-choice',
    priority: 'optional',
    options: [
      { value: 'days', label: 'Dias', scoreModifier: 20 },
      { value: 'weeks', label: 'Semanas', scoreModifier: 15 },
      { value: 'months', label: 'Meses', scoreModifier: 5 },
      { value: 'unknown', label: 'Não sei', scoreModifier: 0 },
    ],
  },
]

/**
 * Scoring rules for Account Unblocking
 */
export const ACCOUNT_UNBLOCKING_RULES: ScoringRule[] = [
  {
    id: 'salary-account-urgency',
    description: 'Conta salário bloqueada - urgência máxima',
    condition: (answers) => answerEquals(answers, 'account-type', 'salary'),
    impact: { urgency: 40, probability: 30 },
  },
  {
    id: 'extreme-urgency',
    description: 'Cliente sem recursos para subsistência',
    condition: (answers) => answerEquals(answers, 'urgency-level', 'extreme'),
    impact: { urgency: 35, probability: 25 },
  },
  {
    id: 'high-value',
    description: 'Valor bloqueado alto (> R$ 10.000)',
    condition: (answers) => answerGreaterThan(answers, 'blocked-amount', 10000),
    impact: { urgency: 20, complexity: 15, probability: 20 },
  },
  {
    id: 'recent-block',
    description: 'Bloqueio recente (dias/semanas)',
    condition: (answers) => answerIn(answers, 'block-duration', ['days', 'weeks']),
    impact: { urgency: 15, probability: 15 },
  },
  {
    id: 'has-documentation',
    description: 'Cliente possui notificação/documentação',
    condition: (answers) => answerEquals(answers, 'has-notification', true),
    impact: { probability: 20, complexity: -10 },
  },
  {
    id: 'fraud-suspicion',
    description: 'Bloqueio por suspeita de fraude (mais fácil de resolver)',
    condition: (answers) => answerEquals(answers, 'block-reason', 'fraud-suspicion'),
    impact: { probability: 15, complexity: -15 },
  },
]

/**
 * Questions for PIX Fraud (Golpe do PIX)
 */
export const PIX_FRAUD_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'fraud-amount',
    text: 'Qual o valor perdido no golpe?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 2500',
  },
  {
    id: 'fraud-type',
    text: 'Que tipo de golpe foi?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'account-invasion', label: 'Invasão de conta/celular', scoreModifier: 25 },
      { value: 'fake-bank-employee', label: 'Falso funcionário do banco', scoreModifier: 20 },
      { value: 'fake-sale', label: 'Compra falsa (marketplace)', scoreModifier: 15 },
      { value: 'fake-job', label: 'Falsa vaga de emprego', scoreModifier: 10 },
      { value: 'other', label: 'Outro', scoreModifier: 5 },
    ],
  },
  {
    id: 'fraud-date',
    text: 'Quando ocorreu a transferência indevida?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'last-7-days', label: 'Últimos 7 dias', scoreModifier: 30 },
      { value: '8-15-days', label: '8 a 15 dias atrás', scoreModifier: 20 },
      { value: '16-30-days', label: '16 a 30 dias atrás', scoreModifier: 10 },
      { value: 'over-30-days', label: 'Mais de 30 dias', scoreModifier: -20 },
    ],
    helpText: 'MED (devolução) deve ser solicitado em até 7 dias',
  },
  {
    id: 'police-report',
    text: 'Você já registrou Boletim de Ocorrência (B.O.)?',
    type: 'yes-no',
    priority: 'important',
    helpText: 'B.O. é fundamental para ação judicial',
  },
  {
    id: 'bank-contacted',
    text: 'Você já entrou em contato com o banco?',
    type: 'yes-no',
    priority: 'important',
  },
  {
    id: 'bank-response',
    text: 'Qual foi a resposta do banco?',
    type: 'single-choice',
    priority: 'important',
    conditionalOn: {
      questionId: 'bank-contacted',
      expectedValue: 'true',
    },
    options: [
      { value: 'med-pending', label: 'MED em análise', scoreModifier: 10 },
      { value: 'med-denied', label: 'MED negado', scoreModifier: 20 },
      { value: 'no-response', label: 'Sem resposta', scoreModifier: 15 },
      { value: 'denied-responsibility', label: 'Negou responsabilidade', scoreModifier: 25 },
    ],
  },
  {
    id: 'has-evidence',
    text: 'Você tem prints/conversas que provam o golpe?',
    type: 'yes-no',
    priority: 'important',
    helpText: 'WhatsApp, anúncios, emails, etc.',
  },
]

/**
 * Scoring rules for PIX Fraud
 */
export const PIX_FRAUD_RULES: ScoringRule[] = [
  {
    id: 'within-med-window',
    description: 'Dentro do prazo de 7 dias para MED',
    condition: (answers) => answerEquals(answers, 'fraud-date', 'last-7-days'),
    impact: { urgency: 40, probability: 25 },
  },
  {
    id: 'account-invasion',
    description: 'Invasão de conta (maior chance de recuperação)',
    condition: (answers) => answerEquals(answers, 'fraud-type', 'account-invasion'),
    impact: { probability: 25, complexity: 10 },
  },
  {
    id: 'high-value-fraud',
    description: 'Valor alto (> R$ 5.000)',
    condition: (answers) => answerGreaterThan(answers, 'fraud-amount', 5000),
    impact: { urgency: 20, probability: 15 },
  },
  {
    id: 'has-police-report',
    description: 'B.O. já registrado',
    condition: (answers) => answerEquals(answers, 'police-report', true),
    impact: { probability: 20, complexity: -10 },
  },
  {
    id: 'bank-denied-med',
    description: 'Banco já negou MED - pronto para ação judicial',
    condition: (answers) => answerEquals(answers, 'bank-response', 'med-denied'),
    impact: { urgency: 25, probability: 20 },
  },
  {
    id: 'has-evidence',
    description: 'Cliente possui provas (prints, conversas)',
    condition: (answers) => answerEquals(answers, 'has-evidence', true),
    impact: { probability: 25, complexity: -15 },
  },
  {
    id: 'too-late',
    description: 'Mais de 30 dias - fora do prazo MED',
    condition: (answers) => answerEquals(answers, 'fraud-date', 'over-30-days'),
    impact: { urgency: -20, probability: -15 },
  },
]

/**
 * Questions for Credit Negativation (Negativação Indevida)
 */
export const CREDIT_NEGATIVATION_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'negativation-reason',
    text: 'Por que a negativação é indevida?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'debt-paid', label: 'Dívida já foi paga', scoreModifier: 30 },
      { value: 'debt-expired', label: 'Dívida prescrita (> 5 anos)', scoreModifier: 25 },
      { value: 'debt-unknown', label: 'Não reconheço a dívida/fraude', scoreModifier: 20 },
      { value: 'wrong-amount', label: 'Valor incorreto', scoreModifier: 15 },
      { value: 'no-notification', label: 'Não fui notificado previamente', scoreModifier: 20 },
    ],
  },
  {
    id: 'debt-amount',
    text: 'Qual o valor da dívida negativada?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
  },
  {
    id: 'negativation-agencies',
    text: 'Em quais órgãos você está negativado?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'serasa', label: 'Serasa', scoreModifier: 5 },
      { value: 'spc', label: 'SPC', scoreModifier: 5 },
      { value: 'boa-vista', label: 'Boa Vista', scoreModifier: 5 },
      { value: 'protest', label: 'Protesto em cartório', scoreModifier: 10 },
    ],
  },
  {
    id: 'negativation-duration',
    text: 'Há quanto tempo está negativado?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'recent', label: 'Menos de 3 meses', scoreModifier: 15 },
      { value: 'moderate', label: '3 a 12 meses', scoreModifier: 10 },
      { value: 'long', label: '1 a 3 anos', scoreModifier: 5 },
      { value: 'very-long', label: 'Mais de 3 anos', scoreModifier: -10 },
    ],
  },
  {
    id: 'has-proof-payment',
    text: 'Tem comprovante de pagamento? (se aplicável)',
    type: 'yes-no',
    priority: 'important',
    conditionalOn: {
      questionId: 'negativation-reason',
      expectedValue: 'debt-paid',
    },
  },
  {
    id: 'creditor-contacted',
    text: 'Tentou resolver direto com o credor?',
    type: 'yes-no',
    priority: 'optional',
  },
]

/**
 * Scoring rules for Credit Negativation
 */
export const CREDIT_NEGATIVATION_RULES: ScoringRule[] = [
  {
    id: 'debt-paid-with-proof',
    description: 'Dívida paga com comprovante',
    condition: (answers) =>
      answerEquals(answers, 'negativation-reason', 'debt-paid') &&
      answerEquals(answers, 'has-proof-payment', true),
    impact: { probability: 35, urgency: 25 },
  },
  {
    id: 'debt-expired',
    description: 'Dívida prescrita (> 5 anos)',
    condition: (answers) => answerEquals(answers, 'negativation-reason', 'debt-expired'),
    impact: { probability: 30, urgency: 20 },
  },
  {
    id: 'fraud-identity-theft',
    description: 'Fraude/não reconhece dívida',
    condition: (answers) => answerEquals(answers, 'negativation-reason', 'debt-unknown'),
    impact: { probability: 25, complexity: 15 },
  },
  {
    id: 'no-prior-notification',
    description: 'Não foi notificado previamente (Súmula 359 STJ)',
    condition: (answers) => answerEquals(answers, 'negativation-reason', 'no-notification'),
    impact: { probability: 30, urgency: 20 },
  },
  {
    id: 'protest-cartorio',
    description: 'Protesto em cartório (mais grave)',
    condition: (answers) => answerContains(answers, 'negativation-agencies', 'protest'),
    impact: { urgency: 20, complexity: 10 },
  },
  {
    id: 'recent-negativation',
    description: 'Negativação recente (< 3 meses)',
    condition: (answers) => answerEquals(answers, 'negativation-duration', 'recent'),
    impact: { urgency: 15, probability: 15 },
  },
]
