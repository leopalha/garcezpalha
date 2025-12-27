/**
 * Agent to Product Mapping
 * Maps each specialized agent to the products/solutions they handle
 */

import type { AgentRole } from '../agents/types'
import type { AgentProductMapping } from './types'

/**
 * Complete mapping of agents to products
 * UPDATED: 27/12/2025 - Added 22 new products
 */
export const AGENT_PRODUCT_MAPPINGS: AgentProductMapping[] = [
  // Financial Protection Agent (11 products total)
  {
    agentRole: 'financial-protection',
    productIds: [
      // Existing (4)
      'desbloqueio-conta',        // Account unblocking
      'golpe-pix',                // PIX fraud
      'negativacao-indevida',     // Improper credit negativation
      'defesa-execucao',          // Execution defense

      // NEW: Bancário/Financeiro (4)
      'seguro-prestamista',       // Insurance tied sale (NEW)
      'revisao-contrato-bancario', // Banking contract review (NEW)
      'portabilidade-credito',    // Credit portability denied (NEW)
      'fraude-consignado',        // Consigned loan fraud (NEW)

      // NEW: Consumidor/Digital (3)
      'assinaturas-digitais',     // Digital subscriptions (NEW)
      'produto-vicio',            // Product with defect (NEW)
      'atraso-entrega',           // Delivery delay (NEW)
    ],
  },

  // Health Insurance Agent
  {
    agentRole: 'health-insurance',
    productIds: [
      'plano-saude',              // Health insurance denial
      'bariatrica',               // Bariatric surgery
      'tratamento-tea',           // TEA/Autism treatment
    ],
  },

  // Social Security Agent (7 products total)
  {
    agentRole: 'social-security',
    productIds: [
      // Existing (4)
      'bpc-loas',                 // BPC/LOAS benefit
      'aposentadoria-invalidez',  // Disability retirement
      'auxilio-doenca',           // Sickness benefit
      'aposentadoria',            // General retirement (INSS)

      // NEW: Previdenciário (3)
      'revisao-aposentadoria',    // Retirement review (NEW)
      'beneficio-negado',         // Benefit denied/cut (NEW)
      'auxilio-acidente',         // Accident benefit (NEW)
    ],
  },

  // Real Estate Agent (6 products total)
  {
    agentRole: 'real-estate',
    productIds: [
      // Existing (5)
      'direito-imobiliario',      // Real estate law
      'usucapiao',                // Adverse possession
      'regularizacao-imovel',     // Property regularization
      'holding-familiar',         // Family holding
      'inventario',               // Inventory/Estate

      // NEW: Consumidor (1)
      'distrato-imobiliario',     // Real estate withdrawal (NEW)
    ],
  },

  // Property Valuation Agent
  {
    agentRole: 'valuation',
    productIds: [
      'avaliacao-imoveis',        // Property valuation
    ],
  },

  // Document Forensics Agent
  {
    agentRole: 'forensics',
    productIds: [
      'pericia-documental',       // Document forensics
      'grafotecnica',             // Signature analysis (graphotechnical expertise)
      'laudo-tecnico',            // Technical report
    ],
  },

  // Medical Expertise Agent (work-related)
  {
    agentRole: 'medical',
    productIds: [
      'pericia-medica',           // Medical expertise (work accidents, medical errors, disability)
    ],
  },

  // Criminal Law Agent
  {
    agentRole: 'criminal',
    productIds: [
      'defesa-criminal',          // Criminal defense
      'habeas-corpus',            // Habeas corpus
      'direito-criminal',         // General criminal law
      'direito-aeronautico',      // Aviation law (includes criminal aspects)
    ],
  },

  // General Agent (handles general queries + misc products)
  {
    agentRole: 'general',
    productIds: [
      // Existing (1)
      'secretaria-remota',        // Remote secretary (automation)

      // NEW: Telecomunicações (3)
      'cobranca-telefonia',       // Telecom billing (NEW)
      'multa-fidelidade',         // Loyalty fee (NEW)
      'portabilidade-numero',     // Number portability (NEW)

      // NEW: Energia (1)
      'cobranca-energia',         // Energy billing (NEW)

      // NEW: Aéreo (1)
      'overbooking-voo',          // Overbooking/flight (NEW)

      // NEW: Trabalhista (2)
      'verbas-rescisoria',        // Severance pay (NEW)
      'horas-extras',             // Overtime (NEW)

      // NEW: Servidor Público (2)
      'incorporacao-gratificacao', // Bonus incorporation (NEW)
      'diferencas-salariais',     // Salary differences (NEW)

      // NEW: Educacional (1)
      'fies-renegociacao',        // FIES renegotiation (NEW)

      // NEW: Condominial (1)
      'cobranca-condominial',     // Condo billing (NEW)
    ],
  },
]

/**
 * Get products for a specific agent
 */
export function getProductsForAgent(agentRole: AgentRole): string[] {
  const mapping = AGENT_PRODUCT_MAPPINGS.find(m => m.agentRole === agentRole)
  return mapping?.productIds || []
}

/**
 * Get agent responsible for a product
 */
export function getAgentForProduct(productId: string): AgentRole | null {
  const mapping = AGENT_PRODUCT_MAPPINGS.find(m =>
    m.productIds.includes(productId)
  )
  return mapping?.agentRole || null
}

/**
 * Check if an agent handles a specific product
 */
export function doesAgentHandleProduct(agentRole: AgentRole, productId: string): boolean {
  const products = getProductsForAgent(agentRole)
  return products.includes(productId)
}

/**
 * Get all mapped product IDs
 */
export function getAllMappedProducts(): string[] {
  return AGENT_PRODUCT_MAPPINGS.flatMap(m => m.productIds)
}

/**
 * Get products by category (based on agent specialization)
 */
export function getProductsByCategory(): Record<string, string[]> {
  return {
    'financial-protection': getProductsForAgent('financial-protection'),
    'health-insurance': getProductsForAgent('health-insurance'),
    'social-security': getProductsForAgent('social-security'),
    'real-estate': getProductsForAgent('real-estate'),
    'valuation': getProductsForAgent('valuation'),
    'forensics': getProductsForAgent('forensics'),
    'medical': getProductsForAgent('medical'),
    'criminal': getProductsForAgent('criminal'),
    'general': getProductsForAgent('general'),
  }
}
