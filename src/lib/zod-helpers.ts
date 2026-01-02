import { ZodError } from 'zod'

/**
 * Format Zod errors to a user-friendly message
 */
export function formatZodErrors(error: ZodError) {
  return error.issues.map((err: any) => ({
    path: err.path.join('.'),
    message: err.message
  }))
}

/**
 * Get first Zod error message
 */
export function getFirstZodError(error: ZodError): string {
  return error.issues[0]?.message || 'Validation failed'
}
