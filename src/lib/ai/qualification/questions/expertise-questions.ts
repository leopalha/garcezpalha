/**
 * Expertise Questions (Perícias)
 *
 * Products:
 * - Perícia Grafotécnica (Assinatura Falsa)
 * - Avaliação de Imóveis
 * - Perícia Médica
 */

import type { QualificationQuestion, ScoringRule } from '../types'
import {
  answerEquals,
  answerGreaterThan,
  answerIn,
  answerContains,
} from '../score-calculator'

/**
 * Perícia Grafotécnica Questions (Assinatura Falsa)
 */
const GRAFOTECNICA_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'document-type',
    text: 'Qual tipo de documento possui a assinatura questionada?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'contract', label: 'Contrato (compra/venda, prestação serviços)', scoreModifier: 40 },
      { value: 'promissory-note', label: 'Nota promissória ou cheque', scoreModifier: 45 },
      { value: 'deed', label: 'Escritura pública ou procuração', scoreModifier: 45 },
      { value: 'loan', label: 'Contrato de empréstimo/financiamento', scoreModifier: 40 },
      { value: 'employment', label: 'Documento trabalhista (rescisão, acordo)', scoreModifier: 35 },
      { value: 'will', label: 'Testamento', scoreModifier: 50 },
      { value: 'other', label: 'Outro tipo de documento', scoreModifier: 30 },
    ],
    helpText: 'O tipo de documento afeta a gravidade e complexidade do caso',
  },
  {
    id: 'document-value',
    text: 'Qual é o valor envolvido no documento?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'low', label: 'Até R$ 10.000', scoreModifier: 20 },
      { value: 'moderate', label: 'R$ 10.000 a R$ 50.000', scoreModifier: 30 },
      { value: 'high', label: 'R$ 50.000 a R$ 200.000', scoreModifier: 40 },
      { value: 'very-high', label: 'R$ 200.000 a R$ 500.000', scoreModifier: 45 },
      { value: 'extreme', label: 'Acima de R$ 500.000', scoreModifier: 50 },
      { value: 'non-monetary', label: 'Não envolve valor monetário direto', scoreModifier: 25 },
    ],
    helpText: 'O valor afeta a urgência e importância do caso',
  },
  {
    id: 'forgery-evidence',
    text: 'Qual é o nível de evidência de falsificação?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'strong-visual', label: 'Forte - diferenças visíveis a olho nu', scoreModifier: 45 },
      { value: 'moderate', label: 'Moderada - suspeitas razoáveis', scoreModifier: 35 },
      { value: 'subtle', label: 'Sutil - necessita análise técnica', scoreModifier: 40 },
      { value: 'denial', label: 'Negação da assinatura pela suposta vítima', scoreModifier: 40 },
      { value: 'witness', label: 'Testemunha afirma que não viu assinatura', scoreModifier: 35 },
    ],
    helpText: 'A força das evidências iniciais afeta a probabilidade de sucesso',
  },
  {
    id: 'authentic-samples',
    text: 'Você possui amostras autênticas da assinatura para comparação?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'many', label: 'Sim, várias amostras autênticas', scoreModifier: 45 },
      { value: 'some', label: 'Sim, algumas amostras', scoreModifier: 35 },
      { value: 'few', label: 'Poucas amostras', scoreModifier: 25 },
      { value: 'none', label: 'Não possuo amostras', scoreModifier: 10 },
      { value: 'public-records', label: 'Posso obter de registros públicos', scoreModifier: 30 },
    ],
    helpText: 'Amostras autênticas são essenciais para a perícia grafotécnica',
  },
  {
    id: 'legal-context',
    text: 'Em que contexto legal a perícia será usada?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'defense', label: 'Defesa em processo em andamento', scoreModifier: 45 },
      { value: 'prosecution', label: 'Iniciar ação judicial', scoreModifier: 40 },
      { value: 'criminal', label: 'Processo criminal (estelionato, falsificação)', scoreModifier: 50 },
      { value: 'investigation', label: 'Investigação preliminar', scoreModifier: 30 },
      { value: 'administrative', label: 'Contestação administrativa', scoreModifier: 25 },
    ],
    helpText: 'O contexto legal determina prazos e urgência',
  },
  {
    id: 'time-since-forgery',
    text: 'Há quanto tempo ocorreu a suposta falsificação?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'recent', label: 'Recente (até 6 meses)', scoreModifier: 40 },
      { value: 'moderate', label: '6 meses a 2 anos', scoreModifier: 35 },
      { value: 'old', label: '2 a 5 anos', scoreModifier: 30 },
      { value: 'very-old', label: 'Mais de 5 anos', scoreModifier: 25 },
    ],
    helpText: 'Casos recentes têm mais urgência e melhor preservação de evidências',
  },
  {
    id: 'has-deadline',
    text: 'Existe prazo judicial ou administrativo?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'urgent', label: 'Sim, prazo urgente (até 15 dias)', scoreModifier: 50 },
      { value: 'short', label: 'Sim, prazo curto (15-30 dias)', scoreModifier: 45 },
      { value: 'moderate', label: 'Sim, prazo moderado (1-3 meses)', scoreModifier: 35 },
      { value: 'long', label: 'Prazo longo (3+ meses)', scoreModifier: 25 },
      { value: 'none', label: 'Não há prazo definido', scoreModifier: 20 },
    ],
    helpText: 'Prazos judiciais determinam a urgência do trabalho pericial',
  },
  {
    id: 'consequences',
    text: 'Quais são as consequências se a falsificação for comprovada?',
    type: 'multi-choice',
    priority: 'optional',
    options: [
      { value: 'financial-loss', label: 'Perda financeira significativa', scoreModifier: 30 },
      { value: 'property-loss', label: 'Perda de propriedade/imóvel', scoreModifier: 40 },
      { value: 'criminal-charges', label: 'Processo criminal contra falsário', scoreModifier: 35 },
      { value: 'contract-nullity', label: 'Anulação de contrato', scoreModifier: 30 },
      { value: 'reputation', label: 'Dano à reputação', scoreModifier: 20 },
    ],
    helpText: 'As consequências ajudam a avaliar a importância do caso',
  },
]

