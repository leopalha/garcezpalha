/**
 * Script para gerar landing pages no padrão TOP
 * para os 22 novos produtos
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Mapeamento de categorias para cores e dados VSL
const categoryData: Record<string, {
  heroColor: string
  agitationPoints: string[]
  solutionSteps: string[]
}> = {
  bancario: {
    heroColor: 'blue',
    agitationPoints: [
      'Tarifas e juros abusivos consomem seu dinheiro sem você perceber',
      'Contratos bancários complexos escondem cobranças ilegais',
      'Bancos dificultam portabilidade e revisão de contratos',
      'Seguros embutidos sem autorização geram prejuízos',
      'Falta de transparência mantém você pagando mais',
    ],
    solutionSteps: [
      'Análise detalhada do contrato e extratos bancários',
      'Identificação de cobranças ilegais e juros abusivos',
      'Cálculo de valores a restituir',
      'Notificação extrajudicial ao banco',
      'Ação judicial para restituição em dobro',
      'Acompanhamento até recuperação total',
    ],
  },
  telecom: {
    heroColor: 'purple',
    agitationPoints: [
      'Cobranças indevidas em faturas de telefone/internet',
      'Multas abusivas por cancelamento ou troca de operadora',
      'Operadoras dificultam portabilidade de número',
      'Serviços contratados não entregues conforme prometido',
      'Atendimento ruim e problemas não resolvidos',
    ],
    solutionSteps: [
      'Análise de faturas e contratos',
      'Identificação de cobranças indevidas',
      'Protocolo de reclamação na Anatel',
      'Notificação à operadora',
      'Ação no JEC para restituição e danos morais',
      'Garantia de portabilidade ou cancelamento',
    ],
  },
  energia: {
    heroColor: 'yellow',
    agitationPoints: [
      'Contas de luz absurdamente altas sem explicação',
      'Cobranças retroativas de consumo não medido',
      'Religação negada ou demorada',
      'Medidores com defeito gerando cobranças erradas',
      'Distribuidora não resolve problemas',
    ],
    solutionSteps: [
      'Análise técnica do histórico de consumo',
      'Perícia em medidor (se necessário)',
      'Protocolo na Aneel',
      'Notificação à distribuidora',
      'Ação para anular cobranças indevidas',
      'Restituição em dobro + danos morais',
    ],
  },
  consumidor: {
    heroColor: 'green',
    agitationPoints: [
      'Produtos com defeito e loja se recusa a trocar',
      'Entrega atrasada sem previsão ou compensação',
      'Assinaturas digitais impossíveis de cancelar',
      'Promessas não cumpridas em compras',
      'Empresa ignora seus direitos como consumidor',
    ],
    solutionSteps: [
      'Análise da compra, nota fiscal e garantia',
      'Protocolo no Procon',
      'Notificação à empresa',
      'Ação no JEC (sem custas iniciais)',
      'Restituição, troca ou abatimento',
      'Danos morais se produto essencial',
    ],
  },
  previdenciario: {
    heroColor: 'cyan',
    agitationPoints: [
      'INSS negou seu benefício sem justificativa adequada',
      'Aposentadoria calculada errada, valor menor que o devido',
      'Perícia médica injusta negou auxílio',
      'Tempo de contribuição não reconhecido',
      'Benefício cortado sem aviso prévio',
    ],
    solutionSteps: [
      'Análise do CNIS e documentação',
      'Cálculo correto do benefício',
      'Recurso administrativo no INSS',
      'Ação judicial para concessão/revisão',
      'Perícia médica judicial (se necessário)',
      'Recebimento retroativo desde a data do requerimento',
    ],
  },
  trabalhista: {
    heroColor: 'orange',
    agitationPoints: [
      'Empresa não pagou verbas rescisórias corretamente',
      'Horas extras trabalhadas não foram pagas',
      'Férias e 13º salário calculados errado',
      'FGTS não depositado',
      'Direitos trabalhistas desrespeitados',
    ],
    solutionSteps: [
      'Análise de contracheques e rescisão',
      'Cálculo de valores devidos',
      'Tentativa de acordo extrajudicial',
      'Reclamação trabalhista na Justiça do Trabalho',
      'Audiência e sustentação oral',
      'Execução para receber os valores',
    ],
  },
  servidor: {
    heroColor: 'indigo',
    agitationPoints: [
      'Gratificações e vantagens não incorporadas ao salário',
      'Diferenças salariais não pagas',
      'Progressão funcional negada',
      'Direitos de servidor público desrespeitados',
      'Aposentadoria calculada incorretamente',
    ],
    solutionSteps: [
      'Análise de contracheques e legislação',
      'Cálculo de diferenças retroativas',
      'Processo administrativo',
      'Ação judicial (Mandado de Segurança)',
      'Incorporação definitiva de vantagens',
      'Recebimento de valores atrasados',
    ],
  },
  educacional: {
    heroColor: 'rose',
    agitationPoints: [
      'Dívida do FIES crescendo descontroladamente',
      'Impossibilidade de pagar as parcelas',
      'Nome negativado por dívida estudantil',
      'Renegociação negada ou com juros abusivos',
      'Faculdade cobrada indevidamente',
    ],
    solutionSteps: [
      'Análise do contrato FIES',
      'Verificação de irregularidades',
      'Negociação com FNDE/Caixa',
      'Ação para renegociação com condições justas',
      'Suspensão de negativação',
      'Redução de juros e parcelamento viável',
    ],
  },
  condominial: {
    heroColor: 'slate',
    agitationPoints: [
      'Cobrança de condomínio com valores abusivos',
      'Taxas extras não autorizadas em assembleia',
      'Multas indevidas aplicadas',
      'Obras não aprovadas gerando custos',
      'Síndico ou administradora age de má-fé',
    ],
    solutionSteps: [
      'Análise de atas, convenção e boletos',
      'Verificação de legalidade das cobranças',
      'Contestação em assembleia',
      'Ação para anular cobranças indevidas',
      'Restituição de valores pagos a mais',
      'Regularização de cobranças futuras',
    ],
  },
}

const template = (category: string, slug: string, productName: string) => {
  const data = categoryData[category]

  return `import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'
import { Shield } from 'lucide-react'

export default function ${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Page() {
  const product = getProductBySlug('${slug}')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="${data.heroColor}"
      heroIcon={Shield}
      agitationPoints={${JSON.stringify(data.agitationPoints, null, 8)}}
      solutionSteps={${JSON.stringify(data.solutionSteps, null, 8)}}
      urgencyMessage="⚡ Atendimento prioritário - Análise gratuita do seu caso"
      guaranteeTitle="Garantia de Resultado"
      guaranteeDescription="Trabalhamos com honorários de êxito. Só cobramos se você ganhar."
      stats={{
        years: 10,
        cases: 300,
        successRate: 85,
        clients: 250,
      }}
    />
  )
}
`
}

// Produtos novos que precisam de página
const newProducts = [
  // Bancário (4)
  { category: 'bancario', slug: 'seguro-prestamista', name: 'Seguro Prestamista' },
  { category: 'bancario', slug: 'revisao-contrato-bancario', name: 'Revisão Contrato Bancário' },
  { category: 'bancario', slug: 'portabilidade-credito', name: 'Portabilidade Crédito' },
  { category: 'bancario', slug: 'fraude-consignado', name: 'Fraude Consignado' },

  // Telecom (3)
  { category: 'telecom', slug: 'cobranca-telefonia', name: 'Cobrança Telefonia' },
  { category: 'telecom', slug: 'multa-fidelidade', name: 'Multa Fidelidade' },
  { category: 'telecom', slug: 'portabilidade-numero', name: 'Portabilidade Número' },

  // Energia (1)
  { category: 'energia', slug: 'cobranca-energia', name: 'Cobrança Energia' },

  // Consumidor (5)
  { category: 'consumidor', slug: 'distrato-imobiliario', name: 'Distrato Imobiliário' },
  { category: 'consumidor', slug: 'assinaturas-digitais', name: 'Assinaturas Digitais' },
  { category: 'consumidor', slug: 'overbooking-voo', name: 'Overbooking Voo' },
  { category: 'consumidor', slug: 'produto-vicio', name: 'Produto Vício' },
  { category: 'consumidor', slug: 'atraso-entrega', name: 'Atraso Entrega' },

  // Previdenciário (3)
  { category: 'previdenciario', slug: 'revisao-aposentadoria', name: 'Revisão Aposentadoria' },
  { category: 'previdenciario', slug: 'beneficio-negado', name: 'Benefício Negado' },
  { category: 'previdenciario', slug: 'auxilio-acidente', name: 'Auxílio Acidente' },

  // Trabalhista (2)
  { category: 'trabalhista', slug: 'verbas-rescisoria', name: 'Verbas Rescisórias' },
  { category: 'trabalhista', slug: 'horas-extras', name: 'Horas Extras' },

  // Servidor (2)
  { category: 'servidor', slug: 'incorporacao-gratificacao', name: 'Incorporação Gratificação' },
  { category: 'servidor', slug: 'diferencas-salariais', name: 'Diferenças Salariais' },

  // Educacional (1)
  { category: 'educacional', slug: 'fies-renegociacao', name: 'FIES Renegociação' },

  // Condominial (1)
  { category: 'condominial', slug: 'cobranca-condominial', name: 'Cobrança Condominial' },
]

console.log('Gerando páginas para 22 novos produtos...\\n')

newProducts.forEach(({ category, slug, name }) => {
  const dir = join(process.cwd(), 'src', 'app', '(marketing)', 'solucoes', category, slug)
  const file = join(dir, 'page.tsx')

  try {
    mkdirSync(dir, { recursive: true })
    writeFileSync(file, template(category, slug, name))
    console.log(`✅ ${category}/${slug}`)
  } catch (err) {
    console.error(`❌ ${category}/${slug}:`, err)
  }
})

console.log('\\n✅ Todas as 22 páginas foram geradas!')
console.log('Execute: npm run build para verificar')
