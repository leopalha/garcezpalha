/**
 * Lead Qualification System
 * Complete system for qualifying leads through questions and scoring
 */

// Types
export type {
  QuestionType,
  QuestionPriority,
  QualificationQuestion,
  QuestionAnswer,
  LeadScore,
  LeadCategory,
  QualificationResult,
  RecommendedAction,
  AgentProductMapping,
  ProductQualificationConfig,
  ScoringRule,
  QualificationContext,
} from './types'

// Agent-Product Mapping
export {
  AGENT_PRODUCT_MAPPINGS,
  getProductsForAgent,
  getAgentForProduct,
  doesAgentHandleProduct,
  getAllMappedProducts,
  getProductsByCategory,
} from './agent-product-mapping'

// Score Calculator
export {
  calculateLeadScore,
  categorizeScore,
  getAnswerValue,
  answerEquals,
  answerIn,
  answerInRange,
  answerGreaterThan,
  answerContains,
  countAnsweredQuestions,
  areRequiredQuestionsAnswered,
  calculateCompletionPercentage,
  getScoreInterpretation,
  estimateCaseValue,
} from './score-calculator'

// Financial Protection Questions
export {
  ACCOUNT_UNBLOCKING_QUESTIONS,
  ACCOUNT_UNBLOCKING_RULES,
  PIX_FRAUD_QUESTIONS,
  PIX_FRAUD_RULES,
  CREDIT_NEGATIVATION_QUESTIONS,
  CREDIT_NEGATIVATION_RULES,
} from './questions/financial-protection-questions'

// Patrimonial Questions
export {
  USUCAPIAO_QUESTIONS,
  USUCAPIAO_RULES,
  HOLDING_FAMILIAR_QUESTIONS,
  HOLDING_FAMILIAR_RULES,
  INVENTARIO_QUESTIONS,
  INVENTARIO_RULES,
  REGULARIZACAO_IMOVEL_QUESTIONS,
  REGULARIZACAO_IMOVEL_RULES,
} from './questions/patrimonial-questions'

// Health Insurance Questions
export {
  PLANO_SAUDE_QUESTIONS,
  PLANO_SAUDE_RULES,
  BARIATRICA_QUESTIONS,
  BARIATRICA_RULES,
  TEA_QUESTIONS,
  TEA_RULES,
  HEALTH_INSURANCE_QUESTIONS,
  HEALTH_INSURANCE_RULES,
} from './questions/health-insurance-questions'

// Social Security Questions
export {
  BPC_LOAS_QUESTIONS,
  BPC_LOAS_RULES,
  APOSENTADORIA_INVALIDEZ_QUESTIONS,
  APOSENTADORIA_INVALIDEZ_RULES,
  AUXILIO_DOENCA_QUESTIONS,
  AUXILIO_DOENCA_RULES,
  SOCIAL_SECURITY_QUESTIONS,
  SOCIAL_SECURITY_RULES,
} from './questions/social-security-questions'

// Criminal Questions
export {
  DEFESA_CRIMINAL_QUESTIONS,
  DEFESA_CRIMINAL_RULES,
  HABEAS_CORPUS_QUESTIONS,
  HABEAS_CORPUS_RULES,
  CRIMINAL_QUESTIONS,
  CRIMINAL_RULES,
} from './questions/criminal-questions'

// Expertise Questions
export {
  GRAFOTECNICA_QUESTIONS,
  GRAFOTECNICA_RULES,
  AVALIACAO_IMOVEIS_QUESTIONS,
  AVALIACAO_IMOVEIS_RULES,
  PERICIA_MEDICA_QUESTIONS,
  PERICIA_MEDICA_RULES,
  EXPERTISE_QUESTIONS,
  EXPERTISE_RULES,
} from './questions/expertise-questions'

// Question Engine
export {
  QuestionEngine,
  createQuestionEngineForProduct,
  resumeQualificationSession,
} from './question-engine'

// Lead Qualifier
export {
  LeadQualifier,
  createLeadQualifier,
  resumeLeadQualification,
} from './lead-qualifier'

// Payment Link Generator
export type {
  PaymentProvider,
  PaymentMethod,
  PaymentLinkConfig,
  PaymentLink,
} from './payment-link-generator'
export {
  generatePaymentLink,
  getRecommendedPaymentConfig,
  formatPaymentLinkForWhatsApp,
  formatPaymentLinkForEmail,
} from './payment-link-generator'

// WhatsApp Templates
export type {
  WhatsAppTemplate,
  FollowUpSequence,
} from './whatsapp-templates'
export {
  FOLLOW_UP_SEQUENCES,
  generateInitialContactMessage,
  generateProposalMessage,
  generateDocumentRequestMessage,
  generatePaymentConfirmationMessage,
  getFollowUpSequence,
  generateAbandonedCartMessage,
  generateConsultationConfirmationMessage,
  generateCaseUpdateMessage,
} from './whatsapp-templates'

// Follow-up Scheduler
export type {
  FollowUpStatus,
  FollowUpMessage,
  FollowUpScheduleConfig,
} from './follow-up-scheduler'
export {
  FollowUpScheduler,
  getFollowUpScheduler,
  scheduleQualificationFollowUp,
  processScheduledFollowUps,
  handleLeadConversion,
  handleLeadResponse,
} from './follow-up-scheduler'

// Proposal Generator
export type {
  ProposalSection,
  Proposal,
} from './proposal-generator'
export {
  generateProposal,
  formatProposalForWhatsApp,
  formatProposalAsHTML,
  formatProposalForPDF,
} from './proposal-generator'
