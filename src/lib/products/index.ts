/**
 * Products Library - Main Export
 * Central export point for all product-related functionality
 */

export * from './types'
export * from './categories'
export * from './catalog'

// Re-export commonly used items
export { NEW_PRODUCTS as PRODUCTS, TOP_5_PRODUTOS } from './catalog'
export { PRODUCT_CATEGORIES } from './categories'
