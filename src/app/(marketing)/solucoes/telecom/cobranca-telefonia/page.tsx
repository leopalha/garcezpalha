import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'
import { Shield } from 'lucide-react'

export default function CobrancaTelefoniaPage() {
  const product = getProductBySlug('cobranca-telefonia')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="purple"
      heroIcon="Shield"
      agitationPoints={[
        "Cobranças indevidas em faturas de telefone/internet",
        "Multas abusivas por cancelamento ou troca de operadora",
        "Operadoras dificultam portabilidade de número",
        "Serviços contratados não entregues conforme prometido",
        "Atendimento ruim e problemas não resolvidos"
]}
      solutionSteps={[
        "Análise de faturas e contratos",
        "Identificação de cobranças indevidas",
        "Protocolo de reclamação na Anatel",
        "Notificação à operadora",
        "Ação no JEC para restituição e danos morais",
        "Garantia de portabilidade ou cancelamento"
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
