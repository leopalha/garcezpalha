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

async function verifyTables() {
  console.log('🔍 Verifying products tables...\n')

  try {
    // Check products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1)

    if (productsError) {
      console.log('❌ products table:', productsError.message)
    } else {
      console.log('✅ products table exists')
    }

    // Check product_packages table
    const { data: packages, error: packagesError } = await supabase
      .from('product_packages')
      .select('count')
      .limit(1)

    if (packagesError) {
      console.log('❌ product_packages table:', packagesError.message)
    } else {
      console.log('✅ product_packages table exists')
    }

    // Get products count
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    console.log(`\n📊 Products count: ${productsCount || 0}`)

    // Get packages count
    const { count: packagesCount } = await supabase
      .from('product_packages')
      .select('*', { count: 'exact', head: true })

    console.log(`📦 Packages count: ${packagesCount || 0}`)

    if (productsCount === 0) {
      console.log('\n💡 Tables exist but are empty. Run seed migration:')
      console.log('   node scripts/execute-seed-migration.mjs')
    }

  } catch (err) {
    console.error('💥 Error:', err)
  }
}

verifyTables()
