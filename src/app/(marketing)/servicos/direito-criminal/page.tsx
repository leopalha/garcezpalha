import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Scale, CheckCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function DireitoCriminalPage() {
  const services = [
    'Defesa criminal em todas as instâncias',
    'Habeas Corpus',
    'Revisão criminal',
    'Recursos criminais',
    'Acompanhamento de inquéritos policiais',
    'Assistência em audiências',
    'Defesa em crimes econômicos',
    'Crimes contra a honra',
    'Defesa em tribunal do júri',
    'Execução penal',
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Scale className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="font-display text-5xl font-bold mb-4">Direito Criminal</h1>
          <p className="text-xl text-muted-foreground">
            Defesa técnica qualificada em processos criminais, garantindo todos os direitos
            constitucionais e as melhores estratégias jurídicas.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {/* Sobre o Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Sobre o Serviço</CardTitle>
              <CardDescription>Defesa criminal com excelência e ética</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Com 364 anos de tradição familiar (desde 1661), oferecemos defesa criminal especializada,
                atuando em todas as fases do processo penal, desde o inquérito policial até
                os tribunais superiores.
              </p>
              <p>
                Nossa experiência abrange desde casos simples até situações complexas, sempre
                priorizando a defesa técnica qualificada e o respeito aos direitos fundamentais
                do cliente.
              </p>
            </CardContent>
          </Card>

          {/* Por que escolher */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Por que escolher nosso escritório?</CardTitle>
              <CardDescription>Diferencial de 364 anos de história</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p>Análise detalhada de provas e documentos</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p>Estratégia de defesa personalizada para cada caso</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p>Acompanhamento em delegacias e audiências</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p>Atendimento emergencial 24h em casos urgentes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Serviços Inclusos */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">Serviços Inclusos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                <span>{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
          <h3 className="font-display text-3xl font-bold mb-4">
            Precisa de defesa criminal?
          </h3>
          <p className="text-muted-foreground mb-6">
            Agende uma consulta confidencial e descubra como podemos defender seus direitos.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/contato">
              <Calendar className="w-4 h-4" />
              Agendar Consulta Confidencial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
