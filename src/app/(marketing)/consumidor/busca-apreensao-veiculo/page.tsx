'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function BuscaApreensaoVeiculoPage() {
  const product = getProductBySlug('busca-apreensao-veiculo')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="red"
      heroIcon="Truck"
      agitationPoints={[
        'Banco entrou com busca e apreensão do seu carro por 2-3 parcelas atrasadas',
        'Liminar de apreensão concedida e oficial pode buscar veículo a qualquer momento',
        'Você precisa do carro para trabalhar mas banco quer tomar',
        'Parcelas são abusivas com juros de 3-5% ao mês',
        'Já pagou 60-70% do financiamento e vai perder tudo',
        'Desespero te leva a aceitar acordo ruim com mais juros'
      ]}
      solutionSteps={[
        'Suspensão da liminar - Impedimos apreensão do veículo',
        'Purgação da mora - Pagamos parcelas atrasadas + custas em até 30 dias',
        'Revisão do contrato - Questionamos juros abusivos e tarifas',
        'Redução das parcelas - Recalculamos com juros justos',
        'Restituição de valores - Recuperamos tarifas e seguros indevidos',
        'Quitação antecipada - Com desconto dos juros futuros'
      ]}
      urgencyMessage="🚗 CARRO VAI SER APREENDIDO? Suspenda liminar + Revise contrato"
      guaranteeTitle="Suspensão Imediata da Apreensão"
      guaranteeDescription="Contestamos a ação e suspendemos liminar de busca e apreensão. Você mantém o carro enquanto discutimos juros abusivos."
      stats={{
        years: 9,
        cases: 480,
        successRate: 88,
        clients: 420,
      }}
      customAlert={{
        title: "Busca e apreensão pode ser SUSPENSA!",
        description: "Se você já pagou mais de 40% do financiamento e há cobrança de juros abusivos, podemos suspender a liminar e revisar o contrato. Não entregue o carro sem lutar!"
      }}
    />
  )
}