const GRAFOTECNICA_RULES: ScoringRule[] = [
  {
    id: 'high-value-urgent-deadline',
    description: 'Alto valor com prazo urgente tem prioridade máxima',
    condition: (answers) =>
      answerIn(answers, 'document-value', ['high', 'very-high', 'extreme']) &&
      answerIn(answers, 'has-deadline', ['urgent', 'short']),
    impact: { urgency: 50, complexity: 35 },
  },
  {
    id: 'strong-evidence-samples',
    description: 'Evidências fortes com amostras abundantes aumentam probabilidade',
    condition: (answers) =>
      answerIn(answers, 'forgery-evidence', ['strong-visual', 'denial']) &&
      answerIn(answers, 'authentic-samples', ['many', 'some']),
    impact: { probability: 45 },
  },
  {
    id: 'criminal-context-priority',
    description: 'Contexto criminal aumenta urgência e complexidade',
    condition: (answers) =>
      answerEquals(answers, 'legal-context', 'criminal'),
    impact: { urgency: 45, complexity: 40 },
  },
  {
    id: 'critical-documents',
    description: 'Documentos críticos (testamento, escritura) têm alta prioridade',
    condition: (answers) =>
      answerIn(answers, 'document-type', ['will', 'deed', 'promissory-note']),
    impact: { urgency: 40, complexity: 35 },
  },
  {
    id: 'many-samples-advantage',
    description: 'Muitas amostras autênticas facilitam a perícia',
    condition: (answers) =>
      answerEquals(answers, 'authentic-samples', 'many'),
    impact: { probability: 35, complexity: -10 },
  },
  {
    id: 'property-at-risk',
    description: 'Risco de perda patrimonial aumenta urgência',
    condition: (answers) =>
      answerContains(answers, 'consequences', 'property-loss'),
    impact: { urgency: 40 },
  },
]

/**
 * Avaliação de Imóveis Questions
 */
