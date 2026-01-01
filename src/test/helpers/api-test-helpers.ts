/**
 * API Test Helpers
 * Utilities for testing API routes with Zod validation
 */

import { NextRequest } from 'next/server'

export function createMockRequest(body: any, options?: {
  method?: string
  headers?: Record<string, string>
}): NextRequest {
  const url = 'http://localhost:3000/api/test'

  return new NextRequest(url, {
    method: options?.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: JSON.stringify(body),
  })
}

export function createMockSupabase(overrides?: any) {
  return {
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: 'test-user-id', email: 'test@example.com' } },
        error: null,
      })),
      getSession: vi.fn(() => ({
        data: { session: { user: { id: 'test-user-id' } } },
        error: null,
      })),
      ...overrides?.auth,
    },
    from: vi.fn((table: string) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: 'test-id' },
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: 'test-id' },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: { id: 'test-id' },
          error: null,
        })),
      })),
      ...overrides?.from?.[table],
    })),
    ...overrides,
  }
}

export async function expectValidationError(
  response: Response,
  expectedField?: string
) {
  expect(response.status).toBe(400)
  const json = await response.json()
  expect(json.error).toBe('Validation failed')
  expect(json.details).toBeInstanceOf(Array)

  if (expectedField) {
    const fieldError = json.details.find((d: any) => d.field === expectedField)
    expect(fieldError).toBeDefined()
  }

  return json
}

export async function expectSuccess(response: Response, expectedStatus = 200) {
  expect(response.status).toBe(expectedStatus)
  const json = await response.json()
  return json
}

export async function expectUnauthorized(response: Response) {
  expect(response.status).toBe(401)
  const json = await response.json()
  expect(json.error).toBe('Unauthorized')
  return json
}

// Mock vi globally for helpers
import { vi } from 'vitest'
