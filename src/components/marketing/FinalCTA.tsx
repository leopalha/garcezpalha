'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { IconMessageCircle, IconArrowRight, IconPhone } from './icons'
import Link from 'next/link'

export function FinalCTA() {
  const whatsappNumber = '5521995354010'
  const whatsappMessage = encodeURIComponent('Ola! Preciso de ajuda juridica.')
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Fale com um especialista
            </h2>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl opacity-90 mb-8"
          >
            Entre em contato agora e receba uma avaliacao inicial do seu caso.
            Atendimento personalizado e sigiloso.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button
              size="lg"
              className="gap-2 text-lg px-8 py-6 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg"
              asChild
            >
              <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <IconMessageCircle className="w-5 h-5" />
                Falar pelo WhatsApp
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-lg px-8 py-6 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/contato">
                <IconPhone className="w-5 h-5" />
                Agendar Consulta
                <IconArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>

          {/* OAB Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm opacity-60"
          >
            OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ
          </motion.p>
        </div>
      </div>
    </section>
  )
}
