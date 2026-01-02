'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Scale, Award, TrendingUp, Calendar, Edit, UserPlus, Loader2, MapPin, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { ErrorAlert } from '@/components/ui/error-alert'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type LawyerStatus = 'active' | 'inactive' | 'on_leave'
type LawyerSpecialty = 'civil' | 'criminal' | 'family' | 'labor' | 'corporate' | 'tax' | 'real_estate' | 'immigration' | 'general'
type CaseStatus = 'aguardando_documentos' | 'em_analise' | 'em_andamento' | 'concluido' | 'cancelado'

interface Case {
  id: string
  service_type: string
  status: CaseStatus
  progress: number
  client_name: string
  created_at: string
  updated_at: string
}

interface LawyerDetail {
  id: string
  full_name: string
  email: string
  phone: string
  oab_number: string
  oab_state: string
  avatar_url: string | null
  specialties: LawyerSpecialty[]
  status: LawyerStatus
  role: 'admin' | 'lawyer'
  bio: string | null
  location: string | null

  // Stats
  active_cases: number
  completed_cases: number
  total_cases: number
  workload_percentage: number
  success_rate: number
  avg_case_duration: number // days
  client_satisfaction: number // 1-5

  // Cases
  cases: Case[]

  // Dates
  joined_at: string
  last_active: string
}

const specialtyLabels: Record<LawyerSpecialty, string> = {
  civil: 'Cível',
  criminal: 'Criminal',
  family: 'Família',
  labor: 'Trabalhista',
  corporate: 'Empresarial',
  tax: 'Tributário',
  real_estate: 'Imobiliário',
  immigration: 'Imigração',
  general: 'Geral'
}

