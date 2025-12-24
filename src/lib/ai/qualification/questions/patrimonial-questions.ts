/**
 * Qualification Questions for Patrimonial Protection Products
 * Usucapião, Holding Familiar, Inventário, Regularização de Imóveis
 */

import type { QualificationQuestion, ScoringRule } from '../types'
import {
  answerEquals,
  answerGreaterThan,
  answerIn,
  answerContains,
} from '../score-calculator'

/**
 * Questions for Usucapião Extrajudicial
 */
export const USUCAPIAO_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'property-type',
    text: 'Que tipo de imóvel você deseja usucapir?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'urban-house', label: 'Casa urbana', scoreModifier: 20 },
      { value: 'urban-apartment', label: 'Apartamento', scoreModifier: 15 },
      { value: 'rural', label: 'Imóvel rural/chácara', scoreModifier: 10 },
      { value: 'land', label: 'Terreno', scoreModifier: 25 },
      { value: 'commercial', label: 'Imóvel comercial', scoreModifier: 10 },
    ],
  },
  {
    id: 'possession-duration',
    text: 'Há quanto tempo você possui o imóvel de forma contínua?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: '5-10-years', label: '5 a 10 anos', scoreModifier: 30 },
      { value: '10-15-years', label: '10 a 15 anos', scoreModifier: 35 },
      { value: 'over-15-years', label: 'Mais de 15 anos', scoreModifier: 40 },
      { value: 'less-5-years', label: 'Menos de 5 anos', scoreModifier: -30 },
    ],
    helpText: 'Usucapião urbano requer no mínimo 5 anos de posse',
  },
  {
    id: 'property-value',
    text: 'Qual o valor estimado do imóvel?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 250000',
  },
  {
    id: 'possession-type',
    text: 'Como você adquiriu a posse do imóvel?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'purchase-no-deed', label: 'Compra sem escritura', scoreModifier: 25 },
      { value: 'inheritance-informal', label: 'Herança informal', scoreModifier: 20 },
      { value: 'donation', label: 'Doação verbal', scoreModifier: 15 },
      { value: 'occupation', label: 'Ocupação', scoreModifier: 10 },
      { value: 'abandoned', label: 'Imóvel abandonado', scoreModifier: 5 },
    ],
  },
  {
    id: 'has-witnesses',
    text: 'Você tem testemunhas que comprovem a posse contínua?',
    type: 'yes-no',
    priority: 'required',
    helpText: 'Mínimo 3 testemunhas são necessárias',
  },
  {
    id: 'property-documents',
    text: 'Que documentos você possui do imóvel?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'iptu', label: 'IPTU em seu nome', scoreModifier: 25 },
      { value: 'utility-bills', label: 'Contas de luz/água em seu nome', scoreModifier: 20 },
      { value: 'old-contract', label: 'Contrato de compra antigo', scoreModifier: 15 },
      { value: 'photos', label: 'Fotos antigas da ocupação', scoreModifier: 10 },
      { value: 'none', label: 'Não possuo documentos', scoreModifier: -20 },
    ],
  },
  {
    id: 'property-improvements',
    text: 'Você fez benfeitorias no imóvel?',
    type: 'yes-no',
    priority: 'important',
    helpText: 'Reformas, construções, melhorias comprovam a posse',
  },
  {
    id: 'owner-known',
    text: 'Você sabe quem é o proprietário registrado?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'yes-no-opposition', label: 'Sim, mas não se opõe', scoreModifier: 30 },
      { value: 'yes-unknown-position', label: 'Sim, mas não sei a posição dele', scoreModifier: 10 },
      { value: 'deceased', label: 'Sim, mas é falecido', scoreModifier: 20 },
      { value: 'unknown', label: 'Não sei quem é', scoreModifier: -10 },
    ],
  },
  {
    id: 'has-debts',
    text: 'O imóvel possui dívidas (IPTU, condomínio)?',
    type: 'yes-no',
    priority: 'optional',
  },
]

/**
 * Scoring rules for Usucapião
 */
