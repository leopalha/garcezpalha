'use client'

import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner, WhatsAppFloat } from '@/components/vsl'
import { PRODUTO_CRIMES_TRANSITO } from '@/lib/products/catalog'

export default function CrimesTransitoPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_CRIMES_TRANSITO.name}
        description={PRODUTO_CRIMES_TRANSITO.description}
        keywords={PRODUTO_CRIMES_TRANSITO.keywords}
        productName={PRODUTO_CRIMES_TRANSITO.name}
        price={PRODUTO_CRIMES_TRANSITO.price.basic || 0}
        category={PRODUTO_CRIMES_TRANSITO.category}
      />

      <ProductVSL
        product={PRODUTO_CRIMES_TRANSITO}
        heroColor="orange"
        heroIcon="Car"
        agitationPoints={[
          'Condenação por crime de trânsito gera antecedentes criminais permanentes',
          'Suspensão ou cassação da CNH impede trabalho e locomoção',
          'Homicídio culposo pode resultar em até 4 anos de prisão',
          'Embriaguez ao volante sem defesa técnica leva à condenação automática',
          'Lesão corporal no trânsito gera processo criminal e ação civil',
          'Sem acordo e transação penal, você terá ficha criminal definitiva'
        ]}
        solutionSteps={[
          'Análise técnica do caso - identificação de atenuantes e excludentes',
          'Negociação de transação penal - prestação pecuniária sem processo',
          'Suspensão condicional do processo - evitar condenação criminal',
          'Defesa técnica completa - contestação de laudos e provas',
          'Acordo com vítima - redução de danos e composição civil',
          'Recursos em todas instâncias - absolvição ou redução de pena'
        ]}
        stats={{
          years: 14,
          cases: 520,
          successRate: 84,
          clients: 480
        }}
        urgencyMessage="Acidente de trânsito? Defesa técnica evita antecedentes criminais"
        guaranteeTitle="Defesa Transacional"
        guaranteeDescription="Especialistas em transação penal e acordos em crimes de trânsito. Nosso objetivo é evitar processo criminal e antecedentes na sua ficha."
        customAlert={{
          title: "Não aceite a culpa sem consultar um advogado!",
          description: "Em crimes de trânsito, existem diversas possibilidades de defesa, transação penal e acordos que evitam condenação criminal. Consulte um especialista antes de qualquer decisão."
        }}
      />
    </div>
  )
}
