/**
 * Health Insurance Questions (Plano de Saúde)
 *
 * Products:
 * - Plano de Saúde (Negativa de Cobertura)
 * - Cirurgia Bariátrica
 * - Tratamento TEA (Transtorno do Espectro Autista)
 */

import type { QualificationQuestion, ScoringRule } from '../types'
import {
  answerEquals,
  answerGreaterThan,
  answerIn,
  answerContains,
} from '../score-calculator'

// ============================================================================
// PLANO DE SAÚDE (Health Insurance Denial)
// ============================================================================

export const PLANO_SAUDE_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'denial-type',
    text: 'Qual foi o tipo de negativa do plano de saúde?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'surgery', label: 'Cirurgia', scoreModifier: 35 },
      { value: 'treatment', label: 'Tratamento contínuo', scoreModifier: 35 },
      { value: 'exam', label: 'Exame ou procedimento', scoreModifier: 30 },
      { value: 'medication', label: 'Medicamento', scoreModifier: 30 },
      { value: 'hospitalization', label: 'Internação', scoreModifier: 40 },
      { value: 'emergency', label: 'Atendimento de emergência', scoreModifier: 45 },
      { value: 'home-care', label: 'Home care', scoreModifier: 35 },
    ],
    helpText: 'O tipo de negativa afeta a urgência e estratégia jurídica',
  },
  {
    id: 'medical-necessity',
    text: 'O procedimento foi solicitado por médico como necessidade médica?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'yes-urgent', label: 'Sim, com urgência médica comprovada', scoreModifier: 40 },
      { value: 'yes-necessary', label: 'Sim, medicamente necessário', scoreModifier: 35 },
      { value: 'yes-elective', label: 'Sim, mas eletivo', scoreModifier: 20 },
      { value: 'no', label: 'Não foi solicitado por médico', scoreModifier: -40 },
    ],
    helpText: 'Solicitação médica é fundamental para processo contra plano de saúde',
  },
  {
    id: 'has-medical-reports',
    text: 'Você possui relatórios médicos detalhados sobre a necessidade do procedimento?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'complete', label: 'Sim, relatórios completos e recentes', scoreModifier: 35 },
      { value: 'partial', label: 'Sim, mas parciais ou incompletos', scoreModifier: 15 },
      { value: 'old', label: 'Sim, mas antigos (mais de 6 meses)', scoreModifier: 5 },
      { value: 'no', label: 'Não possuo', scoreModifier: -25 },
    ],
    helpText: 'Documentação médica sólida aumenta muito as chances de sucesso',
  },
  {
    id: 'denial-reason',
    text: 'Qual foi a justificativa do plano para negar o procedimento?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'not-covered', label: 'Procedimento não coberto pelo plano', scoreModifier: 15 },
      { value: 'experimental', label: 'Tratamento experimental', scoreModifier: 10 },
      { value: 'waiting-period', label: 'Carência não cumprida', scoreModifier: -10 },
      { value: 'pre-existing', label: 'Doença preexistente', scoreModifier: 20 },
      { value: 'no-authorization', label: 'Falta de autorização prévia', scoreModifier: 25 },
      { value: 'no-reason', label: 'Não deram justificativa clara', scoreModifier: 35 },
      { value: 'other', label: 'Outro motivo', scoreModifier: 10 },
    ],
    helpText: 'A justificativa do plano determina a estratégia de defesa',
  },
  {
    id: 'urgency-level',
    text: 'Qual o nível de urgência do procedimento?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'life-threatening', label: 'Risco de morte iminente', scoreModifier: 50 },
      { value: 'urgent', label: 'Urgente (risco à saúde em dias/semanas)', scoreModifier: 40 },
      { value: 'important', label: 'Importante (risco em meses)', scoreModifier: 25 },
      { value: 'elective', label: 'Eletivo (sem urgência)', scoreModifier: 10 },
    ],
    helpText: 'Urgência determina necessidade de tutela de urgência judicial',
  },
  {
    id: 'prior-authorization',
    text: 'Você solicitou autorização prévia ao plano antes do procedimento?',
    type: 'single-choice',
    priority: 'optional',
    options: [
      { value: 'yes-denied', label: 'Sim, e foi negada formalmente', scoreModifier: 30 },
      { value: 'yes-no-response', label: 'Sim, mas não obtive resposta', scoreModifier: 35 },
      { value: 'emergency', label: 'Não, pois era emergência', scoreModifier: 25 },
      { value: 'no', label: 'Não solicitei', scoreModifier: -15 },
    ],
    helpText: 'Tentativa administrativa prévia fortalece o caso',
  },
  {
    id: 'time-since-denial',
    text: 'Há quanto tempo foi a negativa do plano?',
    type: 'single-choice',
    priority: 'optional',
    options: [
      { value: 'days', label: 'Dias atrás', scoreModifier: 35 },
      { value: 'weeks', label: 'Semanas atrás', scoreModifier: 30 },
      { value: 'months', label: '1-3 meses atrás', scoreModifier: 20 },
      { value: 'over-3-months', label: 'Mais de 3 meses', scoreModifier: 5 },
    ],
    helpText: 'Negativas recentes têm maior urgência jurídica',
  },
  {
    id: 'contract-type',
    text: 'Qual o tipo do seu plano de saúde?',
    type: 'single-choice',
    priority: 'optional',
    options: [
      { value: 'individual', label: 'Individual/Familiar', scoreModifier: 10 },
      { value: 'company', label: 'Empresarial (pela empresa)', scoreModifier: 10 },
      { value: 'affiliation', label: 'Coletivo por adesão', scoreModifier: 10 },
      { value: 'dont-know', label: 'Não sei', scoreModifier: 0 },
    ],
    helpText: 'O tipo de contrato pode influenciar a estratégia',
  },
]

