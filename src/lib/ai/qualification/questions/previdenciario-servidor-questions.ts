/**
 * Qualification Questions for Previdenciário + Servidor + Educacional + Outros
 * Created: 2025-12-27
 * FASE 5: COMPLETAR AGENTES - MANUS v6.0
 */

import type { QualificationQuestion, ScoringRule } from '../types'
import { answerEquals, answerGreaterThan, answerIn, answerContains } from '../score-calculator'

// ============================================================================
// PREV-001: REVISÃO DE APOSENTADORIA
// ============================================================================

export const REVISAO_APOSENTADORIA_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'benefit-type',
    text: 'Que tipo de benefício você recebe?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'retirement-age', label: 'Aposentadoria por idade', scoreModifier: 20 },
      { value: 'retirement-time', label: 'Aposentadoria por tempo de contribuição', scoreModifier: 25 },
      { value: 'disability', label: 'Aposentadoria por invalidez', scoreModifier: 15 },
      { value: 'special', label: 'Aposentadoria especial', scoreModifier: 30 },
    ],
  },
  {
    id: 'revision-reason',
    text: 'Por que quer revisar?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'special-activity', label: 'Atividade especial não reconhecida', scoreModifier: 35 },
      { value: 'missing-period', label: 'Período não computado', scoreModifier: 30 },
      { value: 'calculation-error', label: 'Erro no cálculo do INSS', scoreModifier: 25 },
      { value: 'vida-toda', label: 'Revisão da Vida Toda', scoreModifier: 40 },
      { value: 'best-benefit', label: 'Melhor benefício (DIB)', scoreModifier: 20 },
    ],
  },
  {
    id: 'current-value',
    text: 'Valor atual do benefício?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 3000',
  },
  {
    id: 'estimated-increase',
    text: 'Aumento estimado se revisar:',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'unknown', label: 'Não sei', scoreModifier: 5 },
      { value: '10-30', label: '10% a 30%', scoreModifier: 20 },
      { value: '30-50', label: '30% a 50%', scoreModifier: 30 },
      { value: '50+', label: 'Mais de 50%', scoreModifier: 40 },
    ],
  },
  {
    id: 'has-documents',
    text: 'Tem PPP, LTCAT ou CNIS?',
    type: 'yes-no',
    priority: 'important',
    helpText: 'Documentos essenciais para atividade especial',
  },
  {
    id: 'grant-date',
    text: 'Quando foi concedida a aposentadoria?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'last-year', label: 'Último ano', scoreModifier: 25 },
      { value: '1-3-years', label: '1 a 3 anos atrás', scoreModifier: 20 },
      { value: '3-5-years', label: '3 a 5 anos atrás', scoreModifier: 15 },
      { value: '5-10-years', label: '5 a 10 anos atrás', scoreModifier: 10 },
      { value: '10y+', label: 'Mais de 10 anos', scoreModifier: 5 },
    ],
  },
]

export const REVISAO_APOSENTADORIA_RULES: ScoringRule[] = [
  {
    id: 'vida-toda-high-impact',
    description: 'Revisão da Vida Toda - STF favorável',
    condition: (answers) => {
      // @ts-ignore
      const reasons = answers['revision-reason'] as string[]
      return Array.isArray(reasons) && reasons.includes('vida-toda')
    },
    impact: { probability: 40, urgency: 30 },
  },
  {
    id: 'special-activity-not-recognized',
    description: 'Atividade especial - aumenta tempo',
    condition: (answers) => {
      // @ts-ignore
      const reasons = answers['revision-reason'] as string[]
      return Array.isArray(reasons) && reasons.includes('special-activity')
    },
    impact: { probability: 35, urgency: 25 },
  },
  {
    id: 'high-benefit-value',
    description: 'Benefício alto (>= R$ 2.500) - revisão valiosa',
    condition: (answers) => answerGreaterThan(answers, 'current-value', 2500),
    impact: { urgency: 25, probability: 20 },
  },
  {
    id: 'recent-grant',
    description: 'Aposentadoria recente (até 3 anos)',
    condition: (answers) => answerIn(answers, 'grant-date', ['last-year', '1-3-years']),
    impact: { urgency: 20, probability: 20 },
  },
]

// ============================================================================
// PREV-002: BENEFÍCIO NEGADO/CORTADO
// ============================================================================

