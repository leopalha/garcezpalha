import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verify() {
  console.log('🔍 Verificando migração de produtos...\n')

  // Contar produtos
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, category, base_price, is_active')
    .order('category', { ascending: true })

  if (productsError) {
    console.error('❌ Erro ao buscar produtos:', productsError.message)
    process.exit(1)
  }

  console.log(`📦 Total de produtos: ${products.length}\n`)

  // Agrupar por categoria
  const byCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  }, {})

  // Exibir por categoria
  const categoryNames = {
    financeiro: 'Proteção Financeira',
    patrimonial: 'Proteção Patrimonial',
    saude: 'Proteção de Saúde',
    pericia: 'Perícia e Documentos',
    criminal: 'Defesa Criminal',
    automacao: 'Automação Jurídica',
  }

  for (const [category, items] of Object.entries(byCategory)) {
    console.log(`\n📂 ${categoryNames[category] || category} (${items.length} produtos)`)
    console.log('─'.repeat(60))

    for (const product of items) {
      const priceFormatted = (product.base_price / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
      const status = product.is_active ? '✅' : '❌'
      console.log(`${status} ${product.name} - ${priceFormatted}`)
    }
  }

  // Contar pacotes
  console.log('\n' + '='.repeat(60))
  const { data: packages, error: packagesError } = await supabase
    .from('product_packages')
    .select('product_id, name, price, is_recommended')

  if (packagesError) {
    console.error('❌ Erro ao buscar pacotes:', packagesError.message)
  } else {
    console.log(`\n📦 Total de pacotes: ${packages.length}`)

    // Agrupar por produto
    const byProduct = packages.reduce((acc, pkg) => {
      if (!acc[pkg.product_id]) {
        acc[pkg.product_id] = []
      }
      acc[pkg.product_id].push(pkg)
      return acc
    }, {})

    console.log(`\n🎁 Produtos com pacotes: ${Object.keys(byProduct).length}`)
    console.log('─'.repeat(60))

    for (const [productId, pkgs] of Object.entries(byProduct)) {
      const product = products.find((p) => p.id === productId)
      if (product) {
        console.log(`\n${product.name}:`)
        for (const pkg of pkgs) {
          const priceFormatted = (pkg.price / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })
          const recommended = pkg.is_recommended ? '⭐' : '  '
          console.log(`  ${recommended} ${pkg.name} - ${priceFormatted}`)
        }
      }
    }
  }

  // Verificar produtos em destaque
  console.log('\n' + '='.repeat(60))
  const featuredProducts = products.filter((p) => p.is_featured)
  console.log(`\n⭐ Produtos em destaque: ${featuredProducts.length}`)
  if (featuredProducts.length > 0) {
    console.log('─'.repeat(60))
    featuredProducts.forEach((p) => {
      console.log(`  • ${p.name}`)
    })
  }

  // Verificar produtos inativos
  const inactiveProducts = products.filter((p) => !p.is_active)
  if (inactiveProducts.length > 0) {
    console.log(`\n⚠️  Produtos inativos: ${inactiveProducts.length}`)
    console.log('─'.repeat(60))
    inactiveProducts.forEach((p) => {
      console.log(`  • ${p.name}`)
    })
  }

  // Estatísticas de preços
  console.log('\n' + '='.repeat(60))
  console.log('\n💰 Estatísticas de Preços')
  console.log('─'.repeat(60))

  const prices = products.map((p) => p.base_price / 100)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length

  console.log(`  Menor preço: ${minPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`)
  console.log(`  Maior preço: ${maxPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`)
  console.log(`  Preço médio: ${avgPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`)

  console.log('\n' + '='.repeat(60))
  console.log('\n✅ Verificação concluída!\n')
}

verify().catch((error) => {
  console.error('\n💥 Erro durante a verificação:', error)
  process.exit(1)
})
