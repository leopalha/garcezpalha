/**
 * Script para criar usuários de teste no Supabase
 *
 * Uso:
 * node scripts/create-test-users.mjs
 */

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' })

// Configuração Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Usuários de teste
const testUsers = [
  {
    email: 'advogado@garcezpalha.com',
    password: 'advogado123',
    name: 'Dr. João Silva',
    role: 'lawyer',
  },
  {
    email: 'parceiro@garcezpalha.com',
    password: 'parceiro123',
    name: 'Parceiro Comercial',
    role: 'partner',
  },
  {
    email: 'cliente@garcezpalha.com',
    password: 'cliente123',
    name: 'Cliente Teste',
    role: 'client',
  },
]

async function createUsers() {
  console.log('🚀 Iniciando criação de usuários de teste...\n')

  for (const user of testUsers) {
    try {
      console.log(`📝 Processando: ${user.email} (${user.role})`)

      // Verificar se usuário já existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email, is_active')
        .eq('email', user.email)
        .single()

      if (existingUser) {
        console.log(`   ⚠️  Usuário já existe`)

        // Atualizar senha e ativar
        const passwordHash = await bcrypt.hash(user.password, 10)

        const { error: updateError } = await supabase
          .from('users')
          .update({
            password_hash: passwordHash,
            is_active: true,
            name: user.name,
            role: user.role,
            email_verified: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUser.id)

        if (updateError) {
          console.error(`   ❌ Erro ao atualizar:`, updateError.message)
        } else {
          console.log(`   ✅ Usuário atualizado e ativado`)
        }
      } else {
        // Criar novo usuário
        const passwordHash = await bcrypt.hash(user.password, 10)

        const { error: insertError } = await supabase
          .from('users')
          .insert({
            email: user.email,
            name: user.name,
            password_hash: passwordHash,
            role: user.role,
            is_active: true,
            email_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (insertError) {
          console.error(`   ❌ Erro ao criar:`, insertError.message)
        } else {
          console.log(`   ✅ Usuário criado com sucesso`)
        }
      }

      console.log('') // Linha em branco
    } catch (error) {
      console.error(`   ❌ Erro inesperado:`, error.message || error)
      console.log('')
    }
  }

  console.log('✨ Processo concluído!\n')
  console.log('📋 Credenciais de teste:')
  console.log('='.repeat(70))
  testUsers.forEach(u => {
    console.log(`${u.role.toUpperCase().padEnd(10)} | ${u.email.padEnd(35)} | ${u.password}`)
  })
  console.log('='.repeat(70))
}

// Executar
createUsers()
  .then(() => {
    console.log('\n✅ Script finalizado com sucesso')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  })
