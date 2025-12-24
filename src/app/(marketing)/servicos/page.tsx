import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, FileCheck, Home, Stethoscope, Users, Scale } from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    icon: Building2,
    title: 'Direito Imobiliário',
    description: 'Assessoria completa em transações imobiliárias, regularizações e conflitos.',
    href: '/servicos/direito-imobiliario',
  },
  {
    icon: Scale,
    title: 'Direito Criminal',
    description: 'Defesa técnica qualificada em processos criminais e investigações.',
    href: '/servicos/direito-criminal',
  },
  {
    icon: FileCheck,
    title: 'Perícia Documental',
    description: 'Análise de autenticidade, grafotecnia e laudos técnicos especializados.',
    href: '/servicos/pericia-documentos',
  },
  {
    icon: Home,
    title: 'Avaliação de Imóveis',
    description: 'Laudos de avaliação técnica para compra, venda e financiamento.',
    href: '/servicos/avaliacao-imoveis',
  },
  {
    icon: Stethoscope,
    title: 'Perícia Médica Trabalhista',
    description: 'Laudos especializados em acidentes de trabalho e doenças ocupacionais.',
    href: '/servicos/pericia-medica',
  },
  {
    icon: Users,
    title: 'Secretária Remota',
    description: 'Automação completa do atendimento e gestão do seu escritório.',
    href: '/servicos/secretaria-remota',
  },
]

export default function ServicesPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="font-display text-5xl font-bold mb-4">Nossos Serviços</h1>
          <p className="text-xl text-muted-foreground">
            Soluções jurídicas e periciais completas com 364 anos de tradição e expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card key={service.href} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className="w-12 h-12 mb-4 text-primary" />
                  <CardTitle className="font-heading">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={service.href}>Saiba Mais</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
