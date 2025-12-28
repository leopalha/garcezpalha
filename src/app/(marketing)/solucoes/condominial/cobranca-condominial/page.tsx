import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'
import { Shield } from 'lucide-react'

export default function CobrancaCondominialPage() {
  const product = getProductBySlug('cobranca-condominial')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="slate"
      heroIcon="Shield"
      agitationPoints={[
        "Cobrança de condomínio com valores abusivos",
        "Taxas extras não autorizadas em assembleia",
        "Multas indevidas aplicadas",
        "Obras não aprovadas gerando custos",
        "Síndico ou administradora age de má-fé"
]}
      solutionSteps={[
        "Análise de atas, convenção e boletos",
        "Verificação de legalidade das cobranças",
        "Contestação em assembleia",
        "Ação para anular cobranças indevidas",
        "Restituição de valores pagos a mais",
        "Regularização de cobranças futuras"
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
