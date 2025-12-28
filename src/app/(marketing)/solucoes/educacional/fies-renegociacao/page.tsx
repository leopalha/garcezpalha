import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'
import { Shield } from 'lucide-react'

export default function FiesRenegociacaoPage() {
  const product = getProductBySlug('fies-renegociacao')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="rose"
      heroIcon="Shield"
      agitationPoints={[
        "Dívida do FIES crescendo descontroladamente",
        "Impossibilidade de pagar as parcelas",
        "Nome negativado por dívida estudantil",
        "Renegociação negada ou com juros abusivos",
        "Faculdade cobrada indevidamente"
]}
      solutionSteps={[
        "Análise do contrato FIES",
        "Verificação de irregularidades",
        "Negociação com FNDE/Caixa",
        "Ação para renegociação com condições justas",
        "Suspensão de negativação",
        "Redução de juros e parcelamento viável"
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
