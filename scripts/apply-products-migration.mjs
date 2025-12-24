import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const __dirname = dirname(fileURLToPath(import.meta.url))
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function applyMigration() {
  console.log('🚀 Aplicando migration de produtos no Supabase...\n')

  try {
    // Ler o arquivo SQL
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251224180414_create_products_system.sql')
    const sql = readFileSync(migrationPath, 'utf-8')

    console.log('📄 Migration SQL carregada')
    console.log('📊 Tamanho:', sql.length, 'bytes')
    console.log('\n⏳ Executando SQL...\n')

    // Executar o SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      // Se não tiver a função exec_sql, vamos criar as tabelas manualmente
      console.log('⚠️  Função exec_sql não disponível, executando via API...\n')

      // Criar tabela products
      const { error: productsError } = await supabase.rpc('exec_sql', {
        query: `
          CREATE TABLE IF NOT EXISTS products (
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
          );
        `
      })

      if (productsError) {
        throw productsError
      }

      console.log('✅ Tabela products criada')

      // Criar tabela product_packages
      const { error: packagesError } = await supabase.rpc('exec_sql', {
        query: `
          CREATE TABLE IF NOT EXISTS product_packages (
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
          );
        `
      })

      if (packagesError) {
        throw packagesError
      }

      console.log('✅ Tabela product_packages criada')
      console.log('\n💡 IMPORTANTE: As tabelas foram criadas, mas você precisa executar o SQL completo no Supabase Dashboard para criar os índices e triggers.')
      console.log('\n📋 Próximos passos:')
      console.log('   1. Acesse https://app.supabase.com/project/_/sql/new')
      console.log('   2. Cole o conteúdo de: supabase/migrations/20251224180414_create_products_system.sql')
      console.log('   3. Execute o SQL')
      console.log('\nOu rode: npm run migrate:products para popular os dados\n')
      return
    }

    console.log('✅ Migration aplicada com sucesso!\n')
    console.log('📊 Verificando tabelas...')

    // Verificar se as tabelas foram criadas
    const { data: products, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('❌ Erro ao verificar tabela products:', checkError.message)
    } else {
      console.log('✅ Tabela products verificada')
    }

    const { error: packagesCheckError } = await supabase
      .from('product_packages')
      .select('id')
      .limit(1)

    if (packagesCheckError) {
      console.error('❌ Erro ao verificar tabela product_packages:', packagesCheckError.message)
    } else {
      console.log('✅ Tabela product_packages verificada')
    }

    console.log('\n🎉 Migration concluída! Próximo passo: npm run migrate:products\n')
  } catch (error) {
    console.error('\n💥 Erro ao aplicar migration:', error.message)
    console.error('\n📋 Solução alternativa:')
    console.error('   1. Acesse: https://app.supabase.com/project/_/sql/new')
    console.error('   2. Cole o conteúdo de: supabase/migrations/20251224180414_create_products_system.sql')
    console.error('   3. Clique em RUN')
    process.exit(1)
  }
}

applyMigration()
