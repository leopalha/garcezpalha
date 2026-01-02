'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconMessageCircle, IconArrowRight } from './icons'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function ImprovedHero() {
  const whatsappNumber = '5521995354010'
  const whatsappMessage = encodeURIComponent('Olá! Preciso de ajuda jurídica.')
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-muted/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />

      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Logo/Brand Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge variant="secondary" className="text-sm px-4 py-2 mb-6">
              🏛️ Garcez Palha
            </Badge>
          </motion.div>

          {/* Main Content - Centered */}
          <div className="text-center space-y-8">
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-4">
                364 Anos de Tradição
                <br />
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Agora com IA
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Advocacia e Perícia Digital. Resolva problemas jurídicos ou automatize seu
                escritório com nossa plataforma.
              </p>
            </motion.div>

            {/* Dual CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {/* CTA Principal - Clientes */}
              <Button
                size="lg"
                className="gap-2 text-lg px-8 py-6 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                asChild
              >
                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <IconMessageCircle className="w-5 h-5" />
                  Preciso de Advogado
                </Link>
              </Button>

              {/* CTA Secundário - Advogados */}
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8 py-6 border-2 hover:bg-primary/5 w-full sm:w-auto"
                asChild
              >
                <Link href="#plataforma">
                  Sou Advogado(a)
                  <IconArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Credenciais */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-8"
            >
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">OAB/RJ 219.390</span>
                <span>•</span>
                <span className="font-semibold text-foreground">10.000+ clientes</span>
                <span>•</span>
                <span className="font-semibold text-foreground">98% satisfação</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
