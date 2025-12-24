/**
 * Criminal Defense Questions (Direito Criminal)
 *
 * Products:
 * - Defesa Criminal
 * - Habeas Corpus
 */

import type { QualificationQuestion, ScoringRule } from '../types'
import {
  answerEquals,
  answerGreaterThan,
  answerIn,
  answerContains,
} from '../score-calculator'

/**
 * Defesa Criminal Questions
 */
const DEFESA_CRIMINAL_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'crime-type',
    text: 'Qual é o tipo de crime ou acusação?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'violent', label: 'Crime violento (homicídio, lesão corporal)', scoreModifier: 45 },
      { value: 'property', label: 'Crime patrimonial (furto, roubo, estelionato)', scoreModifier: 35 },
      { value: 'drug', label: 'Crime de tráfico de drogas', scoreModifier: 40 },
      { value: 'sexual', label: 'Crime sexual', scoreModifier: 45 },
      { value: 'white-collar', label: 'Crime de colarinho branco (fraude, corrupção)', scoreModifier: 40 },
      { value: 'traffic', label: 'Crime de trânsito', scoreModifier: 30 },
      { value: 'other', label: 'Outro tipo de crime', scoreModifier: 25 },
    ],
    helpText: 'O tipo de crime afeta a complexidade e estratégia da defesa',
  },
  {
    id: 'case-stage',
    text: 'Em que fase está o processo criminal?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'investigation', label: 'Inquérito policial (investigação)', scoreModifier: 40 },
      { value: 'denounced', label: 'Denúncia oferecida pelo MP', scoreModifier: 35 },
      { value: 'trial', label: 'Em julgamento (instrução processual)', scoreModifier: 30 },
      { value: 'sentenced', label: 'Sentença proferida', scoreModifier: 35 },
      { value: 'appeal', label: 'Em recurso', scoreModifier: 30 },
      { value: 'execution', label: 'Execução da pena', scoreModifier: 25 },
    ],
    helpText: 'A fase processual determina os prazos e estratégias disponíveis',
  },
  {
    id: 'detention-status',
    text: 'Qual é a situação de liberdade do acusado?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'detained', label: 'Preso preventivamente', scoreModifier: 50 },
      { value: 'flagrant', label: 'Preso em flagrante', scoreModifier: 50 },
      { value: 'provisional', label: 'Liberdade provisória', scoreModifier: 30 },
      { value: 'free', label: 'Respondendo em liberdade', scoreModifier: 20 },
      { value: 'precautionary', label: 'Medidas cautelares aplicadas', scoreModifier: 35 },
    ],
    helpText: 'Casos de prisão preventiva têm máxima urgência',
  },
  {
    id: 'evidence-strength',
    text: 'Como você avalia as provas contra o acusado?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'weak', label: 'Provas fracas ou circunstanciais', scoreModifier: 35 },
      { value: 'moderate', label: 'Provas moderadas', scoreModifier: 25 },
      { value: 'strong', label: 'Provas fortes', scoreModifier: 20 },
      { value: 'very-strong', label: 'Provas muito fortes (flagrante, confissão)', scoreModifier: 15 },
      { value: 'unknown', label: 'Não tenho acesso às provas', scoreModifier: 30 },
    ],
    helpText: 'A força das provas afeta a probabilidade de sucesso da defesa',
  },
  {
    id: 'prior-record',
    text: 'O acusado possui antecedentes criminais?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'no-record', label: 'Não possui antecedentes (réu primário)', scoreModifier: 35 },
      { value: 'minor-record', label: 'Antecedentes leves', scoreModifier: 25 },
      { value: 'serious-record', label: 'Antecedentes graves', scoreModifier: 15 },
      { value: 'repeat-offender', label: 'Reincidente', scoreModifier: 10 },
      { value: 'unknown', label: 'Não sei', scoreModifier: 20 },
    ],
    helpText: 'Réus primários têm maior probabilidade de benefícios legais',
  },
  {
    id: 'penalty-severity',
    text: 'Qual é a pena prevista para o crime?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'light', label: 'Pena leve (até 2 anos)', scoreModifier: 20 },
      { value: 'moderate', label: 'Pena moderada (2 a 4 anos)', scoreModifier: 30 },
      { value: 'serious', label: 'Pena grave (4 a 8 anos)', scoreModifier: 40 },
      { value: 'very-serious', label: 'Pena muito grave (8+ anos)', scoreModifier: 45 },
      { value: 'life', label: 'Crime hediondo ou equiparado', scoreModifier: 50 },
    ],
    helpText: 'A gravidade da pena afeta a urgência e complexidade do caso',
  },
  {
    id: 'defense-goal',
    text: 'Qual é o principal objetivo da defesa?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'acquittal', label: 'Absolvição total', scoreModifier: 40 },
      { value: 'reduction', label: 'Redução da pena', scoreModifier: 30 },
      { value: 'alternative', label: 'Penas alternativas', scoreModifier: 35 },
      { value: 'plea-deal', label: 'Acordo de delação/colaboração', scoreModifier: 35 },
      { value: 'freedom', label: 'Obter liberdade provisória', scoreModifier: 45 },
      { value: 'procedural', label: 'Nulidade processual', scoreModifier: 30 },
    ],
    helpText: 'O objetivo determina a estratégia de defesa a ser adotada',
  },
  {
    id: 'urgency-level',
    text: 'Qual é o nível de urgência do caso?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'immediate', label: 'Urgente (preso/audiência próxima)', scoreModifier: 50 },
      { value: 'high', label: 'Alta (prazo de defesa correndo)', scoreModifier: 40 },
      { value: 'moderate', label: 'Moderada (processo andamento normal)', scoreModifier: 25 },
      { value: 'low', label: 'Baixa (apenas acompanhamento)', scoreModifier: 15 },
    ],
    helpText: 'A urgência afeta a prioridade de atendimento',
  },
]

