'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function OverbookingVooPage() {
  const product = getProductBySlug('overbooking-voo')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="blue"
      heroIcon="Plane"
      agitationPoints={[
        'Impedido de embarcar mesmo com passagem confirmada (overbooking)',
        'Voo cancelado ou atrasado mais de 4 horas sem assistência',
        'Perda de compromissos importantes (reunião, casamento, formatura)',
        'Bagagem extraviada, danificada ou entregue com dias de atraso',
        'Companhia oferece voucher irrisório que não cobre prejuízos',
        'Você aceita acordo ruim no desespero e perde direito a indenização justa'
      ]}
      solutionSteps={[
        'Documentação completa - Orientamos quais provas coletar',
        'Cálculo de indenização - Danos morais + materiais + lucros cessantes',
        'Ação no JEC - Processo rápido sem custas iniciais',
        'Indenização garantida - R$ 5k a R$ 30k conforme gravidade',
        'Reembolso de despesas - Hospedagem, alimentação, transporte',
        'Execução rápida - Recebimento em 6-12 meses'
      ]}
      urgencyMessage="✈️ VOO CANCELADO? Indenização de R$ 5k a R$ 30k + reembolso"
      guaranteeTitle="Indenização Garantida ou Não Paga"
      guaranteeDescription="Se não conseguirmos indenização, você não paga honorários. Garantia total de resultado."
      stats={{
        years: 8,
        cases: 920,
        successRate: 94,
        clients: 870,
      }}
      customAlert={{
        title: "NÃO ACEITE VOUCHER IRRISÓRIO!",
        description: "Companhias oferecem R$ 200-500 em voucher para você desistir de processar. Judicialmente você pode receber R$ 5k a R$ 30k conforme dano. Não assine nada sem consultar advogado!"
      }}
    />
  )
}
