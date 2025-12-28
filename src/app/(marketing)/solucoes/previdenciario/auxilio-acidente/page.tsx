import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'
import { Shield } from 'lucide-react'

export default function AuxilioAcidentePage() {
  const product = getProductBySlug('auxilio-acidente')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="cyan"
      heroIcon="Shield"
      agitationPoints={[
        "INSS negou seu benefício sem justificativa adequada",
        "Aposentadoria calculada errada, valor menor que o devido",
        "Perícia médica injusta negou auxílio",
        "Tempo de contribuição não reconhecido",
        "Benefício cortado sem aviso prévio"
]}
      solutionSteps={[
        "Análise do CNIS e documentação",
        "Cálculo correto do benefício",
        "Recurso administrativo no INSS",
        "Ação judicial para concessão/revisão",
        "Perícia médica judicial (se necessário)",
        "Recebimento retroativo desde a data do requerimento"
]}
      urgencyMessage="⚡ Atendimento prioritário - Análise gratuita do seu caso"
      guaranteeTitle="Garantia de Resultado"
      guaranteeDescription="Trabalhamos com honorários de êxito. Só cobramos se você ganhar."
      stats={{
        years: 10,
        cases: 300,
        successRate: 85,
        clients: 250,
      }}
    />
  )
}