export const PLANO_SAUDE_RULES: ScoringRule[] = [
  {
    id: 'life-threatening-emergency',
    description: 'Casos de emergência/risco de vida têm prioridade máxima e alta chance tutela urgência',
    condition: (answers) =>
      answerIn(answers, 'urgency-level', ['life-threatening', 'urgent']) &&
      answerIn(answers, 'denial-type', ['emergency', 'hospitalization', 'surgery']),
    impact: { urgency: 50, probability: 40 },
  },
  {
    id: 'has-medical-documentation',
    description: 'Documentação médica completa + necessidade comprovada = alta chance de êxito',
    condition: (answers) =>
      answerEquals(answers, 'has-medical-reports', 'complete') &&
      answerIn(answers, 'medical-necessity', ['yes-urgent', 'yes-necessary']),
    impact: { probability: 35, complexity: -10 },
  },
  {
    id: 'abusive-denial',
    description: 'Negativa sem justificativa ou por falta de autorização é abusiva',
    condition: (answers) =>
      answerIn(answers, 'denial-reason', ['no-reason', 'no-authorization']) &&
      answerEquals(answers, 'prior-authorization', 'yes-denied'),
    impact: { probability: 30, urgency: 20 },
  },
  {
    id: 'pre-existing-condition-defense',
    description: 'Negativa por doença preexistente é contestável com documentação',
    condition: (answers) =>
      answerEquals(answers, 'denial-reason', 'pre-existing') &&
      answerEquals(answers, 'has-medical-reports', 'complete'),
    impact: { probability: 25, complexity: 15 },
  },
  {
    id: 'waiting-period-issue',
    description: 'Carência não cumprida reduz chances, salvo urgência/emergência',
    condition: (answers) => answerEquals(answers, 'denial-reason', 'waiting-period'),
    impact: { probability: -20, complexity: 10 },
  },
  {
    id: 'recent-urgent-case',
    description: 'Negativa recente + urgência = necessidade de ação judicial imediata',
    condition: (answers) =>
      answerIn(answers, 'time-since-denial', ['days', 'weeks']) &&
      answerIn(answers, 'urgency-level', ['life-threatening', 'urgent']),
    impact: { urgency: 40 },
  },
]

// ============================================================================
// CIRURGIA BARIÁTRICA (Bariatric Surgery)
// ============================================================================

