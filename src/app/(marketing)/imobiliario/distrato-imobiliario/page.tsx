'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function DistratoImobiliarioPage() {
  const product = getProductBySlug('distrato-imobiliario')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="red"
      heroIcon="Home"
      agitationPoints={[
        'Construtora retém 30-50% do valor pago como multa de distrato',
        'Obra atrasada há anos e você quer desistir mas perde tudo',
        'Contrato prevê perda de TODAS as parcelas pagas (cláusula abusiva)',
        'Construtora só devolve após vender para terceiro (anos de espera)',
        'Você pagou R$ 100k e só vai receber R$ 50k daqui a 2 anos',
        'Desespero financeiro te impede de questionar cláusulas abusivas'
      ]}
      solutionSteps={[
        'Análise do contrato - Identificamos cláusulas abusivas',
        'Distrato judicial - Rescindimos contrato com multa justa (10-25%)',
        'Devolução imediata - Liminar para receber valores em 60 dias',
        'Recuperação máxima - Minimizamos perdas com multa reduzida',
        'Danos morais - Indenização por retenção abusiva (R$ 5k a R$ 15k)',
        'Correção monetária - Valores devolvidos com juros e correção'
      ]}
      urgencyMessage="🏠 QUER DESISTIR DO IMÓVEL? Recupere até 90% do valor pago"
      guaranteeTitle="Devolução Maximizada Garantida"
      guaranteeDescription="Reduzimos multa de distrato de 30-50% para 10-25% via judicial. Você recupera muito mais do que no distrato amigável."
      stats={{
        years: 10,
        cases: 380,
        successRate: 91,
        clients: 350,
      }}
      customAlert={{
        title: "Multa de 30-50% é ABUSIVA!",
        description: "Judicialmente, a multa máxima de distrato é 10-25% conforme STJ. Se a construtora quer reter mais que isso, é ILEGAL. Não aceite perder metade do que pagou!"
      }}
    />
  )
}
