/**
 * Beta Signup Page
 * Formulário de inscrição para beta testers
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Sparkles, Users, Zap, Trophy } from 'lucide-react'
import { trackEvent } from '@/lib/analytics/ga4'

export default function BetaSignupPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    oab: '',
    company: '',
    city: '',
    state: '',
    interests: [] as string[],
    experience: '',
    howHeard: '',
    motivation: '',
    techFamiliarity: '3',
    weeklyHours: '',
    usedOtherPlatforms: '',
    otherPlatforms: '',
    canDedicateTime: 'yes',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Track form submission
      trackEvent('beta_signup_submit', {
        profession: formData.profession,
        tech_familiarity: formData.techFamiliarity,
      })

      const res = await fetch('/api/beta/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao enviar inscrição')
      }

      // Track success
      trackEvent('beta_signup_success', {
        profession: formData.profession,
      })

      // Redirect to success page
      router.push('/beta-signup/success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      trackEvent('beta_signup_error', {
        error: err instanceof Error ? err.message : 'unknown',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Beta Exclusivo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Faça Parte do Futuro Jurídico
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seja um dos primeiros a testar nossa plataforma e ganhe acesso
            vitalício com 50% de desconto.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">Acesso Antecipado</h3>
            <p className="text-sm text-muted-foreground">
              Teste features antes de todo mundo
            </p>
          </Card>
          <Card className="p-6 text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">Influência Direta</h3>
            <p className="text-sm text-muted-foreground">
              Seu feedback molda o produto
            </p>
          </Card>
          <Card className="p-6 text-center">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">50% de Desconto</h3>
            <p className="text-sm text-muted-foreground">
              Vitalício nos primeiros 6 meses
            </p>
          </Card>
        </div>

        {/* Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Informações Pessoais</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="profession">Profissão *</Label>
                  <Select
                    value={formData.profession}
                    onValueChange={(value) =>
                      handleInputChange('profession', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="advogado">Advogado(a)</SelectItem>
                      <SelectItem value="estudante">Estudante de Direito</SelectItem>
                      <SelectItem value="contador">Contador(a)</SelectItem>
                      <SelectItem value="consultor">Consultor(a)</SelectItem>
                      <SelectItem value="ti">Profissional de TI</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            {formData.profession === 'advogado' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Informações Profissionais</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="oab">OAB</Label>
                    <Input
                      id="oab"
                      value={formData.oab}
                      onChange={(e) => handleInputChange('oab', e.target.value)}
                      placeholder="Ex: OAB/RJ 123456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Escritório/Empresa</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Localização</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Ex: RJ"
                  />
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Áreas de Interesse</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {['Bancário', 'Consumidor', 'Trabalhista', 'Previdenciário', 'Administrativo', 'Imobiliário'].map(
                  (interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label htmlFor={interest} className="cursor-pointer">
                        {interest}
                      </Label>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Qualification Questions */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Sobre Você</h2>
              <div className="space-y-4">
                <div>
                  <Label>Familiaridade com tecnologia (1-5) *</Label>
                  <RadioGroup
                    value={formData.techFamiliarity}
                    onValueChange={(value) =>
                      handleInputChange('techFamiliarity', value)
                    }
                    className="flex gap-4 mt-2"
                  >
                    {['1', '2', '3', '4', '5'].map((num) => (
                      <div key={num} className="flex items-center space-x-2">
                        <RadioGroupItem value={num} id={`tech-${num}`} />
                        <Label htmlFor={`tech-${num}`}>{num}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground mt-1">
                    1 = Iniciante | 5 = Avançado
                  </p>
                </div>

                <div>
                  <Label htmlFor="weeklyHours">
                    Horas/semana com questões jurídicas
                  </Label>
                  <Input
                    id="weeklyHours"
                    type="number"
                    value={formData.weeklyHours}
                    onChange={(e) =>
                      handleInputChange('weeklyHours', e.target.value)
                    }
                    placeholder="Ex: 40"
                  />
                </div>

                <div>
                  <Label>Já usou outras plataformas jurídicas? *</Label>
                  <RadioGroup
                    value={formData.usedOtherPlatforms}
                    onValueChange={(value) =>
                      handleInputChange('usedOtherPlatforms', value)
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="used-yes" />
                      <Label htmlFor="used-yes">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="used-no" />
                      <Label htmlFor="used-no">Não</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.usedOtherPlatforms === 'yes' && (
                  <div>
                    <Label htmlFor="otherPlatforms">Quais plataformas?</Label>
                    <Input
                      id="otherPlatforms"
                      value={formData.otherPlatforms}
                      onChange={(e) =>
                        handleInputChange('otherPlatforms', e.target.value)
                      }
                      placeholder="Ex: Projuris, Aurum, etc"
                    />
                  </div>
                )}

                <div>
                  <Label>Pode dedicar 2h/semana para feedback? *</Label>
                  <RadioGroup
                    value={formData.canDedicateTime}
                    onValueChange={(value) =>
                      handleInputChange('canDedicateTime', value)
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="time-yes" />
                      <Label htmlFor="time-yes">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="time-no" />
                      <Label htmlFor="time-no">Não</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="motivation">
                    Por que quer ser beta tester? *
                  </Label>
                  <Textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) =>
                      handleInputChange('motivation', e.target.value)
                    }
                    rows={4}
                    required
                    placeholder="Conte-nos sua motivação..."
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Inscrição'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Ao enviar, você concorda com nossos Termos de Uso e Política de
              Privacidade. Analisaremos sua inscrição em até 48h.
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
