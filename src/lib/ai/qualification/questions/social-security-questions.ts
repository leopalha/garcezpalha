/**
 * Social Security Questions (Previdenciário)
 *
 * Products:
 * - BPC LOAS (Benefício de Prestação Continuada)
 * - Aposentadoria por Invalidez
 * - Auxílio-Doença
 */

import type { QualificationQuestion, ScoringRule } from '../types'
import {
  answerEquals,
  answerGreaterThan,
  answerIn,
  answerContains,
} from '../score-calculator'

// ============================================================================
// BPC LOAS (Benefício de Prestação Continuada)
// ============================================================================

export const BPC_LOAS_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'beneficiary-type',
    text: 'Quem é o beneficiário do BPC LOAS?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'elderly', label: 'Idoso (65+ anos)', scoreModifier: 30 },
      { value: 'disabled', label: 'Pessoa com deficiência', scoreModifier: 30 },
      { value: 'disabled-child', label: 'Criança/adolescente com deficiência', scoreModifier: 35 },
    ],
    helpText: 'BPC LOAS é para idosos 65+ ou pessoas com deficiência de qualquer idade',
  },
  {
    id: 'disability-proof',
    text: 'Existe comprovação médica da deficiência/limitação?',
    type: 'single-choice',
    priority: 'required',
    options: [
      {
        value: 'complete-documentation',
        label: 'Sim, laudos médicos completos e recentes',
        scoreModifier: 40,
      },
      { value: 'partial-documentation', label: 'Sim, mas documentação parcial', scoreModifier: 20 },
      { value: 'old-documentation', label: 'Sim, mas laudos antigos', scoreModifier: 10 },
      { value: 'no', label: 'Não possuo documentação médica', scoreModifier: -30 },
    ],
    helpText: 'Laudos médicos atualizados são fundamentais para perícia do INSS',
  },
  {
    id: 'income-per-capita',
    text: 'Qual a renda per capita (por pessoa) da família?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'under-quarter', label: 'Menos de 1/4 do salário mínimo', scoreModifier: 45 },
      {
        value: 'quarter-to-half',
        label: 'Entre 1/4 e 1/2 salário mínimo',
        scoreModifier: 25,
      },
      { value: 'half-to-one', label: 'Entre 1/2 e 1 salário mínimo', scoreModifier: 10 },
      { value: 'over-one', label: 'Mais de 1 salário mínimo', scoreModifier: -20 },
    ],
    helpText: 'Critério legal: renda per capita inferior a 1/4 do salário mínimo',
  },
  {
    id: 'previous-denial',
    text: 'Já houve pedido anterior de BPC LOAS?',
    type: 'single-choice',
    priority: 'required',
    options: [
      {
        value: 'denied-recently',
        label: 'Sim, negado recentemente (últimos 6 meses)',
        scoreModifier: 30,
      },
      { value: 'denied-before', label: 'Sim, negado há mais tempo', scoreModifier: 20 },
      { value: 'never-applied', label: 'Não, nunca solicitei', scoreModifier: -10 },
      { value: 'receiving', label: 'Estou recebendo, mas foi suspenso', scoreModifier: 40 },
    ],
    helpText: 'Negativas anteriores ou suspensão de benefício aumentam urgência',
  },
  {
    id: 'denial-reason',
    text: 'Se houve negativa, qual foi o motivo alegado pelo INSS?',
    type: 'single-choice',
    priority: 'optional',
    options: [
      { value: 'income', label: 'Renda superior ao limite', scoreModifier: 20 },
      {
        value: 'disability-not-proven',
        label: 'Perícia não constatou deficiência/incapacidade',
        scoreModifier: 15,
      },
      { value: 'procedural', label: 'Questões documentais/procedimentais', scoreModifier: 25 },
      { value: 'other', label: 'Outro motivo', scoreModifier: 10 },
    ],
    helpText: 'O motivo da negativa orienta a estratégia de recurso',
  },
  {
    id: 'urgency-situation',
    text: 'Qual a situação de urgência do caso?',
    type: 'single-choice',
    priority: 'required',
    options: [
      {
        value: 'no-income',
        label: 'Família sem nenhuma renda',
        scoreModifier: 50,
      },
      {
        value: 'minimal-income',
        label: 'Renda insuficiente para necessidades básicas',
        scoreModifier: 35,
      },
      {
        value: 'medical-expenses',
        label: 'Altos gastos médicos sem cobertura',
        scoreModifier: 40,
      },
      { value: 'stable', label: 'Situação estável no momento', scoreModifier: 10 },
    ],
    helpText: 'Vulnerabilidade social extrema justifica tutela de urgência',
  },
  {
    id: 'cras-registration',
    text: 'A família está cadastrada no CadÚnico/CRAS?',
    type: 'single-choice',
    priority: 'optional',
    options: [
      { value: 'yes-updated', label: 'Sim, cadastro atualizado', scoreModifier: 20 },
      { value: 'yes-outdated', label: 'Sim, mas desatualizado', scoreModifier: 10 },
      { value: 'no', label: 'Não está cadastrada', scoreModifier: -10 },
    ],
    helpText: 'Cadastro no CadÚnico ajuda a comprovar vulnerabilidade',
  },
]

