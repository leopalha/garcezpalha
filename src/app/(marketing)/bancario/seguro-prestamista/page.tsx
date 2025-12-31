'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function SeguroPrestamistaPage() {
  const product = getProductBySlug('seguro-prestamista')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="green"
      heroIcon="Shield"
      agitationPoints={[
        'Seguro prestamista embutido no empréstimo sem autorização clara',
        'Banco vendeu seguro junto com empréstimo (venda casada ilegal)',
        'Você nem sabia que estava pagando seguro prestamista',
        'Valor do seguro duplica ou triplica a dívida total',
        'Banco alega que seguro era "opcional" mas forçou contratação',
        'Recusa de empréstimo se você não aceitar o seguro'
      ]}
      solutionSteps={[
        'Identificação do seguro - Encontramos cobrança no contrato',
        'Venda casada comprovada - Demonstramos ilegalidade',
        'Restituição em DOBRO - Art. 42 CDC + Súmula 322 STJ',
        'Danos morais - Indenização por venda casada (R$ 3k a R$ 8k)',
        'Jurisprudência sólida - Tema 972 STJ favorável',
        'Processo no JEC - Sem custas iniciais, rápido e eficaz'
      ]}
      urgencyMessage="🛡️ SEGURO PRESTAMISTA? Restituição em DOBRO + Danos morais"
      guaranteeTitle="Tema 972 STJ - Jurisprudência Consolidada"
      guaranteeDescription="STJ decidiu que seguro prestamista não autorizado deve ser restituído em dobro + danos morais. Precedente favorável ao consumidor."
      stats={{
        years: 8,
        cases: 1120,
        successRate: 94,
        clients: 1050,
      }}
      customAlert={{
        title: "Seguro prestamista pode valer R$ 10k a R$ 50k em restituição!",
        description: "Restituição em DOBRO do valor pago + danos morais de R$ 3k a R$ 8k. Se você pagou R$ 5.000 de seguro, pode receber R$ 10.000 (dobro) + R$ 5.000 (danos morais) = R$ 15.000!"
      }}
    />
  )
}
