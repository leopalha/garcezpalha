/**
 * Agent to Product Mapping
 * Maps each specialized agent to the products/solutions they handle
 */

import type { AgentRole } from '../agents/types'
import type { AgentProductMapping } from './types'

/**
 * Complete mapping of agents to products
 */
export const AGENT_PRODUCT_MAPPINGS: AgentProductMapping[] = [
  // Financial Protection Agent
  {
    agentRole: 'financial-protection',
    productIds: [
      'desbloqueio-conta',        // Account unblocking
      'golpe-pix',                // PIX fraud
      'negativacao-indevida',     // Improper credit negativation
      'defesa-execucao',          // Execution defense
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

  // Social Security Agent
  {
    agentRole: 'social-security',
    productIds: [
      'bpc-loas',                 // BPC/LOAS benefit
      'aposentadoria-invalidez',  // Disability retirement
      'auxilio-doenca',           // Sickness benefit
      'aposentadoria',            // General retirement (INSS)
    ],
  },

  // Real Estate Agent
  {
    agentRole: 'real-estate',
    productIds: [
      'direito-imobiliario',      // Real estate law
      'usucapiao',                // Adverse possession
      'regularizacao-imovel',     // Property regularization
      'holding-familiar',         // Family holding
      'inventario',               // Inventory/Estate
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

  // General Agent (no specific products - handles general queries)
  {
    agentRole: 'general',
    productIds: [
      'secretaria-remota',        // Remote secretary (automation)
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
