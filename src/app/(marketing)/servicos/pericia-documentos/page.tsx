import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileCheck, CheckCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function PericiaDocumentosPage() {
  const services = [
    'Grafotecnia e análise de assinaturas',
    'Verificação de autenticidade documental',
    'Laudos periciais técnicos',
    'Perícia em documentos falsificados',
    'Análise de alterações documentais',
    'Datação de documentos',
    'Exame de tintas e papéis',
    'Perícia em cheques e contratos',
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <FileCheck className="w-20 h-20 text-secondary mx-auto mb-6" />
          <h1 className="font-display text-5xl font-bold mb-4">Perícia Documental</h1>
          <p className="text-xl text-muted-foreground">
            Análise técnica especializada de documentos para verificação de autenticidade,
            grafotecnia e laudos periciais com reconhecimento judicial.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {/* Sobre o Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Sobre o Serviço</CardTitle>
              <CardDescription>Perícia oficial reconhecida pelos tribunais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Como perito oficial, Leonardo Mendonça Palha da Silva possui habilitação técnica
                para realizar análises documentais complexas, com laudos que possuem validade
                judicial.
              </p>
              <p>
                Utilizamos metodologias científicas avançadas para detecção de fraudes, análise de
                autenticidade e verificação de alterações em documentos diversos.
              </p>
            </CardContent>
          </Card>

          {/* Aplicações */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Aplicações Principais</CardTitle>
              <CardDescription>Quando solicitar uma perícia documental</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p>Processos judiciais que exigem prova pericial</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p>Verificação de autenticidade de assinaturas</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p>Investigação de fraudes documentais</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p>Análise de contratos e cheques suspeitos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Serviços Inclusos */}
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

        {/* Metodologia */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Nossa Metodologia</CardTitle>
              <CardDescription>Processo científico e rigoroso</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <strong>Recebimento e Análise Inicial</strong>
                    <p className="text-muted-foreground">
                      Avaliação preliminar do documento e definição do escopo da perícia
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <strong>Exames Técnicos</strong>
                    <p className="text-muted-foreground">
                      Aplicação de métodos científicos de análise grafotécnica e documental
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <strong>Elaboração do Laudo</strong>
                    <p className="text-muted-foreground">
                      Redação técnica detalhada com conclusões fundamentadas
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </span>
                  <div>
                    <strong>Apresentação e Suporte</strong>
                    <p className="text-muted-foreground">
                      Entrega do laudo e esclarecimentos técnicos quando necessário
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
          <h3 className="font-display text-3xl font-bold mb-4">Precisa de perícia documental?</h3>
          <p className="text-muted-foreground mb-6">
            Entre em contato para uma avaliação preliminar do seu caso.
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