const AVALIACAO_IMOVEIS_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'purpose',
    text: 'Qual é a finalidade da avaliação do imóvel?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'judicial', label: 'Processo judicial (execução, partilha)', scoreModifier: 40 },
      { value: 'financing', label: 'Financiamento bancário', scoreModifier: 35 },
      { value: 'sale', label: 'Compra e venda', scoreModifier: 30 },
      { value: 'expropriation', label: 'Desapropriação', scoreModifier: 45 },
      { value: 'divorce', label: 'Divórcio/partilha de bens', scoreModifier: 40 },
      { value: 'inheritance', label: 'Inventário/herança', scoreModifier: 40 },
      { value: 'tax', label: 'Questões fiscais/tributárias', scoreModifier: 35 },
      { value: 'insurance', label: 'Seguro', scoreModifier: 30 },
    ],
    helpText: 'A finalidade determina o tipo e rigor da avaliação',
  },
  {
    id: 'property-type',
    text: 'Qual é o tipo de imóvel a ser avaliado?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'residential-house', label: 'Casa residencial', scoreModifier: 25 },
      { value: 'apartment', label: 'Apartamento', scoreModifier: 25 },
      { value: 'commercial', label: 'Imóvel comercial', scoreModifier: 35 },
      { value: 'land', label: 'Terreno urbano', scoreModifier: 30 },
      { value: 'rural', label: 'Propriedade rural', scoreModifier: 40 },
      { value: 'industrial', label: 'Imóvel industrial', scoreModifier: 40 },
      { value: 'special', label: 'Imóvel especial (hotel, hospital)', scoreModifier: 45 },
    ],
    helpText: 'O tipo de imóvel afeta a complexidade da avaliação',
  },
  {
    id: 'property-value-estimate',
    text: 'Qual é a estimativa de valor do imóvel?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'low', label: 'Até R$ 200.000', scoreModifier: 20 },
      { value: 'moderate', label: 'R$ 200.000 a R$ 500.000', scoreModifier: 30 },
      { value: 'high', label: 'R$ 500.000 a R$ 1.500.000', scoreModifier: 35 },
      { value: 'very-high', label: 'R$ 1.500.000 a R$ 5.000.000', scoreModifier: 40 },
      { value: 'extreme', label: 'Acima de R$ 5.000.000', scoreModifier: 45 },
    ],
    helpText: 'O valor estimado afeta a complexidade e responsabilidade',
  },
  {
    id: 'nbr-compliance',
    text: 'A avaliação precisa seguir a NBR 14653?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'yes-judicial', label: 'Sim, para fins judiciais (obrigatória)', scoreModifier: 40 },
      { value: 'yes-financing', label: 'Sim, exigida pelo banco', scoreModifier: 35 },
      { value: 'recommended', label: 'Recomendada mas não obrigatória', scoreModifier: 25 },
      { value: 'no', label: 'Não é necessária', scoreModifier: 20 },
    ],
    helpText: 'NBR 14653 é a norma técnica brasileira para avaliação de imóveis',
  },
  {
    id: 'complexity-factors',
    text: 'Quais fatores aumentam a complexidade da avaliação?',
    type: 'multi-choice',
    priority: 'optional',
    options: [
      { value: 'irregular-documentation', label: 'Documentação irregular', scoreModifier: 20 },
      { value: 'construction-issues', label: 'Problemas construtivos', scoreModifier: 15 },
      { value: 'location-issues', label: 'Localização atípica', scoreModifier: 15 },
      { value: 'market-scarcity', label: 'Poucos comparáveis no mercado', scoreModifier: 25 },
      { value: 'special-use', label: 'Uso especial ou específico', scoreModifier: 20 },
      { value: 'environmental', label: 'Questões ambientais', scoreModifier: 20 },
      { value: 'preservation', label: 'Imóvel tombado/preservação', scoreModifier: 25 },
    ],
    helpText: 'Fatores de complexidade afetam tempo e custo da avaliação',
  },
  {
    id: 'inspection-access',
    text: 'Qual é a situação de acesso para vistoria do imóvel?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'full-access', label: 'Acesso total disponível', scoreModifier: 30 },
      { value: 'limited', label: 'Acesso limitado ou agendado', scoreModifier: 25 },
      { value: 'difficult', label: 'Acesso difícil (ocupado, distante)', scoreModifier: 20 },
      { value: 'no-access', label: 'Sem acesso (avaliação externa)', scoreModifier: 15 },
    ],
    helpText: 'O acesso ao imóvel afeta a qualidade e tipo de avaliação possível',
  },
  {
    id: 'deadline-urgency',
    text: 'Qual é o prazo para entrega da avaliação?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'urgent', label: 'Urgente (até 7 dias)', scoreModifier: 50 },
      { value: 'short', label: 'Curto (7-15 dias)', scoreModifier: 40 },
      { value: 'moderate', label: 'Moderado (15-30 dias)', scoreModifier: 30 },
      { value: 'long', label: 'Confortável (30+ dias)', scoreModifier: 20 },
    ],
    helpText: 'O prazo determina a urgência e recursos necessários',
  },
  {
    id: 'dispute-involved',
    text: 'Existe disputa ou litígio envolvendo o imóvel?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'yes-active', label: 'Sim, litígio ativo', scoreModifier: 45 },
      { value: 'yes-potential', label: 'Sim, disputa potencial', scoreModifier: 35 },
      { value: 'no', label: 'Não há disputa', scoreModifier: 25 },
    ],
    helpText: 'Disputas aumentam a responsabilidade e cuidado necessários',
  },
]

