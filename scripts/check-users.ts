/**
 * Script para verificar usuários no banco de dados
 *
 * Uso:
 * npx ts-node scripts/check-users.ts
 */

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

// Configuração Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const testEmails = [
  'advogado@garcezpalha.com',
  'parceiro@garcezpalha.com',
  'cliente@garcezpalha.com',
]

const testPasswords = {
  'advogado@garcezpalha.com': 'advogado123',
  'parceiro@garcezpalha.com': 'parceiro123',
  'cliente@garcezpalha.com': 'cliente123',
}

async function checkUsers() {
  console.log('🔍 Verificando usuários de teste...\n')

  for (const email of testEmails) {
    console.log(`\n📧 Email: ${email}`)
    console.log('─'.repeat(60))

    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        console.log('❌ Status: USUÁRIO NÃO ENCONTRADO')
        console.log(`   Erro: ${error.message}`)
        console.log('   💡 Execute: npx ts-node scripts/create-test-users.ts')
        continue
      }

      if (!user) {
        console.log('❌ Status: USUÁRIO NÃO EXISTE')
        console.log('   💡 Execute: npx ts-node scripts/create-test-users.ts')
        continue
      }

      // Informações do usuário
      console.log('✅ Status: USUÁRIO ENCONTRADO')
      console.log(`   ID: ${user.id}`)
      console.log(`   Nome: ${user.name}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Ativo: ${user.is_active ? '✅ Sim' : '❌ Não'}`)
      console.log(`   Email Verificado: ${user.email_verified ? '✅ Sim' : '❌ Não'}`)
      console.log(`   Tem Senha: ${user.password_hash ? '✅ Sim' : '❌ Não'}`)

      // Verificar senha
      if (user.password_hash) {
        const password = testPasswords[email as keyof typeof testPasswords]
        const isValid = await bcrypt.compare(password, user.password_hash)
        console.log(`   Senha "${password}": ${isValid ? '✅ Válida' : '❌ Inválida'}`)

        if (!isValid) {
          console.log('   ⚠️  A senha está incorreta! Execute create-test-users.ts para resetar')
        }
      } else {
        console.log('   ⚠️  Usuário sem senha configurada!')
      }

      // Verificar problemas
      const problems: string[] = []

      if (!user.is_active) {
        problems.push('Usuário está INATIVO')
      }

      if (!user.password_hash) {
        problems.push('Usuário sem SENHA')
      }

      if (problems.length > 0) {
        console.log('\n   ⚠️  PROBLEMAS DETECTADOS:')
        problems.forEach(p => console.log(`      - ${p}`))
        console.log('   💡 Execute: npx ts-node scripts/create-test-users.ts')
      }

    } catch (error: any) {
      console.log('❌ ERRO:', error.message)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO')
  console.log('='.repeat(60))

  // Contar usuários
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  console.log(`Total de usuários no banco: ${totalUsers}`)

  // Contar por role
  const roles = ['admin', 'lawyer', 'partner', 'client']
  for (const role of roles) {
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', role)

    console.log(`  ${role.padEnd(10)}: ${count}`)
  }

  console.log('\n✨ Verificação concluída!\n')
}

// Executar
checkUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })
