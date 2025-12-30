'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO





export default function CirurgiaBariatricaPage() {
  const product = getProductBySlug('cirurgia-bariatrica')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="green"
      heroIcon="Heart"
      agitationPoints={[
        'Plano de saúde nega cirurgia bariátrica mesmo com indicação médica clara',
        'Obesidade mórbida compromete sua saúde e qualidade de vida diariamente',
        'Espera na fila do SUS pode levar anos enquanto sua saúde se deteriora',
        'Custo particular da cirurgia (R$ 30-80 mil) é inacessível para maioria',
        'Cada dia sem tratamento aumenta riscos de diabetes, hipertensão e morte',
        'Tentativas de negociação com plano falham sem pressão jurídica'
      ]}
      solutionSteps={[
        'Análise GRATUITA do caso - Verificamos se seu plano é obrigado a cobrir',
        'Reunião de documentação médica - Organizamos laudos e exames necessários',
        'Notificação extrajudicial - Pressão formal para autorização imediata',
        'Liminar de urgência - Cirurgia autorizada judicialmente em 7-15 dias',
        'Indenização por danos morais - Compensação pela negativa abusiva',
        'Acompanhamento pós-cirúrgico - Garantia de cobertura completa'
      ]}
      urgencyMessage="CIRURGIA NEGADA? Conseguimos autorização judicial em 7-15 dias"
      guaranteeTitle="Autorização Garantida ou Dinheiro de Volta"
      guaranteeDescription="Se não conseguirmos a autorização judicial da cirurgia, devolvemos 100% dos honorários pagos."
      stats={{
        years: 10,
        cases: 420,
        successRate: 95,
        clients: 380,
      }}
      customAlert={{
        title: "Plano é Obrigado a Cobrir?",
        description: "Sim! Se você tem indicação médica (IMC acima de 40 ou acima de 35 com comorbidades) e já tentou tratamento clínico, o plano é obrigado a cobrir a cirurgia bariátrica."
      }}
    />
  )
}
