import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { createClient } from './supabase/server'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        try {
          // Query Supabase for user
          const supabase = await createClient()
          const { data: user, error } = await supabase
            .from('users')
            .select('id, email, name, password_hash, role, is_active, email_verified')
            .eq('email', credentials.email)
            .single()

          if (error || !user) {
            throw new Error('Credenciais inválidas')
          }

          // Check if user is active
          if (!user.is_active) {
            throw new Error('Usuário inativo. Entre em contato com o suporte.')
          }

          // Verify password
          if (!user.password_hash) {
            throw new Error('Usuário sem senha configurada. Use recuperação de senha.')
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)
          
          if (!isPasswordValid) {
            throw new Error('Credenciais inválidas')
          }

          // Update last login
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id)

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as 'client' | 'admin' | 'lawyer' | 'partner',
            emailVerified: user.email_verified,
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'client' | 'admin' | 'lawyer' | 'partner'
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