const AVALIACAO_IMOVEIS_RULES: ScoringRule[] = [
  {
    id: 'judicial-nbr-required',
    description: 'Avaliações judiciais com NBR obrigatória têm alta complexidade',
    condition: (answers) =>
      answerIn(answers, 'purpose', ['judicial', 'expropriation']) &&
      answerEquals(answers, 'nbr-compliance', 'yes-judicial'),
    impact: { complexity: 40, urgency: 35 },
  },
  {
    id: 'high-value-dispute',
    description: 'Alto valor com litígio aumenta urgência e responsabilidade',
    condition: (answers) =>
      answerIn(answers, 'property-value-estimate', ['very-high', 'extreme']) &&
      answerEquals(answers, 'dispute-involved', 'yes-active'),
    impact: { urgency: 45, complexity: 40 },
  },
  {
    id: 'complex-property-types',
    description: 'Imóveis especiais/industriais/rurais têm maior complexidade',
    condition: (answers) =>
      answerIn(answers, 'property-type', ['rural', 'industrial', 'special']),
    impact: { complexity: 40, probability: 30 },
  },
  {
    id: 'market-scarcity-challenge',
    description: 'Poucos comparáveis aumentam complexidade técnica',
    condition: (answers) =>
      answerContains(answers, 'complexity-factors', 'market-scarcity'),
    impact: { complexity: 30 },
  },
  {
    id: 'urgent-deadline-boost',
    description: 'Prazos urgentes recebem prioridade máxima',
    condition: (answers) =>
      answerIn(answers, 'deadline-urgency', ['urgent', 'short']),
    impact: { urgency: 50 },
  },
  {
    id: 'full-access-advantage',
    description: 'Acesso total ao imóvel facilita avaliação precisa',
    condition: (answers) =>
      answerEquals(answers, 'inspection-access', 'full-access'),
    impact: { probability: 35, complexity: -10 },
  },
  {
    id: 'expropriation-priority',
    description: 'Desapropriações têm máxima urgência legal',
    condition: (answers) =>
      answerEquals(answers, 'purpose', 'expropriation'),
    impact: { urgency: 45, complexity: 40 },
  },
]

/**
 * Perícia Médica Questions
 */
