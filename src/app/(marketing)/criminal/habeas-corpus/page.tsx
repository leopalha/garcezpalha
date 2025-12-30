'use client'


import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner } from '@/components/vsl'
import { PRODUTO_HABEAS_CORPUS , getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO





export default function HabeasCorpusPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_HABEAS_CORPUS.name}
        description={PRODUTO_HABEAS_CORPUS.description}
        keywords={PRODUTO_HABEAS_CORPUS.keywords}
        productName={PRODUTO_HABEAS_CORPUS.name}
        price={PRODUTO_HABEAS_CORPUS.price.basic || 0}
        category={PRODUTO_HABEAS_CORPUS.category}
      />

      <ProductVSL
        product={PRODUTO_HABEAS_CORPUS}
        heroColor="violet"
        heroIcon="Shield"
        agitationPoints={[
          'Prisão ilegal mantém você encarcerado sem necessidade ou fundamento',
          'Cada dia preso afeta sua vida pessoal, profissional e familiar',
          'Sem defesa técnica especializada, a liberdade provisória é negada',
          'Prazo de prisão preventiva pode se estender indefinidamente',
          'Constrangimento ilegal viola seus direitos constitucionais',
          'Decisões judiciais podem ser revertidas com HC bem fundamentado'
        ]}
        solutionSteps={[
          'Análise URGENTE da prisão em até 24h - identificamos ilegalidades e abusos',
          'Elaboração técnica do Habeas Corpus - fundamentação jurídica sólida',
          'Protocolo IMEDIATO em 24-48h - peticionamento urgente no tribunal',
          'Acompanhamento da decisão - sustentação oral se necessário',
          'Liberdade provisória ou relaxamento de prisão ilegal',
          'Recursos em instâncias superiores se necessário (STJ/STF)'
        ]}
        stats={{
          years: 15,
          cases: 350,
          successRate: 82,
          clients: 300
        }}
        urgencyMessage="ATENDIMENTO 24 HORAS - Habeas Corpus urgente para prisões ilegais"
        guaranteeTitle="Atendimento 24 Horas"
        guaranteeDescription="Plantão criminal para casos urgentes. Análise imediata da prisão e elaboração do HC em 24-48h."
        customAlert={{
          title: "ATENÇÃO: Você tem direito à liberdade!",
          description: "Se a prisão é ilegal, abusiva ou sem fundamento, o Habeas Corpus pode garantir sua liberdade imediatamente. Não espere - cada dia preso conta!"
        }}
      />
    </div>
  )
}