export const BPC_LOAS_RULES: ScoringRule[] = [
  {
    id: 'meets-income-criteria',
    description: 'Renda abaixo de 1/4 SM atende critério legal básico do BPC LOAS',
    condition: (answers) => answerEquals(answers, 'income-per-capita', 'under-quarter'),
    impact: { probability: 40, complexity: -10 },
  },
  {
    id: 'complete-medical-proof',
    description: 'Documentação médica completa aumenta chances na perícia do INSS',
    condition: (answers) =>
      answerEquals(answers, 'disability-proof', 'complete-documentation') &&
      answerIn(answers, 'beneficiary-type', ['disabled', 'disabled-child']),
    impact: { probability: 35, complexity: -5 },
  },
  {
    id: 'extreme-vulnerability',
    description: 'Vulnerabilidade extrema + sem renda = tutela de urgência justificada',
    condition: (answers) =>
      answerIn(answers, 'urgency-situation', ['no-income', 'medical-expenses']) &&
      answerEquals(answers, 'income-per-capita', 'under-quarter'),
    impact: { urgency: 50, probability: 30 },
  },
  {
    id: 'benefit-suspended',
    description: 'Suspensão indevida de benefício ativo tem alta urgência e chance de reversão',
    condition: (answers) =>
      answerEquals(answers, 'previous-denial', 'receiving') &&
      answerEquals(answers, 'disability-proof', 'complete-documentation'),
    impact: { urgency: 45, probability: 35 },
  },
  {
    id: 'income-borderline',
    description: 'Renda acima do critério legal dificulta, mas jurisprudência flexibiliza em casos extremos',
    condition: (answers) =>
      answerIn(answers, 'income-per-capita', ['quarter-to-half', 'half-to-one']) &&
      answerIn(answers, 'urgency-situation', ['no-income', 'medical-expenses']),
    impact: { probability: 20, complexity: 15 },
  },
  {
    id: 'child-disability',
    description: 'Criança com deficiência tem prioridade e jurisprudência favorável',
    condition: (answers) =>
      answerEquals(answers, 'beneficiary-type', 'disabled-child') &&
      answerEquals(answers, 'disability-proof', 'complete-documentation'),
    impact: { probability: 30, urgency: 25 },
  },
]

// ============================================================================
// APOSENTADORIA POR INVALIDEZ
// ============================================================================