export const USUCAPIAO_RULES: ScoringRule[] = [
  {
    id: 'long-possession',
    description: 'Posse há mais de 15 anos',
    condition: (answers) => answerEquals(answers, 'possession-duration', 'over-15-years'),
    impact: { probability: 40, complexity: -15 },
  },
  {
    id: 'has-iptu',
    description: 'IPTU em nome do possuidor',
    condition: (answers) => answerContains(answers, 'property-documents', 'iptu'),
    impact: { probability: 30, complexity: -10 },
  },
  {
    id: 'witnesses-available',
    description: 'Possui testemunhas',
    condition: (answers) => answerEquals(answers, 'has-witnesses', true),
    impact: { probability: 25, complexity: -10 },
  },
  {
    id: 'owner-no-opposition',
    description: 'Proprietário não se opõe',
    condition: (answers) => answerEquals(answers, 'owner-known', 'yes-no-opposition'),
    impact: { probability: 35, complexity: -20, urgency: 15 },
  },
  {
    id: 'purchase-no-deed',
    description: 'Compra sem escritura (mais fácil)',
    condition: (answers) => answerEquals(answers, 'possession-type', 'purchase-no-deed'),
    impact: { probability: 25, complexity: -10 },
  },
  {
    id: 'high-value-property',
    description: 'Imóvel de alto valor (> R$ 500k)',
    condition: (answers) => answerGreaterThan(answers, 'property-value', 500000),
    impact: { urgency: 20, complexity: 10 },
  },
  {
    id: 'insufficient-possession',
    description: 'Posse inferior a 5 anos (inviável)',
    condition: (answers) => answerEquals(answers, 'possession-duration', 'less-5-years'),
    impact: { probability: -50, urgency: -30 },
  },
]

/**
 * Questions for Holding Familiar
 */
export const HOLDING_FAMILIAR_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'total-assets',
    text: 'Qual o valor aproximado do patrimônio familiar total?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 2000000',
    helpText: 'Holding é recomendada para patrimônios acima de R$ 2 milhões',
  },
  {
    id: 'asset-types',
    text: 'Que tipos de bens compõem o patrimônio?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'real-estate', label: 'Imóveis', scoreModifier: 20 },
      { value: 'business', label: 'Empresas', scoreModifier: 25 },
      { value: 'investments', label: 'Investimentos financeiros', scoreModifier: 15 },
      { value: 'vehicles', label: 'Veículos', scoreModifier: 5 },
      { value: 'rural-property', label: 'Propriedades rurais', scoreModifier: 20 },
    ],
  },
  {
    id: 'heirs-count',
    text: 'Quantos herdeiros a família possui?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: '1-2', label: '1 a 2 herdeiros', scoreModifier: 10 },
      { value: '3-4', label: '3 a 4 herdeiros', scoreModifier: 20 },
      { value: '5-plus', label: '5 ou mais herdeiros', scoreModifier: 30 },
    ],
    helpText: 'Mais herdeiros = maior necessidade de planejamento',
  },
  {
    id: 'main-goal',
    text: 'Qual o principal objetivo da holding?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'succession', label: 'Planejamento sucessório', scoreModifier: 25 },
      { value: 'tax-optimization', label: 'Otimização tributária', scoreModifier: 20 },
      { value: 'asset-protection', label: 'Proteção patrimonial', scoreModifier: 20 },
      { value: 'business-management', label: 'Gestão empresarial', scoreModifier: 15 },
      { value: 'all', label: 'Todos os objetivos', scoreModifier: 30 },
    ],
  },
  {
    id: 'has-will',
    text: 'A família já possui testamento?',
    type: 'yes-no',
    priority: 'important',
  },
  {
    id: 'family-agreement',
    text: 'Todos os familiares concordam com a criação da holding?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'all-agree', label: 'Sim, todos concordam', scoreModifier: 35 },
      { value: 'most-agree', label: 'Maioria concorda', scoreModifier: 15 },
      { value: 'uncertain', label: 'Ainda não discutimos', scoreModifier: -10 },
      { value: 'disagreement', label: 'Há discordância', scoreModifier: -25 },
    ],
  },
  {
    id: 'urgency-reason',
    text: 'Por que deseja criar a holding agora?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'health-issues', label: 'Problemas de saúde na família', scoreModifier: 40 },
      { value: 'age', label: 'Idade avançada dos pais', scoreModifier: 30 },
      { value: 'family-conflicts', label: 'Prevenir conflitos futuros', scoreModifier: 25 },
      { value: 'tax-planning', label: 'Planejamento tributário', scoreModifier: 15 },
      { value: 'general-planning', label: 'Planejamento geral', scoreModifier: 10 },
    ],
  },
]

/**
 * Scoring rules for Holding Familiar
 */
