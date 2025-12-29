/**
 * Centralized API Error Handler
 * Provides consistent error responses across all API routes
 */

import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

/**
 * Standard API Error Class
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Common API Error Types
 */
export const APIErrors = {
  // 400 Bad Request
  BadRequest: (message: string, details?: any) =>
    new APIError(message, 400, 'BAD_REQUEST', details),

  // 401 Unauthorized
  Unauthorized: (message: string = 'Não autorizado') =>
    new APIError(message, 401, 'UNAUTHORIZED'),

  // 403 Forbidden
  Forbidden: (message: string = 'Acesso negado') =>
    new APIError(message, 403, 'FORBIDDEN'),

  // 404 Not Found
  NotFound: (resource: string) =>
    new APIError(`${resource} não encontrado`, 404, 'NOT_FOUND'),

  // 409 Conflict
  Conflict: (message: string) =>
    new APIError(message, 409, 'CONFLICT'),

  // 422 Validation Error
  ValidationError: (message: string, details?: any) =>
    new APIError(message, 422, 'VALIDATION_ERROR', details),

  // 429 Rate Limit
  RateLimit: (message: string = 'Muitas requisições. Tente novamente mais tarde.') =>
    new APIError(message, 429, 'RATE_LIMIT'),

  // 500 Internal Server Error
  Internal: (message: string = 'Erro interno do servidor') =>
    new APIError(message, 500, 'INTERNAL_ERROR'),

  // 503 Service Unavailable
  ServiceUnavailable: (service: string) =>
    new APIError(`Serviço ${service} temporariamente indisponível`, 503, 'SERVICE_UNAVAILABLE'),
}

/**
 * Error Response Interface
 */
interface ErrorResponse {
  error: string
  code: string
  details?: any
  timestamp: string
}

/**
 * Central Error Handler
 * Handles all types of errors and returns consistent responses
 *
 * @param error - The error to handle
 * @param context - Optional context for logging
 * @returns NextResponse with appropriate error format
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   try {
 *     // ... route logic
 *   } catch (error) {
 *     return handleAPIError(error)
 *   }
 * }
 * ```
 */
export function handleAPIError(error: unknown, context?: string): NextResponse<ErrorResponse> {
  const timestamp = new Date().toISOString()

  // Log error (in production, send to monitoring service)
  if (context) {
    console.error(`[API Error - ${context}]`, error)
  } else {
    console.error('[API Error]', error)
  }

  // Zod Validation Errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Erro de validação',
        code: 'VALIDATION_ERROR',
        details: error.issues.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
        timestamp,
      },
      { status: 422 }
    )
  }

  // Custom API Errors
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code || 'API_ERROR',
        details: error.details,
        timestamp,
      },
      { status: error.statusCode }
    )
  }

  // Supabase/PostgreSQL Errors
  if (error && typeof error === 'object' && 'code' in error) {
    const dbError = error as any

    // Handle common database errors
    if (dbError.code === '23505') {
      // Unique violation
      return NextResponse.json(
        {
          error: 'Registro duplicado',
          code: 'DUPLICATE_ENTRY',
          timestamp,
        },
        { status: 409 }
      )
    }

    if (dbError.code === '23503') {
      // Foreign key violation
      return NextResponse.json(
        {
          error: 'Referência inválida',
          code: 'INVALID_REFERENCE',
          timestamp,
        },
        { status: 400 }
      )
    }

    if (dbError.code === 'PGRST116') {
      // No rows returned (Supabase)
      return NextResponse.json(
        {
          error: 'Recurso não encontrado',
          code: 'NOT_FOUND',
          timestamp,
        },
        { status: 404 }
      )
    }

    // Generic database error
    return NextResponse.json(
      {
        error: 'Erro no banco de dados',
        code: 'DATABASE_ERROR',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined,
        timestamp,
      },
      { status: 503 }
    )
  }

  // JavaScript/TypeScript Errors
  if (error instanceof Error) {
    // In production, don't expose internal error messages
    const message =
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Erro interno do servidor'

    return NextResponse.json(
      {
        error: message,
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp,
      },
      { status: 500 }
    )
  }

  // Unknown errors
  return NextResponse.json(
    {
      error: 'Erro desconhecido',
      code: 'UNKNOWN_ERROR',
      timestamp,
    },
    { status: 500 }
  )
}

/**
 * Success Response Helper
 * Provides consistent success responses
 *
 * @example
 * ```typescript
 * return successResponse({ user: createdUser }, 201)
 * ```
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse<T> {
  return NextResponse.json(data, { status })
}

/**
 * Async Error Wrapper
 * Wraps async route handlers to automatically catch and handle errors
 *
 * @example
 * ```typescript
 * export const POST = withErrorHandler(async (request: NextRequest) => {
 *   const data = await request.json()
 *   // ... logic
 *   return successResponse({ success: true })
 * })
 * ```
 */
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse<R>>,
  context?: string
): (...args: T) => Promise<NextResponse<R | ErrorResponse>> {
  return async (...args: T) => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleAPIError(error, context)
    }
  }
}
