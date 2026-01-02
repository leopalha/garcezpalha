import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number as Brazilian currency (BRL)
 */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return 'R$ 0,00'

  const numValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numValue)) return 'R$ 0,00'

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue)
}
