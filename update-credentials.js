const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
)

async function updateCredentials() {
  console.log('🔄 Atualizando credenciais de teste...\n')

  // Delete old test users
  const { error: deleteError } = await supabase
    .from('users')
    .delete()
    .in('email', [
      'parceiro1@example.com',
      'parceiro2@example.com',
      'parceiro3@example.com',
      'parceiro@example.com'
    ])

  if (deleteError) {
    console.log('⚠️  Erro ao deletar usuários antigos:', deleteError.message)
  } else {
    console.log('✅ Usuários antigos removidos')
  }

  // Upsert new test users
  const users = [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      email: 'admin@garcezpalha.com',
      name: 'Administrador',
      password_hash: '$2b$10$tvkkaCoiqVBsd3iiR4uiHOadtUuThPzcfgnIMvRmgkDZMrHC84vrW',
      role: 'admin',
      phone: '(21) 99999-0001',
      email_verified: true,
      is_active: true
    },
    {
      id: 'l0000000-0000-0000-0000-000000000001',
      email: 'advogado@garcezpalha.com',
      name: 'Dr. Carlos Advogado',
      password_hash: '$2b$10$sTzMJSEwFj7YIeMyv82R4.MHp7eXfdd5yvFRkvw2dSXLWj/m3zdya',
      role: 'admin',
      phone: '(21) 99999-0002',
      email_verified: true,
      is_active: true
    },
    {
      id: 'p0000000-0000-0000-0000-000000000001',
      email: 'parceiro@garcezpalha.com',
      name: 'Parceiro Garcez Palha',
      password_hash: '$2b$10$uBUTB8XEYN3NLJSJJhbkjeBbq2U55NBtJPRpmqaYKtuESPZyq4Akm',
      role: 'partner',
      phone: '(21) 99999-0003',
      email_verified: true,
      is_active: true
    },
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      email: 'cliente@garcezpalha.com',
      name: 'João Cliente',
      password_hash: '$2b$10$jifi5hqGG/k/CKit1eTx8uU31IQ.CKb6a7K7o4ItxIpfyjZAPVCpS',
      role: 'client',
      phone: '(21) 99999-0004',
      email_verified: true,
      is_active: true
    }
  ]

  for (const user of users) {
    const { error } = await supabase
      .from('users')
      .upsert(user, { onConflict: 'email' })

    if (error) {
      console.log(`❌ Erro ao criar/atualizar ${user.email}:`, error.message)
    } else {
      console.log(`✅ ${user.email} atualizado`)
    }
  }

  console.log('\n📋 CREDENCIAIS ATUALIZADAS:\n')
  console.log('Admin:     admin@garcezpalha.com      / admin123')
  console.log('Advogado:  advogado@garcezpalha.com   / advogado123')
  console.log('Parceiro:  parceiro@garcezpalha.com   / parceiro123')
  console.log('Cliente:   cliente@garcezpalha.com    / cliente123')
  console.log('\n✅ Concluído!')
}

updateCredentials().catch(console.error)
