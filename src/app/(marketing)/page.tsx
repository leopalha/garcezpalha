'use client'

import {
  ImprovedHero,
  ClientsSection,
  LawyersPlatformSection,
  HowItWorks,
  WhyChooseUs,
  Credentials,
  Testimonials,
  FAQ,
  FinalCTA,
} from '@/components/marketing'
import { Timeline } from './components/timeline'

// Note: Page is 'use client' due to interactive components, but still benefits from SSG
export default function HomePage() {
  return (
    <main role="main" aria-label="Página principal">
      {/* Hero Principal - 364 anos + 2 CTAs */}
      <section aria-label="Banner principal">
        <ImprovedHero />
      </section>

      {/* Seção Para Clientes - Logo após o hero */}
      <section aria-label="Serviços para clientes">
        <ClientsSection />
      </section>

      {/* Seção Para Advogados - Plataforma */}
      <section aria-label="Plataforma para advogados">
        <LawyersPlatformSection />
      </section>

      {/* Como Funciona */}
      <section aria-label="Como funciona nosso serviço">
        <HowItWorks />
      </section>

      {/* Por que Garcez Palha */}
      <section aria-label="Diferenciais Garcez Palha">
        <WhyChooseUs />
      </section>

      {/* Credenciais */}
      <section aria-label="Credenciais e certificações">
        <Credentials />
      </section>

      {/* Depoimentos */}
      <section aria-label="Depoimentos de clientes">
        <Testimonials />
      </section>

      {/* História 364 anos - Timeline */}
      <section aria-label="Nossa história de 364 anos">
        <Timeline />
      </section>

      {/* FAQ */}
      <section aria-label="Perguntas frequentes">
        <FAQ />
      </section>

      {/* CTA Final */}
      <section aria-label="Chamada para ação">
        <FinalCTA />
      </section>
    </main>
  )
}