export const BARIATRICA_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'current-bmi',
    text: 'Qual seu IMC (Índice de Massa Corporal) atual?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'over-40', label: 'Acima de 40', scoreModifier: 40 },
      { value: '35-40-comorbidities', label: 'Entre 35-40 com comorbidades', scoreModifier: 35 },
      { value: '35-40-no-comorbidities', label: 'Entre 35-40 sem comorbidades', scoreModifier: 10 },
      { value: 'under-35', label: 'Abaixo de 35', scoreModifier: -30 },
    ],
    helpText: 'IMC ≥40 ou ≥35 com comorbidades são critérios médicos para cirurgia bariátrica',
  },
  {
    id: 'comorbidities',
    text: 'Você possui comorbidades relacionadas à obesidade?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'diabetes', label: 'Diabetes tipo 2', scoreModifier: 15 },
      { value: 'hypertension', label: 'Hipertensão arterial', scoreModifier: 15 },
      { value: 'sleep-apnea', label: 'Apneia do sono', scoreModifier: 15 },
      { value: 'heart-disease', label: 'Doença cardíaca', scoreModifier: 20 },
      { value: 'joint-problems', label: 'Problemas articulares graves', scoreModifier: 10 },
      { value: 'other', label: 'Outras doenças relacionadas', scoreModifier: 10 },
      { value: 'none', label: 'Não possuo comorbidades', scoreModifier: -15 },
    ],
    helpText: 'Comorbidades reforçam indicação médica para cirurgia bariátrica',
  },
  {
    id: 'prior-treatments',
    text: 'Você já tentou tratamentos clínicos para obesidade?',
    type: 'single-choice',
    priority: 'required',
    options: [
      {
        value: 'yes-2-years',
        label: 'Sim, por mais de 2 anos sem sucesso',
        scoreModifier: 40,
      },
      {
        value: 'yes-1-year',
        label: 'Sim, por 1-2 anos sem sucesso',
        scoreModifier: 30,
      },
      { value: 'yes-less-1-year', label: 'Sim, por menos de 1 ano', scoreModifier: 15 },
      { value: 'no', label: 'Não tentei tratamentos clínicos', scoreModifier: -25 },
    ],
    helpText: 'Tratamento clínico prévio sem sucesso é critério necessário',
  },
  {
    id: 'medical-indication',
    text: 'Você possui indicação médica formal para cirurgia bariátrica?',
    type: 'single-choice',
    priority: 'required',
    options: [
      {
        value: 'complete-report',
        label: 'Sim, com relatório completo de equipe multidisciplinar',
        scoreModifier: 45,
      },
      { value: 'doctor-report', label: 'Sim, relatório de médico especialista', scoreModifier: 35 },
      { value: 'general-doctor', label: 'Sim, de médico clínico geral', scoreModifier: 20 },
      { value: 'no', label: 'Não possuo indicação médica formal', scoreModifier: -40 },
    ],
    helpText: 'Indicação de equipe multidisciplinar (cirurgião, endócrino, psicólogo, nutricionista)',
  },
  {
    id: 'bariatric-denial-reason',
    text: 'Por que o plano negou a cirurgia bariátrica?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'not-covered', label: 'Não está coberta pelo plano', scoreModifier: 30 },
      { value: 'aesthetic', label: 'Alegaram ser procedimento estético', scoreModifier: 35 },
      { value: 'criteria', label: 'Critérios não atendidos', scoreModifier: 10 },
      { value: 'no-reason', label: 'Não deram justificativa', scoreModifier: 40 },
      { value: 'waiting-period', label: 'Carência não cumprida', scoreModifier: -10 },
    ],
    helpText: 'A justificativa da negativa determina a estratégia jurídica',
  },
  {
    id: 'health-deterioration',
    text: 'Há piora progressiva do seu quadro de saúde?',
    type: 'single-choice',
    priority: 'optional',
    options: [
      { value: 'rapid', label: 'Sim, piora rápida (últimos meses)', scoreModifier: 35 },
      { value: 'gradual', label: 'Sim, piora gradual', scoreModifier: 25 },
      { value: 'stable', label: 'Não, quadro estável', scoreModifier: 10 },
    ],
    helpText: 'Deterioração da saúde aumenta urgência do caso',
  },
]

