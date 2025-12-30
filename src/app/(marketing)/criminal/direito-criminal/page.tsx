import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO
export async function generateMetadata() {
  const product = getProductBySlug('direito-criminal')
  if (!product) return {}

  return {
    title: `${product.name} | Garcez Palha Advogados`,
    description: product.description,
  }
}





export default function DireitoCriminalPage() {
  const product = getProductBySlug('direito-criminal')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="violet"
      heroIcon="Shield"
      agitationPoints={[
        'Prisão preventiva mantém você preso durante todo o processo sem defesa adequada',
        'Depoimentos sem advogado podem incriminar você mesmo sendo inocente',
        'Falta de conhecimento técnico resulta em perda de prazos e oportunidades de defesa',
        'Acordos prejudiciais aceitos por desespero e falta de orientação',
        'Condenações excessivas por ausência de estratégia defensiva',
        'Antecedentes criminais destroem oportunidades profissionais e pessoais'
      ]}
      solutionSteps={[
        'Atendimento URGENTE 24h - Advogado disponível imediatamente para flagrantes',
        'Análise estratégica - Avaliamos todas as provas e possibilidades de defesa',
        'Habeas corpus - Liberdade provisória e relaxamento de prisão ilegal',
        'Defesa no inquérito - Acompanhamento policial e orientação em depoimentos',
        'Defesa processual - Estratégia completa no processo criminal',
        'Recursos e revisões - Atuação em todas as instâncias até o STJ/STF'
      ]}
      urgencyMessage="🚨 ATENDIMENTO 24 HORAS - Plantão criminal para casos urgentes"
      guaranteeTitle="Atendimento 24 Horas"
      guaranteeDescription="Plantão criminal para casos urgentes. Advogado disponível imediatamente para atender flagrantes e situações emergenciais."
      stats={{
        years: 15,
        cases: 400,
        successRate: 88,
        clients: 350,
      }}
      customAlert={{
        title: "ATENÇÃO: Não fale NADA sem advogado!",
        description: "Tudo que você disser pode e será usado contra você. O direito ao silêncio é garantido pela Constituição. Não preste depoimento, não assine nada e não faça acordo sem orientação de advogado criminalista."
      }}
    />
  )
}