export const APOSENTADORIA_INVALIDEZ_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'contribution-time',
    text: 'Por quanto tempo você contribuiu para o INSS?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'over-20-years', label: 'Mais de 20 anos', scoreModifier: 35 },
      { value: '15-20-years', label: 'Entre 15 e 20 anos', scoreModifier: 30 },
      { value: '10-15-years', label: 'Entre 10 e 15 anos', scoreModifier: 25 },
      { value: '5-10-years', label: 'Entre 5 e 10 anos (carência mínima)', scoreModifier: 20 },
      { value: 'under-5-years', label: 'Menos de 5 anos', scoreModifier: -20 },
      { value: 'dont-know', label: 'Não sei ao certo', scoreModifier: 0 },
    ],
    helpText: 'Carência mínima: 12 meses de contribuição (salvo acidente)',
  },
  {
    id: 'incapacity-type',
    text: 'Qual o tipo de incapacidade para o trabalho?',
    type: 'single-choice',
    priority: 'required',
    options: [
      {
        value: 'total-permanent',
        label: 'Total e permanente (sem possibilidade de reabilitação)',
        scoreModifier: 45,
      },
      {
        value: 'total-may-improve',
        label: 'Total no momento, mas pode melhorar',
        scoreModifier: 25,
      },
      { value: 'partial', label: 'Parcial (não consigo minha função)', scoreModifier: 15 },
      { value: 'temporary', label: 'Temporária', scoreModifier: -10 },
    ],
    helpText: 'Aposentadoria por invalidez exige incapacidade total e permanente',
  },
  {
    id: 'medical-documentation-invalidez',
    text: 'Você possui documentação médica da incapacidade?',
    type: 'single-choice',
    priority: 'required',
    options: [
      {
        value: 'complete-reports',
        label: 'Sim, laudos de especialistas e exames recentes',
        scoreModifier: 40,
      },
      { value: 'partial-reports', label: 'Sim, mas documentação parcial', scoreModifier: 20 },
      { value: 'old-reports', label: 'Sim, mas laudos antigos', scoreModifier: 10 },
      { value: 'no', label: 'Não possuo documentação', scoreModifier: -30 },
    ],
    helpText: 'Laudos médicos atualizados são essenciais para perícia do INSS',
  },
  {
    id: 'disease-type',
    text: 'Qual o tipo de doença/condição que causa a incapacidade?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'grave-disease', label: 'Doença grave (câncer, HIV, etc.)', scoreModifier: 40 },
      { value: 'neurological', label: 'Neurológica/psiquiátrica', scoreModifier: 30 },
      { value: 'orthopedic', label: 'Ortopédica/lesões', scoreModifier: 25 },
      { value: 'cardio-respiratory', label: 'Cardíaca/respiratória', scoreModifier: 30 },
      { value: 'multiple', label: 'Múltiplas condições', scoreModifier: 35 },
      { value: 'other', label: 'Outra condição', scoreModifier: 15 },
    ],
    helpText: 'Doenças graves têm isenção de carência',
  },
  {
    id: 'inss-decision',
    text: 'Qual foi a decisão do INSS sobre seu pedido?',
    type: 'single-choice',
    priority: 'required',
    options: [
      {
        value: 'denied-invalidez',
        label: 'Negaram aposentadoria por invalidez',
        scoreModifier: 30,
      },
      {
        value: 'granted-auxilio',
        label: 'Concederam apenas auxílio-doença',
        scoreModifier: 25,
      },
      { value: 'denied-all', label: 'Negaram qualquer benefício', scoreModifier: 20 },
      { value: 'suspended', label: 'Suspenderam benefício que eu recebia', scoreModifier: 40 },
      { value: 'not-applied', label: 'Ainda não solicitei ao INSS', scoreModifier: -15 },
    ],
    helpText: 'É necessário pedido administrativo prévio ao INSS',
  },
  {
    id: 'work-ability',
    text: 'Você consegue exercer alguma atividade remunerada?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'no-activity', label: 'Não consigo nenhuma atividade', scoreModifier: 45 },
      {
        value: 'not-my-profession',
        label: 'Não consigo minha profissão habitual',
        scoreModifier: 30,
      },
      { value: 'limited', label: 'Apenas atividades muito limitadas', scoreModifier: 20 },
      { value: 'yes-with-pain', label: 'Sim, mas com muita dificuldade/dor', scoreModifier: 10 },
    ],
    helpText: 'Incapacidade deve ser para toda e qualquer atividade remunerada',
  },
  {
    id: 'age',
    text: 'Qual sua idade atual?',
    type: 'single-choice',
    priority: 'optional',
    options: [
      { value: 'over-60', label: 'Mais de 60 anos', scoreModifier: 30 },
      { value: '50-60', label: 'Entre 50 e 60 anos', scoreModifier: 20 },
      { value: '40-50', label: 'Entre 40 e 50 anos', scoreModifier: 10 },
      { value: 'under-40', label: 'Menos de 40 anos', scoreModifier: 5 },
    ],
    helpText: 'Idade avançada dificulta reabilitação profissional',
  },
]

