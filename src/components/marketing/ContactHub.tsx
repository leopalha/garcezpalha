'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle,
  Mail,
  Phone,
  Calendar,
  Bot,
  X,
  ExternalLink,
  Clock,
  CheckCircle2,
} from 'lucide-react'

interface ContactOption {
  id: string
  title: string
  description: string
  icon: any
  badge?: string
  badgeColor?: string
  action: {
    label: string
    href: string
    external?: boolean
  }
  availability: string
  responseTime: string
  features: string[]
}

const contactOptions: ContactOption[] = [
  {
    id: 'whatsapp-bot',
    title: 'WhatsApp (IA)',
    description: 'Atendimento automatizado inteligente que funciona 24/7',
    icon: Bot,
    badge: 'Recomendado',
    badgeColor: 'bg-green-500',
    action: {
      label: 'Iniciar Conversa',
      href: 'https://wa.me/5521995354010',
      external: true,
    },
    availability: '24 horas, 7 dias',
    responseTime: 'Imediato',
    features: [
      'Respostas instantâneas',
      'Qualificação automática',
      'Agendamento de consultas',
      'Informações sobre serviços',
    ],
  },
  {
    id: 'form',
    title: 'Formulário Web',
    description: 'Preencha online e receba retorno prioritário',
    icon: Mail,
    badge: 'Resposta rápida',
    badgeColor: 'bg-blue-500',
    action: {
      label: 'Preencher Formulário',
      href: '/contato',
      external: false,
    },
    availability: 'Sempre disponível',
    responseTime: 'Até 24h úteis',
    features: [
      'Atendimento organizado',
      'Anexo de documentos',
      'Histórico salvo',
      'Consulta gratuita',
    ],
  },
  {
    id: 'phone',
    title: 'Telefone',
    description: 'Fale diretamente com nossa equipe',
    icon: Phone,
    action: {
      label: 'Ligar Agora',
      href: 'tel:+5521995354010',
      external: true,
    },
    availability: 'Seg-Sex 9h-18h, Sáb 9h-13h',
    responseTime: 'Imediato',
    features: [
      'Atendimento humano',
      'Esclarecimento imediato',
      'Orientação personalizada',
      'Agendamento de consultas',
    ],
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Para casos mais complexos que precisam de detalhamento',
    icon: Mail,
    action: {
      label: 'Enviar Email',
      href: 'mailto:contato@garcezpalha.com',
      external: true,
    },
    availability: 'Sempre disponível',
    responseTime: 'Até 48h úteis',
    features: [
      'Casos complexos',
      'Documentação extensa',
      'Registro formal',
      'Histórico completo',
    ],
  },
]

export function ContactHub() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Como Prefere Entrar em Contato?
          </h2>
          <p className="text-xl text-muted-foreground">
            Escolha o canal mais conveniente para você. Estamos prontos para atender.
          </p>
        </motion.div>

        {/* Contact Options Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {contactOptions.map((option, index) => {
            const Icon = option.icon
            const isSelected = selectedOption === option.id

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`h-full transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-primary shadow-lg scale-[1.02]'
                      : 'hover:border-primary/50 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedOption(isSelected ? null : option.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${
                          option.badgeColor || 'bg-primary/10'
                        } flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {option.badge && (
                        <Badge className={option.badgeColor || 'bg-primary'}>
                          {option.badge}
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="font-heading text-xl">
                      {option.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {option.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{option.availability}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Resposta: {option.responseTime}</span>
                      </div>
                    </div>

                    {/* Features - Show when expanded */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 border-t">
                            <p className="text-sm font-semibold mb-2">
                              O que você pode fazer:
                            </p>
                            <ul className="space-y-1">
                              {option.features.map((feature, i) => (
                                <li
                                  key={i}
                                  className="text-sm text-muted-foreground flex items-start gap-2"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Button */}
                    <Button
                      className="w-full gap-2"
                      variant={isSelected ? 'default' : 'outline'}
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={option.action.href}
                        target={option.action.external ? '_blank' : '_self'}
                        rel={option.action.external ? 'noopener noreferrer' : undefined}
                      >
                        {option.action.label}
                        {option.action.external && (
                          <ExternalLink className="w-4 h-4" />
                        )}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="max-w-3xl mx-auto mt-12 text-center"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold mb-1">Consulta Inicial Gratuita</p>
                  <p className="text-sm text-muted-foreground">
                    Independente do canal escolhido, você terá direito a uma consulta inicial de 30
                    minutos totalmente gratuita para avaliar seu caso. Sem compromisso.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
