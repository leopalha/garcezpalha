'use client'

import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner, WhatsAppFloat } from '@/components/vsl'
import { PRODUTO_CRIMES_EMPRESARIAIS } from '@/lib/products/catalog'

export default function CrimesEmpresariaisPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_CRIMES_EMPRESARIAIS.name}
        description={PRODUTO_CRIMES_EMPRESARIAIS.description}
        keywords={PRODUTO_CRIMES_EMPRESARIAIS.keywords}
        productName={PRODUTO_CRIMES_EMPRESARIAIS.name}
        price={PRODUTO_CRIMES_EMPRESARIAIS.price.basic || 0}
        category={PRODUTO_CRIMES_EMPRESARIAIS.category}
      />

      <ProductVSL
        product={PRODUTO_CRIMES_EMPRESARIAIS}
        heroColor="blue"
        heroIcon="Briefcase"
        agitationPoints={[
          'Crimes fiscais podem resultar em prisão de até 5 anos e multas pesadas',
          'Inquéritos da Receita Federal e Polícia Federal são complexos e técnicos',
          'Estelionato empresarial destrói reputação e carreira profissional',
          'Apropriação indébita pode levar a bloqueio de bens e prisão preventiva',
          'Sem defesa especializada, acordos prejudiciais são impostos',
          'Condenação criminal impede participação em licitações e negócios'
        ]}
        solutionSteps={[
          'Análise técnica do caso - revisão de documentação contábil e fiscal',
          'Defesa administrativa prévia - regularização quando possível',
          'Estratégia de acordo de não persecução penal - evitar condenação',
          'Defesa em inquérito e processo - atuação em todas as fases',
          'Produção de perícia contábil - contraprova técnica especializada',
          'Recursos em todas instâncias - STJ e STF se necessário'
        ]}
        stats={{
          years: 16,
          cases: 185,
          successRate: 76,
          clients: 160
        }}
        urgencyMessage="Investigação fiscal ou criminal empresarial? Defesa técnica especializada urgente"
        guaranteeTitle="Defesa Empresarial"
        guaranteeDescription="Especialistas em crimes empresariais e fiscais. Atuação estratégica para regularização, acordos e defesa técnica em todas as instâncias."
        customAlert={{
          title: "Recebeu notificação fiscal ou está sendo investigado?",
          description: "Crimes empresariais exigem defesa técnica especializada desde o início. Regularização e acordos podem evitar processo criminal e condenação."
        }}
      />
    </div>
  )
}
