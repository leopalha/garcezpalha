import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Produtos atuais do checkout.ts
const products = [
  // ============================================
  // PROTEÇÃO FINANCEIRA
  // ============================================
  {
    id: 'desbloqueio-conta',
    name: 'Desbloqueio de Conta Bancária',
    slug: 'desbloqueio-conta',
    category: 'financeiro',
    description: 'Ação judicial para desbloqueio de conta bancária ou poupança bloqueada',
    hero_title: 'Conta Bancária Bloqueada? Desbloqueie em 3-7 Dias',
    hero_subtitle: 'Ação judicial especializada para recuperar o acesso à sua conta',
    hero_problem: 'Sua conta foi bloqueada e você não consegue pagar contas?',
    base_price: 150000, // R$ 1.500
    features: [
      'Análise do bloqueio judicial',
      'Petição de desbloqueio',
      'Acompanhamento do processo',
      'Recursos se necessário',
    ],
    benefits: [
      'Desbloqueio em 3-7 dias',
      '95% de taxa de sucesso',
      'Garantia de satisfação',
    ],
    documents_required: [
      'RG e CPF',
      'Extrato bancário',
      'Comprovante de residência',
      'Documentos do bloqueio',
    ],
    
    is_active: true,
    
  },
  {
    id: 'golpe-pix',
    name: 'Recuperação de Golpe do PIX',
    slug: 'golpe-pix',
    category: 'financeiro',
    description: 'Recuperação de valores perdidos em golpes via PIX',
    hero_title: 'Foi vítima de golpe do PIX? Recupere seu dinheiro',
    hero_subtitle: 'Ação judicial especializada com 85% de taxa de sucesso',
    hero_problem: 'Perdeu dinheiro em golpe do PIX e não sabe como recuperar?',
    base_price: 120000, // R$ 1.200
    features: [
      'Análise do caso',
      'Boletim de ocorrência',
      'Notificação ao banco',
      'Ação judicial de recuperação',
    ],
    benefits: [
      'Ação em 24-48h',
      '85% de recuperação',
      'Sem custo inicial',
    ],
    documents_required: [
      'RG e CPF',
      'Comprovante da transferência PIX',
      'Print das conversas',
      'Boletim de ocorrência',
    ],
    
    is_active: true,
    
  },
  {
    id: 'negativacao-indevida',
    name: 'Negativação Indevida',
    slug: 'negativacao-indevida',
    category: 'financeiro',
    description: 'Remoção de nome do SPC/Serasa + indenização por danos morais',
    hero_title: 'Nome sujo sem dever? Limpe e receba indenização',
    hero_subtitle: 'Remoção em 48h + R$ 5 a 15 mil de indenização',
    hero_problem: 'Seu nome foi negativado indevidamente?',
    base_price: 100000, // R$ 1.000
    features: [
      'Análise da negativação',
      'Notificação extrajudicial',
      'Ação de indenização',
      'Pedido de liminar',
    ],
    benefits: [
      'Remoção em 48h',
      'R$ 5-15 mil de indenização',
      'Limpa seu nome',
    ],
    documents_required: [
      'RG e CPF',
      'Comprovante de negativação',
      'Comprovante de residência',
    ],
    
    is_active: true,
    
  },
  {
    id: 'defesa-execucao',
    name: 'Defesa em Execução',
    slug: 'defesa-execucao',
    category: 'financeiro',
    description: 'Embargos à execução e defesa em cobranças judiciais',
    hero_title: 'Está sendo executado? Defenda-se',
    hero_subtitle: 'Embargos e defesa especializada em execuções',
    base_price: 180000, // R$ 1.800
    features: [
      'Análise da execução',
      'Embargos do devedor',
      'Impugnação ao cumprimento',
      'Negociação de acordo',
    ],
    
    is_active: true,
  },

  // ============================================
  // PROTEÇÃO PATRIMONIAL
  // ============================================
  {
    id: 'direito-imobiliario',
    name: 'Direito Imobiliário',
    slug: 'direito-imobiliario',
    category: 'patrimonial',
    description: 'Assessoria completa em transações imobiliárias',
    hero_title: 'Compra ou Venda de Imóvel Segura',
    hero_subtitle: 'Análise completa e proteção jurídica na sua transação',
    base_price: 150000, // R$ 1.500
    features: [
      'Análise de contrato de compra e venda',
      'Verificação de matrícula atualizada',
      'Análise de certidões',
      'Cálculo de ITBI e custos',
    ],
    
    is_active: true,
  },
  {
    id: 'usucapiao',
    name: 'Usucapião',
    slug: 'usucapiao',
    category: 'patrimonial',
    description: 'Regularização de imóvel por usucapião judicial ou extrajudicial',
    hero_title: 'Regularize seu Imóvel por Usucapião',
    hero_subtitle: 'Judicial ou extrajudicial - você escolhe',
    base_price: 300000, // R$ 3.000
    features: [
      'Análise de viabilidade',
      'Levantamento documental',
      'Petição inicial ou requerimento',
      'Acompanhamento completo',
    ],
    
    is_active: true,
  },
  {
    id: 'holding-familiar',
    name: 'Holding Familiar',
    slug: 'holding-familiar',
    category: 'patrimonial',
    description: 'Estruturação de holding para proteção patrimonial',
    hero_title: 'Proteja seu Patrimônio com Holding Familiar',
    hero_subtitle: 'Planejamento sucessório e economia de impostos',
    base_price: 500000, // R$ 5.000
    features: [
      'Planejamento societário',
      'Constituição da empresa',
      'Transferência de bens',
      'Planejamento sucessório',
    ],
    
    is_active: true,
    
  },
  {
    id: 'inventario',
    name: 'Inventário',
    slug: 'inventario',
    category: 'patrimonial',
    description: 'Inventário judicial ou extrajudicial para partilha de bens',
    hero_title: 'Inventário Rápido e Sem Burocracia',
    hero_subtitle: 'Judicial ou extrajudicial - a partir de R$ 3.500',
    base_price: 350000, // R$ 3.500
    features: [
      'Levantamento de bens e dívidas',
      'Cálculo de impostos (ITCMD)',
      'Elaboração da minuta',
      'Registro em cartório',
    ],
    
    is_active: true,
  },
  {
    id: 'regularizacao-imovel',
    name: 'Regularização de Imóvel',
    slug: 'regularizacao-imovel',
    category: 'patrimonial',
    description: 'Regularização documental de imóveis irregulares',
    hero_title: 'Regularize seu Imóvel',
    hero_subtitle: 'Averbação, retificação e desmembramento',
    base_price: 200000, // R$ 2.000
    features: [
      'Análise da situação',
      'Retificação de área',
      'Averbação de construção',
      'Desmembramento/unificação',
    ],
    
    is_active: true,
  },
  {
    id: 'avaliacao-imoveis',
    name: 'Avaliação de Imóveis',
    slug: 'avaliacao-imoveis',
    category: 'patrimonial',
    description: 'Laudo de avaliação conforme NBR 14653',
    hero_title: 'Avaliação Profissional de Imóveis',
    hero_subtitle: 'Laudo técnico conforme NBR 14653',
    base_price: 120000, // R$ 1.200
    features: [
      'Vistoria presencial',
      'Análise de mercado',
      'Laudo conforme NBR 14653',
      'Fotos e plantas detalhadas',
    ],
    
    is_active: true,
  },

  // ============================================
  // PROTEÇÃO DE SAÚDE
  // ============================================
  {
    id: 'plano-saude',
    name: 'Plano de Saúde Negou',
    slug: 'plano-saude',
    category: 'saude',
    description: 'Ação contra plano de saúde por negativa de cobertura',
    hero_title: 'Plano de Saúde Negou? Force a Cobertura',
    hero_subtitle: 'Liminar em 24-48h + Indenização',
    base_price: 150000, // R$ 1.500
    features: [
      'Análise da negativa',
      'Notificação ao plano',
      'Ação com pedido de liminar',
      'Indenização por danos',
    ],
    
    is_active: true,
    
  },
  {
    id: 'cirurgia-bariatrica',
    name: 'Cirurgia Bariátrica',
    slug: 'cirurgia-bariatrica',
    category: 'saude',
    description: 'Ação para obrigar plano a cobrir cirurgia bariátrica',
    hero_title: 'Cirurgia Bariátrica Negada?',
    hero_subtitle: 'Force a cobertura do seu plano',
    base_price: 180000, // R$ 1.800
    features: [
      'Análise do contrato',
      'Parecer médico',
      'Ação com tutela de urgência',
      'Acompanhamento até a cirurgia',
    ],
    
    is_active: true,
  },
  {
    id: 'tratamento-tea',
    name: 'Tratamento TEA',
    slug: 'tratamento-tea',
    category: 'saude',
    description: 'Ação para cobertura de tratamento de autismo (TEA)',
    hero_title: 'Tratamento de Autismo (TEA)',
    hero_subtitle: 'Garanta a cobertura integral do tratamento',
    base_price: 150000, // R$ 1.500
    features: [
      'Análise da negativa',
      'Laudos e relatórios médicos',
      'Ação com liminar',
      'Cobertura integral do tratamento',
    ],
    
    is_active: true,
  },
  {
    id: 'bpc-loas',
    name: 'BPC / LOAS',
    slug: 'bpc-loas',
    category: 'saude',
    description: 'Benefício de Prestação Continuada para idosos e deficientes',
    hero_title: 'BPC/LOAS - 1 Salário Mínimo Vitalício',
    hero_subtitle: 'Para idosos e pessoas com deficiência',
    base_price: 120000, // R$ 1.200
    features: [
      'Análise de requisitos',
      'Requerimento administrativo',
      'Ação judicial se negado',
      'Acompanhamento do benefício',
    ],
    
    is_active: true,
  },
  {
    id: 'pericia-medica',
    name: 'Perícia Médica',
    slug: 'pericia-medica',
    category: 'saude',
    description: 'Laudo pericial para processos de saúde e previdência',
    hero_title: 'Perícia Médica Especializada',
    hero_subtitle: 'Laudo técnico para seu processo',
    base_price: 250000, // R$ 2.500
    features: [
      'Análise de laudos e exames',
      'Avaliação de nexo causal',
      'Cálculo de incapacidade',
      'Parecer técnico fundamentado',
    ],
    
    is_active: true,
  },

  // ============================================
  // PERÍCIA E DOCUMENTOS
  // ============================================
  {
    id: 'pericia-documental',
    name: 'Perícia Documental',
    slug: 'pericia-documental',
    category: 'pericia',
    description: 'Análise grafotécnica e autenticidade de documentos',
    hero_title: 'Perícia Documental Profissional',
    hero_subtitle: 'Detecte falsificações e adulterações',
    base_price: 200000, // R$ 2.000
    features: [
      'Análise de autenticidade',
      'Detecção de adulterações',
      'Comparação grafotécnica',
      'Laudo técnico pericial',
    ],
    
    is_active: true,
  },
  {
    id: 'grafotecnia',
    name: 'Grafotecnia',
    slug: 'grafotecnia',
    category: 'pericia',
    description: 'Exame de assinaturas e manuscritos para comprovação de autoria',
    hero_title: 'Exame Grafotécnico',
    hero_subtitle: 'Comprove a autenticidade de assinaturas',
    base_price: 180000, // R$ 1.800
    features: [
      'Coleta de padrões gráficos',
      'Análise comparativa',
      'Laudo grafotécnico',
      'Atuação como assistente técnico',
    ],
    
    is_active: true,
  },
  {
    id: 'laudo-tecnico',
    name: 'Laudo Técnico',
    slug: 'laudo-tecnico',
    category: 'pericia',
    description: 'Laudos técnicos para processos judiciais e extrajudiciais',
    hero_title: 'Laudo Técnico Especializado',
    hero_subtitle: 'Para processos judiciais e extrajudiciais',
    base_price: 150000, // R$ 1.500
    features: [
      'Análise técnica especializada',
      'Fundamentação legal',
      'Parecer conclusivo',
      'Defesa em audiência',
    ],
    
    is_active: true,
  },

  // ============================================
  // DEFESA CRIMINAL
  // ============================================
  {
    id: 'direito-criminal',
    name: 'Direito Criminal',
    slug: 'direito-criminal',
    category: 'criminal',
    description: 'Defesa criminal completa em processos e inquéritos',
    hero_title: 'Defesa Criminal Especializada',
    hero_subtitle: 'Proteja seus direitos e sua liberdade',
    base_price: 250000, // R$ 2.500
    features: [
      'Análise do inquérito/processo',
      'Estratégia de defesa',
      'Habeas Corpus se cabível',
      'Acompanhamento de audiências',
    ],
    
    is_active: true,
  },
  {
    id: 'direito-aeronautico',
    name: 'Direito Aeronáutico',
    slug: 'direito-aeronautico',
    category: 'criminal',
    description: 'Assessoria jurídica especializada em aviação',
    hero_title: 'Direito Aeronáutico',
    hero_subtitle: 'Especialistas em aviação e regulação ANAC',
    base_price: 300000, // R$ 3.000
    features: [
      'Consultoria regulatória (ANAC)',
      'Acidentes e incidentes',
      'Licenças e certificados',
      'Defesa administrativa',
    ],
    
    is_active: true,
  },

  // ============================================
  // AUTOMAÇÃO JURÍDICA
  // ============================================
  {
    id: 'secretaria-remota',
    name: 'Secretaria Remota',
    slug: 'secretaria-remota',
    category: 'automacao',
    description: 'Gestão de prazos, petições e acompanhamento processual',
    hero_title: 'Secretaria Jurídica Remota',
    hero_subtitle: 'Gestão profissional dos seus processos',
    base_price: 80000, // R$ 800/mês
    features: [
      'Monitoramento de prazos',
      'Alertas automáticos',
      'Protocolo de petições',
      'Relatórios mensais',
    ],
    
    is_active: true,
  },
  {
    id: 'aposentadoria',
    name: 'Aposentadoria',
    slug: 'aposentadoria',
    category: 'automacao',
    description: 'Análise e requerimento de aposentadoria junto ao INSS',
    hero_title: 'Aposentadoria pelo INSS',
    hero_subtitle: 'Maximize seu benefício',
    base_price: 150000, // R$ 1.500
    features: [
      'Análise de tempo de contribuição',
      'Simulação de benefício',
      'Requerimento administrativo',
      'Ação judicial se negado',
    ],
    
    is_active: true,
  },
]

