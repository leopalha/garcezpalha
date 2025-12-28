/**
 * Script para popular o banco de dados com produtos do catalog.ts
 *
 * Uso:
 * npx tsx scripts/seed-products.ts
 */

import { createClient } from '@supabase/supabase-js'
import { ALL_PRODUCTS } from '../src/lib/products/catalog'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Carregar variáveis de ambiente do .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

// Configuração Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedProducts() {
  console.log('🚀 Iniciando seed de produtos...\n')
  console.log(`📦 Total de produtos no catalog.ts: ${ALL_PRODUCTS.length}\n`)

  let created = 0
  let updated = 0
  let errors = 0

  for (const product of ALL_PRODUCTS) {
    try {
      console.log(`📝 Processando: ${product.name} (${product.category})`)

      // Verificar se produto já existe
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('id', product.id)
        .single()

      // Preparar dados do produto para o banco
      const productData = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        description: product.description,
        hero_title: product.name, // Usar nome como título
        hero_subtitle: product.description,
        hero_problem: '', // Campo vazio por padrão
        base_price: (product.price.basic || 0) * 100, // Converter para centavos
        features: product.features || [],
        benefits: [], // Campo vazio por padrão
        documents_required: product.documents || [],
        faq_items: [], // Campo vazio por padrão
        is_active: product.isActive,
      }

      if (existingProduct) {
        // Atualizar produto existente
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)

        if (updateError) {
          console.error(`   ❌ Erro ao atualizar:`, updateError.message)
          errors++
        } else {
          console.log(`   ✅ Produto atualizado`)
          updated++

          // Deletar pacotes antigos
          await supabase
            .from('product_packages')
            .delete()
            .eq('product_id', product.id)
        }
      } else {
        // Criar novo produto
        const { error: insertError } = await supabase
          .from('products')
          .insert(productData)

        if (insertError) {
          console.error(`   ❌ Erro ao criar:`, insertError.message)
          errors++
        } else {
          console.log(`   ✅ Produto criado`)
          created++
        }
      }

      // Inserir pacotes (packages)
      if (product.packages && product.packages.length > 0) {
        console.log(`   📦 Inserindo ${product.packages.length} pacote(s)...`)

        for (let i = 0; i < product.packages.length; i++) {
          const pkg = product.packages[i]

          const packageData = {
            product_id: product.id,
            name: pkg.name,
            description: pkg.description,
            price: pkg.price * 100, // Converter para centavos
            features: pkg.features || [],
            is_recommended: pkg.highlighted || false,
            order_index: i,
            is_active: true,
          }

          const { error: packageError } = await supabase
            .from('product_packages')
            .insert(packageData)

          if (packageError) {
            console.error(`      ❌ Erro ao criar pacote "${pkg.name}":`, packageError.message)
          } else {
            console.log(`      ✓ Pacote "${pkg.name}" criado`)
          }
        }
      }

      console.log('') // Linha em branco
    } catch (error) {
      console.error(`   ❌ Erro inesperado:`, error)
      errors++
      console.log('')
    }
  }

  console.log('✨ Processo concluído!\n')
  console.log('📋 Resumo:')
  console.log('=' .repeat(50))
  console.log(`✅ Produtos criados:    ${created}`)
  console.log(`🔄 Produtos atualizados: ${updated}`)
  console.log(`❌ Erros encontrados:   ${errors}`)
  console.log(`📦 Total processado:    ${created + updated + errors}`)
  console.log('=' .repeat(50))

  // Verificar total no banco
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  console.log(`\n💾 Total de produtos no banco de dados: ${count}`)
}

// Executar
seedProducts()
  .then(() => {
    console.log('\n✅ Script finalizado com sucesso')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  })
