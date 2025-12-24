/**
 * Script para executar migracoes SQL no Supabase via REST API
 * Executa as migracoes 016 e 017 para o sistema de leads e documentos
 */
const fs = require('fs')
const path = require('path')

// Supabase credentials from .env.local
const SUPABASE_URL = 'https://cpcnzkttcwodvfqyhkou.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwY256a3R0Y3dvZHZmcXloa291Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM4OTI0NSwiZXhwIjoyMDc4OTY1MjQ1fQ.aszAL6l5Mr0gAQ1jcU0CA22ERJBGOM0rmEkRPV572Ak'

// Split SQL into executable chunks (remove comments and split by statement)
function splitSqlStatements(sql) {
  // Remove multi-line comments
  sql = sql.replace(/\/\*[\s\S]*?\*\//g, '')
  // Remove single-line comments
  sql = sql.replace(/--.*$/gm, '')

  // Split by semicolon, keeping DO blocks intact
  const statements = []
  let current = ''
  let inDollarQuote = false

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i]
    const next = sql[i + 1]

    // Check for $$ dollar quote
    if (char === '$' && next === '$') {
      inDollarQuote = !inDollarQuote
      current += char
      continue
    }

    if (char === ';' && !inDollarQuote) {
      const stmt = current.trim()
      if (stmt.length > 0) {
        statements.push(stmt)
      }
      current = ''
    } else {
      current += char
    }
  }

  // Add last statement if exists
  const lastStmt = current.trim()
  if (lastStmt.length > 0) {
    statements.push(lastStmt)
  }

  return statements
}

async function executeSql(sql, description) {
  console.log(`Executando: ${description}...`)

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({})
  })

  // Try using the SQL endpoint directly
  const sqlResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    }
  })

  return sqlResponse.ok
}

async function runMigrations() {
  console.log('===========================================')
  console.log('   GARCEZ PALHA - EXECUCAO DE MIGRACOES')
  console.log('===========================================\n')

  try {
    // Check if we can reach Supabase
    console.log('Verificando conexao com Supabase...')
    const healthCheck = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      }
    })

    if (!healthCheck.ok) {
      throw new Error(`Falha na conexao: ${healthCheck.status}`)
    }
    console.log('Conexao OK!\n')

    // Read migration files
    const migration016Path = path.join(__dirname, 'supabase/migrations/016_leads_qualification_system.sql')
    const migration017Path = path.join(__dirname, 'supabase/migrations/017_generated_documents.sql')

    const migration016 = fs.readFileSync(migration016Path, 'utf8')
    const migration017 = fs.readFileSync(migration017Path, 'utf8')

    console.log(`Migration 016: ${migration016.length} caracteres`)
    console.log(`Migration 017: ${migration017.length} caracteres\n`)

    // Unfortunately, the REST API doesn't support raw SQL execution
    // We need to use the Supabase Dashboard or pg client with direct connection

    console.log('========================================')
    console.log('NOTA: A API REST do Supabase nao suporta')
    console.log('execucao direta de SQL DDL.')
    console.log('========================================\n')

    console.log('Para executar as migracoes, use uma das opcoes:\n')

    console.log('OPCAO 1 - Supabase Dashboard (Recomendado):')
    console.log('  1. Acesse: https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou/sql')
    console.log('  2. Cole o conteudo de: supabase/migrations/016_leads_qualification_system.sql')
    console.log('  3. Execute e verifique')
    console.log('  4. Cole o conteudo de: supabase/migrations/017_generated_documents.sql')
    console.log('  5. Execute e verifique\n')

    console.log('OPCAO 2 - Via DATABASE_URL:')
    console.log('  1. Obtenha a connection string em Project Settings > Database')
    console.log('  2. Adicione ao .env.local: DATABASE_URL=postgresql://...')
    console.log('  3. Execute: node run-migration.js\n')

    console.log('OPCAO 3 - Via Supabase CLI:')
    console.log('  1. npx supabase login')
    console.log('  2. npx supabase link --project-ref cpcnzkttcwodvfqyhkou')
    console.log('  3. npx supabase db push\n')

    // Create a consolidated SQL file for easy copy-paste
    const consolidatedPath = path.join(__dirname, 'supabase/EXECUTE_ALL_MIGRATIONS.sql')
    const consolidatedSql = `-- GARCEZ PALHA - MIGRACOES CONSOLIDADAS
-- Execute este arquivo no SQL Editor do Supabase Dashboard
-- URL: https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou/sql

-- =====================================================
-- MIGRATION 016: LEADS QUALIFICATION SYSTEM
-- =====================================================

${migration016}

-- =====================================================
-- MIGRATION 017: GENERATED DOCUMENTS
-- =====================================================

${migration017}

-- =====================================================
-- VERIFICACAO
-- =====================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'leads', 'qualification_sessions', 'payment_links',
  'proposals', 'follow_up_messages', 'lead_interactions',
  'generated_documents', 'review_queue', 'document_templates', 'document_revisions'
)
ORDER BY table_name;
`

    fs.writeFileSync(consolidatedPath, consolidatedSql)
    console.log('Arquivo consolidado criado:')
    console.log(`  ${consolidatedPath}\n`)
    console.log('Copie e cole no SQL Editor do Supabase!')

  } catch (error) {
    console.error('\nERRO:', error.message)
    process.exit(1)
  }
}

runMigrations()
