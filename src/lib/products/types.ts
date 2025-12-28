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
  // Legacy categories
  | 'financeiro'
  | 'patrimonial'
  | 'aeronautico'
  | 'automacao'

export interface ProductPrice {
  basic: number // Valor base
  complete?: number // Valor completo (se houver)
}

/**
 * Pacote/Plano de um produto
 * Cada produto pode ter múltiplos pacotes (básico, completo, premium, etc)
 */
export interface ProductPackage {
  id: string // ID único do pacote (ex: 'criminal-defesa-flagrante')
  name: string // Nome do pacote (ex: 'Flagrante')
  description: string // Descrição curta
  price: number // Preço fixo
  priceLabel?: string // Label customizado (ex: 'A partir de', 'R$ 5.000+')
  features: string[] // Lista de features incluídas
  highlighted?: boolean // Se é o pacote recomendado
  icon?: string // Nome do ícone Lucide (ex: 'Shield', 'Phone')
  timeline?: string // Prazo específico deste pacote
  successFee?: number // Taxa de êxito específica
  ctaText?: string // Texto do botão customizado
}

export interface Product {
  id: string // Código único (ex: FIN-010)
  name: string // Nome do produto
  slug: string // URL-friendly slug
  category: ProductCategory
  description: string
  price: ProductPrice // Preço padrão (usado se não houver packages)
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
  packages?: ProductPackage[] // NOVO: Pacotes/Planos disponíveis
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
  // Legacy categories
  financeiro: 'Financeiro',
  patrimonial: 'Patrimonial',
  aeronautico: 'Aeronáutico',
  automacao: 'Automação',
}
