import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  phone: z.string().optional(),
  document: z.string().optional(), // CPF/CNPJ
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = signupSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password, phone, document } = validation.data

    // Create Supabase client
    const supabase = await createClient()

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
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
      console.error('Error creating user:', createError)
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 500 }
      )
    }

    // TODO: Send verification email
    // This should be implemented with Resend or Supabase Auth Email

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      message: 'Cadastro realizado com sucesso! Você já pode fazer login.',
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
