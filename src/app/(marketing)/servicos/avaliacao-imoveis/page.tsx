import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, CheckCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function AvaliacaoImoveisPage() {
  const services = [
    'Avaliação para compra e venda',
    'Laudos para financiamento bancário',
    'Avaliação de garantias',
    'Perícias judiciais',
    'Avaliação de danos',
    'Laudos para partilha',
    'Avaliação patrimonial',
    'Vistoria técnica',
  ]

  const types = [
    { title: 'Residenciais', items: ['Casas', 'Apartamentos', 'Terrenos', 'Sítios e chácaras'] },
    {
      title: 'Comerciais',
      items: ['Lojas', 'Escritórios', 'Galpões', 'Prédios comerciais'],
    },
    { title: 'Especiais', items: ['Hotéis', 'Hospitais', 'Escolas', 'Indústrias'] },
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Home className="w-20 h-20 text-primary mx-auto mb-6" />
          <h1 className="font-display text-5xl font-bold mb-4">Avaliação de Imóveis</h1>
          <p className="text-xl text-muted-foreground">
            Laudos técnicos de avaliação imobiliária elaborados por perito oficial, com
            reconhecimento judicial e bancário.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {/* Sobre o Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Sobre o Serviço</CardTitle>
              <CardDescription>Avaliações técnicas precisas e fundamentadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Realizamos avaliações imobiliárias seguindo as normas da ABNT (NBR 14.653) e
                metodologias reconhecidas pelo mercado e pelo judiciário.
              </p>
              <p>
                Nossos laudos são aceitos por bancos, tribunais e órgãos públicos, garantindo
                segurança jurídica em suas operações imobiliárias.
              </p>
            </CardContent>
          </Card>

          {/* Metodologia */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Metodologia Técnica</CardTitle>
              <CardDescription>Conformidade com normas ABNT</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p>Vistoria técnica no local</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p>Pesquisa de mercado comparativa</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p>Análise de características construtivas</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p>Tratamento estatístico de dados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tipos de Imóveis */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Tipos de Imóveis Avaliados
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {types.map((type) => (
              <Card key={type.title}>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">{type.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Serviços Inclusos */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Finalidades da Avaliação
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                <span>{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Processo */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Processo de Avaliação</CardTitle>
              <CardDescription>Como funciona do início ao fim</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <strong className="text-lg">Solicitação</strong>
                    <p className="text-muted-foreground">
                      Você entra em contato informando o imóvel e a finalidade da avaliação
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <strong className="text-lg">Agendamento da Vistoria</strong>
                    <p className="text-muted-foreground">
                      Marcamos data e horário para visita técnica ao imóvel
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <strong className="text-lg">Vistoria e Pesquisa</strong>
                    <p className="text-muted-foreground">
                      Realizamos levantamento completo e pesquisa de mercado
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <strong className="text-lg">Entrega do Laudo</strong>
                    <p className="text-muted-foreground">
                      Laudo técnico completo em até 7 dias úteis (prazo pode variar)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
          <h3 className="font-display text-3xl font-bold mb-4">
            Precisa avaliar um imóvel?
          </h3>
          <p className="text-muted-foreground mb-6">
            Solicite um orçamento sem compromisso e receba atendimento personalizado.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/contato">
              <Calendar className="w-4 h-4" />
              Solicitar Orçamento
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
