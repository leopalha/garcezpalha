import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/email/email-service'
import { withRateLimit } from '@/lib/rate-limit'
import { withValidation } from '@/lib/validations/api-middleware'
import { z } from 'zod'
import { PerformanceTimer, trackApiCall, trackError, trackConversion } from '@/lib/monitoring/observability'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:auth:signup')

const signupSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  phone: z.string().optional(),
  document: z.string().optional(), // CPF/CNPJ
})

async function handler(request: NextRequest) {
  const timer = new PerformanceTimer('POST /api/auth/signup')

  try {
    logger.info('Processing signup request')
    const { name, email, password, phone, document } = (request as any).validatedData

    // Create Supabase client
    const supabase = await createClient()

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      logger.warn('Signup failed - email already exists', { email })
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      )
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password_hash,
        phone,
        document,
        role: 'client',
        is_active: true,
        email_verified: false,
      })
      .select('id, name, email, role')
      .single()

    if (createError) {
      logger.error('Error creating user in database', createError, { email })
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 500 }
      )
    }

    logger.info('User created successfully', { userId: newUser.id, email })

    // Generate verification token (valid for 24 hours)
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

    // Store verification token in database
    await supabase
      .from('users')
      .update({
        verification_token: verificationTokenHash,
        verification_token_expiry: verificationTokenExpiry,
      })
      .eq('id', newUser.id)

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`

    await emailService.sendVerificationEmail({
      to: email,
      name: name,
      verificationUrl,
      userId: newUser.id,
    })

    logger.info('Verification email sent', { userId: newUser.id, email })

    const duration = timer.end()
    trackApiCall('/api/auth/signup', duration, 200, { userId: newUser.id })
    trackConversion('user_signup', undefined, { role: newUser.role })

    logger.info('Signup request successful', { userId: newUser.id, status: 200, duration })

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      message: 'Cadastro realizado! Enviamos um email de verificação. Confira sua caixa de entrada.',
    })
  } catch (error) {
    timer.end()
    trackError(error as Error, { endpoint: '/api/auth/signup', method: 'POST' })
    logger.error('Signup request failed', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Apply validation, sanitization, and rate limiting
export const POST = withRateLimit(
  withValidation(signupSchema, handler, { sanitize: true }),
  { type: 'auth', limit: 5 }
)