export const BENEFICIO_NEGADO_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'benefit-denied-type',
    text: 'Qual benefício foi negado/cortado?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'auxilio-doenca', label: 'Auxílio-doença', scoreModifier: 30 },
      { value: 'aposentadoria-invalidez', label: 'Aposentadoria por invalidez', scoreModifier: 35 },
      { value: 'bpc-loas', label: 'BPC/LOAS', scoreModifier: 40 },
      { value: 'aposentadoria', label: 'Aposentadoria', scoreModifier: 25 },
      { value: 'pensao', label: 'Pensão por morte', scoreModifier: 20 },
    ],
  },
  {
    id: 'denial-reason',
    text: 'Motivo da negativa:',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'pericia-injusta', label: 'Perícia injusta', scoreModifier: 35 },
      { value: 'docs-insufficient', label: 'Documentos "insuficientes"', scoreModifier: 25 },
      { value: 'carencia', label: 'Falta de carência', scoreModifier: 20 },
      { value: 'unknown', label: 'Não explicaram', scoreModifier: 30 },
    ],
  },
  {
    id: 'has-medical-reports',
    text: 'Tem laudos médicos recentes?',
    type: 'yes-no',
    priority: 'required',
    helpText: 'Laudos de especialistas fortalecem muito',
  },
  {
    id: 'urgency-financial',
    text: 'Situação financeira atual:',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'desperate', label: 'Sem renda, desesperado', scoreModifier: 45 },
      { value: 'very-difficult', label: 'Muito difícil', scoreModifier: 35 },
      { value: 'difficult', label: 'Difícil', scoreModifier: 20 },
      { value: 'managing', label: 'Conseguindo administrar', scoreModifier: 5 },
    ],
  },
  {
    id: 'denial-time',
    text: 'Quando foi negado/cortado?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'last-30-days', label: 'Últimos 30 dias', scoreModifier: 40 },
      { value: '1-3-months', label: '1 a 3 meses', scoreModifier: 30 },
      { value: '3-6-months', label: '3 a 6 meses', scoreModifier: 20 },
      { value: '6m+', label: 'Mais de 6 meses', scoreModifier: 10 },
    ],
    helpText: 'Prazo 30 dias para recurso administrativo',
  },
]

export const BENEFICIO_NEGADO_RULES: ScoringRule[] = [
  {
    id: 'desperate-financial-situation',
    description: 'Sem renda - urgência máxima',
    condition: (answers) => answerEquals(answers, 'urgency-financial', 'desperate'),
    impact: { urgency: 50, probability: 30 },
  },
  {
    id: 'recent-denial-30-days',
    description: 'Negado há menos de 30 dias - recurso admin possível',
    condition: (answers) => answerEquals(answers, 'denial-time', 'last-30-days'),
    impact: { urgency: 40, probability: 25 },
  },
  {
    id: 'bpc-loas-vulnerable',
    description: 'BPC/LOAS - população vulnerável',
    condition: (answers) => answerEquals(answers, 'benefit-denied-type', 'bpc-loas'),
    impact: { urgency: 40, probability: 30 },
  },
  {
    id: 'has-medical-evidence',
    description: 'Tem laudos médicos - prova forte',
    condition: (answers) => answerEquals(answers, 'has-medical-reports', true),
    impact: { probability: 35, complexity: -15 },
  },
]

// ============================================================================
// PREV-003: AUXÍLIO-ACIDENTE
// ============================================================================

export const AUXILIO_ACIDENTE_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'sequela-type',
    text: 'Que tipo de sequela tem?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'physical', label: 'Física (perda movimento, amputação)', scoreModifier: 30 },
      { value: 'hearing', label: 'Auditiva (perda audição)', scoreModifier: 25 },
      { value: 'visual', label: 'Visual (perda visão)', scoreModifier: 25 },
      { value: 'psychological', label: 'Psicológica (depressão, ansiedade)', scoreModifier: 15 },
    ],
  },
  {
    id: 'is-working',
    text: 'Está trabalhando atualmente?',
    type: 'yes-no',
    priority: 'required',
    helpText: 'Auxílio-acidente ACUMULA com salário',
  },
  {
    id: 'has-cat',
    text: 'Foi feita CAT (Comunicação de Acidente de Trabalho)?',
    type: 'yes-no',
    priority: 'important',
    helpText: 'CAT é importante mas não obrigatório',
  },
  {
    id: 'has-medical-proof',
    text: 'Tem laudos que comprovam a sequela permanente?',
    type: 'yes-no',
    priority: 'required',
  },
  {
    id: 'accident-date',
    text: 'Quando foi o acidente/doença?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'last-year', label: 'Último ano', scoreModifier: 25 },
      { value: '1-3-years', label: '1 a 3 anos', scoreModifier: 20 },
      { value: '3-5-years', label: '3 a 5 anos', scoreModifier: 15 },
      { value: '5y+', label: 'Mais de 5 anos', scoreModifier: 5 },
    ],
  },
]