// Pacotes para cada produto
const packages = {
  'desbloqueio-conta': [
    {
      name: 'Análise Gratuita',
      description: 'Análise inicial do caso',
      price: 0,
      features: ['Análise do bloqueio', 'Orientação inicial', 'Proposta personalizada'],
      order_index: 0,
    },
    {
      name: 'Desbloqueio Completo',
      description: 'Serviço completo de desbloqueio',
      price: 150000,
      features: [
        'Análise completa',
        'Petição urgente com liminar',
        'Acompanhamento diário',
        'Garantia de satisfação',
      ],
      is_recommended: true,
      order_index: 1,
    },
  ],
  'golpe-pix': [
    {
      name: 'Análise + Orientação',
      description: 'Análise do caso e orientação jurídica',
      price: 29700,
      features: ['Análise do caso', 'Orientação jurídica', 'Plano de ação'],
      order_index: 0,
    },
    {
      name: 'Notificação Extrajudicial',
      description: 'Notificação ao banco para tentativa de recuperação',
      price: 69700,
      features: ['Tudo anterior', 'Notificação ao banco', 'Cobrança extrajudicial'],
      is_recommended: true,
      order_index: 1,
    },
    {
      name: 'Ação Judicial Completa',
      description: 'Ação judicial para recuperação do valor',
      price: 120000,
      features: ['Tudo anterior', 'Ação judicial', 'Acompanhamento completo'],
      order_index: 2,
    },
  ],
  'negativacao-indevida': [
    {
      name: 'Notificação Extrajudicial',
      description: 'Tentativa de remoção extrajudicial',
      price: 39700,
      features: ['Análise da negativação', 'Notificação ao credor', 'Cobrança de remoção'],
      order_index: 0,
    },
    {
      name: 'Remoção com Liminar',
      description: 'Ação judicial com pedido de liminar',
      price: 89700,
      features: ['Tudo anterior', 'Ação judicial', 'Liminar em 48h', 'Remoção garantida'],
      is_recommended: true,
      order_index: 1,
    },
    {
      name: 'Remoção + Indenização',
      description: 'Remoção do nome + pedido de indenização',
      price: 100000,
      features: [
        'Tudo anterior',
        'Pedido de indenização',
        'R$ 5-15 mil esperado',
        'Sem custo adicional',
      ],
      order_index: 2,
    },
  ],
  'plano-saude': [
    {
      name: 'Notificação Extrajudicial',
      description: 'Tentativa extrajudicial de cobertura',
      price: 49700,
      features: ['Análise da negativa', 'Notificação ao plano', 'Fundamentação legal'],
      order_index: 0,
    },
    {
      name: 'Ação com Liminar',
      description: 'Ação judicial com pedido de urgência',
      price: 150000,
      features: [
        'Tudo anterior',
        'Ação judicial urgente',
        'Liminar em 24-48h',
        'Acompanhamento',
      ],
      is_recommended: true,
      order_index: 1,
    },
    {
      name: 'Ação + Indenização',
      description: 'Cobertura + indenização por danos',
      price: 200000,
      features: ['Tudo anterior', 'Pedido de indenização', 'Danos morais', 'Danos materiais'],
      order_index: 2,
    },
  ],
}

