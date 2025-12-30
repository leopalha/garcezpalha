'use client'


import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner } from '@/components/vsl'
import { PRODUTO_REGULARIZACAO_IMOVEL , getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)

// Generate metadata for SEO





export default function RegularizacaoImovelPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_REGULARIZACAO_IMOVEL.name}
        description={PRODUTO_REGULARIZACAO_IMOVEL.description}
        keywords={PRODUTO_REGULARIZACAO_IMOVEL.keywords}
        productName={PRODUTO_REGULARIZACAO_IMOVEL.name}
        price={PRODUTO_REGULARIZACAO_IMOVEL.price.basic || 0}
        category={PRODUTO_REGULARIZACAO_IMOVEL.category}
      />

      <ProductVSL
        product={PRODUTO_REGULARIZACAO_IMOVEL}
        heroColor="green"
        heroIcon="Home"
        agitationPoints={[
          'Imóvel sem documentação regular não pode ser vendido legalmente',
          'Impossibilidade de financiar ou transferir propriedade',
          'Risco de demolição ou multas por construção irregular',
          'Herança bloqueada por falta de regularização fundiária',
          'Valorização do imóvel comprometida sem documentação',
          'Insegurança jurídica e risco de perda da propriedade'
        ]}
        solutionSteps={[
          'Análise completa da situação do imóvel - verificação documental',
          'Levantamento de documentação necessária - plantas, matrículas',
          'Regularização fundiária judicial ou administrativa - conforme o caso',
          'Averbação em cartório - registro da propriedade',
          'Legalização de construções - aprovação municipal',
          'Certidões negativas - regularização fiscal e ambiental'
        ]}
        stats={{
          years: 13,
          cases: 320,
          successRate: 82,
          clients: 290
        }}
        urgencyMessage="Imóvel irregular? Regularize e valorize seu patrimônio"
        guaranteeTitle="Regularização Completa"
        guaranteeDescription="Especialistas em regularização fundiária e documentação de imóveis. Processo completo até a escritura registrada em cartório."
        customAlert={{
          title: "Imóvel sem documentação regular?",
          description: "Regularização fundiária garante segurança jurídica, possibilita venda e financiamento, e valoriza seu patrimônio. Processo pode ser judicial ou administrativo."
        }}
      />
    </div>
  )
}
