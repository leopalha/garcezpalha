'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function AtrasoEntregaPage() {
  const product = getProductBySlug('atraso-entrega')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="orange"
      heroIcon="Truck"
      agitationPoints={[
        'Imóvel com entrega atrasada há meses ou anos',
        'Você paga aluguel + parcelas do imóvel que não pode usar',
        'Construtora alega "caso fortuito" para não indenizar',
        'Carência de 180 dias é usada abusivamente para não pagar multa',
        'Prejuízos se acumulam: aluguel, mudança, móveis planejados perdidos',
        'Você aceita "chaves na mão" sem questionar perdas financeiras'
      ]}
      solutionSteps={[
        'Cálculo de prejuízos - Aluguel + lucros cessantes + danos morais',
        'Multa contratual - 1% ao mês sobre valor do imóvel (cláusula penal)',
        'Lucros cessantes - Aluguel que você deixou de receber ou pagou a mais',
        'Danos morais - R$ 10k a R$ 50k conforme gravidade do atraso',
        'Multa de 2% + juros - Sobre valor total pago',
        'Execução garantida - Penhora de bens da construtora se necessário'
      ]}
      urgencyMessage="🏗️ OBRA ATRASADA? Indenização de R$ 30k a R$ 200k + multa"
      guaranteeTitle="Indenização Proporcional ao Atraso"
      guaranteeDescription="Quanto maior o atraso, maior a indenização. Calculamos todas as perdas: aluguel, lucros cessantes, danos morais e multas contratuais."
      stats={{
        years: 11,
        cases: 520,
        successRate: 93,
        clients: 480,
      }}
      customAlert={{
        title: "Carência de 180 dias NÃO exclui indenização!",
        description: "Após 180 dias de carência, CADA MÊS de atraso gera: multa de 1% sobre valor do imóvel + lucros cessantes + danos morais. Um atraso de 2 anos pode valer R$ 50k a R$ 200k!"
      }}
    />
  )
}
