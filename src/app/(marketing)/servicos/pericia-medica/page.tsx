import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Stethoscope, CheckCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function PericiaMedicaPage() {
  const services = [
    'Acidentes de trabalho',
    'Doenças ocupacionais',
    'Nexo causal',
    'Incapacidade laborativa',
    'Danos pessoais',
    'Sequelas permanentes',
    'Aposentadoria por invalidez',
    'Auxílio-doença',
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Stethoscope className="w-20 h-20 text-secondary mx-auto mb-6" />
          <h1 className="font-display text-5xl font-bold mb-4">Perícia Médica Trabalhista</h1>
          <p className="text-xl text-muted-foreground">
            Laudos periciais especializados em acidentes de trabalho, doenças ocupacionais e
            avaliação de incapacidade laborativa.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {/* Sobre o Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Sobre o Serviço</CardTitle>
              <CardDescription>Perícia técnica com validade judicial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Realizamos perícias médicas trabalhistas com foco em acidentes de trabalho, doenças
                ocupacionais e avaliação de nexo causal entre condições de saúde e atividade
                profissional.
              </p>
              <p>
                Nossos laudos são elaborados seguindo critérios técnicos rigorosos, com total
                imparcialidade e fundamentação científica, sendo reconhecidos por tribunais
                trabalhistas.
              </p>
            </CardContent>
          </Card>

          {/* Aplicações */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Quando Solicitar</CardTitle>
              <CardDescription>Principais situações que requerem perícia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p>Processos trabalhistas de acidente ou doença</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p>Solicitação de benefícios previdenciários</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p>Avaliação de danos e indenizações</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p>Comprovação de nexo causal</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tipos de Perícia */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Tipos de Perícia Oferecidos
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

        {/* O que avaliamos */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Nexo Causal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Avaliação da relação entre a doença/lesão e as condições de trabalho ou acidente
                ocorrido.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Incapacidade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Determinação do grau de incapacidade laborativa, temporária ou permanente, total ou
                parcial.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Sequelas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Identificação e quantificação de sequelas permanentes decorrentes de acidentes ou
                doenças.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Processo */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Como Funciona</CardTitle>
              <CardDescription>Processo pericial médico trabalhista</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-secondary font-bold">1</span>
                  </div>
                  <div>
                    <strong className="text-lg">Agendamento</strong>
                    <p className="text-muted-foreground">
                      Marcação da consulta pericial com apresentação de documentos médicos
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-secondary font-bold">2</span>
                  </div>
                  <div>
                    <strong className="text-lg">Exame Pericial</strong>
                    <p className="text-muted-foreground">
                      Avaliação médica completa com análise de exames e histórico
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-secondary font-bold">3</span>
                  </div>
                  <div>
                    <strong className="text-lg">Análise Técnica</strong>
                    <p className="text-muted-foreground">
                      Estudo detalhado do caso com fundamentação científica
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-secondary font-bold">4</span>
                  </div>
                  <div>
                    <strong className="text-lg">Laudo Pericial</strong>
                    <p className="text-muted-foreground">
                      Emissão do laudo técnico com conclusões fundamentadas
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Importante */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-secondary/20 bg-secondary/5">
            <CardHeader>
              <CardTitle className="font-heading text-2xl flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-secondary" />
                Importante Saber
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                <strong>Documentação Necessária:</strong> Traga todos os exames médicos, laudos,
                atestados e documentos relacionados ao caso.
              </p>
              <p>
                <strong>Prazo de Entrega:</strong> O laudo pericial é entregue em até 10 dias úteis
                após a consulta.
              </p>
              <p>
                <strong>Validade Judicial:</strong> Nossos laudos têm validade em processos
                judiciais trabalhistas e previdenciários.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
          <h3 className="font-display text-3xl font-bold mb-4">
            Precisa de perícia médica trabalhista?
          </h3>
          <p className="text-muted-foreground mb-6">
            Entre em contato para agendar sua consulta pericial ou tirar dúvidas.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/contato">
              <Calendar className="w-4 h-4" />
              Agendar Consulta
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