const DEFESA_CRIMINAL_RULES: ScoringRule[] = [
  {
    id: 'detained-urgent',
    description: 'Casos de prisão preventiva ou flagrante têm prioridade máxima',
    condition: (answers) =>
      answerIn(answers, 'detention-status', ['detained', 'flagrant']),
    impact: { urgency: 50, probability: 30 },
  },
  {
    id: 'serious-crime-high-complexity',
    description: 'Crimes graves aumentam complexidade e urgência',
    condition: (answers) =>
      answerIn(answers, 'crime-type', ['violent', 'sexual', 'drug']) &&
      answerIn(answers, 'penalty-severity', ['serious', 'very-serious', 'life']),
    impact: { urgency: 40, complexity: 40, probability: 25 },
  },
  {
    id: 'primary-defendant-advantage',
    description: 'Réus primários têm maior probabilidade de sucesso',
    condition: (answers) =>
      answerEquals(answers, 'prior-record', 'no-record'),
    impact: { probability: 35 },
  },
  {
    id: 'weak-evidence-high-probability',
    description: 'Provas fracas aumentam chance de absolvição',
    condition: (answers) =>
      answerIn(answers, 'evidence-strength', ['weak', 'unknown']) &&
      answerEquals(answers, 'defense-goal', 'acquittal'),
    impact: { probability: 40 },
  },
  {
    id: 'investigation-phase-advantage',
    description: 'Fase de inquérito oferece mais oportunidades de defesa',
    condition: (answers) =>
      answerEquals(answers, 'case-stage', 'investigation'),
    impact: { probability: 30, urgency: 35 },
  },
  {
    id: 'light-crime-alternative-penalty',
    description: 'Crimes leves com réu primário têm alta chance de penas alternativas',
    condition: (answers) =>
      answerIn(answers, 'penalty-severity', ['light', 'moderate']) &&
      answerEquals(answers, 'prior-record', 'no-record') &&
      answerEquals(answers, 'defense-goal', 'alternative'),
    impact: { probability: 45 },
  },
  {
    id: 'immediate-urgency-boost',
    description: 'Casos com urgência imediata recebem boost adicional',
    condition: (answers) =>
      answerEquals(answers, 'urgency-level', 'immediate'),
    impact: { urgency: 50 },
  },
]

/**
 * Habeas Corpus Questions
 */
