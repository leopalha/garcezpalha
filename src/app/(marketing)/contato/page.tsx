'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [submitMessage, setSubmitMessage] = useState('')

  const createLead = trpc.leads.create.useMutation({
    onSuccess: () => {
      setSubmitMessage(
        'Mensagem enviada com sucesso! Entraremos em contato em breve.'
      )
      setFormData({ name: '', email: '', phone: '', service: '', message: '' })
    },
    onError: (error) => {
      setSubmitMessage(
        `Erro ao enviar mensagem: ${error.message}. Por favor, tente novamente.`
      )
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitMessage('')

    createLead.mutate({
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service_interest: formData.service,
      message: formData.message,
      source: 'website',
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">Entre em Contato</h1>
          <p className="text-xl text-muted-foreground">
            Estamos prontos para atender você. Preencha o formulário ou use nossos canais diretos.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-8">
          {/* Informações de Contato */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Informações de Contato</CardTitle>
                <CardDescription>Nossos canais de atendimento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a
                      href="mailto:contato@garcezpalha.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      contato@garcezpalha.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Telefone / WhatsApp</p>
                    <a
                      href="tel:+5521995354010"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      (21) 99535-4010
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Endereço</p>
                    <p className="text-muted-foreground">
                      Av. das Américas 13685
                      <br />
                      Barra da Tijuca, Rio de Janeiro, RJ
                      <br />
                      CEP 22790-701
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Horário de Atendimento</p>
                    <p className="text-muted-foreground">
                      Segunda a Sexta: 9h às 18h
                      <br />
                      Sábado: 9h às 13h
                      <br />
                      <span className="text-secondary font-semibold">
                        WhatsApp 24/7 (chatbot)
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Consulta Gratuita</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Oferecemos uma consulta inicial gratuita de 30 minutos para avaliar seu caso e
                  apresentar as melhores soluções.
                </p>
                <p className="text-sm font-semibold text-primary">
                  Sem compromisso. Totalmente confidencial.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Formulário */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Envie sua Mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e responderemos em até 24 horas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="(21) 99999-9999"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Serviço de Interesse *</Label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Selecione um serviço</option>
                      <option value="direito-imobiliario">Direito Imobiliário</option>
                      <option value="pericia-documentos">Perícia Documental</option>
                      <option value="avaliacao-imoveis">Avaliação de Imóveis</option>
                      <option value="pericia-medica">Perícia Médica Trabalhista</option>
                      <option value="secretaria-remota">Secretária Remota (IA)</option>
                      <option value="parceria">Parceria / Afiliação</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Conte-nos sobre sua necessidade..."
                      className="min-h-[150px]"
                    />
                  </div>

                  {submitMessage && (
                    <div className="p-4 rounded-lg bg-primary/10 text-primary border border-primary/20">
                      {submitMessage}
                    </div>
                  )}

                  <Button type="submit" size="lg" className="w-full gap-2" disabled={createLead.isPending}>
                    {createLead.isPending ? (
                      'Enviando...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Ao enviar este formulário, você concorda com nossa{' '}
                    <a href="/privacidade" className="underline hover:text-primary">
                      Política de Privacidade
                    </a>
                    . Seus dados estão seguros conosco.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Métodos Alternativos */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">
            Outras Formas de Contato
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl mb-2">WhatsApp</h3>
                <p className="text-muted-foreground mb-4">
                  Atendimento automático 24/7 via chatbot com IA
                </p>
                <Button variant="outline" asChild>
                  <a href="https://wa.me/5521995354010" target="_blank" rel="noopener noreferrer">
                    Abrir WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-heading text-xl mb-2">Email Direto</h3>
                <p className="text-muted-foreground mb-4">
                  Resposta em até 24 horas úteis
                </p>
                <Button variant="outline" asChild>
                  <a href="mailto:contato@garcezpalha.com">Enviar Email</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl mb-2">Telefone</h3>
                <p className="text-muted-foreground mb-4">
                  Horário comercial: Seg-Sex 9h-18h
                </p>
                <Button variant="outline" asChild>
                  <a href="tel:+5521995354010">Ligar Agora</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
