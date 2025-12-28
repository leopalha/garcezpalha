import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function DefesaFlagrantePage() {
  const product = getProductBySlug('defesa-flagrante')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="violet"
      heroIcon="Shield"
      agitationPoints={[
        'Prisão em flagrante pode resultar em meses de prisão preventiva sem necessidade',
        'Primeiras horas são cruciais para evitar prisão preventiva e perda de direitos',
        'Sem advogado, você pode ser induzido a confessar crimes que não cometeu',
        'Depoimento sem orientação técnica pode prejudicar toda sua defesa futura',
        'Liberdade provisória pode ser negada por falta de argumentação adequada',
        'Cada dia preso afeta sua vida pessoal, profissional e familiar irreversivelmente'
      ]}
      solutionSteps={[
        'Atendimento URGENTE 24h - Advogado na delegacia em até 2h após o chamado',
        'Orientação no flagrante - Protegemos seus direitos durante depoimento',
        'Habeas Corpus preventivo - Evitamos prisão preventiva desnecessária',
        'Liberdade provisória - Argumentação técnica para soltura imediata',
        'Análise de ilegalidades - Identificamos vícios na prisão para relaxamento',
        'Acompanhamento completo - Defesa desde a delegacia até sentença final'
      ]}
      urgencyMessage="ATENDIMENTO 24 HORAS - Plantão criminal para prisões em flagrante"
      guaranteeTitle="Atendimento 24 Horas"
      guaranteeDescription="Plantão criminal 24/7 para atendimento imediato em delegacia. Advogado disponível em até 2h após chamado."
      stats={{
        years: 15,
        cases: 400,
        successRate: 85,
        clients: 350,
      }}
      customAlert={{
        title: "ATENÇÃO: Cada hora conta!",
        description: "Nas primeiras horas após a prisão em flagrante, podemos evitar a conversão em prisão preventiva. Quanto mais rápido agirmos, maiores as chances de liberdade provisória."
      }}
    />
  )
}
