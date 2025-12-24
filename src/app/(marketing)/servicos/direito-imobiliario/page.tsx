import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, CheckCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function DireitoImobiliarioPage() {
  const services = [
    'Compra e venda de imóveis',
    'Regularização de documentação',
    'Usucapião',
    'Contratos de locação',
    'Incorporação imobiliária',
    'Ações possessórias',
    'Despejos',
    'Condomínios',
    'Inventários e partilhas',
    'Consultoria preventiva',
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Building2 className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="font-display text-5xl font-bold mb-4">Direito Imobiliário</h1>
          <p className="text-xl text-muted-foreground">
            Assessoria jurídica completa para transações imobiliárias, regularizações e solução de
            conflitos relacionados a propriedades.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {/* Sobre o Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Sobre o Serviço</CardTitle>
              <CardDescription>Expertise em questões imobiliárias complexas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Com 364 anos de tradição familiar (desde 1661), oferecemos assessoria jurídica especializada em
                todas as etapas de transações imobiliárias, desde a análise documental até a
                finalização do negócio.
              </p>
              <p>
                Nossa experiência abrange desde operações simples até casos complexos envolvendo
                regularização fundiária, usucapião e conflitos de propriedade.
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
                <p>Análise minuciosa de documentação imobiliária</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p>Prevenção de problemas futuros com due diligence completa</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p>Acompanhamento em cartórios e órgãos públicos</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p>Solução ágil de pendências e irregularidades</p>
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
            Precisa de assessoria imobiliária?
          </h3>
          <p className="text-muted-foreground mb-6">
            Agende uma consulta gratuita de 30 minutos e descubra como podemos ajudar você.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/contato">
              <Calendar className="w-4 h-4" />
              Agendar Consulta Gratuita
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
