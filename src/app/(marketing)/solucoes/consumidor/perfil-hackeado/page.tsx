'use client'

import { ProductVSL } from '@/components/vsl/ProductVSL'
import { SEOHead, UrgencyBanner, WhatsAppFloat } from '@/components/vsl'
import { PRODUTO_PERFIL_HACKEADO } from '@/lib/products/catalog'

export default function PerfilHackeadoPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={PRODUTO_PERFIL_HACKEADO.name}
        description={PRODUTO_PERFIL_HACKEADO.description}
        keywords={PRODUTO_PERFIL_HACKEADO.keywords}
        productName={PRODUTO_PERFIL_HACKEADO.name}
        price={PRODUTO_PERFIL_HACKEADO.price.basic || 0}
        category={PRODUTO_PERFIL_HACKEADO.category}
      />

      <ProductVSL
        product={PRODUTO_PERFIL_HACKEADO}
        heroColor="red"
        heroIcon="AlertOctagon"
        agitationPoints={[
          'Perfil hackeado usado para aplicar golpes em amigos e familiares',
          'Publicações falsas prejudicam reputação pessoal e profissional',
          'Plataforma demora dias ou semanas para recuperar conta',
          'Perda de acesso a fotos, mensagens e memórias importantes',
          'Golpistas pedem dinheiro em seu nome e destroem relacionamentos',
          'Responsabilidade da plataforma por falha de segurança'
        ]}
        solutionSteps={[
          'Notificação urgente à plataforma - pedido de recuperação imediata',
          'Documentação do hack - prints e evidências dos golpes',
          'Boletim de ocorrência - registro do crime cibernético',
          'Ação judicial contra a plataforma - indenização por danos',
          'Recuperação da conta - medidas judiciais para acesso',
          'Indenização por danos morais e prejuízos causados'
        ]}
        stats={{
          years: 6,
          cases: 320,
          successRate: 79,
          clients: 290
        }}
        urgencyMessage="Perfil hackeado e golpes em seu nome? Responsabilize a plataforma"
        guaranteeTitle="Recuperação e Indenização"
        guaranteeDescription="Especialistas em crimes digitais e responsabilidade de plataformas. Recuperação de conta e ação de indenização por falha de segurança."
        customAlert={{
          title: "Seu perfil foi hackeado e usado para golpes?",
          description: "Plataformas têm responsabilidade pela segurança dos dados dos usuários. Falha de segurança que resulta em hack gera direito à indenização e recuperação imediata da conta."
        }}
      />
    </div>
  )
}