export const AUXILIO_ACIDENTE_RULES: ScoringRule[] = [
  {
    id: 'permanent-sequela-proven',
    description: 'Sequela permanente comprovada',
    condition: (answers) => answerEquals(answers, 'has-medical-proof', true),
    impact: { probability: 35, complexity: -15 },
  },
  {
    id: 'cumulative-benefit',
    description: 'Trabalhando - benefício acumula',
    condition: (answers) => answerEquals(answers, 'is-working', true),
    impact: { urgency: 25, probability: 20 },
  },
  {
    id: 'has-cat-documentation',
    description: 'CAT registrada - nexo causal claro',
    condition: (answers) => answerEquals(answers, 'has-cat', true),
    impact: { probability: 30, complexity: -10 },
  },
]

// ============================================================================
// SERV-001: INCORPORAÇÃO GRATIFICAÇÃO
// ============================================================================

export const INCORPORACAO_GRATIFICACAO_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'gratification-time',
    text: 'Há quanto tempo recebe a função gratificada?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: '5y+', label: '5 anos ou mais (QUINQUÊNIO)', scoreModifier: 45 },
      { value: '3-5y', label: '3 a 5 anos', scoreModifier: 20 },
      { value: 'less-3y', label: 'Menos de 3 anos', scoreModifier: -20 },
    ],
    helpText: 'Quinquênio (5 anos) garante incorporação definitiva',
  },
  {
    id: 'monthly-gratification',
    text: 'Valor mensal da gratificação?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 2000',
  },
  {
    id: 'still-in-function',
    text: 'Ainda está na função gratificada?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'yes-5y+', label: 'Sim, há 5+ anos', scoreModifier: 40 },
      { value: 'yes-less', label: 'Sim, há menos de 5 anos', scoreModifier: 10 },
      { value: 'removed-recently', label: 'Fui removido recentemente', scoreModifier: 35 },
      { value: 'removed-past', label: 'Fui removido há tempos', scoreModifier: 15 },
    ],
  },
  {
    id: 'has-portarias',
    text: 'Tem portarias de nomeação e remoção?',
    type: 'yes-no',
    priority: 'important',
    helpText: 'Portarias provam o quinquênio',
  },
]

export const INCORPORACAO_GRATIFICACAO_RULES: ScoringRule[] = [
  {
    id: 'quinquenio-completed',
    description: '5+ anos - incorporação garantida (Lei 8.112/90)',
    condition: (answers) => answerIn(answers, 'gratification-time', ['5y+']) || answerEquals(answers, 'still-in-function', 'yes-5y+'),
    impact: { probability: 45, urgency: 35 },
  },
  {
    id: 'high-gratification-value',
    description: 'Gratificação alta (>= R$ 1.500)',
    condition: (answers) => answerGreaterThan(answers, 'monthly-gratification', 1500),
    impact: { urgency: 30, probability: 20 },
  },
  {
    id: 'recently-removed',
    description: 'Removido recentemente - urgência',
    condition: (answers) => answerEquals(answers, 'still-in-function', 'removed-recently'),
    impact: { urgency: 35, probability: 30 },
  },
]

// ============================================================================
// SERV-002, EDU-001, ENE-001, COND-001
// ============================================================================

export const DIFERENCAS_SALARIAIS_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'difference-type',
    text: 'Que tipo de diferença?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'reajuste', label: 'Reajuste não pago', scoreModifier: 30 },
      { value: 'progressao', label: 'Progressão atrasada', scoreModifier: 35 },
      { value: 'reenquadramento', label: 'Reenquadramento não aplicado', scoreModifier: 40 },
      { value: 'auxilio', label: 'Auxílios não pagos', scoreModifier: 20 },
    ],
  },
  {
    id: 'estimated-monthly-diff',
    text: 'Diferença mensal estimada?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 500',
  },
  {
    id: 'months-not-paid',
    text: 'Há quantos meses não recebe?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: '1-6', label: '1 a 6 meses', scoreModifier: 15 },
      { value: '6-12', label: '6 a 12 meses', scoreModifier: 20 },
      { value: '12-24', label: '1 a 2 anos', scoreModifier: 25 },
      { value: '24-60', label: '2 a 5 anos', scoreModifier: 30 },
      { value: '60+', label: 'Mais de 5 anos', scoreModifier: -10 },
    ],
    helpText: 'Prescrição de 5 anos',
  },
]

