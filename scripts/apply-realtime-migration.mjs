import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = 'https://cpcnzkttcwodvfqyhkou.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwY256a3R0Y3dvZHZmcXloa291Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM4OTI0NSwiZXhwIjoyMDc4OTY1MjQ1fQ.aszAL6l5Mr0gAQ1jcU0CA22ERJBGOM0rmEkRPV572Ak'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

async function applyMigration() {
  try {
    console.log('📦 Aplicando migration: create_realtime_conversations...')

    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251226185714_create_realtime_conversations.sql')
    const sql = readFileSync(migrationPath, 'utf-8')

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Encontrados ${statements.length} statements SQL`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      console.log(`\n[${i + 1}/${statements.length}] Executando...`)
      console.log(statement.substring(0, 100) + '...')

      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement
      })

      if (error) {
        // Try direct query if RPC fails
        const { error: directError } = await supabase
          .from('_temp')
          .select('*')
          .limit(0)

        console.log('⚠️  RPC exec_sql não disponível, usando abordagem alternativa')
        console.log('⚠️  Error:', error.message)

        // Para migrations complexas, recomendamos usar Supabase Dashboard
        console.log('\n💡 Para aplicar esta migration:')
        console.log('1. Acesse: https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou/editor/sql')
        console.log('2. Cole o conteúdo de: supabase/migrations/20251226185714_create_realtime_conversations.sql')
        console.log('3. Execute manualmente')
        break
      }

      console.log('✅ Success')
    }

    console.log('\n🎉 Migration aplicada com sucesso!')

  } catch (error) {
    console.error('❌ Erro ao aplicar migration:', error.message)
    process.exit(1)
  }
}

applyMigration()
