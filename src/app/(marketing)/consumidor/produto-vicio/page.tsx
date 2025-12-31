'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function ProdutoVicioPage() {
  const product = getProductBySlug('produto-vicio')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="red"
      heroIcon="AlertOctagon"
      agitationPoints={[
        'Produto novo apresenta defeito logo após compra',
        'Loja/fabricante não conserta em 30 dias',
        'Assistência técnica enrola e não resolve problema',
        'Produto fica mais tempo na assistência que com você',
        'Querem te dar crédito na loja em vez de dinheiro',
        'Garantia venceu mas defeito é de fabricação (vício oculto)'
      ]}
      solutionSteps={[
        'Rescisão do contrato - Devolução do dinheiro integral',
        'Troca por produto novo - Se você preferir',
        'Abatimento do preço - Proporcional ao defeito',
        'Danos morais - Indenização por vício não sanado (R$ 3k a R$ 8k)',
        'Vício oculto - Mesmo após garantia, se defeito é de fábrica',
        'Prazo de 30 dias - Se não consertarem, você escolhe a solução'
      ]}
      urgencyMessage="🔧 PRODUTO COM DEFEITO? Devolução + Danos morais garantidos"
      guaranteeTitle="30 Dias para Consertar ou Devolver Dinheiro"
      guaranteeDescription="CDC Art. 18: se produto não for consertado em 30 dias, você escolhe: troca, devolução do dinheiro ou abatimento do preço."
      stats={{
        years: 9,
        cases: 980,
        successRate: 91,
        clients: 890,
      }}
      customAlert={{
        title: "Depois de 30 dias SEM CONSERTO, você ESCOLHE a solução!",
        description: "Loja/fabricante tem 30 dias para consertar. Se não conseguirem, você decide: quer dinheiro de volta, troca por produto novo ou desconto no preço. NÃO aceite crédito na loja se quiser dinheiro!"
      }}
    />
  )
}