export const APOSENTADORIA_INVALIDEZ_RULES: ScoringRule[] = [
  {
    id: 'total-permanent-incapacity',
    description: 'Incapacidade total e permanente atende requisito legal principal',
    condition: (answers) =>
      answerEquals(answers, 'incapacity-type', 'total-permanent') &&
      answerEquals(answers, 'work-ability', 'no-activity'),
    impact: { probability: 45, complexity: -10 },
  },
  {
    id: 'grave-disease-exemption',
    description: 'Doenças graves têm isenção de carência + prioridade processual',
    condition: (answers) =>
      answerEquals(answers, 'disease-type', 'grave-disease') &&
      answerEquals(answers, 'medical-documentation-invalidez', 'complete-reports'),
    impact: { probability: 40, urgency: 25 },
  },
  {
    id: 'benefit-suspended-invalidez',
    description: 'Suspensão indevida de benefício ativo = urgência máxima + alta chance reversão',
    condition: (answers) =>
      answerEquals(answers, 'inss-decision', 'suspended') &&
      answerEquals(answers, 'medical-documentation-invalidez', 'complete-reports'),
    impact: { urgency: 50, probability: 40 },
  },
  {
    id: 'long-contribution-elderly',
    description: 'Longo tempo de contribuição + idade avançada = dificuldade reabilitação',
    condition: (answers) =>
      answerIn(answers, 'contribution-time', ['over-20-years', '15-20-years']) &&
      answerIn(answers, 'age', ['over-60', '50-60']),
    impact: { probability: 30, urgency: 20 },
  },
  {
    id: 'insufficient-contribution',
    description: 'Carência insuficiente dificulta muito, salvo doença grave ou acidente',
    condition: (answers) =>
      answerEquals(answers, 'contribution-time', 'under-5-years') &&
      !answerEquals(answers, 'disease-type', 'grave-disease'),
    impact: { probability: -30, complexity: 20 },
  },
  {
    id: 'multiple-conditions',
    description: 'Múltiplas condições somadas podem caracterizar incapacidade total',
    condition: (answers) =>
      answerEquals(answers, 'disease-type', 'multiple') &&
      answerIn(answers, 'incapacity-type', ['total-permanent', 'total-may-improve']),
    impact: { probability: 30, complexity: 15 },
  },
]

// ============================================================================
// AUXÍLIO-DOENÇA
// ============================================================================

