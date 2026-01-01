/**
 * Vitest Setup File
 * Global test configuration and mocks
 */

import { vi } from 'vitest'
import 'vitest-axe/extend-expect'

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.NEXTAUTH_SECRET = 'test-secret-32-characters-minimum'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.OPENAI_API_KEY = 'sk-test-key'
process.env.RESEND_API_KEY = 're_test_key'
process.env.RESEND_FROM_EMAIL = 'test@garcezpalha.com'
process.env.WHATSAPP_API_TOKEN = 'test-whatsapp-token'
process.env.WHATSAPP_PHONE_NUMBER_ID = '123456789'
process.env.CRON_SECRET = 'test-cron-secret'
process.env.REDIS_URL = 'redis://localhost:6379'
process.env.PJE_API_URL = 'https://test-pje.tjrj.jus.br'
process.env.PJE_API_TOKEN = 'test-pje-token'

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  // Keep error for debugging
  error: console.error,
}

// Mock fetch globally
global.fetch = vi.fn()

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})
