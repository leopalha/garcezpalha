/**
 * Environment Variables Validator
 * Ensures all required environment variables are properly configured
 */

export interface EnvConfig {
  /** Variable name */
  name: string
  /** Whether this variable is required */
  required: boolean
  /** Default value if not set (only for optional variables) */
  defaultValue?: string
  /** Description of what this variable is for */
  description?: string
  /** Validation function */
  validate?: (value: string) => boolean
  /** Example value */
  example?: string
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  missing: string[]
}

/**
 * Validate environment variables
 */
export function validateEnv(configs: EnvConfig[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const missing: string[] = []

  for (const config of configs) {
    const value = process.env[config.name]

    // Check if required variable is missing
    if (config.required && !value) {
      missing.push(config.name)
      errors.push(
        `Missing required environment variable: ${config.name}${
          config.description ? ` (${config.description})` : ''
        }`
      )
      continue
    }

    // Check optional variable
    if (!config.required && !value) {
      if (config.defaultValue) {
        warnings.push(
          `Using default value for ${config.name}: ${config.defaultValue}`
        )
      }
      continue
    }

    // Validate value if validator provided
    if (value && config.validate && !config.validate(value)) {
      errors.push(
        `Invalid value for ${config.name}${
          config.example ? `. Example: ${config.example}` : ''
        }`
      )
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    missing,
  }
}

/**
 * Get environment variable with fallback
 */
export function getEnv(name: string, defaultValue?: string): string {
  return process.env[name] || defaultValue || ''
}

/**
 * Get required environment variable (throws if not set)
 */
export function getRequiredEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Please set it in your .env file.`
    )
  }

  return value
}

/**
 * Check if environment variable is set
 */
export function hasEnv(name: string): boolean {
  return !!process.env[name]
}

/**
 * Predefined environment configurations for Garcez Palha
 */
export const garcezPalhaEnvConfigs: EnvConfig[] = [
  // Database
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL',
    example: 'https://xxxxx.supabase.co',
    validate: (v) => v.startsWith('https://') && v.includes('supabase.co'),
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key',
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    required: true,
    description: 'Supabase service role key (server-side only)',
  },

  // Authentication
  {
    name: 'NEXTAUTH_URL',
    required: true,
    description: 'Base URL for NextAuth',
    example: 'http://localhost:3000',
  },
  {
    name: 'NEXTAUTH_SECRET',
    required: true,
    description: 'Secret for NextAuth session encryption',
  },

  // AI APIs
  {
    name: 'OPENAI_API_KEY',
    required: true,
    description: 'OpenAI API key for GPT models',
    validate: (v) => v.startsWith('sk-'),
  },
  {
    name: 'GROQ_API_KEY',
    required: false,
    description: 'Groq API key for Whisper transcription (fallback)',
  },

  // WhatsApp - Twilio
  {
    name: 'TWILIO_ACCOUNT_SID',
    required: false,
    description: 'Twilio account SID for WhatsApp',
    validate: (v) => v.startsWith('AC'),
  },
  {
    name: 'TWILIO_AUTH_TOKEN',
    required: false,
    description: 'Twilio auth token',
  },
  {
    name: 'TWILIO_WHATSAPP_NUMBER',
    required: false,
    description: 'Twilio WhatsApp number',
    example: 'whatsapp:+14155238886',
  },

  // WhatsApp - Cloud API
  {
    name: 'WHATSAPP_ACCESS_TOKEN',
    required: false,
    description: 'Meta WhatsApp Cloud API access token',
  },
  {
    name: 'WHATSAPP_PHONE_NUMBER_ID',
    required: false,
    description: 'WhatsApp phone number ID',
  },
  {
    name: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
    required: false,
    description: 'WhatsApp Business Account ID',
  },
  {
    name: 'WHATSAPP_VERIFY_TOKEN',
    required: false,
    description: 'Webhook verification token',
  },

  // Telegram
  {
    name: 'TELEGRAM_BOT_TOKEN',
    required: false,
    description: 'Telegram bot token',
  },

  // Payment Gateways
  {
    name: 'STRIPE_SECRET_KEY',
    required: false,
    description: 'Stripe secret key',
    validate: (v) => v.startsWith('sk_'),
  },
  {
    name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    required: false,
    description: 'Stripe publishable key',
    validate: (v) => v.startsWith('pk_'),
  },
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    required: false,
    description: 'Stripe webhook signing secret',
  },
  {
    name: 'MERCADOPAGO_ACCESS_TOKEN',
    required: false,
    description: 'Mercado Pago access token',
  },

  // Email
  {
    name: 'RESEND_API_KEY',
    required: false,
    description: 'Resend API key for sending emails',
  },

  // Cron Jobs
  {
    name: 'CRON_SECRET',
    required: true,
    description: 'Secret for securing cron job endpoints',
  },
]

/**
 * Validate Garcez Palha environment configuration
 */
export function validateGarcezPalhaEnv(): ValidationResult {
  return validateEnv(garcezPalhaEnvConfigs)
}

/**
 * Log environment validation results
 */
export function logEnvValidation(result: ValidationResult): void {
  if (result.valid) {
    console.log('✅ Environment configuration valid')

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:')
      result.warnings.forEach((w) => console.log(`  - ${w}`))
    }
  } else {
    console.error('❌ Environment configuration invalid\n')
    console.error('Errors:')
    result.errors.forEach((e) => console.error(`  - ${e}`))

    if (result.missing.length > 0) {
      console.error('\n📋 Missing required variables:')
      result.missing.forEach((m) => console.error(`  - ${m}`))
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:')
      result.warnings.forEach((w) => console.log(`  - ${w}`))
    }

    console.error('\n💡 Check your .env.local file and ensure all required variables are set.')
  }
}

/**
 * Validate specific service environment variables
 */
export function validateServiceEnv(service: 'twilio' | 'stripe' | 'whatsapp' | 'telegram'): boolean {
  const serviceConfigs: Record<string, string[]> = {
    twilio: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_WHATSAPP_NUMBER'],
    stripe: ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'],
    whatsapp: [
      'WHATSAPP_ACCESS_TOKEN',
      'WHATSAPP_PHONE_NUMBER_ID',
      'WHATSAPP_BUSINESS_ACCOUNT_ID',
    ],
    telegram: ['TELEGRAM_BOT_TOKEN'],
  }

  const requiredVars = serviceConfigs[service]

  if (!requiredVars) {
    return false
  }

  return requiredVars.every((varName) => !!process.env[varName])
}
