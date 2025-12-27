/**
 * Product Categories Configuration
 * Defines all product categories with metadata
 */

import type { ProductCategory } from './types'

export interface CategoryConfig {
  id: ProductCategory
  name: string
  description: string
  icon: string
  color: string
  agentRole?: string // Mapeamento para agent especializado
}

export const PRODUCT_CATEGORIES: CategoryConfig[] = [
  {
    id: 'bancario',
    name: 'Bancário/Financeiro',
    description: 'Seguro prestamista, revisão contratual, fraudes, portabilidade',
    icon: '🏦',
    color: 'blue',
    agentRole: 'financial-protection',
  },
  {
    id: 'telecom',
    name: 'Telecomunicações',
    description: 'Cobranças indevidas, multas, portabilidade de número',
    icon: '📱',
    color: 'purple',
  },
  {
    id: 'energia',
    name: 'Energia Elétrica',
    description: 'Consumo estimado, débitos prescritos, corte indevido',
    icon: '⚡',
    color: 'yellow',
  },
  {
    id: 'consumidor',
    name: 'Direito do Consumidor',
    description: 'Produtos com vício, atraso entrega, distrato imobiliário',
    icon: '🛒',
    color: 'green',
  },
  {
    id: 'digital',
    name: 'Consumidor Digital',
    description: 'Assinaturas, marketplace, perfis hackeados, LGPD',
    icon: '💻',
    color: 'cyan',
  },
  {
    id: 'aereo',
    name: 'Direito Aéreo',
    description: 'Overbooking, voo cancelado, atraso, bagagem extraviada',
    icon: '✈️',
    color: 'sky',
  },
  {
    id: 'previdenciario',
    name: 'Previdenciário',
    description: 'Revisão aposentadoria, benefícios negados, auxílio-acidente',
    icon: '🏛️',
    color: 'indigo',
    agentRole: 'social-security',
  },
  {
    id: 'trabalhista',
    name: 'Trabalhista',
    description: 'Verbas rescisórias, horas extras (casos claros)',
    icon: '👷',
    color: 'orange',
  },
  {
    id: 'servidor',
    name: 'Servidor Público',
    description: 'Incorporação gratificação, diferenças salariais',
    icon: '🏢',
    color: 'slate',
  },
  {
    id: 'educacional',
    name: 'Educacional',
    description: 'FIES, renegociação dívida estudantil',
    icon: '📚',
    color: 'emerald',
  },
  {
    id: 'condominial',
    name: 'Condominial',
    description: 'Multas abusivas, rateios irregulares',
    icon: '🏘️',
    color: 'gray',
  },
  {
    id: 'saude',
    name: 'Plano de Saúde',
    description: 'Negativas, bariátrica, TEA, BPC/LOAS',
    icon: '🏥',
    color: 'red',
    agentRole: 'health-insurance',
  },
  {
    id: 'imobiliario',
    name: 'Imobiliário',
    description: 'Usucapião, inventário, regularização, holding',
    icon: '🏠',
    color: 'amber',
    agentRole: 'real-estate',
  },
  {
    id: 'pericia',
    name: 'Perícias',
    description: 'Documental, grafotécnica, médica, avaliação',
    icon: '🔍',
    color: 'violet',
    agentRole: 'forensics',
  },
  {
    id: 'criminal',
    name: 'Criminal',
    description: 'Defesa criminal, habeas corpus, aeronáutico',
    icon: '⚖️',
    color: 'rose',
    agentRole: 'criminal',
  },
  {
    id: 'geral',
    name: 'Geral',
    description: 'Secretaria remota, automação',
    icon: '⚙️',
    color: 'zinc',
    agentRole: 'general',
  },
]

/**
 * Get category config by ID
 */
export function getCategoryById(id: ProductCategory): CategoryConfig | undefined {
  return PRODUCT_CATEGORIES.find(c => c.id === id)
}

/**
 * Get categories by agent role
 */
export function getCategoriesByAgent(agentRole: string): CategoryConfig[] {
  return PRODUCT_CATEGORIES.filter(c => c.agentRole === agentRole)
}

/**
 * Get all category IDs
 */
export function getAllCategoryIds(): ProductCategory[] {
  return PRODUCT_CATEGORIES.map(c => c.id)
}