export const HOLDING_FAMILIAR_RULES: ScoringRule[] = [
  {
    id: 'high-net-worth',
    description: 'Patrimônio elevado (> R$ 5 milhões)',
    condition: (answers) => answerGreaterThan(answers, 'total-assets', 5000000),
    impact: { urgency: 30, probability: 35 },
  },
  {
    id: 'many-heirs',
    description: '5+ herdeiros (complexidade sucessória)',
    condition: (answers) => answerEquals(answers, 'heirs-count', '5-plus'),
    impact: { urgency: 25, complexity: 20, probability: 30 },
  },
  {
    id: 'health-urgency',
    description: 'Urgência por saúde',
    condition: (answers) => answerEquals(answers, 'urgency-reason', 'health-issues'),
    impact: { urgency: 45, probability: 30 },
  },
  {
    id: 'family-consensus',
    description: 'Família alinhada (todos concordam)',
    condition: (answers) => answerEquals(answers, 'family-agreement', 'all-agree'),
    impact: { probability: 40, complexity: -20 },
  },
  {
    id: 'business-assets',
    description: 'Possui empresas no patrimônio',
    condition: (answers) => answerContains(answers, 'asset-types', 'business'),
    impact: { urgency: 20, complexity: 15 },
  },
  {
    id: 'family-conflict',
    description: 'Discordância familiar (dificulta)',
    condition: (answers) => answerEquals(answers, 'family-agreement', 'disagreement'),
    impact: { probability: -30, complexity: 25 },
  },
  {
    id: 'low-net-worth',
    description: 'Patrimônio abaixo de R$ 2 milhões (não recomendado)',
    condition: (answers) => !answerGreaterThan(answers, 'total-assets', 2000000),
    impact: { probability: -20, urgency: -15 },
  },
]

/**
 * Questions for Inventário Extrajudicial
 */
export const INVENTARIO_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'estate-value',
    text: 'Qual o valor aproximado do espólio (bens deixados)?',
    type: 'currency',
    priority: 'required',
    validation: { required: true, min: 0 },
    placeholder: 'Ex: 800000',
  },
  {
    id: 'heirs-consensus',
    text: 'Todos os herdeiros estão de acordo com a partilha?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'all-agree', label: 'Sim, todos concordam', scoreModifier: 40 },
      { value: 'minor-disagreement', label: 'Pequenos pontos de discordância', scoreModifier: 10 },
      { value: 'major-disagreement', label: 'Grande discordância', scoreModifier: -35 },
    ],
    helpText: 'Extrajudicial requer consenso total',
  },
  {
    id: 'has-will',
    text: 'O falecido deixou testamento?',
    type: 'yes-no',
    priority: 'required',
  },
  {
    id: 'minor-heirs',
    text: 'Há herdeiros menores de idade ou incapazes?',
    type: 'yes-no',
    priority: 'required',
    helpText: 'Presença de menores exige inventário judicial',
  },
  {
    id: 'heirs-count',
    text: 'Quantos herdeiros existem?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: '1-2', label: '1 a 2 herdeiros', scoreModifier: 10 },
      { value: '3-5', label: '3 a 5 herdeiros', scoreModifier: 5 },
      { value: '6-plus', label: '6 ou mais herdeiros', scoreModifier: -10 },
    ],
  },
  {
    id: 'estate-composition',
    text: 'Quais tipos de bens compõem o espólio?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'real-estate', label: 'Imóveis', scoreModifier: 10 },
      { value: 'bank-accounts', label: 'Contas bancárias', scoreModifier: 15 },
      { value: 'vehicles', label: 'Veículos', scoreModifier: 5 },
      { value: 'investments', label: 'Investimentos', scoreModifier: 10 },
      { value: 'business', label: 'Empresas/quotas', scoreModifier: 5 },
    ],
  },
  {
    id: 'death-certificate',
    text: 'Você já possui a certidão de óbito?',
    type: 'yes-no',
    priority: 'required',
  },
  {
    id: 'time-since-death',
    text: 'Há quanto tempo ocorreu o falecimento?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'less-6-months', label: 'Menos de 6 meses', scoreModifier: 15 },
      { value: '6-12-months', label: '6 a 12 meses', scoreModifier: 10 },
      { value: '1-2-years', label: '1 a 2 anos', scoreModifier: 5 },
      { value: 'over-2-years', label: 'Mais de 2 anos', scoreModifier: -10 },
    ],
    helpText: 'ITCMD aumenta com o tempo',
  },
]

/**
 * Scoring rules for Inventário
 */
