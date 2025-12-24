/**
 * Script para apenas atualizar as senhas dos usuários de teste
 *
 * Uso:
 * node scripts/fix-test-passwords.mjs
 */

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Usuários de teste (apenas email e senha)
const testUsers = [
  { email: 'advogado@garcezpalha.com', password: 'advogado123' },
  { email: 'parceiro@garcezpalha.com', password: 'parceiro123' },
  { email: 'cliente@garcezpalha.com', password: 'cliente123' },
]

async function fixPasswords() {
  console.log('🔐 Atualizando senhas dos usuários de teste...\n')

  for (const user of testUsers) {
    try {
      console.log(`📝 Processando: ${user.email}`)

      // Buscar usuário
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id, email, role, is_active')
        .eq('email', user.email)
        .single()

      if (fetchError || !existingUser) {
        console.log(`   ❌ Usuário não encontrado`)
        continue
      }

      // Gerar novo hash de senha
      const passwordHash = await bcrypt.hash(user.password, 10)

      // Atualizar apenas a senha e garantir que está ativo
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password_hash: passwordHash,
          is_active: true,
          email_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id)

      if (updateError) {
        console.error(`   ❌ Erro ao atualizar:`, updateError.message)
      } else {
        console.log(`   ✅ Senha atualizada com sucesso (role: ${existingUser.role})`)
      }

    } catch (error) {
      console.error(`   ❌ Erro inesperado:`, error.message || error)
    }
  }

  console.log('\n✨ Processo concluído!\n')
  console.log('📋 Credenciais atualizadas:')
  console.log('='.repeat(70))

  // Buscar e mostrar roles reais
  for (const user of testUsers) {
    const { data } = await supabase
      .from('users')
      .select('email, role')
      .eq('email', user.email)
      .single()

    if (data) {
      console.log(`${data.role.toUpperCase().padEnd(10)} | ${data.email.padEnd(35)} | ${user.password}`)
    }
  }
  console.log('='.repeat(70))
}

// Executar
fixPasswords()
  .then(() => {
    console.log('\n✅ Senhas atualizadas! Tente fazer login agora.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  })
