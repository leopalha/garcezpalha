import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// SQL statements para executar
const sqlStatements = [
  // Criar tabela products
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_problem TEXT,
    base_price INTEGER NOT NULL DEFAULT 0,
    features JSONB DEFAULT '[]',
    benefits JSONB DEFAULT '[]',
    documents_required JSONB DEFAULT '[]',
    faq_items JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Criar tabela product_packages
  `CREATE TABLE IF NOT EXISTS product_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    features JSONB DEFAULT '[]',
    is_recommended BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Criar índices
  `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`,
  `CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active)`,
  `CREATE INDEX IF NOT EXISTS idx_packages_product ON product_packages(product_id)`,

  // Criar função de trigger
  `CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql`,

  // Criar triggers
  `DROP TRIGGER IF EXISTS update_products_updated_at ON products`,
  `CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,

  `DROP TRIGGER IF EXISTS update_packages_updated_at ON product_packages`,
  `CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON product_packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`
]

async function executeSql(sql) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
      },
      body: JSON.stringify({ query: sql })
    })

    const data = await response.text()

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data}`)
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function createTables() {
  console.log('🚀 Criando tabelas de produtos via API REST...\n')

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < sqlStatements.length; i++) {
    const sql = sqlStatements[i]
    const preview = sql.substring(0, 60).replace(/\n/g, ' ').trim() + '...'

    console.log(`\n⏳ [${i + 1}/${sqlStatements.length}] ${preview}`)

    const result = await executeSql(sql)

    if (result.success) {
      console.log('✅ Sucesso')
      successCount++
    } else {
      console.log(`❌ Falhou: ${result.error}`)
      failCount++

      // Se falhar tentando criar, tentar método alternativo
      if (sql.includes('CREATE TABLE') && result.error.includes('not found')) {
        console.log('\n⚠️  A função exec_sql não está disponível no Supabase.')
        console.log('📋 Execute o SQL manualmente no Dashboard:\n')
        console.log(`   ${SUPABASE_URL.replace('https://', 'https://app.supabase.com/project/')}/sql/new\n`)
        console.log('Cole todo o conteúdo de: supabase/migrations/20251224180414_create_products_system.sql\n')
        process.exit(1)
      }
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`\n✅ Sucesso: ${successCount}`)
  console.log(`❌ Falhas: ${failCount}`)
  console.log('\n' + '='.repeat(60))

  if (failCount === 0) {
    console.log('\n🎉 Tabelas criadas com sucesso!')
    console.log('\n📝 Próximo passo: npm run migrate:products\n')
  } else {
    console.log('\n⚠️  Algumas operações falharam.')
    console.log('Verifique os erros acima e execute manualmente se necessário.\n')
  }
}

createTables().catch(error => {
  console.error('\n💥 Erro fatal:', error)
  process.exit(1)
})