const HABEAS_CORPUS_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'hc-type',
    text: 'Qual é o tipo de Habeas Corpus necessário?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'preventive', label: 'Preventivo (evitar prisão iminente)', scoreModifier: 45 },
      { value: 'liberatory', label: 'Liberatório (já está preso)', scoreModifier: 50 },
      { value: 'repressive', label: 'Repressivo (prisão ilegal)', scoreModifier: 50 },
    ],
    helpText: 'O tipo de HC determina a urgência e estratégia processual',
  },
  {
    id: 'detention-type',
    text: 'Qual é o tipo de prisão ou ameaça de prisão?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'preventive', label: 'Prisão preventiva', scoreModifier: 45 },
      { value: 'temporary', label: 'Prisão temporária', scoreModifier: 45 },
      { value: 'flagrant', label: 'Prisão em flagrante', scoreModifier: 50 },
      { value: 'sentence', label: 'Prisão por sentença condenatória', scoreModifier: 40 },
      { value: 'civil', label: 'Prisão civil (pensão alimentícia)', scoreModifier: 45 },
      { value: 'warrant', label: 'Mandado de prisão expedido', scoreModifier: 50 },
    ],
    helpText: 'O tipo de prisão afeta a fundamentação do HC',
  },
  {
    id: 'illegality-ground',
    text: 'Qual é a principal fundamentação de ilegalidade?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'lack-requirements', label: 'Falta de requisitos legais', scoreModifier: 40 },
      { value: 'excess-deadline', label: 'Excesso de prazo processual', scoreModifier: 45 },
      { value: 'procedural-nullity', label: 'Nulidade processual', scoreModifier: 35 },
      { value: 'lack-evidence', label: 'Ausência de fundamentação/provas', scoreModifier: 40 },
      { value: 'disproportionate', label: 'Desproporcionalidade da medida', scoreModifier: 35 },
      { value: 'alternative-measures', label: 'Cabimento de medidas cautelares alternativas', scoreModifier: 40 },
      { value: 'constitutional', label: 'Violação de garantias constitucionais', scoreModifier: 45 },
    ],
    helpText: 'A fundamentação afeta a probabilidade de êxito do HC',
  },
  {
    id: 'detention-duration',
    text: 'Há quanto tempo a pessoa está presa ou ameaçada?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'hours', label: 'Poucas horas', scoreModifier: 50 },
      { value: 'days', label: 'Alguns dias (até 5 dias)', scoreModifier: 45 },
      { value: 'weeks', label: 'Semanas (até 1 mês)', scoreModifier: 40 },
      { value: 'months', label: 'Meses (1 a 6 meses)', scoreModifier: 45 },
      { value: 'long', label: 'Mais de 6 meses', scoreModifier: 50 },
      { value: 'imminent', label: 'Prisão iminente (ainda não preso)', scoreModifier: 40 },
    ],
    helpText: 'Excesso de prazo fortalece o pedido de HC',
  },
  {
    id: 'crime-category',
    text: 'Qual é a categoria do crime?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'heinous', label: 'Crime hediondo', scoreModifier: 25 },
      { value: 'serious', label: 'Crime grave (violência)', scoreModifier: 30 },
      { value: 'moderate', label: 'Crime de média gravidade', scoreModifier: 35 },
      { value: 'light', label: 'Crime de menor potencial ofensivo', scoreModifier: 45 },
      { value: 'non-violent', label: 'Crime sem violência ou grave ameaça', scoreModifier: 40 },
    ],
    helpText: 'A gravidade do crime afeta a probabilidade de concessão do HC',
  },
  {
    id: 'defendant-profile',
    text: 'Qual é o perfil do paciente (pessoa presa)?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'primary-good', label: 'Réu primário com bons antecedentes', scoreModifier: 45 },
      { value: 'primary', label: 'Réu primário', scoreModifier: 40 },
      { value: 'minor-record', label: 'Antecedentes leves', scoreModifier: 30 },
      { value: 'repeat', label: 'Reincidente', scoreModifier: 20 },
      { value: 'vulnerable', label: 'Pessoa vulnerável (idoso, gestante, doente)', scoreModifier: 45 },
    ],
    helpText: 'O perfil do paciente afeta a análise dos requisitos da prisão',
  },
  {
    id: 'has-fixed-address',
    text: 'O paciente possui endereço fixo e vínculos sociais?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'yes-strong', label: 'Sim, com fortes vínculos (família, trabalho)', scoreModifier: 40 },
      { value: 'yes', label: 'Sim, possui endereço fixo', scoreModifier: 30 },
      { value: 'partial', label: 'Possui alguns vínculos', scoreModifier: 20 },
      { value: 'no', label: 'Não possui endereço fixo', scoreModifier: 10 },
    ],
    helpText: 'Endereço fixo e vínculos diminuem risco de fuga',
  },
  {
    id: 'hc-urgency',
    text: 'Qual é o nível de urgência do Habeas Corpus?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'extreme', label: 'Extrema (risco à vida ou integridade)', scoreModifier: 50 },
      { value: 'very-high', label: 'Muito alta (preso há muito tempo)', scoreModifier: 45 },
      { value: 'high', label: 'Alta (excesso de prazo)', scoreModifier: 40 },
      { value: 'moderate', label: 'Moderada (prisão recente)', scoreModifier: 30 },
    ],
    helpText: 'A urgência determina a prioridade de atendimento',
  },
]

