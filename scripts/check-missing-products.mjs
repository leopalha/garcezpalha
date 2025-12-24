import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Produtos que deveriam existir baseado na migration
const expectedProducts = [
  'desbloqueio-conta',
  'negativacao-indevida',
  'defesa-execucao',
  'direito-imobiliario',
  'usucapiao',
  'holding-familiar',
  'inventario',
  'plano-saude-negou',
  'cirurgia-bariatrica',
  'tea',
  'bpc-loas',
  'pericia-documental',
  'grafotecnia',
  'direito-criminal',
  'direito-aeronautico'
]

async function checkProducts() {
  console.log('🔍 Verificando produtos no banco...\n')

  try {
    // Buscar todos os produtos
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, category')
      .order('category', { ascending: true })

    if (error) {
      console.error('❌ Erro ao buscar produtos:', error.message)
      return
    }

    console.log(`📊 Total de produtos no banco: ${products.length}\n`)

    // Verificar quais dos esperados existem
    const existingIds = products.map(p => p.id)
    const missing = expectedProducts.filter(id => !existingIds.includes(id))

    if (missing.length === 0) {
      console.log('✅ Todos os 15 produtos da migration estão cadastrados!\n')
    } else {
      console.log(`⚠️  ${missing.length} produtos faltando:\n`)
      missing.forEach(id => {
        console.log(`   - ${id}`)
      })
      console.log('\n💡 Execute a migration: 20251225000002_insert_products_only.sql')
    }

    // Listar produtos por categoria
    console.log('\n📋 Produtos por categoria:\n')
    const byCategory = products.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = []
      acc[p.category].push(p)
      return acc
    }, {})

    Object.entries(byCategory).forEach(([category, prods]) => {
      console.log(`${category.toUpperCase()}:`)
      prods.forEach(p => console.log(`  • ${p.name} (${p.id})`))
      console.log('')
    })

  } catch (err) {
    console.error('💥 Erro:', err)
  }
}

checkProducts()
