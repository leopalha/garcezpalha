'use client'

import { motion } from 'framer-motion'
import { IconAward, IconScale, IconBuilding2 } from './icons'

const credentials = [
  { icon: IconScale, label: 'OAB/RJ', value: '219.390', description: 'Advocacia' },
  { icon: IconAward, label: 'CONPEJ/RJ', value: 'Registrado', description: 'Pericias' },
  { icon: IconBuilding2, label: 'CRECI/RJ', value: 'Ativo', description: 'Imoveis' },
]

export function Credentials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-center max-w-3xl"
            >
              {/* Name */}
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  Leonardo Mendonça Palha da Silva
                </h2>
                <p className="text-lg text-muted-foreground">
                  Advogado, Perito Judicial e Corretor de Imoveis
                </p>
              </div>

              {/* Credentials */}
              <div className="flex flex-wrap gap-4 justify-center">
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
