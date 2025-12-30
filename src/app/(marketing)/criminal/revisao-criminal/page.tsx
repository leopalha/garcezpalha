import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO
export async function generateMetadata() {
  const product = getProductBySlug('revisao-criminal')
  if (!product) return {}

  return {
    title: `${product.name} | Garcez Palha Advogados`,
    description: product.description,
  }
}





export default function RevisaoCriminalPage() {
  const product = getProductBySlug('revisao-criminal')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="violet"
      heroIcon="Scale"
      agitationPoints={[
        'Condenação criminal injusta mantém você preso ou com antecedentes',
        'Provas novas podem provar sua inocência mas ninguém analisa',
        'Erros jurídicos na sentença passam despercebidos sem revisão técnica',
        'Pena excessiva ou desproporcional cumpre-se integralmente sem questionamento',
        'Cada dia a mais preso é irreversível para sua vida e família',
        'Antecedentes criminais impedem oportunidades de emprego e negócios'
      ]}
      solutionSteps={[
        'Análise COMPLETA do processo - Buscamos erros, vícios e provas novas',
        'Busca de provas inéditas - Investigação para demonstrar inocência',
        'Revisão criminal - Ação para absolvição ou redução de pena',
        'Habeas Corpus - Liberdade imediata se houver constrangimento ilegal',
        'Progressão de regime - Antecipação de benefícios legais',
        'Extinção da punibilidade - Prescrição, anistia ou outras causas'
      ]}
      urgencyMessage="JÁ CONDENADO? Revisão criminal pode absolver ou reduzir pena"
      guaranteeTitle="Análise Gratuita"
      guaranteeDescription="Analisamos gratuitamente seu processo e indicamos as melhores estratégias de revisão criminal."
      stats={{
        years: 15,
        cases: 220,
        successRate: 68,
        clients: 180,
      }}
      customAlert={{
        title: "Revisão Criminal é Possível?",
        description: "Sim! Mesmo após o trânsito em julgado (sentença final), a revisão criminal pode absolver ou reduzir pena se houver provas novas ou erro judicial."
      }}
    />
  )
}
