import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

console.log('🔍 Testando conexão com o banco de dados...\n')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL não está definida no .env.local')
  process.exit(1)
}

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não está definida no .env.local')
  process.exit(1)
}

console.log('✅ Variáveis de ambiente encontradas')
console.log(`   URL: ${supabaseUrl}`)
console.log(`   Key: ${supabaseKey.substring(0, 20)}...`)
console.log('')

const supabase = createClient(supabaseUrl, supabaseKey)

try {
  console.log('🔌 Conectando ao banco de dados...')

  // Testar conexão verificando a tabela products
  const { data, error } = await supabase.from('products').select('id').limit(1)

  if (error) {
    console.error('❌ Erro ao conectar:', error.message)
    console.error('   Detalhes:', error)
    process.exit(1)
  }

  console.log('✅ Conexão bem-sucedida!')
  console.log(`   Tabela 'products' está acessível`)

  if (data && data.length > 0) {
    console.log(`   Já existem ${data.length} produtos no banco`)
  } else {
    console.log(`   Banco está vazio - pronto para migração`)
  }

  // Testar tabela product_packages
  const { error: pkgError } = await supabase.from('product_packages').select('id').limit(1)

  if (pkgError) {
    console.error('⚠️  Tabela product_packages não encontrada:', pkgError.message)
  } else {
    console.log('✅ Tabela product_packages está acessível')
  }

  console.log('\n🎉 Tudo pronto para a migração!')
} catch (error) {
  console.error('❌ Erro inesperado:', error)
  process.exit(1)
}
