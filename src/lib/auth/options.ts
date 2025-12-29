import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'admin' | 'lawyer' | 'partner' | 'client'
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: 'admin' | 'lawyer' | 'partner' | 'client'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    name: string
    role: 'admin' | 'lawyer' | 'partner' | 'client'
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
          throw new Error('Configuração do Supabase ausente')
        }

        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        )

        // First try to authenticate with users table (legacy system with admin123 password)
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, email, name, role, password_hash')
          .eq('email', credentials.email)
          .eq('is_active', true)
          .single()

        if (user && user.password_hash) {
          // Verify password using bcrypt
          const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash)

          if (isValidPassword) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role as 'admin' | 'lawyer' | 'partner' | 'client',
            }
          }

          // Password is incorrect
          throw new Error('Email ou senha incorretos')
        }

        // Fallback: Try Supabase Auth (for profiles table users)
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })

        if (authData?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', authData.user.id)
            .single()

          if (profile) {
            return {
              id: authData.user.id,
              email: authData.user.email || credentials.email,
              name: profile.full_name || authData.user.email || 'Usuário',
              role: profile.role,
            }
          }
        }

        throw new Error('Email ou senha incorretos')
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-key-change-in-production',
}
