import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeMigration() {
  console.log('🚀 Executing products migration...\n')

  try {
    // Read migration file
    const migrationPath = join(projectRoot, 'supabase/migrations/20251224180414_create_products_system.sql')
    const sql = readFileSync(migrationPath, 'utf8')

    console.log('📄 Migration loaded')
    console.log('📊 Size:', sql.length, 'bytes\n')

    // Execute migration using RPC
    const { data, error } = await supabase.rpc('exec_sql', { query: sql })

    if (error) {
      console.error('❌ Error executing migration:', error.message)
      console.log('\n💡 Try running the SQL manually in Supabase Dashboard:')
      console.log('   https://app.supabase.com/project/_/sql/new')
      process.exit(1)
    }

    console.log('✅ Migration executed successfully!')
    console.log('\n📋 Next steps:')
    console.log('   1. Run seed migration: node scripts/execute-seed-migration.mjs')
    console.log('   2. Verify tables: Check Supabase Dashboard > Database > Tables')

  } catch (err) {
    console.error('💥 Unexpected error:', err)
    process.exit(1)
  }
}

executeMigration()
