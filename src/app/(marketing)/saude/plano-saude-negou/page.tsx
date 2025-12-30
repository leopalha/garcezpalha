import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO





export default function PlanoSaudeNegouPage() {
  const product = getProductBySlug('plano-saude-negou')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="green"
      heroIcon="Heart"
      agitationPoints={[
        'Plano nega tratamento ou cirurgia mesmo com indicação médica urgente',
        'Carências e coberturas são usadas como desculpa para negar atendimento',
        'Você paga mensalidade em dia mas não recebe cobertura quando precisa',
        'Atraso no tratamento agrava sua doença e pode levar a sequelas',
        'Custos particulares do tratamento podem comprometer todo seu patrimônio',
        'Negociação direta com plano não funciona sem pressão jurídica'
      ]}
      solutionSteps={[
        'Análise URGENTE do caso - Verificamos obrigação de cobertura do plano',
        'Reunião de documentação - Organizamos laudos, exames e prescrições',
        'Notificação extrajudicial - Exigência formal de autorização imediata',
        'Liminar de urgência - Tratamento autorizado judicialmente em 24-72h',
        'Reembolso de despesas - Recuperamos valores que você já pagou',
        'Indenização por danos morais - Compensação pela negativa abusiva'
      ]}
      urgencyMessage="PLANO NEGOU TRATAMENTO? Autorização judicial em 24-72h"
      guaranteeTitle="Autorização Urgente"
      guaranteeDescription="Atuamos com pedidos de urgência para garantir tratamento imediato quando há risco à saúde."
      stats={{
        years: 10,
        cases: 650,
        successRate: 92,
        clients: 580,
      }}
      customAlert={{
        title: "O que o plano NÃO pode negar?",
        description: "Cirurgias, exames, internações e tratamentos com indicação médica não podem ser negados se estiverem no rol da ANS ou forem essenciais para sua saúde, mesmo que não estejam no rol."
      }}
    />
  )
}
