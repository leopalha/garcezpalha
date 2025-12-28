/**
 * Adapter para converter produtos do catalog.ts para o formato de checkout
 * Isso mantém a compatibilidade com o sistema de checkout existente
 */

import { ALL_PRODUCTS } from './catalog'
import type { Product, ProductPackage } from './types'
import type { Solution, SolutionVariant } from '@/types/checkout'

/**
 * Converte um ProductPackage para SolutionVariant
 */
function packageToVariant(pkg: ProductPackage): SolutionVariant {
  return {
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    price: pkg.price * 100, // Converter para centavos
    features: pkg.features,
    estimatedDelivery: pkg.timeline,
  }
}

/**
 * Converte um Product para Solution (formato do checkout)
 */
function productToSolution(product: Product): Solution {
  const hasVariants = Boolean(product.packages && product.packages.length > 0)

  return {
    id: product.slug, // Usar slug como ID para URLs amigáveis
    name: product.name,
    description: product.description,
    price: (product.price.basic || 0) * 100, // Preço base em centavos
    category: product.category as any, // Categories são compatíveis
    icon: 'FileText', // Icon padrão, pode ser mapeado depois
    features: product.features || [],
    estimatedDelivery: product.timeline,
    isProductized: true,
    variants: hasVariants ? product.packages?.map(packageToVariant) : undefined,
    hasVariants,
  }
}

/**
 * Retorna todas as soluções disponíveis a partir do catalog.ts
 */
export function getAllSolutions(): Solution[] {
  return ALL_PRODUCTS.filter(p => p.isActive).map(productToSolution)
}

/**
 * Busca uma solução específica por ID/slug
 */
export function getSolutionById(id: string): Solution | null {
  const product = ALL_PRODUCTS.find(p => p.slug === id || p.id === id)
  return product ? productToSolution(product) : null
}

/**
 * Retorna o preço de uma solução (com variante se fornecida)
 */
export function getSolutionPrice(solutionId: string, variantId?: string): number {
  const solution = getSolutionById(solutionId)
  if (!solution) return 0

  if (variantId && solution.variants) {
    const variant = solution.variants.find(v => v.id === variantId)
    return variant?.price || solution.price
  }

  return solution.price
}

/**
 * Retorna o nome completo da solução (incluindo variante se houver)
 */
export function getSolutionFullName(solutionId: string, variantId?: string): string {
  const solution = getSolutionById(solutionId)
  if (!solution) return ''

  if (variantId && solution.variants) {
    const variant = solution.variants.find(v => v.id === variantId)
    return variant ? `${solution.name} - ${variant.name}` : solution.name
  }

  return solution.name
}

/**
 * Formata valor em centavos para moeda brasileira
 */
export function formatCurrency(valueInCents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInCents / 100)
}
