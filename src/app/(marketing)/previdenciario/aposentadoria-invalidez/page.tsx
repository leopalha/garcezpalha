'use client'

import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner } from '@/components/vsl'
import { PRODUTO_APOSENTADORIA_INVALIDEZ } from '@/lib/products/catalog'

export default function AposentadoriaInvalidezPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_APOSENTADORIA_INVALIDEZ.name}
        description={PRODUTO_APOSENTADORIA_INVALIDEZ.description}
        keywords={PRODUTO_APOSENTADORIA_INVALIDEZ.keywords}
        productName={PRODUTO_APOSENTADORIA_INVALIDEZ.name}
        price={PRODUTO_APOSENTADORIA_INVALIDEZ.price.basic || 0}
        category={PRODUTO_APOSENTADORIA_INVALIDEZ.category}
      />

      <ProductVSL
        product={PRODUTO_APOSENTADORIA_INVALIDEZ}
        heroColor="blue"
        heroIcon="DollarSign"
        agitationPoints={[
          'Incapacidade permanente para o trabalho sem renda fixa',
          'INSS nega aposentadoria por invalidez sem análise adequada',
          'Perícia médica superficial não considera toda a doença',
          'Sem benefício, família fica sem sustento e proteção',
          'Tratamento médico custoso sem aposentadoria para pagar',
          'Direito ao benefício desde o afastamento do trabalho'
        ]}
        solutionSteps={[
          'Análise gratuita de elegibilidade - verificação de requisitos',
          'Coleta de documentação médica completa - laudos e exames',
          'Requerimento administrativo ao INSS - pedido formal',
          'Preparação para perícia médica - estratégia técnica',
          'Ação judicial se negado - garantia do benefício na Justiça',
          'Retroativo desde o afastamento - recebimento de atrasados'
        ]}
        stats={{
          years: 12,
          cases: 480,
          successRate: 86,
          clients: 420
        }}
        urgencyMessage="Incapacidade permanente? Garanta sua aposentadoria por invalidez"
        guaranteeTitle="Benefício Vitalício"
        guaranteeDescription="Especialistas em aposentadoria por invalidez. Análise médica e jurídica completa para garantir seu benefício vitalício no INSS."
        customAlert={{
          title: "Não consegue mais trabalhar por doença ou acidente?",
          description: "Se você tem incapacidade permanente e total para o trabalho, tem direito à aposentadoria por invalidez. O benefício é vitalício e retroativo ao afastamento."
        }}
      />
    </div>
  )
}
