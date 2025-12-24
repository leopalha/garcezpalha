import { z } from 'zod'

// Schema for environment variables
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // NextAuth
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),

  // Database - Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),

  // OpenAI
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_ORG_ID: z.string().optional(),
  OPENAI_ASSISTANT_ID: z.string().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // MercadoPago
  MERCADOPAGO_ACCESS_TOKEN: z.string().optional(),
  MERCADOPAGO_PUBLIC_KEY: z.string().optional(),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().optional(),

  // Resend (Email)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  EMAIL_REPLY_TO: z.string().email().optional(),

  // WhatsApp
  WHATSAPP_SESSION_DIR: z.string().optional(),
  WHATSAPP_PAIRING_CODE_ENABLED: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

// Validate environment variables
export function validateEnv(): {
  success: boolean
  env?: Env
  errors?: string[]
} {
  try {
    const env = envSchema.parse(process.env)
    return { success: true, env }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      )
      return { success: false, errors }
    }
    return { success: false, errors: ['Unknown validation error'] }
  }
}

// Check which services are configured
export function getConfiguredServices(): {
  auth: boolean
  database: boolean
  openai: boolean
  stripe: boolean
  mercadopago: boolean
  resend: boolean
  whatsapp: boolean
} {
  return {
    auth: Boolean(
      process.env.NEXTAUTH_URL &&
      process.env.NEXTAUTH_SECRET &&
      process.env.NEXTAUTH_SECRET !== 'your-nextauth-secret'
    ),
    database: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')
    ),
    openai: Boolean(
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY.startsWith('sk-')
    ),
    stripe: Boolean(
      process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_SECRET_KEY.startsWith('sk_')
    ),
    mercadopago: Boolean(
      process.env.MERCADOPAGO_ACCESS_TOKEN &&
      process.env.MERCADOPAGO_ACCESS_TOKEN.startsWith('APP_USR')
    ),
    resend: Boolean(
      process.env.RESEND_API_KEY &&
      process.env.RESEND_API_KEY.startsWith('re_')
    ),
    whatsapp: Boolean(process.env.WHATSAPP_SESSION_DIR),
  }
}

// Get missing required services for production
export function getMissingRequiredServices(): string[] {
  const services = getConfiguredServices()
  const missing: string[] = []

  if (!services.auth) missing.push('Authentication (NextAuth)')
  if (!services.database) missing.push('Database (Supabase)')

  return missing
}

// Get optional but recommended services
export function getMissingOptionalServices(): string[] {
  const services = getConfiguredServices()
  const missing: string[] = []

  if (!services.openai) missing.push('AI Chatbot (OpenAI)')
  if (!services.stripe) missing.push('Stripe Payments')
  if (!services.mercadopago) missing.push('MercadoPago PIX')
  if (!services.resend) missing.push('Email Service (Resend)')
  if (!services.whatsapp) missing.push('WhatsApp Integration')

  return missing
}

// Check if running in production mode with demo credentials
export function isUsingDemoCredentials(): boolean {
  const demoPatterns = [
    'your-',
    'placeholder',
    'example',
    'test-key',
    'demo-',
  ]

  const envVars = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.OPENAI_API_KEY,
    process.env.STRIPE_SECRET_KEY,
    process.env.MERCADOPAGO_ACCESS_TOKEN,
    process.env.RESEND_API_KEY,
  ]

  return envVars.some((value) =>
    value && demoPatterns.some((pattern) => value.toLowerCase().includes(pattern))
  )
}

// Log configuration status on startup
export function logConfigStatus(): void {
  const services = getConfiguredServices()
  const missingRequired = getMissingRequiredServices()
  const missingOptional = getMissingOptionalServices()

  console.log('\n=== Environment Configuration Status ===')
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log('\nServices:')

  Object.entries(services).forEach(([service, configured]) => {
    const status = configured ? '✅' : '❌'
    console.log(`  ${status} ${service}`)
  })

  if (missingRequired.length > 0) {
    console.warn('\n⚠️  Missing required services:')
    missingRequired.forEach((service) => console.warn(`  - ${service}`))
  }

  if (missingOptional.length > 0) {
    console.log('\n📝 Optional services not configured:')
    missingOptional.forEach((service) => console.log(`  - ${service}`))
  }

  if (isUsingDemoCredentials()) {
    console.warn('\n⚠️  WARNING: Demo/placeholder credentials detected!')
    console.warn('   Replace with production credentials before deploying.')
  }

  console.log('\n==========================================\n')
}