export const AUXILIO_DOENCA_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'contribution-time-auxilio',
    text: 'Você possui pelo menos 12 meses de contribuição ao INSS?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'yes-over-12', label: 'Sim, mais de 12 meses', scoreModifier: 35 },
      { value: 'yes-exactly-12', label: 'Sim, exatamente 12 meses', scoreModifier: 30 },
      { value: 'under-12', label: 'Não, menos de 12 meses', scoreModifier: -20 },
      { value: 'accident', label: 'É acidente (não precisa carência)', scoreModifier: 40 },
      { value: 'dont-know', label: 'Não sei', scoreModifier: 0 },
    ],
    helpText: 'Carência: 12 meses (salvo acidente ou doença grave)',
  },
  {
    id: 'incapacity-duration',
    text: 'Há quanto tempo você está incapacitado para o trabalho?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'over-6-months', label: 'Mais de 6 meses', scoreModifier: 35 },
      { value: '3-6-months', label: 'Entre 3 e 6 meses', scoreModifier: 30 },
      { value: '1-3-months', label: 'Entre 1 e 3 meses', scoreModifier: 25 },
      { value: 'over-15-days', label: 'Mais de 15 dias', scoreModifier: 20 },
      { value: 'under-15-days', label: 'Menos de 15 dias', scoreModifier: -15 },
    ],
    helpText: 'Auxílio-doença exige incapacidade superior a 15 dias',
  },
  {
    id: 'medical-documentation-auxilio',
    text: 'Você possui atestados e laudos médicos da incapacidade?',
    type: 'single-choice',
    priority: 'required',
    options: [
      {
        value: 'complete-documentation',
        label: 'Sim, atestados contínuos e laudos atualizados',
        scoreModifier: 40,
      },
      { value: 'partial-documentation', label: 'Sim, mas documentação incompleta', scoreModifier: 20 },
      { value: 'old-documentation', label: 'Sim, mas atestados antigos', scoreModifier: 10 },
      { value: 'no', label: 'Não possuo', scoreModifier: -30 },
    ],
    helpText: 'Atestados médicos sequenciais são fundamentais',
  },
  {
    id: 'disease-type-auxilio',
    text: 'Qual o tipo de doença/condição?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'grave-disease', label: 'Doença grave (câncer, HIV, etc.)', scoreModifier: 40 },
      { value: 'work-accident', label: 'Acidente de trabalho', scoreModifier: 35 },
      { value: 'orthopedic', label: 'Problema ortopédico', scoreModifier: 25 },
      { value: 'psychiatric', label: 'Transtorno psiquiátrico', scoreModifier: 30 },
      { value: 'chronic', label: 'Doença crônica', scoreModifier: 25 },
      { value: 'other', label: 'Outra condição', scoreModifier: 15 },
    ],
    helpText: 'Acidentes de trabalho e doenças graves têm regras especiais',
  },
  {
    id: 'inss-decision-auxilio',
    text: 'Qual foi a decisão do INSS sobre seu pedido de auxílio-doença?',
    type: 'single-choice',
    priority: 'required',
    options: [
      {
        value: 'denied-not-incapacitated',
        label: 'Negaram (perícia disse que não estou incapacitado)',
        scoreModifier: 25,
      },
      {
        value: 'denied-no-quality',
        label: 'Negaram por falta de qualidade de segurado',
        scoreModifier: 15,
      },
      { value: 'granted-then-stopped', label: 'Concederam, mas cessaram depois', scoreModifier: 35 },
      {
        value: 'not-applied',
        label: 'Ainda não solicitei',
        scoreModifier: -20,
      },
    ],
    helpText: 'Pedido administrativo prévio é obrigatório',
  },
  {
    id: 'currently-working',
    text: 'Você está conseguindo trabalhar atualmente?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'no-completely-unable', label: 'Não, completamente impossibilitado', scoreModifier: 40 },
      { value: 'no-on-leave', label: 'Não, estou afastado', scoreModifier: 35 },
      { value: 'yes-with-difficulty', label: 'Sim, mas com muita dificuldade', scoreModifier: 10 },
      { value: 'yes-normally', label: 'Sim, trabalhando normalmente', scoreModifier: -30 },
    ],
    helpText: 'Estar trabalhando pode descaracterizar incapacidade',
  },
  {
    id: 'treatment-ongoing',
    text: 'Você está em tratamento médico contínuo?',
    type: 'single-choice',
    priority: 'optional',
    options: [
      { value: 'yes-intensive', label: 'Sim, tratamento intensivo', scoreModifier: 30 },
      { value: 'yes-regular', label: 'Sim, acompanhamento regular', scoreModifier: 20 },
      { value: 'yes-sporadic', label: 'Sim, mas esporádico', scoreModifier: 10 },
      { value: 'no', label: 'Não estou em tratamento', scoreModifier: -15 },
    ],
    helpText: 'Tratamento contínuo comprova a necessidade do benefício',
  },
]

