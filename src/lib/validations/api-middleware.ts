/**
 * API Validation Middleware
 * Wraps API handlers with automatic validation, sanitization, and error handling
 */

import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { sanitizeObject } from '@/lib/security/sanitize'

export interface ValidatedRequest<T = any> extends NextRequest {
  validatedData: T
}

export type ApiHandler<T = any> = (
  req: ValidatedRequest<T>
) => Promise<NextResponse> | NextResponse

/**
 * Validate and sanitize request body
 */
export function withValidation<T extends z.ZodTypeAny>(
  schema: T,
  handler: ApiHandler<z.infer<T>>,
  options: {
    sanitize?: boolean
    sanitizeMode?: 'text' | 'html'
  } = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Parse request body
      const body = await req.json().catch(() => ({}))

      // Sanitize input if enabled
      const input = options.sanitize
        ? sanitizeObject(body, options.sanitizeMode || 'text')
        : body

      // Validate with Zod
      const validatedData = schema.parse(input)

      // Attach validated data to request
      const validatedReq = req as ValidatedRequest<z.infer<T>>
      validatedReq.validatedData = validatedData

      // Call handler with validated request
      return await handler(validatedReq)
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Dados inválidos',
            details: error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        )
      }

      if (error instanceof SyntaxError) {
        return NextResponse.json(
          {
            success: false,
            error: 'JSON inválido',
          },
          { status: 400 }
        )
      }

      console.error('Validation middleware error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Erro interno do servidor',
        },
        { status: 500 }
      )
    }
  }
}

/**
 * Validate query parameters
 */
export function withQueryValidation<T extends z.ZodTypeAny>(
  schema: T,
  handler: ApiHandler<z.infer<T>>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Parse query parameters
      const { searchParams } = new URL(req.url)
      const query: Record<string, any> = {}

      searchParams.forEach((value, key) => {
        // Handle arrays (key[] syntax)
        if (key.endsWith('[]')) {
          const arrayKey = key.slice(0, -2)
          if (!query[arrayKey]) {
            query[arrayKey] = []
          }
          query[arrayKey].push(value)
        } else {
          query[key] = value
        }
      })

      // Validate with Zod
      const validatedData = schema.parse(query)

      // Attach validated data to request
      const validatedReq = req as ValidatedRequest<z.infer<T>>
      validatedReq.validatedData = validatedData

      // Call handler with validated request
      return await handler(validatedReq)
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Parâmetros inválidos',
            details: error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        )
      }

      console.error('Query validation middleware error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Erro interno do servidor',
        },
        { status: 500 }
      )
    }
  }
}

/**
 * Combine multiple middleware functions
 */
export function composeMiddleware(...middlewares: Array<(handler: any) => any>) {
  return (handler: any) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}
