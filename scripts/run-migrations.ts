/**
 * Script para rodar migrations manualmente via Supabase API
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Carregar .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration(filePath: string) {
  console.log(`\n📝 Rodando migration: ${path.basename(filePath)}`)

  const sql = fs.readFileSync(filePath, 'utf-8')

  try {
    // Executar SQL
    const { error } = await supabase.rpc('exec_sql', { sql_string: sql })

    if (error) {
      console.error(`❌ Erro ao executar migration:`, error)
      return false
    }

    console.log(`✅ Migration executada com sucesso`)
    return true
  } catch (error) {
    console.error(`❌ Erro inesperado:`, error)
    return false
  }
}

async function runAllMigrations() {
  console.log('🚀 Iniciando execução de migrations...\n')

  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')

  // Listar migrations (ordenar por nome)
  const files = fs
    .readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  console.log(`📦 Encontradas ${files.length} migrations\n`)

  let successCount = 0
  let errorCount = 0

  for (const file of files) {
    const filePath = path.join(migrationsDir, file)
    const success = await runMigration(filePath)

    if (success) {
      successCount++
    } else {
      errorCount++
      // Continuar mesmo com erro (algumas migrations podem já ter sido aplicadas)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Resumo:')
  console.log('='.repeat(60))
  console.log(`✅ Sucesso: ${successCount}`)
  console.log(`❌ Erros:   ${errorCount}`)
  console.log(`📦 Total:   ${files.length}`)
  console.log('='.repeat(60))
}

// Executar
runAllMigrations()
  .then(() => {
    console.log('\n✅ Script finalizado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  })
