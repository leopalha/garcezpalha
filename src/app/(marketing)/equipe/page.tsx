import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, FileCheck, Home, Stethoscope, Mail, Linkedin, Scale, Landmark, Bot, Users } from 'lucide-react'
import Link from 'next/link'

export default function EquipePage() {
  const expertise = [
    {
      icon: Building2,
      title: 'Direito Imobiliário',
      years: '15+ anos',
    },
    {
      icon: Scale,
      title: 'Direito Criminal',
      years: '12+ anos',
    },
    {
      icon: FileCheck,
      title: 'Perícia Documental',
      years: '10+ anos',
    },
    {
      icon: Home,
      title: 'Avaliação de Imóveis',
      years: '12+ anos',
    },
    {
      icon: Stethoscope,
      title: 'Perícia Médica',
      years: '8+ anos',
    },
  ]

  const credentials = [
    'Advogado inscrito na OAB/RJ',
    'Perito Judicial credenciado pelo CONPEJ/RJ',
    'Corretor de Imóveis com CRECI/RJ',
    'Especialização em Perícia Documental e Grafotecnia',
    'Especialização em Avaliação Imobiliária (ABNT NBR 14.653)',
    'Descendente de Viscondes, Barões e Governadores Coloniais',
  ]

  const values = [
    {
      title: 'Tradição',
      description: '364 anos de tradição, nobreza e serviço desde 1661. Herança de excelência jurídica.',
    },
    {
      title: 'Inovação',
      description: 'Pioneirismo na aplicação de inteligência artificial em serviços jurídicos.',
    },
    {
      title: 'Ética',
      description:
        'Conduta profissional irrepreensível e total respeito aos códigos de ética da OAB.',
    },
    {
      title: 'Transparência',
      description: 'Comunicação clara, honesta e regular com todos os clientes.',
    },
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">Nossa Equipe</h1>
          <p className="text-xl text-muted-foreground">
            Experiência, tradição e inovação a serviço de nossos clientes
          </p>
        </div>

        {/* Leonardo Palha - Perfil Principal */}
        <div className="max-w-6xl mx-auto mb-16">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-5">
              {/* Foto (placeholder) */}
              <div className="md:col-span-2 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-12">
                <div className="w-full aspect-square max-w-sm rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <span className="text-8xl font-bold">LP</span>
                </div>
              </div>

              {/* Info */}
              <div className="md:col-span-3 p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="font-display text-4xl">
                    Leonardo Mendonça Palha da Silva
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    Advogado, Perito Oficial e Fundador
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 space-y-6">
                  <p className="text-lg">
                    Descendente direto de <strong>Viscondes de Bucelas, Barões de Combarjúa e
                    Condes de Ribandar</strong>, Leonardo representa a 6ª geração brasileira de uma
                    linhagem nobiliárquica que remonta a 1661 em Lisboa. Une o legado de governadores
                    coloniais que serviram em três continentes com expertise jurídica contemporânea.
                  </p>

                  <p>
                    Como perito judicial credenciado pelo CONPEJ/RJ, atua em casos complexos de perícia
                    documental, avaliação imobiliária e perícia médica trabalhista. Sua formação
                    multidisciplinar reflete a tradição familiar: assim como seus antepassados foram
                    simultaneamente militares, engenheiros e educadores.
                  </p>

                  <p>
                    Pioneiro na aplicação de inteligência artificial em serviços jurídicos, Leonardo
                    moderniza a prática legal mantendo os valores de excelência, integridade e
                    compromisso com a justiça que caracterizaram os Garcez Palha por 364 anos.
                  </p>

                  <div className="flex gap-4 mt-8">
                    <Button asChild>
                      <Link href="/contato" className="gap-2">
                        <Mail className="w-4 h-4" />
                        Entrar em Contato
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link
                        href="https://www.linkedin.com/in/leopalha"
                        target="_blank"
                        className="gap-2"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>

        {/* Credenciais */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Credenciais e Formação
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {credentials.map((credential, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                <span>{credential}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Áreas de Expertise */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Áreas de Expertise
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((area) => {
              const Icon = area.icon
              return (
                <Card key={area.title} className="text-center">
                  <CardHeader>
                    <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="font-heading text-xl">{area.title}</CardTitle>
                    <CardDescription className="text-secondary font-semibold">
                      {area.years}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Valores */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">Nossos Valores</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value) => (
              <Card key={value.title}>
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Citação */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-12 text-center">
              <blockquote className="space-y-4">
                <p className="text-2xl font-heading italic">
                  "Carrego comigo o peso e a honra de 364 anos de tradição familiar. Descendente
                  de governadores que libertaram Macau, viscondes que modernizaram Goa e defensores
                  culturais que preservaram línguas — cada cliente é uma oportunidade de honrar esse legado
                  através da excelência profissional."
                </p>
                <footer className="text-muted-foreground mt-4">
                  — Leonardo Mendonça Palha da Silva, 6ª geração brasileira
                </footer>
              </blockquote>
            </CardContent>
          </Card>
        </div>

        {/* Diferenciais */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Por que escolher nosso escritório?
          </h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="w-5 h-5 text-primary" />
                  <h3 className="font-heading text-xl">Nobreza Documentada</h3>
                </div>
                <p className="text-muted-foreground">
                  Desde 1661, Viscondes, Barões, Condes e Governadores Coloniais. 364 anos
                  de tradição e serviço em três continentes — Portugal, Índia e Brasil.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <h3 className="font-heading text-xl">Inovação Tecnológica</h3>
                </div>
                <p className="text-muted-foreground">
                  Utilizamos inteligência artificial e automação para oferecer atendimento 24/7,
                  agilidade nos processos e comunicação constante.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-5 h-5 text-primary" />
                  <h3 className="font-heading text-xl">Expertise Multidisciplinar</h3>
                </div>
                <p className="text-muted-foreground">
                  Advocacia, perícia documental, avaliação imobiliária e perícia médica - tudo em
                  um só lugar, com a mesma qualidade.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-heading text-xl">Atendimento Personalizado</h3>
                </div>
                <p className="text-muted-foreground">
                  Cada cliente é único. Oferecemos soluções customizadas para cada necessidade,
                  sempre com transparência e comunicação clara.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
          <h3 className="font-display text-3xl font-bold mb-4">Vamos trabalhar juntos?</h3>
          <p className="text-muted-foreground mb-6">
            Entre em contato e descubra como 364 anos de tradição nobiliárquica podem fazer
            a diferença no seu caso.
          </p>
          <Button size="lg" asChild>
            <Link href="/contato">Agendar Consulta Gratuita</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4 italic">
            Tradição desde 1661 | Excelência desde sempre
          </p>
        </div>
      </div>
    </div>
  )
}
