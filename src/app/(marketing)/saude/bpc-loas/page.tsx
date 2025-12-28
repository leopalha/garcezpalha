import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function BpcLoasPage() {
  const product = getProductBySlug('bpc-loas')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="green"
      heroIcon="Heart"
      agitationPoints={[
        'Benefício negado pelo INSS mesmo tendo direito por baixa renda e deficiência',
        'Processo complexo e burocrático dificulta aprovação sem orientação técnica',
        'Perícia médica despreparada nega benefício para quem realmente precisa',
        'Cada mês sem BPC/LOAS é um salário mínimo que você perde e não recupera',
        'Família em situação vulnerável sem renda para necessidades básicas',
        'Tentativas sozinho resultam em negativa e perda de tempo precioso'
      ]}
      solutionSteps={[
        'Análise GRATUITA do caso - Verificamos se você tem direito ao BPC/LOAS',
        'Documentação completa - Orientamos sobre laudos e comprovantes necessários',
        'Preparo para perícia médica - Garantimos que deficiência seja bem avaliada',
        'Ação judicial se negado - Conseguimos benefício via justiça em 90% dos casos',
        'Acompanhamento até aprovação - Suporte completo até receber o benefício',
        'Pagamento retroativo - Receba valores desde a data do pedido'
      ]}
      urgencyMessage="BENEFÍCIO NEGADO? Conseguimos na justiça em 90% dos casos"
      guaranteeTitle="Honorários de Êxito"
      guaranteeDescription="Só cobramos se você ganhar o benefício. Nosso sucesso depende do seu."
      stats={{
        years: 12,
        cases: 850,
        successRate: 90,
        clients: 750,
      }}
      customAlert={{
        title: "Quem tem direito ao BPC/LOAS?",
        description: "Idosos acima de 65 anos ou pessoas com deficiência de qualquer idade, que tenham renda familiar per capita inferior a 1/4 do salário mínimo. O benefício é de 1 salário mínimo mensal."
      }}
    />
  )
}