export const DIFERENCAS_SALARIAIS_RULES: ScoringRule[] = [
  {
    id: 'high-retroactive-value',
    description: 'Retroativo alto (>= R$ 10.000)',
    condition: (answers) => {
      // @ts-ignore
      const monthly = answers['estimated-monthly-diff'] as number
      // @ts-ignore
      const monthsKey = answers['months-not-paid'] as string
      const monthsMap: Record<string, number> = { '1-6': 3, '6-12': 9, '12-24': 18, '24-60': 36, '60+': 40 }
      const months = monthsMap[monthsKey] || 0
      return monthly * months >= 10000
    },
    impact: { urgency: 30, probability: 25 },
  },
]

export const FIES_RENEGOCIACAO_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'debt-amount',
    text: 'Valor da dívida FIES?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 80000',
  },
  {
    id: 'can-pay',
    text: 'Consegue pagar algum valor?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'nothing', label: 'Não consigo pagar nada', scoreModifier: 40 },
      { value: 'little', label: 'Muito pouco (até R$ 200/mês)', scoreModifier: 30 },
      { value: 'moderate', label: 'Parcela reduzida (R$ 200-500/mês)', scoreModifier: 20 },
    ],
  },
  {
    id: 'is-negativated',
    text: 'Está negativado por causa do FIES?',
    type: 'yes-no',
    priority: 'important',
  },
]

export const FIES_RENEGOCIACAO_RULES: ScoringRule[] = [
  {
    id: 'high-debt-fies',
    description: 'Dívida alta (>= R$ 50.000)',
    condition: (answers) => answerGreaterThan(answers, 'debt-amount', 50000),
    impact: { urgency: 30, probability: 25 },
  },
  {
    id: 'resolucao-mec-64-2025',
    description: 'Resolução MEC 64/2025 - desconto até 99%',
    condition: (answers) => true,
    impact: { probability: 35, urgency: 30, complexity: -10 },
  },
]

export const COBRANCA_ENERGIA_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'energy-problem',
    text: 'Qual o problema?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'estimated', label: 'Consumo estimado (não leram medidor)', scoreModifier: 30 },
      { value: 'meter-change', label: 'Troca medidor com retroativo', scoreModifier: 35 },
      { value: 'prescribed-debt', label: 'Dívida prescrita (> 5 anos)', scoreModifier: 40 },
      { value: 'wrongful-cutoff', label: 'Cortaram sem avisar', scoreModifier: 45 },
    ],
  },
  {
    id: 'overcharge-amount',
    text: 'Valor cobrado indevidamente (total)?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 2000',
  },
]

export const COBRANCA_ENERGIA_RULES: ScoringRule[] = [
  {
    id: 'wrongful-cutoff-severe',
    description: 'Corte sem aviso - ilegal',
    condition: (answers) => {
      // @ts-ignore
      const problems = answers['energy-problem'] as string[]
      return Array.isArray(problems) && problems.includes('wrongful-cutoff')
    },
    impact: { urgency: 45, probability: 40 },
  },
]

export const COBRANCA_CONDOMINIAL_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'condo-problem',
    text: 'Qual a cobrança abusiva?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'fine-over-2', label: 'Multa acima de 2%', scoreModifier: 35 },
      { value: 'unapproved-charge', label: 'Rateio sem aprovação', scoreModifier: 40 },
      { value: 'moving-fee', label: 'Taxa de mudança ilegal', scoreModifier: 30 },
      { value: 'excessive-interest', label: 'Juros excessivos', scoreModifier: 20 },
    ],
  },
  {
    id: 'charge-amount',
    text: 'Valor da cobrança?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 800',
  },
]

export const COBRANCA_CONDOMINIAL_RULES: ScoringRule[] = [
  {
    id: 'fine-over-legal-limit',
    description: 'Multa > 2% - Lei 4.591/64 proíbe',
    condition: (answers) => {
      // @ts-ignore
      const problems = answers['condo-problem'] as string[]
      return Array.isArray(problems) && problems.includes('fine-over-2')
    },
    impact: { probability: 40, urgency: 25 },
  },
]
