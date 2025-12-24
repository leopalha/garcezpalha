'use client'

import { motion } from 'framer-motion'
import { Award, Scale, Building2 } from 'lucide-react'
import Image from 'next/image'

const credentials = [
  { icon: Scale, label: 'OAB/RJ', value: '219.390', description: 'Advocacia' },
  { icon: Award, label: 'CONPEJ/RJ', value: 'Registrado', description: 'Pericias' },
  { icon: Building2, label: 'CRECI/RJ', value: 'Ativo', description: 'Imoveis' },
]

export function Credentials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Brasao */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="relative">
                <Image
                  src="/brasao-garcez-palha.png"
                  alt="Brasao Heraldico da Familia Garcez Palha"
                  width={350}
                  height={350}
                  className="w-full h-auto max-w-[350px] drop-shadow-xl"
                  priority
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Name */}
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  Leonardo Garcez Palha
                </h2>
                <p className="text-lg text-muted-foreground">
                  Advogado, Perito Judicial e Corretor de Imoveis
                </p>
              </div>

              {/* Credentials */}
              <div className="flex flex-wrap gap-4">
                {credentials.map((cred) => {
                  const Icon = cred.icon
                  return (
                    <div
                      key={cred.label}
                      className="flex items-center gap-3 px-4 py-3 bg-background rounded-lg border"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{cred.label}</p>
                        <p className="text-xs text-muted-foreground">{cred.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Bio */}
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Tres credenciais para resolver seu problema de forma completa.
                  Seja uma questao juridica, pericial ou imobiliaria, voce tem
                  um unico profissional com todas as habilitacoes necessarias.
                </p>
              </div>

              {/* History Quote */}
              <div className="relative pl-6 border-l-4 border-primary">
                <p className="text-foreground italic leading-relaxed">
                  "A familia Garcez Palha serve o Brasil desde 1661. Governadores de
                  Goa e Macau. Viscondes e Baroes do Imperio. 364 anos depois,
                  continuamos servindo."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
