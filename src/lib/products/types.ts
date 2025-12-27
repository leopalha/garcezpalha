/**
 * Product Type Definitions
 * Central type definitions for all product-related data structures
 */

export type ProductCategory =
  | 'bancario'
  | 'telecom'
  | 'energia'
  | 'consumidor'
  | 'digital'
  | 'aereo'
  | 'previdenciario'
  | 'trabalhista'
  | 'servidor'
  | 'educacional'
  | 'condominial'
  | 'saude'
  | 'imobiliario'
  | 'pericia'
  | 'criminal'
  | 'geral'

export interface ProductPrice {
  basic: number // Valor base
  complete?: number // Valor completo (se houver)
}

export interface Product {
  id: string // Código único (ex: FIN-010)
  name: string // Nome do produto
  slug: string // URL-friendly slug
  category: ProductCategory
  description: string
  price: ProductPrice
  successFee?: number // Taxa de êxito (0-1, ex: 0.30 = 30%)
  timeline: string // Prazo estimado
  documents: string[] // Documentos necessários
  keywords: string[] // Palavras-chave para SEO e busca
  priority: 1 | 2 | 3 | 4 | 5 // Prioridade (5 = máxima)
  automation: number // Nível de automação (0-100)
  demandPerMonth?: number // Demanda mensal estimada
  features?: string[] // Características/benefícios
  crossSell?: string[] // IDs de produtos relacionados
  isActive: boolean
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  bancario: 'Bancário/Financeiro',
  telecom: 'Telecomunicações',
  energia: 'Energia Elétrica',
  consumidor: 'Consumidor',
  digital: 'Digital',
  aereo: 'Aéreo',
  previdenciario: 'Previdenciário',
  trabalhista: 'Trabalhista',
  servidor: 'Servidor Público',
  educacional: 'Educacional',
  condominial: 'Condominial',
  saude: 'Saúde',
  imobiliario: 'Imobiliário',
  pericia: 'Perícia',
  criminal: 'Criminal',
  geral: 'Geral',
}