const PERICIA_MEDICA_QUESTIONS: QualificationQuestion[] = [
  {
    id: 'purpose',
    text: 'Qual é a finalidade da perícia médica?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'disability', label: 'Comprovação de incapacidade (INSS)', scoreModifier: 40 },
      { value: 'work-accident', label: 'Acidente de trabalho', scoreModifier: 40 },
      { value: 'medical-malpractice', label: 'Erro médico', scoreModifier: 45 },
      { value: 'personal-injury', label: 'Lesão corporal (processo criminal)', scoreModifier: 45 },
      { value: 'insurance', label: 'Seguro (invalidez, morte)', scoreModifier: 35 },
      { value: 'civil-damages', label: 'Danos morais/corporais (processo civil)', scoreModifier: 40 },
      { value: 'revision', label: 'Revisão de perícia anterior', scoreModifier: 35 },
    ],
    helpText: 'A finalidade determina o tipo e profundidade da perícia',
  },
  {
    id: 'condition-type',
    text: 'Qual é o tipo de condição médica a ser avaliada?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'orthopedic', label: 'Ortopédica (fraturas, lesões musculares)', scoreModifier: 30 },
      { value: 'neurological', label: 'Neurológica', scoreModifier: 40 },
      { value: 'psychiatric', label: 'Psiquiátrica/psicológica', scoreModifier: 40 },
      { value: 'multiple', label: 'Múltiplas lesões/condições', scoreModifier: 45 },
      { value: 'chronic', label: 'Doença crônica', scoreModifier: 35 },
      { value: 'occupational', label: 'Doença ocupacional', scoreModifier: 40 },
      { value: 'permanent', label: 'Incapacidade permanente', scoreModifier: 45 },
    ],
    helpText: 'O tipo de condição afeta a especialidade médica necessária',
  },
  {
    id: 'severity',
    text: 'Qual é a gravidade da condição?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'severe', label: 'Grave (risco de vida, sequelas permanentes)', scoreModifier: 50 },
      { value: 'moderate-severe', label: 'Moderada a grave', scoreModifier: 40 },
      { value: 'moderate', label: 'Moderada', scoreModifier: 30 },
      { value: 'mild', label: 'Leve', scoreModifier: 20 },
    ],
    helpText: 'A gravidade afeta urgência e valor do caso',
  },
  {
    id: 'medical-documentation',
    text: 'Qual documentação médica está disponível?',
    type: 'multi-choice',
    priority: 'required',
    options: [
      { value: 'exams', label: 'Exames (raio-x, ressonância, etc.)', scoreModifier: 20 },
      { value: 'medical-records', label: 'Prontuários médicos', scoreModifier: 20 },
      { value: 'hospital-records', label: 'Relatórios de internação', scoreModifier: 15 },
      { value: 'prescriptions', label: 'Receitas e prescrições', scoreModifier: 10 },
      { value: 'previous-expertise', label: 'Perícias anteriores', scoreModifier: 15 },
      { value: 'witness-statements', label: 'Declarações de testemunhas', scoreModifier: 10 },
    ],
    helpText: 'Documentação completa facilita a perícia',
  },
  {
    id: 'time-since-event',
    text: 'Há quanto tempo ocorreu o evento/início da condição?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'recent', label: 'Recente (até 3 meses)', scoreModifier: 40 },
      { value: 'moderate', label: '3 meses a 1 ano', scoreModifier: 35 },
      { value: 'old', label: '1 a 3 anos', scoreModifier: 30 },
      { value: 'very-old', label: 'Mais de 3 anos', scoreModifier: 25 },
      { value: 'ongoing', label: 'Condição em andamento/progressiva', scoreModifier: 35 },
    ],
    helpText: 'O tempo afeta disponibilidade de evidências e nexo causal',
  },
  {
    id: 'legal-stage',
    text: 'Em que fase está o processo legal?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'pre-litigation', label: 'Pré-processual (preparação)', scoreModifier: 30 },
      { value: 'active', label: 'Processo ativo', scoreModifier: 40 },
      { value: 'appeal', label: 'Fase de recurso', scoreModifier: 35 },
      { value: 'administrative', label: 'Recurso administrativo (INSS)', scoreModifier: 40 },
      { value: 'counter-expertise', label: 'Contraprova de perícia oficial', scoreModifier: 45 },
    ],
    helpText: 'A fase processual determina prazos e tipo de perícia',
  },
  {
    id: 'financial-impact',
    text: 'Qual é o impacto financeiro esperado?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'low', label: 'Baixo (até R$ 20.000)', scoreModifier: 20 },
      { value: 'moderate', label: 'Moderado (R$ 20.000 a R$ 100.000)', scoreModifier: 30 },
      { value: 'high', label: 'Alto (R$ 100.000 a R$ 500.000)', scoreModifier: 40 },
      { value: 'very-high', label: 'Muito alto (acima de R$ 500.000)', scoreModifier: 45 },
      { value: 'pension', label: 'Benefício previdenciário vitalício', scoreModifier: 50 },
    ],
    helpText: 'O valor envolvido afeta a importância do caso',
  },
  {
    id: 'urgency',
    text: 'Qual é a urgência para conclusão da perícia?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'urgent', label: 'Urgente (prazo judicial até 15 dias)', scoreModifier: 50 },
      { value: 'high', label: 'Alta (15-30 dias)', scoreModifier: 40 },
      { value: 'moderate', label: 'Moderada (30-60 dias)', scoreModifier: 30 },
      { value: 'low', label: 'Baixa (60+ dias)', scoreModifier: 20 },
    ],
    helpText: 'Prazos judiciais são rígidos e devem ser respeitados',
  },
  {
    id: 'patient-cooperation',
    text: 'Qual é o nível de cooperação do paciente/periciando?',
    type: 'single-choice',
    priority: 'required',
    options: [
      { value: 'full', label: 'Cooperação total', scoreModifier: 35 },
      { value: 'partial', label: 'Cooperação parcial', scoreModifier: 25 },
      { value: 'reluctant', label: 'Relutante ou evasivo', scoreModifier: 15 },
      { value: 'hostile', label: 'Hostil ou não cooperativo', scoreModifier: 10 },
      { value: 'unable', label: 'Incapaz de cooperar (estado grave)', scoreModifier: 20 },
    ],
    helpText: 'A cooperação afeta a qualidade da perícia',
  },
]

