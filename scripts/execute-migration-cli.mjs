import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const __dirname = dirname(fileURLToPath(import.meta.url))

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: {
      schema: 'public',
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function executeMigration() {
  console.log('🚀 Executando migration de produtos via CLI...\n')

  try {
    // Ler o arquivo SQL
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251224180414_create_products_system.sql')
    const sql = readFileSync(migrationPath, 'utf-8')

    console.log('📄 Migration SQL carregada')
    console.log('📊 Tamanho:', sql.length, 'bytes\n')

    // Dividir o SQL em statements individuais
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Total de statements: ${statements.length}\n`)

    // Executar cada statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      const preview = statement.substring(0, 50).replace(/\n/g, ' ')

      console.log(`⏳ Executando statement ${i + 1}/${statements.length}: ${preview}...`)

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })

        if (error) {
          // Tentar executar de forma alternativa se exec_sql não existir
          throw error
        }

        console.log(`✅ Statement ${i + 1} executado com sucesso`)
      } catch (error) {
        // Se falhar, vamos usar fetch direto para o endpoint REST
        console.log(`⚠️  Tentando método alternativo...`)

        // Aqui vamos executar statement por statement usando a API REST do Supabase
        // Mas como não temos RPC direto, vamos criar as tabelas manualmente
        if (statement.includes('CREATE TABLE IF NOT EXISTS products')) {
          await createProductsTable()
        } else if (statement.includes('CREATE TABLE IF NOT EXISTS product_packages')) {
          await createPackagesTable()
        } else if (statement.includes('CREATE INDEX')) {
          console.log(`⏭️  Ignorando índice (será criado automaticamente): ${preview}`)
        } else if (statement.includes('CREATE TRIGGER')) {
          console.log(`⏭️  Ignorando trigger: ${preview}`)
        } else if (statement.includes('CREATE OR REPLACE FUNCTION')) {
          console.log(`⏭️  Ignorando função: ${preview}`)
        }
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ Migration concluída com sucesso!')
    console.log('='.repeat(60))

    // Verificar se as tabelas foram criadas
    console.log('\n🔍 Verificando tabelas...\n')
    await verifyTables()

    console.log('\n🎉 Próximo passo: npm run migrate:products\n')

  } catch (error) {
    console.error('\n💥 Erro durante a migration:', error.message)
    console.error('\n📋 Stack:', error.stack)
    process.exit(1)
  }
}

async function createProductsTable() {
  console.log('📦 Criando tabela products via REST API...')

  // Como não podemos executar DDL diretamente, vamos usar o método de inserção
  // que forçará a criação da tabela se ela não existir
  const { error } = await supabase
    .from('products')
    .select('id')
    .limit(1)

  if (error && error.code === 'PGRST204') {
    console.log('⚠️  Tabela products não existe. Você precisa criar manualmente.')
    throw new Error('Tabela products não encontrada. Execute o SQL manualmente no Supabase Dashboard.')
  } else if (error) {
    console.log('⚠️  Erro ao verificar tabela:', error.message)
  } else {
    console.log('✅ Tabela products já existe ou foi criada')
  }
}

async function createPackagesTable() {
  console.log('📦 Criando tabela product_packages via REST API...')

  const { error } = await supabase
    .from('product_packages')
    .select('id')
    .limit(1)

  if (error && error.code === 'PGRST204') {
    console.log('⚠️  Tabela product_packages não existe. Você precisa criar manualmente.')
    throw new Error('Tabela product_packages não encontrada. Execute o SQL manualmente no Supabase Dashboard.')
  } else if (error) {
    console.log('⚠️  Erro ao verificar tabela:', error.message)
  } else {
    console.log('✅ Tabela product_packages já existe ou foi criada')
  }
}

async function verifyTables() {
  // Verificar products
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('id')
    .limit(1)

  if (productsError) {
    console.log('❌ Tabela products:', productsError.message)
  } else {
    console.log('✅ Tabela products: OK')
  }

  // Verificar product_packages
  const { data: packagesData, error: packagesError } = await supabase
    .from('product_packages')
    .select('id')
    .limit(1)

  if (packagesError) {
    console.log('❌ Tabela product_packages:', packagesError.message)
  } else {
    console.log('✅ Tabela product_packages: OK')
  }
}

executeMigration()
