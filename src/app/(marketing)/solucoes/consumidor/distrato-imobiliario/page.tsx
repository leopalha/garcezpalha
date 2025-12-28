import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'
import { Shield } from 'lucide-react'

export default function DistratoImobiliarioPage() {
  const product = getProductBySlug('distrato-imobiliario')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="green"
      heroIcon="Shield"
      agitationPoints={[
        "Produtos com defeito e loja se recusa a trocar",
        "Entrega atrasada sem previsão ou compensação",
        "Assinaturas digitais impossíveis de cancelar",
        "Promessas não cumpridas em compras",
        "Empresa ignora seus direitos como consumidor"
]}
      solutionSteps={[
        "Análise da compra, nota fiscal e garantia",
        "Protocolo no Procon",
        "Notificação à empresa",
        "Ação no JEC (sem custas iniciais)",
        "Restituição, troca ou abatimento",
        "Danos morais se produto essencial"
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