const HABEAS_CORPUS_RULES: ScoringRule[] = [
  {
    id: 'already-detained-maximum-urgency',
    description: 'Pessoa já presa tem urgência máxima',
    condition: (answers) =>
      answerIn(answers, 'hc-type', ['liberatory', 'repressive']),
    impact: { urgency: 50, probability: 35 },
  },
  {
    id: 'excess-deadline-strong-case',
    description: 'Excesso de prazo é fundamento forte para HC',
    condition: (answers) =>
      answerEquals(answers, 'illegality-ground', 'excess-deadline') &&
      answerIn(answers, 'detention-duration', ['months', 'long']),
    impact: { probability: 45, urgency: 45 },
  },
  {
    id: 'primary-light-crime-high-probability',
    description: 'Réu primário em crime leve tem alta chance de HC',
    condition: (answers) =>
      answerIn(answers, 'defendant-profile', ['primary-good', 'primary']) &&
      answerIn(answers, 'crime-category', ['light', 'moderate', 'non-violent']),
    impact: { probability: 45 },
  },
  {
    id: 'vulnerable-person-priority',
    description: 'Pessoas vulneráveis têm prioridade e maior chance',
    condition: (answers) =>
      answerEquals(answers, 'defendant-profile', 'vulnerable'),
    impact: { urgency: 45, probability: 40 },
  },
  {
    id: 'strong-social-ties',
    description: 'Vínculos sociais fortes favorecem concessão do HC',
    condition: (answers) =>
      answerEquals(answers, 'has-fixed-address', 'yes-strong'),
    impact: { probability: 35 },
  },
  {
    id: 'constitutional-violation',
    description: 'Violação constitucional é fundamento forte',
    condition: (answers) =>
      answerIn(answers, 'illegality-ground', ['constitutional', 'lack-evidence']),
    impact: { probability: 40 },
  },
  {
    id: 'flagrant-detention-urgent',
    description: 'Prisão em flagrante recente requer ação imediata',
    condition: (answers) =>
      answerEquals(answers, 'detention-type', 'flagrant') &&
      answerIn(answers, 'detention-duration', ['hours', 'days']),
    impact: { urgency: 50, probability: 35 },
  },
  {
    id: 'extreme-urgency-boost',
    description: 'Urgência extrema recebe boost máximo',
    condition: (answers) =>
      answerEquals(answers, 'hc-urgency', 'extreme'),
    impact: { urgency: 50, complexity: 30 },
  },
]

/**
 * Exported Questions and Rules
 */

// Export individual question sets
export { DEFESA_CRIMINAL_QUESTIONS, DEFESA_CRIMINAL_RULES }
export { HABEAS_CORPUS_QUESTIONS, HABEAS_CORPUS_RULES }

// Export combined objects
export const CRIMINAL_QUESTIONS = {
  'defesa-criminal': DEFESA_CRIMINAL_QUESTIONS,
  'habeas-corpus': HABEAS_CORPUS_QUESTIONS,
}

export const CRIMINAL_RULES = {
  'defesa-criminal': DEFESA_CRIMINAL_RULES,
  'habeas-corpus': HABEAS_CORPUS_RULES,
}