const PERICIA_MEDICA_RULES: ScoringRule[] = [
  {
    id: 'severe-permanent-high-value',
    description: 'Casos graves permanentes com alto valor têm máxima prioridade',
    condition: (answers) =>
      answerEquals(answers, 'severity', 'severe') &&
      answerIn(answers, 'condition-type', ['permanent', 'neurological', 'multiple']) &&
      answerIn(answers, 'financial-impact', ['very-high', 'pension']),
    impact: { urgency: 50, complexity: 45, probability: 40 },
  },
  {
    id: 'medical-malpractice-complex',
    description: 'Erro médico tem alta complexidade e responsabilidade',
    condition: (answers) =>
      answerEquals(answers, 'purpose', 'medical-malpractice'),
    impact: { complexity: 45, urgency: 40 },
  },
  {
    id: 'counter-expertise-urgent',
    description: 'Contraprova de perícia oficial é urgente',
    condition: (answers) =>
      answerEquals(answers, 'legal-stage', 'counter-expertise'),
    impact: { urgency: 50, complexity: 35 },
  },
  {
    id: 'complete-documentation-advantage',
    description: 'Documentação completa aumenta probabilidade de sucesso',
    condition: (answers) =>
      answerContains(answers, 'medical-documentation', 'exams') &&
      answerContains(answers, 'medical-documentation', 'medical-records'),
    impact: { probability: 40 },
  },
  {
    id: 'recent-event-better-evidence',
    description: 'Eventos recentes têm melhor preservação de evidências',
    condition: (answers) =>
      answerEquals(answers, 'time-since-event', 'recent'),
    impact: { probability: 35 },
  },
  {
    id: 'urgent-judicial-deadline',
    description: 'Prazos judiciais urgentes têm prioridade máxima',
    condition: (answers) =>
      answerEquals(answers, 'urgency', 'urgent'),
    impact: { urgency: 50 },
  },
  {
    id: 'work-accident-priority',
    description: 'Acidentes de trabalho têm urgência e complexidade moderada-alta',
    condition: (answers) =>
      answerIn(answers, 'purpose', ['work-accident', 'disability']) &&
      answerEquals(answers, 'legal-stage', 'administrative'),
    impact: { urgency: 40, probability: 35 },
  },
  {
    id: 'cooperative-patient-advantage',
    description: 'Paciente cooperativo facilita perícia completa',
    condition: (answers) =>
      answerEquals(answers, 'patient-cooperation', 'full'),
    impact: { probability: 30, complexity: -10 },
  },
  {
    id: 'psychiatric-complex',
    description: 'Condições psiquiátricas têm alta complexidade avaliativa',
    condition: (answers) =>
      answerEquals(answers, 'condition-type', 'psychiatric'),
    impact: { complexity: 40 },
  },
]

/**
 * Exported Questions and Rules
 */

// Export individual question sets
export { GRAFOTECNICA_QUESTIONS, GRAFOTECNICA_RULES }
export { AVALIACAO_IMOVEIS_QUESTIONS, AVALIACAO_IMOVEIS_RULES }
export { PERICIA_MEDICA_QUESTIONS, PERICIA_MEDICA_RULES }

// Export combined objects
export const EXPERTISE_QUESTIONS = {
  'grafotecnica': GRAFOTECNICA_QUESTIONS,
  'avaliacao-imoveis': AVALIACAO_IMOVEIS_QUESTIONS,
  'pericia-medica': PERICIA_MEDICA_QUESTIONS,
}

export const EXPERTISE_RULES = {
  'grafotecnica': GRAFOTECNICA_RULES,
  'avaliacao-imoveis': AVALIACAO_IMOVEIS_RULES,
  'pericia-medica': PERICIA_MEDICA_RULES,
}
