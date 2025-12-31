'use client'

import { Metadata } from 'next'
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


export default function HomePage() {
  return (
    <>
      {/* Hero Principal - 364 anos + 2 CTAs */}
      <ImprovedHero />

      {/* Seção Para Clientes - Logo após o hero */}
      <ClientsSection />

      {/* Seção Para Advogados - Plataforma */}
      <LawyersPlatformSection />

      {/* Como Funciona */}
      <HowItWorks />

      {/* Por que Garcez Palha */}
      <WhyChooseUs />

      {/* Credenciais */}
      <Credentials />

      {/* Depoimentos */}
      <Testimonials />

      {/* História 364 anos - Timeline */}
      <Timeline />

      {/* FAQ */}
      <FAQ />

      {/* CTA Final */}
      <FinalCTA />
    </>
  )
}
