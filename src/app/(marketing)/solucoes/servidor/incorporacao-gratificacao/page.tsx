import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'
import { Shield } from 'lucide-react'

export default function IncorporacaoGratificacaoPage() {
  const product = getProductBySlug('incorporacao-gratificacao')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="indigo"
      heroIcon={Shield}
      agitationPoints={[
        "Gratificações e vantagens não incorporadas ao salário",
        "Diferenças salariais não pagas",
        "Progressão funcional negada",
        "Direitos de servidor público desrespeitados",
        "Aposentadoria calculada incorretamente"
]}
      solutionSteps={[
        "Análise de contracheques e legislação",
        "Cálculo de diferenças retroativas",
        "Processo administrativo",
        "Ação judicial (Mandado de Segurança)",
        "Incorporação definitiva de vantagens",
        "Recebimento de valores atrasados"
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