export const INVENTARIO_RULES: ScoringRule[] = [
  {
    id: 'full-consensus',
    description: 'Consenso total entre herdeiros',
    condition: (answers) => answerEquals(answers, 'heirs-consensus', 'all-agree'),
    impact: { probability: 45, complexity: -25, urgency: 20 },
  },
  {
    id: 'has-minor-heirs',
    description: 'Herdeiros menores (inviabiliza extrajudicial)',
    condition: (answers) => answerEquals(answers, 'minor-heirs', true),
    impact: { probability: -50, complexity: 30 },
  },
  {
    id: 'major-disagreement',
    description: 'Grande discordância (inviabiliza extrajudicial)',
    condition: (answers) => answerEquals(answers, 'heirs-consensus', 'major-disagreement'),
    impact: { probability: -45, complexity: 35 },
  },
  {
    id: 'high-estate-value',
    description: 'Espólio de alto valor (> R$ 2 milhões)',
    condition: (answers) => answerGreaterThan(answers, 'estate-value', 2000000),
    impact: { urgency: 25, complexity: 15 },
  },
  {
    id: 'recent-death',
    description: 'Falecimento recente (< 6 meses)',
    condition: (answers) => answerEquals(answers, 'time-since-death', 'less-6-months'),
    impact: { urgency: 25, probability: 20 },
  },
  {
    id: 'simple-estate',
    description: 'Espólio simples (contas + imóveis)',
    condition: (answers) =>
      answerContains(answers, 'estate-composition', 'bank-accounts') &&
      answerContains(answers, 'estate-composition', 'real-estate'),
    impact: { complexity: -15, probability: 20 },
  },
]

/**
 * Questions for Regularização de Imóvel
 */
export const REGULARIZACAO_IMOVEL_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'irregularity-type',
    text: 'Qual a irregularidade do imóvel?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'no-registration', label: 'Sem matrícula no cartório', scoreModifier: 25 },
      { value: 'construction-no-permit', label: 'Construção sem alvará', scoreModifier: 20 },
      { value: 'area-mismatch', label: 'Área diferente da escritura', scoreModifier: 15 },
      { value: 'unauthorized-changes', label: 'Reformas não regularizadas', scoreModifier: 10 },
      { value: 'subdivision', label: 'Lote subdividido irregularmente', scoreModifier: 20 },
    ],
  },
  {
    id: 'property-location',
    text: 'Onde está localizado o imóvel?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'urban-regular', label: 'Área urbana regular', scoreModifier: 20 },
      { value: 'urban-irregular', label: 'Área urbana irregular/favela', scoreModifier: 10 },
      { value: 'rural', label: 'Área rural', scoreModifier: 5 },
      { value: 'environmental', label: 'Próximo a área ambiental', scoreModifier: -15 },
    ],
  },
  {
    id: 'property-use',
    text: 'Qual o uso atual do imóvel?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'residence', label: 'Residência própria', scoreModifier: 25 },
      { value: 'rent', label: 'Alugado', scoreModifier: 15 },
      { value: 'commercial', label: 'Comercial', scoreModifier: 20 },
      { value: 'vacant', label: 'Vago', scoreModifier: 5 },
    ],
  },
  {
    id: 'has-documents',
    text: 'Que documentos você possui?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'old-deed', label: 'Escritura antiga', scoreModifier: 25 },
      { value: 'purchase-contract', label: 'Contrato de compra e venda', scoreModifier: 20 },
      { value: 'iptu', label: 'IPTU', scoreModifier: 15 },
      { value: 'possession-receipt', label: 'Recibo de posse', scoreModifier: 10 },
      { value: 'none', label: 'Nenhum documento', scoreModifier: -25 },
    ],
  },
  {
    id: 'urgency-reason',
    text: 'Por que precisa regularizar agora?',
    type: 'single-choice',
    priority: 'important',
    options: [
      { value: 'sell', label: 'Preciso vender o imóvel', scoreModifier: 30 },
      { value: 'financing', label: 'Conseguir financiamento', scoreModifier: 25 },
      { value: 'inheritance', label: 'Inventário/herança', scoreModifier: 20 },
      { value: 'legal-security', label: 'Segurança jurídica', scoreModifier: 15 },
    ],
  },
]

/**
 * Scoring rules for Regularização de Imóvel
 */
export const REGULARIZACAO_IMOVEL_RULES: ScoringRule[] = [
  {
    id: 'need-to-sell',
    description: 'Urgência para vender',
    condition: (answers) => answerEquals(answers, 'urgency-reason', 'sell'),
    impact: { urgency: 35, probability: 25 },
  },
  {
    id: 'has-old-deed',
    description: 'Possui escritura antiga',
    condition: (answers) => answerContains(answers, 'has-documents', 'old-deed'),
    impact: { probability: 30, complexity: -15 },
  },
  {
    id: 'urban-regular-area',
    description: 'Área urbana regular (mais fácil)',
    condition: (answers) => answerEquals(answers, 'property-location', 'urban-regular'),
    impact: { probability: 25, complexity: -10 },
  },
  {
    id: 'environmental-area',
    description: 'Próximo a área ambiental (dificulta)',
    condition: (answers) => answerEquals(answers, 'property-location', 'environmental'),
    impact: { probability: -25, complexity: 30 },
  },
  {
    id: 'no-documents',
    description: 'Sem documentos (muito difícil)',
    condition: (answers) => answerContains(answers, 'has-documents', 'none'),
    impact: { probability: -35, complexity: 35 },
  },
]
