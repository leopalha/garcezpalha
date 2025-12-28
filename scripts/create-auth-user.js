/**
 * Script para criar usuário de autenticação no Supabase
 *
 * EXECUÇÃO:
 * node scripts/create-auth-user.js
 *
 * CREDENCIAIS:
 * Email: leonardo.palha@gmail.com
 * Senha: Admin2025!
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ ERRO: Variáveis de ambiente não encontradas')
  console.error('Certifique-se que .env.local contém:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAuthUser() {
  console.log('🚀 Iniciando criação de usuário...\n')

  const userId = 'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1'
  const email = 'leonardo.palha@gmail.com'
  const password = 'Admin2025!'

  try {
    // 1. Verificar se usuário já existe em profiles
    console.log('1️⃣ Verificando profile existente...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError
    }

    if (!profile) {
      console.log('⚠️  Profile não encontrado. Criando novo profile...')
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          role: 'admin',
          full_name: 'Leonardo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (createProfileError) throw createProfileError
      console.log('✅ Profile criado com sucesso!')
    } else {
      console.log('✅ Profile já existe:', profile.email, '- Role:', profile.role)
    }

    // 2. Criar usuário de autenticação usando Admin API
    console.log('\n2️⃣ Criando usuário de autenticação...')

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Leonardo'
      },
      app_metadata: {
        provider: 'email',
        providers: ['email']
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  Usuário já existe. Tentando atualizar senha...')

        // Tentar atualizar a senha
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
          userId,
          { password: password }
        )

        if (updateError) throw updateError
        console.log('✅ Senha atualizada com sucesso!')
      } else {
        throw authError
      }
    } else {
      console.log('✅ Usuário de autenticação criado com sucesso!')
      console.log('   ID:', authData.user.id)
      console.log('   Email:', authData.user.email)
    }

    // 3. Verificar se tudo está OK
    console.log('\n3️⃣ Verificando configuração final...')
    const { data: finalProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!finalProfile) {
      throw new Error('Profile não encontrado após criação')
    }

    console.log('\n✅ SUCESSO! Usuário configurado corretamente:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', email)
    console.log('🔑 Senha:', password)
    console.log('👤 Nome:', finalProfile.full_name)
    console.log('🎭 Role:', finalProfile.role)
    console.log('🆔 UUID:', userId)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🎯 Próximos passos:')
    console.log('1. Acesse: http://localhost:3000/login')
    console.log('2. Use as credenciais acima para fazer login')
    console.log('3. Você terá acesso admin completo\n')

  } catch (error) {
    console.error('\n❌ ERRO:', error.message)
    console.error('\nDetalhes do erro:', error)
    process.exit(1)
  }
}

// Executar
createAuthUser()