export const AUXILIO_DOENCA_RULES: ScoringRule[] = [
  {
    id: 'meets-basic-requirements',
    description: 'Atende requisitos básicos: carência + incapacidade > 15 dias',
    condition: (answers) =>
      answerIn(answers, 'contribution-time-auxilio', ['yes-over-12', 'yes-exactly-12', 'accident']) &&
      answerIn(answers, 'incapacity-duration', ['over-6-months', '3-6-months', '1-3-months']),
    impact: { probability: 35, complexity: -10 },
  },
  {
    id: 'work-accident',
    description: 'Acidente de trabalho: sem carência + presunção de incapacidade',
    condition: (answers) =>
      answerEquals(answers, 'disease-type-auxilio', 'work-accident') &&
      answerEquals(answers, 'medical-documentation-auxilio', 'complete-documentation'),
    impact: { probability: 40, urgency: 25 },
  },
  {
    id: 'grave-disease-auxilio',
    description: 'Doença grave: isenção de carência + urgência pela gravidade',
    condition: (answers) =>
      answerEquals(answers, 'disease-type-auxilio', 'grave-disease') &&
      answerEquals(answers, 'medical-documentation-auxilio', 'complete-documentation'),
    impact: { probability: 40, urgency: 30 },
  },
  {
    id: 'benefit-stopped',
    description: 'Cessação indevida de benefício + ainda incapacitado = urgência + alta chance',
    condition: (answers) =>
      answerEquals(answers, 'inss-decision-auxilio', 'granted-then-stopped') &&
      answerEquals(answers, 'currently-working', 'no-completely-unable'),
    impact: { urgency: 45, probability: 40 },
  },
  {
    id: 'long-incapacity',
    description: 'Incapacidade prolongada + afastamento do trabalho reforça necessidade',
    condition: (answers) =>
      answerEquals(answers, 'incapacity-duration', 'over-6-months') &&
      answerIn(answers, 'currently-working', ['no-completely-unable', 'no-on-leave']),
    impact: { probability: 30, urgency: 25 },
  },
  {
    id: 'working-normally',
    description: 'Estar trabalhando normalmente descaracteriza incapacidade',
    condition: (answers) => answerEquals(answers, 'currently-working', 'yes-normally'),
    impact: { probability: -40, complexity: 20 },
  },
  {
    id: 'psychiatric-with-treatment',
    description: 'Transtorno psiquiátrico em tratamento: incapacidade menos visível mas reconhecida',
    condition: (answers) =>
      answerEquals(answers, 'disease-type-auxilio', 'psychiatric') &&
      answerIn(answers, 'treatment-ongoing', ['yes-intensive', 'yes-regular']),
    impact: { probability: 25, complexity: 15 },
  },
]

// ============================================================================
// EXPORT ALL
// ============================================================================

export const SOCIAL_SECURITY_QUESTIONS = {
  'bpc-loas': BPC_LOAS_QUESTIONS,
  'aposentadoria-invalidez': APOSENTADORIA_INVALIDEZ_QUESTIONS,
  'auxilio-doenca': AUXILIO_DOENCA_QUESTIONS,
}

export const SOCIAL_SECURITY_RULES = {
  'bpc-loas': BPC_LOAS_RULES,
  'aposentadoria-invalidez': APOSENTADORIA_INVALIDEZ_RULES,
  'auxilio-doenca': AUXILIO_DOENCA_RULES,
}