async function migrate() {
  console.log('🚀 Iniciando migração de produtos...\n')

  let successCount = 0
  let errorCount = 0

  for (const product of products) {
    console.log(`📦 Migrando produto: ${product.name}`)

    try {
      // Inserir produto
      const { data: productData, error: productError } = await supabase
        .from('products')
        .upsert(product, { onConflict: 'id' })
        .select()
        .single()

      if (productError) {
        console.error(`❌ Erro ao migrar ${product.name}:`, productError.message)
        errorCount++
        continue
      }

      console.log(`✅ Produto ${product.name} migrado com sucesso`)
      successCount++

      // Inserir pacotes se existirem
      const productPackages = packages[product.id]
      if (productPackages) {
        console.log(`   📦 Migrando ${productPackages.length} pacotes...`)

        for (const pkg of productPackages) {
          const { error: pkgError } = await supabase.from('product_packages').insert({
            product_id: product.id,
            ...pkg,
          })

          if (pkgError) {
            console.error(`   ❌ Erro ao migrar pacote ${pkg.name}:`, pkgError.message)
          } else {
            console.log(`   ✅ Pacote ${pkg.name} migrado`)
          }
        }
      }

      console.log('')
    } catch (error) {
      console.error(`❌ Erro inesperado ao migrar ${product.name}:`, error)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 RESUMO DA MIGRAÇÃO')
  console.log('='.repeat(50))
  console.log(`✅ Produtos migrados com sucesso: ${successCount}`)
  console.log(`❌ Produtos com erro: ${errorCount}`)
  console.log(`📦 Total de produtos processados: ${products.length}`)
  console.log('='.repeat(50))

  if (errorCount === 0) {
    console.log('\n🎉 Migração concluída com sucesso!\n')
  } else {
    console.log('\n⚠️  Migração concluída com alguns erros. Verifique os logs acima.\n')
    process.exit(1)
  }
}

migrate().catch((error) => {
  console.error('\n💥 Erro fatal durante a migração:', error)
  process.exit(1)
})
