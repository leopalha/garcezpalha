'use client'

import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner, WhatsAppFloat } from '@/components/vsl'
import { PRODUTO_REVISAO_CRIMINAL } from '@/lib/products/catalog'

export default function RevisaoCriminalPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_REVISAO_CRIMINAL.name}
        description={PRODUTO_REVISAO_CRIMINAL.description}
        keywords={PRODUTO_REVISAO_CRIMINAL.keywords}
        productName={PRODUTO_REVISAO_CRIMINAL.name}
        price={PRODUTO_REVISAO_CRIMINAL.price.basic || 0}
        category={PRODUTO_REVISAO_CRIMINAL.category}
      />

      <ProductVSL
        product={PRODUTO_REVISAO_CRIMINAL}
        heroColor="indigo"
        heroIcon="RotateCcw"
        agitationPoints={[
          'Sentença condenatória injusta mantém você preso ou com antecedentes',
          'Novas provas podem demonstrar inocência ou reduzir pena drasticamente',
          'Decisão contrária à evidência dos autos pode ser revista',
          'Erro judiciário destrói vida pessoal, profissional e familiar',
          'Sem revisão criminal, condenação injusta permanece para sempre',
          'Possibilidade de absolvição ou redução significativa da pena'
        ]}
        solutionSteps={[
          'Análise completa do processo - identificação de vícios e erros',
          'Busca de provas novas - investigação e documentação',
          'Identificação de decisões contrárias - jurisprudência favorável',
          'Elaboração técnica da petição de revisão - fundamentação sólida',
          'Peticionamento em tribunal competente - protocolo estratégico',
          'Sustentação oral e recursos - atuação até decisão final'
        ]}
        stats={{
          years: 17,
          cases: 95,
          successRate: 68,
          clients: 85
        }}
        urgencyMessage="Condenação injusta? Revisão criminal pode reverter sentença definitiva"
        guaranteeTitle="Revisão Especializada"
        guaranteeDescription="Especialistas em revisão criminal e recursos em tribunais superiores. Análise técnica completa para identificar possibilidades de absolvição ou redução de pena."
        customAlert={{
          title: "Foi condenado injustamente?",
          description: "A revisão criminal é o instrumento para reformar sentença condenatória definitiva. Se há prova nova ou erro judiciário, é possível buscar absolvição ou redução de pena."
        }}
      />
    </div>
  )
}
