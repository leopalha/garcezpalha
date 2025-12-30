'use client'

import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)

// Generate metadata for SEO





export default function TeaPage() {
  const product = getProductBySlug('tea')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="green"
      heroIcon="Heart"
      agitationPoints={[
        'Plano de saúde nega tratamento para TEA mesmo com diagnóstico médico',
        'Terapias essenciais (ABA, fonoaudiologia, TO) negadas por "não cobertura"',
        'Desenvolvimento da criança é prejudicado pela falta de intervenção precoce',
        'Custo particular das terapias (R$ 3-8 mil/mês) é inviável para maioria',
        'Cada mês sem tratamento adequado atrasa desenvolvimento irreversivelmente',
        'Limitação de sessões mensais prejudica efetividade do tratamento'
      ]}
      solutionSteps={[
        'Análise GRATUITA do caso - Verificamos obrigação de cobertura do plano',
        'Reunião de documentação - Organizamos laudos, relatórios e prescrições',
        'Notificação extrajudicial - Exigência de autorização das terapias',
        'Liminar de urgência - Cobertura autorizada judicialmente em 7-15 dias',
        'Sessões ilimitadas - Garantimos quantidade necessária ao desenvolvimento',
        'Reembolso + indenização - Recuperamos gastos e danos morais'
      ]}
      urgencyMessage="TERAPIAS NEGADAS? Cobertura completa via judicial em 7-15 dias"
      guaranteeTitle="Autorização Garantida"
      guaranteeDescription="Se não conseguirmos a autorização judicial das terapias, devolvemos 100% dos honorários pagos."
      stats={{
        years: 8,
        cases: 320,
        successRate: 94,
        clients: 280,
      }}
      customAlert={{
        title: "Plano é Obrigado a Cobrir TEA?",
        description: "Sim! Desde 2019 (Lei 13.438), planos de saúde são obrigados a cobrir todas as terapias necessárias ao tratamento de TEA, incluindo ABA, fonoaudiologia, TO e psicologia, sem limitação de sessões."
      }}
    />
  )
}
