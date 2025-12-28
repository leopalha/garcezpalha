'use client'

import { Award, BookOpen, Briefcase, Users, Scale, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface CredentialsSectionProps {
  lawyerName?: string
  experience?: string
  specialization?: string
  stats?: {
    years?: number
    cases?: number
    successRate?: number
    clients?: number
  }
}

export function CredentialsSection({
  lawyerName = 'Equipe Garcez Palha',
  experience = '15+ anos de experiência',
  specialization = 'Especialistas em Direito Civil e Empresarial',
  stats = {
    years: 15,
    cases: 500,
    successRate: 95,
    clients: 1000,
  },
}: CredentialsSectionProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Scale className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por Que Confiar em Nós?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {experience} com reconhecimento em todo o Brasil
            </p>
          </div>

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-blue-200 bg-white dark:bg-gray-900">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Reconhecimento OAB</h3>
                <p className="text-sm text-muted-foreground">
                  Advogados certificados e especializados
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white dark:bg-gray-900">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{specialization}</h3>
                <p className="text-sm text-muted-foreground">
                  Formação acadêmica de excelência
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white dark:bg-gray-900">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Experiência Comprovada</h3>
                <p className="text-sm text-muted-foreground">
                  Atuação em casos de alta complexidade
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-8">
              Números que Comprovam Nossa Excelência
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                  <div className="text-4xl font-bold text-blue-600">{stats.years}+</div>
                </div>
                <div className="text-sm text-muted-foreground">Anos de Experiência</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
                  <div className="text-4xl font-bold text-blue-600">{stats.cases}+</div>
                </div>
                <div className="text-sm text-muted-foreground">Casos Resolvidos</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-blue-600 mr-2" />
                  <div className="text-4xl font-bold text-blue-600">{stats.successRate}%</div>
                </div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-blue-600 mr-2" />
                  <div className="text-4xl font-bold text-blue-600">{stats.clients}+</div>
                </div>
                <div className="text-sm text-muted-foreground">Clientes Satisfeitos</div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium">
              🏆 OAB Certificado
            </div>
            <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium">
              ⚖️ Perito Credenciado CONPEJ
            </div>
            <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium">
              🏠 Corretor CRECI
            </div>
            <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium">
              💼 Atuação Nacional
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
