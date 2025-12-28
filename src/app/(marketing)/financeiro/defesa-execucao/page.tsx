import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

export default function DefesaExecucaoPage() {
  const product = getProductBySlug('defesa-execucao')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="blue"
      heroIcon="Shield"
      agitationPoints={[
        'Penhora de salário, contas bancárias e imóveis sem defesa adequada',
        'Valores cobrados indevidos ou com cálculos errados passam despercebidos',
        'Perda de prazos processuais resulta em impossibilidade de defesa',
        'Execuções prescritas ou nulas continuam correndo sem questionamento',
        'Patrimônio familiar em risco por falta de conhecimento técnico',
        'Acordos desvantajosos aceitos por desespero e falta de orientação'
      ]}
      solutionSteps={[
        'Análise URGENTE do processo - Verificamos prazos, valores e possibilidades de defesa',
        'Exceção de pré-executividade - Questionamos vícios sem necessidade de garantia',
        'Embargos à execução - Defesa completa com discussão de mérito e valores',
        'Impugnação ao cumprimento de sentença - Contestamos cálculos e excessos',
        'Redução de penhora - Buscamos substituir bens penhorados por menos onerosos',
        'Negociação estratégica - Acordos vantajosos quando apropriado'
      ]}
      urgencyMessage="⚖️ CONSULTA GRATUITA - Analise suas chances de defesa na execução"
      guaranteeTitle="Consulta Gratuita de Viabilidade"
      guaranteeDescription="Analisamos seu processo gratuitamente e apresentamos todas as possibilidades de defesa."
      stats={{
        years: 10,
        cases: 200,
        successRate: 85,
        clients: 150,
      }}
      customAlert={{
        title: "Atenção: Prazos Curtos!",
        description: "Você tem apenas 15 dias para opor embargos à execução após a intimação da penhora. Perder esse prazo pode significar perder seu patrimônio. Aja rápido!"
      }}
    />
  )
}