export const BARIATRICA_RULES: ScoringRule[] = [
  {
    id: 'meets-medical-criteria',
    description: 'Atende critérios médicos clássicos: IMC + tratamento prévio sem sucesso',
    condition: (answers) =>
      answerIn(answers, 'current-bmi', ['over-40', '35-40-comorbidities']) &&
      answerIn(answers, 'prior-treatments', ['yes-2-years', 'yes-1-year']),
    impact: { probability: 40, complexity: -10 },
  },
  {
    id: 'complete-medical-documentation',
    description: 'Documentação completa + comorbidades = caso sólido para ação judicial',
    condition: (answers) =>
      answerEquals(answers, 'medical-indication', 'complete-report') &&
      answerContains(answers, 'comorbidities', 'diabetes'),
    impact: { probability: 35, urgency: 15 },
  },
  {
    id: 'abusive-aesthetic-denial',
    description: 'Classificar bariátrica como estética é negativa abusiva quando há indicação médica',
    condition: (answers) =>
      answerEquals(answers, 'bariatric-denial-reason', 'aesthetic') &&
      answerIn(answers, 'current-bmi', ['over-40', '35-40-comorbidities']),
    impact: { probability: 40, urgency: 20 },
  },
  {
    id: 'health-deteriorating',
    description: 'Piora rápida com comorbidades graves = urgência para tutela antecipada',
    condition: (answers) =>
      answerEquals(answers, 'health-deterioration', 'rapid') &&
      answerContains(answers, 'comorbidities', 'heart-disease'),
    impact: { urgency: 40, probability: 20 },
  },
  {
    id: 'insufficient-prior-treatment',
    description: 'Falta de tratamento clínico prévio adequado dificulta aprovação',
    condition: (answers) =>
      answerIn(answers, 'prior-treatments', ['yes-less-1-year', 'no']),
    impact: { probability: -25, complexity: 15 },
  },
]

// ============================================================================
// TRATAMENTO TEA (Autism Spectrum Disorder Treatment)
// ============================================================================

export const TEA_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'tea-diagnosis',
    text: 'O diagnóstico de TEA (Transtorno do Espectro Autista) foi feito por profissional habilitado?',
    type: 'single-choice',
    priority: 'required',
    options: [
      {
        value: 'specialist-report',
        label: 'Sim, com laudo de neuropediatra/psiquiatra infantil',
        scoreModifier: 40,
      },
      { value: 'psychologist', label: 'Sim, laudo de psicólogo', scoreModifier: 30 },
      { value: 'general-doctor', label: 'Sim, por médico clínico', scoreModifier: 15 },
      { value: 'no', label: 'Não tenho diagnóstico formal', scoreModifier: -40 },
    ],
    helpText: 'Diagnóstico por neuropediatra ou psiquiatra infantil é fundamental',
  },
  {
    id: 'patient-age',
    text: 'Qual a idade da pessoa com TEA?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: '0-3', label: '0 a 3 anos (intervenção precoce)', scoreModifier: 45 },
      { value: '4-6', label: '4 a 6 anos', scoreModifier: 40 },
      { value: '7-12', label: '7 a 12 anos', scoreModifier: 35 },
      { value: '13-17', label: '13 a 17 anos', scoreModifier: 30 },
      { value: 'over-18', label: 'Maior de 18 anos', scoreModifier: 25 },
    ],
    helpText: 'Intervenção precoce (0-6 anos) tem prioridade e melhores resultados',
  },
  {
    id: 'treatments-needed',
    text: 'Quais tratamentos foram prescritos e negados pelo plano?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'aba', label: 'ABA (Análise do Comportamento Aplicada)', scoreModifier: 35 },
      { value: 'speech-therapy', label: 'Fonoaudiologia', scoreModifier: 30 },
      { value: 'occupational-therapy', label: 'Terapia Ocupacional', scoreModifier: 30 },
      { value: 'psychology', label: 'Psicologia/Psicoterapia', scoreModifier: 25 },
      { value: 'psychopedagogy', label: 'Psicopedagogia', scoreModifier: 20 },
      { value: 'other', label: 'Outras terapias', scoreModifier: 15 },
    ],
    helpText: 'Tratamentos essenciais para TEA devem ser cobertos pelo plano',
  },
  {
    id: 'sessions-frequency',
    text: 'Qual a frequência de sessões prescrita pelo médico?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'intensive', label: 'Intensivo (20+ horas/semana)', scoreModifier: 40 },
      { value: 'high', label: 'Alta (10-20 horas/semana)', scoreModifier: 35 },
      { value: 'moderate', label: 'Moderada (5-10 horas/semana)', scoreModifier: 25 },
      { value: 'low', label: 'Baixa (menos de 5 horas/semana)', scoreModifier: 15 },
    ],
    helpText: 'Frequência prescrita deve ser respeitada pelo plano de saúde',
  },
  {
    id: 'tea-denial-reason',
    text: 'Por que o plano negou o tratamento para TEA?',
    type: 'single-choice',
    priority: 'required',
    options: [
      {
        value: 'session-limit',
        label: 'Limitou número de sessões (ex: 12/ano)',
        scoreModifier: 40,
      },
      { value: 'not-covered', label: 'Alegou que não está coberto', scoreModifier: 35 },
      { value: 'educational', label: 'Classificou como educacional, não médico', scoreModifier: 35 },
      { value: 'home-therapy', label: 'Negou terapia domiciliar', scoreModifier: 30 },
      { value: 'no-reason', label: 'Não deu justificativa', scoreModifier: 45 },
    ],
    helpText: 'Limitação de sessões para TEA é ilegal por jurisprudência consolidada',
  },
  {
    id: 'tea-medical-prescription',
    text: 'Você possui prescrição médica detalhada do plano terapêutico?',
    type: 'single-choice',
    priority: 'required',
    options: [
      {
        value: 'complete',
        label: 'Sim, com plano completo (tipo/frequência/duração)',
        scoreModifier: 40,
      },
      { value: 'partial', label: 'Sim, mas genérica ou incompleta', scoreModifier: 20 },
      { value: 'no', label: 'Não possuo prescrição detalhada', scoreModifier: -25 },
    ],
    helpText: 'Prescrição médica detalhada é essencial para obrigar o plano',
  },
  {
    id: 'developmental-regression',
    text: 'Há risco de regressão no desenvolvimento sem o tratamento?',
    type: 'single-choice',
    priority: 'optional',
    options: [
      { value: 'documented-risk', label: 'Sim, risco documentado pelo médico', scoreModifier: 35 },
      { value: 'likely', label: 'Sim, é provável', scoreModifier: 25 },
      { value: 'no', label: 'Não há risco imediato', scoreModifier: 10 },
    ],
    helpText: 'Risco de regressão aumenta urgência do caso',
  },
]

