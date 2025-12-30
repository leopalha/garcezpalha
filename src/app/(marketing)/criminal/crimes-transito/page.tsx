'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)

// Generate metadata for SEO





export default function CrimesTransitoPage() {
  const product = getProductBySlug('crimes-transito')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="violet"
      heroIcon="Shield"
      agitationPoints={[
        'Acidente de trânsito pode resultar em processo criminal e prisão',
        'Testemunhas e perícias desfavoráveis sem defesa adequada condenam injustamente',
        'Perda da CNH definitiva e antecedentes criminais destroem oportunidades',
        'Indenizações milionárias podem ser impostas sem contestação',
        'Crimes culposos (sem intenção) também geram condenação e prisão',
        'Defesa pública muitas vezes não tem tempo para análise técnica adequada'
      ]}
      solutionSteps={[
        'Análise URGENTE do acidente - Verificamos responsabilidades e estratégia',
        'Perícia técnica independente - Questionamos laudos desfavoráveis',
        'Defesa no processo criminal - Atuamos para absolvição ou penas alternativas',
        'Contestação de indenizações - Reduzimos valores de danos materiais e morais',
        'Preservação da CNH - Evitamos suspensão definitiva da carteira',
        'Recursos em todas instâncias - Lutamos até STJ/STF se necessário'
      ]}
      urgencyMessage="ENVOLVIDO EM ACIDENTE? Defesa criminal + cível completa"
      guaranteeTitle="Defesa Completa"
      guaranteeDescription="Atuação conjunta na esfera criminal e cível para proteger sua liberdade e patrimônio."
      stats={{
        years: 15,
        cases: 380,
        successRate: 82,
        clients: 320,
      }}
      customAlert={{
        title: "Acidente de Trânsito é Crime?",
        description: "Sim! Homicídio culposo, lesão corporal culposa e embriaguez ao volante são crimes que podem resultar em prisão e antecedentes criminais. Defenda-se desde o início."
      }}
    />
  )
}