const statusConfig: Record<CaseStatus, { label: string; color: string }> = {
  aguardando_documentos: {
    label: 'Aguardando Documentos',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  em_analise: {
    label: 'Em Análise',
    color: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  em_andamento: {
    label: 'Em Andamento',
    color: 'bg-green-100 text-green-800 border-green-300'
  },
  concluido: {
    label: 'Concluído',
    color: 'bg-gray-100 text-gray-800 border-gray-300'
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-300'
  }
}

export default function LawyerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lawyerId = params.id as string

  const [lawyer, setLawyer] = useState<LawyerDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (lawyerId) {
      loadLawyer()
    }
  }, [lawyerId])

  async function loadLawyer() {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/lawyers/${lawyerId}`)

      if (!response.ok) {
        throw new Error('Erro ao carregar dados do advogado')
      }

      const data = await response.json()
      setLawyer(data)
    } catch (err) {
      console.error('Error loading lawyer:', err)
      setError(err instanceof Error ? err : new Error('Erro desconhecido'))
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !lawyer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Perfil do Advogado</h1>
          </div>
        </div>

        <ErrorAlert
          error={error || new Error('Advogado não encontrado')}
          retry={loadLawyer}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Perfil do Advogado</h1>
          <p className="text-muted-foreground">
            Informações detalhadas e estatísticas
          </p>
        </div>

        <Link href={`/admin/equipe/${lawyer.id}/editar`}>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        </Link>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-32 w-32">
              <AvatarImage src={lawyer.avatar_url || undefined} />
              <AvatarFallback className="text-3xl">
                {lawyer.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{lawyer.full_name}</h2>
                  <Badge variant="outline" className="capitalize">
                    {lawyer.role === 'admin' ? 'Administrador' : 'Advogado'}
                  </Badge>
                  <Badge
                    variant={lawyer.status === 'active' ? 'default' : 'secondary'}
                  >
                    {lawyer.status === 'active' ? 'Ativo' :
                     lawyer.status === 'on_leave' ? 'Afastado' : 'Inativo'}
                  </Badge>
                </div>

                {lawyer.bio && (
                  <p className="text-muted-foreground">{lawyer.bio}</p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono">{lawyer.oab_number}/{lawyer.oab_state}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${lawyer.email}`} className="hover:underline">
                    {lawyer.email}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${lawyer.phone}`} className="hover:underline">
                    {lawyer.phone}
                  </a>
                </div>

                {lawyer.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{lawyer.location}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Especialidades:</span>
                {lawyer.specialties.map((spec) => (
                  <Badge key={spec} variant="secondary">
                    {specialtyLabels[spec]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Ativos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lawyer.active_cases}</div>
            <p className="text-xs text-muted-foreground">
              {lawyer.total_cases} total ({lawyer.completed_cases} concluídos)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carga de Trabalho</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lawyer.workload_percentage}%</div>
            <Progress value={lawyer.workload_percentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {lawyer.workload_percentage >= 90 ? 'Capacidade máxima' :
               lawyer.workload_percentage >= 70 ? 'Alta carga' :
               lawyer.workload_percentage >= 40 ? 'Carga moderada' :
               'Disponível para novos casos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {lawyer.success_rate}%
            </div>
            <p className="text-xs text-muted-foreground">
              Casos finalizados com êxito
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lawyer.avg_case_duration}</div>
            <p className="text-xs text-muted-foreground">
              dias por caso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs with Details */}
      <Tabs defaultValue="cases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cases">
            Casos ({lawyer.cases.length})
          </TabsTrigger>
          <TabsTrigger value="performance">
            Performance
          </TabsTrigger>
          <TabsTrigger value="info">
            Informações
          </TabsTrigger>
        </TabsList>

        {/* Cases Tab */}
        <TabsContent value="cases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Casos do Advogado</CardTitle>
              <CardDescription>
                Todos os casos atribuídos a {lawyer.full_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lawyer.cases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum caso atribuído ainda
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Serviço</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lawyer.cases.map((caseItem) => (
                      <TableRow key={caseItem.id}>
                        <TableCell className="font-medium">
                          {caseItem.service_type}
                        </TableCell>
                        <TableCell>{caseItem.client_name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn('border', statusConfig[caseItem.status].color)}
                          >
                            {statusConfig[caseItem.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className="bg-primary rounded-full h-2"
                                style={{ width: `${caseItem.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12">
                              {caseItem.progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(caseItem.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Taxa de Sucesso</span>
                    <span className="text-sm font-bold text-green-600">
                      {lawyer.success_rate}%
                    </span>
                  </div>
                  <Progress value={lawyer.success_rate} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Carga de Trabalho</span>
                    <span className="text-sm font-bold">
                      {lawyer.workload_percentage}%
                    </span>
                  </div>
                  <Progress value={lawyer.workload_percentage} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Satisfação do Cliente</span>
                    <span className="text-sm font-bold">
                      {lawyer.client_satisfaction.toFixed(1)}/5.0
                    </span>
                  </div>
                  <Progress value={(lawyer.client_satisfaction / 5) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Casos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total de Casos</span>
                  <span className="text-lg font-bold">{lawyer.total_cases}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Casos Ativos</span>
                  <span className="text-lg font-bold text-green-600">
                    {lawyer.active_cases}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Casos Concluídos</span>
                  <span className="text-lg font-bold">{lawyer.completed_cases}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tempo Médio/Caso</span>
                  <span className="text-lg font-bold">
                    {lawyer.avg_case_duration} dias
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Advogado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nome Completo</span>
                  <p className="text-lg font-medium">{lawyer.full_name}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Função</span>
                  <p className="text-lg font-medium capitalize">
                    {lawyer.role === 'admin' ? 'Administrador' : 'Advogado'}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Email</span>
                  <p className="text-lg font-medium">{lawyer.email}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Telefone</span>
                  <p className="text-lg font-medium">{lawyer.phone}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">OAB</span>
                  <p className="text-lg font-medium font-mono">
                    {lawyer.oab_number}/{lawyer.oab_state}
                  </p>
                </div>

                {lawyer.location && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Localização</span>
                    <p className="text-lg font-medium">{lawyer.location}</p>
                  </div>
                )}

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Entrou em</span>
                  <p className="text-lg font-medium">
                    {format(new Date(lawyer.joined_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Última Atividade</span>
                  <p className="text-lg font-medium">
                    {format(new Date(lawyer.last_active), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>

              {lawyer.bio && (
                <div className="pt-4 border-t">
                  <span className="text-sm font-medium text-muted-foreground">Biografia</span>
                  <p className="text-base mt-2">{lawyer.bio}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <span className="text-sm font-medium text-muted-foreground mb-2 block">
                  Especialidades
                </span>
                <div className="flex flex-wrap gap-2">
                  {lawyer.specialties.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-sm">
                      {specialtyLabels[spec]}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
