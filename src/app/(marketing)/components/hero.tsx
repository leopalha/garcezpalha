'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-primary">364 Anos</span> de Tradição,
              <br />
              Nobreza e Excelência
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
          >
            Desde 1661, a família Garcez Palha une tradição nobiliárquica portuguesa,
            serviço imperial em três continentes e expertise jurídica contemporânea.
            Viscondes, Barões e Governadores que agora servem você.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="gap-2" asChild>
              <Link href="/contato">
                Agendar Consulta Gratuita
                <Calendar className="w-4 h-4" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/historia">
                Nossa História
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
