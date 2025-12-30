import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO
export async function generateMetadata() {
  const product = getProductBySlug('lei-maria-penha-defesa')
  if (!product) return {}

  return {
    title: `${product.name} | Garcez Palha Advogados`,
    description: product.description,
  }
}





export default function LeiMariaPenhaPage() {
  const product = getProductBySlug('lei-maria-penha-defesa')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="violet"
      heroIcon="Shield"
      agitationPoints={[
        'Acusação falsa de violência doméstica pode destruir sua vida e reputação',
        'Medidas protetivas impedem contato com filhos e acesso à própria casa',
        'Prisão preventiva pode ocorrer com base apenas em declarações sem provas',
        'Condenação criminal gera antecedentes e perda de direitos civis',
        'Sem defesa adequada, você pode ser condenado injustamente',
        'Processo criminal afeta emprego, família e vida social irreversivelmente'
      ]}
      solutionSteps={[
        'Análise URGENTE do caso - Verificamos acusações e estratégia defensiva',
        'Habeas Corpus se preso - Liberdade provisória com argumentação técnica',
        'Contestação de medidas protetivas - Buscamos flexibilização ou revogação',
        'Defesa criminal completa - Atuamos por absolvição ou desclassificação',
        'Produção de provas favoráveis - Testemunhas, perícias e documentos',
        'Recursos em todas instâncias - Lutamos até reversão da condenação'
      ]}
      urgencyMessage="ACUSADO INJUSTAMENTE? Defesa técnica especializada 24h"
      guaranteeTitle="Atendimento 24 Horas"
      guaranteeDescription="Plantão criminal 24/7 para casos urgentes de prisão ou medidas protetivas. Defesa completa do início ao fim."
      stats={{
        years: 15,
        cases: 280,
        successRate: 75,
        clients: 250,
      }}
      customAlert={{
        title: "ATENÇÃO: Medidas Urgentes",
        description: "Medidas protetivas podem ser concedidas em 24h e prisão preventiva pode ocorrer a qualquer momento. Defesa técnica imediata é crucial para proteger seus direitos."
      }}
    />
  )
}
