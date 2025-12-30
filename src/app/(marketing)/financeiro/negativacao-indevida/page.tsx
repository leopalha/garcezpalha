import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO
export async function generateMetadata() {
  const product = getProductBySlug('negativacao-indevida')
  if (!product) return {}

  return {
    title: `${product.name} | Garcez Palha Advogados`,
    description: product.description,
  }
}





export default function NegativacaoIndevidaPage() {
  const product = getProductBySlug('negativacao-indevida')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="blue"
      heroIcon="CreditCard"
      agitationPoints={[
        'Não consegue fazer empréstimos ou financiamentos',
        'Compras parceladas recusadas em lojas',
        'Cartões de crédito negados ou cancelados',
        'Oportunidades de emprego perdidas por nome sujo',
        'Constrangimento ao ser recusado em estabelecimentos',
        'Dificuldade para alugar imóvel ou abrir conta bancária',
      ]}
      solutionSteps={[
        'Análise GRATUITA da negativação - Verificamos se é indevida e seu direito',
        'Consulta completa Serasa/SPC/Boa Vista - Identificamos todas as negativações',
        'Petição com liminar urgente - Solicitamos limpeza imediata (24-48h)',
        'Pedido de indenização - Danos morais entre R$ 5.000 e R$ 15.000',
        'Limpeza definitiva do CPF/CNPJ - Nome limpo para crédito imediato',
        'Acompanhamento até indenização - Garantimos pagamento total',
      ]}
      urgencyMessage="⚠️ NOME SUJO INDEVIDAMENTE? Limpeza em 48h + Indenização até R$ 15 mil"
      guaranteeTitle="Limpeza Garantida em 48h ou Dinheiro de Volta"
      guaranteeDescription="Se não conseguirmos a liminar de limpeza do seu nome em 48h, devolvemos 100% do valor pago. Nossa taxa de sucesso é de 92%."
      stats={{
        years: 12,
        cases: 800,
        successRate: 92,
        clients: 1000,
      }}
      customAlert={{
        title: "Você Sabia?",
        description: "Negativação indevida gera direito a indenização por danos morais entre R$ 5.000 e R$ 15.000, além da limpeza imediata do nome. Muitas pessoas têm esse direito e não sabem."
      }}
    />
  )
}
