/**
 * Aplica migrations do Supabase usando conexão PostgreSQL direta
 */

import { Client } from 'pg'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Carregar .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

if (!supabaseUrl) {
  console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL não configurada')
  process.exit(1)
}

// Extrair detalhes da conexão
// URL format: https://PROJECT_REF.supabase.co
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '')

// Connection string para Supabase
const connectionString = `postgresql://postgres.${projectRef}:${process.env.SUPABASE_SERVICE_ROLE_KEY}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

async function applyMigration(client: Client, filePath: string): Promise<boolean> {
  const fileName = path.basename(filePath)
  console.log(`\n📝 Aplicando: ${fileName}`)

  try {
    const sql = fs.readFileSync(filePath, 'utf-8')

    // Executar migration
    await client.query(sql)

    console.log(`✅ ${fileName} aplicada com sucesso`)
    return true
  } catch (error: any) {
    // Ignorar erros de "already exists" (migrations já aplicadas)
    if (
      error.message?.includes('already exists') ||
      error.message?.includes('duplicate')
    ) {
      console.log(`⏭️  ${fileName} já foi aplicada anteriormente`)
      return true
    }

    console.error(`❌ Erro em ${fileName}:`, error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Iniciando aplicação de migrations...\n')

  // Conectar ao Supabase
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log('✅ Conectado ao Supabase PostgreSQL\n')

    // Listar migrations
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')
    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .filter(f => f.includes('20251230')) // Apenas as novas migrations
      .sort()

    console.log(`📦 Encontradas ${files.length} migrations para aplicar\n`)

    let successCount = 0
    let errorCount = 0

    for (const file of files) {
      const filePath = path.join(migrationsDir, file)
      const success = await applyMigration(client, filePath)

      if (success) {
        successCount++
      } else {
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📊 Resumo:')
    console.log('='.repeat(60))
    console.log(`✅ Sucesso: ${successCount}`)
    console.log(`❌ Erros:   ${errorCount}`)
    console.log(`📦 Total:   ${files.length}`)
    console.log('='.repeat(60))
  } catch (error) {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
  .then(() => {
    console.log('\n✅ Migrations aplicadas com sucesso!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Erro:', error)
    process.exit(1)
  })
