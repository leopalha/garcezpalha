'use client'


import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner } from '@/components/vsl'
import { PRODUTO_AUXILIO_DOENCA, getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)

// Generate metadata for SEO





export default function AuxilioDoencaPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_AUXILIO_DOENCA.name}
        description={PRODUTO_AUXILIO_DOENCA.description}
        keywords={PRODUTO_AUXILIO_DOENCA.keywords}
        productName={PRODUTO_AUXILIO_DOENCA.name}
        price={PRODUTO_AUXILIO_DOENCA.price.basic || 0}
        category={PRODUTO_AUXILIO_DOENCA.category}
      />

      <ProductVSL
        product={PRODUTO_AUXILIO_DOENCA}
        heroColor="green"
        heroIcon="Heart"
        agitationPoints={[
          'INSS nega auxílio-doença mesmo com doença comprovada',
          'Perícia médica de 5 minutos não analisa caso adequadamente',
          'Benefício cortado antes da recuperação completa',
          'Sem auxílio-doença, você fica sem renda durante tratamento',
          'Família depende do benefício para sobreviver',
          'Direito ao benefício desde o afastamento do trabalho'
        ]}
        solutionSteps={[
          'Análise da negativa ou cessação - identificação de erros',
          'Coleta de documentação médica completa - laudos atualizados',
          'Recurso administrativo ou novo pedido - reversão da negativa',
          'Preparação para nova perícia médica - estratégia técnica',
          'Ação judicial se necessário - perícia médica judicial',
          'Retroativo desde o afastamento - recebimento de atrasados'
        ]}
        stats={{
          years: 11,
          cases: 650,
          successRate: 89,
          clients: 580
        }}
        urgencyMessage="Auxílio-doença negado ou cortado? Reverta a decisão do INSS"
        guaranteeTitle="Reversão de Negativa"
        guaranteeDescription="Especialistas em reversão de negativas do INSS. Análise médica e jurídica para garantir seu auxílio-doença com retroativo."
        customAlert={{
          title: "Auxílio-doença negado ou cortado indevidamente?",
          description: "Se você está doente e não consegue trabalhar, tem direito ao auxílio-doença. Perícia médica pode ser contestada na Justiça com laudos médicos completos."
        }}
      />
    </div>
  )
}
