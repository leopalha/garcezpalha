import { notFound } from 'next/navigation'
import { ProductVSL } from '@/components/vsl'
import { getProductBySlug } from '@/lib/products/catalog'

// ISR: Revalidate every 1 hour (product pages rarely change)
export const revalidate = 3600

// Generate metadata for SEO





export default function InqueritoPolicialPage() {
  const product = getProductBySlug('inquerito-policial')

  if (!product) {
    notFound()
  }

  return (
    <ProductVSL
      product={product}
      heroColor="violet"
      heroIcon="Shield"
      agitationPoints={[
        'Ser investigado sem advogado pode resultar em acusações infundadas e denúncia criminal',
        'Depoimentos sem orientação técnica podem incriminar você injustamente',
        'Perda de prazos no inquérito compromete toda a defesa futura',
        'Indiciamento sem defesa adequada marca seus antecedentes permanentemente',
        'Delegado pode pedir prisão preventiva sem que você saiba se defender',
        'Falta de acompanhamento permite que provas contra você sejam fabricadas'
      ]}
      solutionSteps={[
        'Análise URGENTE do inquérito - Verificamos acusações e estratégia defensiva',
        'Acompanhamento em depoimentos - Orientação técnica para evitar auto-incriminação',
        'Requerimentos estratégicos - Juntada de provas favoráveis e testemunhas',
        'Pedido de diligências - Requisitamos investigações que o ajudem',
        'Manifestação final - Argumentamos pelo arquivamento do inquérito',
        'Habeas Corpus preventivo - Se houver risco de prisão injusta'
      ]}
      urgencyMessage="INVESTIGADO? Defesa técnica completa desde o início do inquérito"
      guaranteeTitle="Acompanhamento Completo"
      guaranteeDescription="Defesa técnica em todas as fases do inquérito policial, desde a notificação até o arquivamento ou oferecimento da denúncia."
      stats={{
        years: 15,
        cases: 450,
        successRate: 78,
        clients: 380,
      }}
      customAlert={{
        title: "Sendo Investigado?",
        description: "Mesmo que você seja inocente, o inquérito policial pode resultar em denúncia criminal se você não tiver defesa adequada. Não espere ser preso para contratar advogado."
      }}
    />
  )
}
