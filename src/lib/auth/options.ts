import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'

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

        // Use Supabase Direct Database Query (not Auth)
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        // Query users table directly
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, email, name, password_hash, role, is_active')
          .eq('email', credentials.email)
          .single()

        if (userError || !user) {
          throw new Error('Email ou senha incorretos')
        }

        // Check if user is active
        if (!user.is_active) {
          throw new Error('Usuário inativo. Entre em contato com o suporte.')
        }

        // Verify password with bcrypt
        const bcrypt = require('bcryptjs')
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)

        if (!isPasswordValid) {
          throw new Error('Email ou senha incorretos')
        }

        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
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