export const TEA_RULES: ScoringRule[] = [
  {
    id: 'early-intervention-critical',
    description: 'Intervenção precoce em TEA é crítica - jurisprudência favorável',
    condition: (answers) =>
      answerIn(answers, 'patient-age', ['0-3', '4-6']) &&
      answerEquals(answers, 'tea-diagnosis', 'specialist-report'),
    impact: { urgency: 50, probability: 40 },
  },
  {
    id: 'session-limitation-abuse',
    description: 'Limitação de sessões para TEA é ilegal - Lei Brasileira de Inclusão + Súmulas',
    condition: (answers) =>
      answerEquals(answers, 'tea-denial-reason', 'session-limit') &&
      answerEquals(answers, 'tea-medical-prescription', 'complete'),
    impact: { probability: 45, urgency: 30 },
  },
  {
    id: 'intensive-aba-needed',
    description: 'ABA intensivo para TEA tem jurisprudência consolidada de cobertura obrigatória',
    condition: (answers) =>
      answerContains(answers, 'treatments-needed', 'aba') &&
      answerIn(answers, 'sessions-frequency', ['intensive', 'high']),
    impact: { probability: 35, urgency: 25 },
  },
  {
    id: 'educational-vs-therapeutic',
    description: 'Classificar TEA como educacional (vs terapêutico) é negativa abusiva',
    condition: (answers) =>
      answerEquals(answers, 'tea-denial-reason', 'educational') &&
      answerEquals(answers, 'tea-diagnosis', 'specialist-report'),
    impact: { probability: 40, urgency: 20 },
  },
  {
    id: 'regression-risk',
    description: 'Risco documentado de regressão em criança = urgência para tutela antecipada',
    condition: (answers) =>
      answerEquals(answers, 'developmental-regression', 'documented-risk') &&
      answerIn(answers, 'patient-age', ['0-3', '4-6', '7-12']),
    impact: { urgency: 40, probability: 25 },
  },
  {
    id: 'multidisciplinary-treatment',
    description: 'Necessidade de múltiplas terapias reforça gravidade e necessidade médica',
    condition: (answers) => {
      const answer = answers.find(a => a.questionId === 'treatments-needed')
      if (!answer || !Array.isArray(answer.value)) return false
      return answer.value.length >= 3
    },
    impact: { probability: 30, complexity: 10 },
  },
]

// ============================================================================
// EXPORT ALL
// ============================================================================

export const HEALTH_INSURANCE_QUESTIONS = {
  'plano-saude': PLANO_SAUDE_QUESTIONS,
  'bariatrica': BARIATRICA_QUESTIONS,
  'tratamento-tea': TEA_QUESTIONS,
}

export const HEALTH_INSURANCE_RULES = {
  'plano-saude': PLANO_SAUDE_RULES,
  'bariatrica': BARIATRICA_RULES,
  'tratamento-tea': TEA_RULES,
}
