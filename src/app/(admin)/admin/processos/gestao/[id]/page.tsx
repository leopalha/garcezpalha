'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  FileText,
  Calendar,
  Users,
  DollarSign,
  MessageSquare,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ErrorAlert } from '@/components/ui/error-alert'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

type ProcessStatus = 'aguardando_documentos' | 'em_analise' | 'em_andamento' | 'concluido' | 'cancelado'

type Process = {
  id: string
  client_id: string
  lawyer_id: string
  service_type: string
  status: ProcessStatus
  case_number: string | null
  court: string | null
  description: string | null
  current_phase: string | null
  progress: number
  next_step: string | null
  value: number | null
  created_at: string
  updated_at: string
  completed_at: string | null
  metadata: any
  client?: {
    id: string
    full_name: string
    email: string
    phone?: string
    avatar_url?: string
  }
  lawyer?: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
  }
}

type TimelineEvent = {
  id: string
  type: string
  title: string
  description: string | null
  created_at: string
}

type Document = {
  id: string
  name: string
  type: string
  description: string | null
  file_url: string
  file_size: number
  status: string
  uploaded_at: string
  uploaded_by: string
}

const statusConfig: Record<ProcessStatus, { label: string; color: string; icon: any }> = {
  aguardando_documentos: {
    label: 'Aguardando Documentos',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Clock
  },
  em_analise: {
    label: 'Em Análise',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: Activity
  },
  em_andamento: {
    label: 'Em Andamento',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle
  },
  concluido: {
    label: 'Concluído',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: CheckCircle
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: AlertCircle
  }
}

export default function DetalhesProcessoPage() {
  const params = useParams()
  const router = useRouter()
  const processId = params.id as string

  const [process, setProcess] = useState<Process | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadProcessData()
  }, [processId])

  async function loadProcessData() {
    try {
      setIsLoading(true)
      setError(null)

      // Load process details
      const processResponse = await fetch(`/api/admin/processes/${processId}`)
      if (!processResponse.ok) {
        throw new Error('Erro ao carregar processo')
      }
      const processData = await processResponse.json()
      setProcess(processData)

      // Load timeline
      const timelineResponse = await fetch(`/api/client/cases/${processId}`)
      if (timelineResponse.ok) {
        const data = await timelineResponse.json()
        setTimeline(data.timeline || [])
        setDocuments(data.documents || [])
      }
    } catch (err) {
      console.error('Error loading process:', err)
      setError(err instanceof Error ? err : new Error('Erro desconhecido'))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteProcess() {
    if (!confirm('Tem certeza que deseja excluir este processo? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/processes/${processId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir processo')
      }

      router.push('/admin/processos/gestao')
    } catch (err) {
      console.error('Error deleting process:', err)
      alert('Erro ao excluir processo')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error || !process) {
    return (
      <div className="space-y-6">
        <ErrorAlert error={error || new Error('Processo não encontrado')} />
      </div>
    )
  }

  const StatusIcon = statusConfig[process.status].icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/processos/gestao">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{process.service_type}</h1>
            <p className="text-muted-foreground">
              {process.case_number || 'Processo não distribuído'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/admin/processos/gestao/${processId}/editar`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDeleteProcess}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Status and Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Status</p>
              <Badge variant="outline" className={cn('text-base', statusConfig[process.status].color)}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {statusConfig[process.status].label}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Progresso</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary rounded-full h-3 transition-all"
                    style={{ width: `${process.progress}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-12">{process.progress}%</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Última Atualização</p>
              <p className="font-medium">
                {formatDistanceToNow(new Date(process.updated_at), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="informacoes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="informacoes">
            <FileText className="h-4 w-4 mr-2" />
            Informações
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Activity className="h-4 w-4 mr-2" />
            Timeline ({timeline.length})
          </TabsTrigger>
          <TabsTrigger value="documentos">
            <FileText className="h-4 w-4 mr-2" />
            Documentos ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="partes">
            <Users className="h-4 w-4 mr-2" />
            Partes
          </TabsTrigger>
        </TabsList>

        {/* Tab: Informações */}
        <TabsContent value="informacoes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cliente */}
            <Card>
              <CardHeader>
                <CardTitle>Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{process.client?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{process.client?.email}</p>
                </div>
                {process.client?.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{process.client.phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Advogado */}
            <Card>
              <CardHeader>
                <CardTitle>Advogado Responsável</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{process.lawyer?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{process.lawyer?.email}</p>
                </div>
                {process.metadata?.oab && (
                  <div>
                    <p className="text-sm text-muted-foreground">OAB</p>
                    <p className="font-medium">{process.metadata.oab}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Dados do Processo */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Processo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {process.court && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tribunal/Vara</p>
                    <p className="font-medium">{process.court}</p>
                  </div>
                )}
                {process.value && (
                  <div>
                    <p className="text-sm text-muted-foreground">Valor da Causa</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(process.value)}
                    </p>
                  </div>
                )}
              </div>

              {process.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                  <p className="text-sm">{process.description}</p>
                </div>
              )}

              <Separator />

              {process.current_phase && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fase Atual</p>
                  <p className="font-medium">{process.current_phase}</p>
                </div>
              )}

              {process.next_step && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Próximo Passo</p>
                  <p className="text-sm">{process.next_step}</p>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Criado em</p>
                  <p>{format(new Date(process.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                </div>
                {process.completed_at && (
                  <div>
                    <p className="text-muted-foreground">Concluído em</p>
                    <p>{format(new Date(process.completed_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Timeline */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Eventos</CardTitle>
              <CardDescription>
                Acompanhe todo o histórico de movimentações do processo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum evento registrado ainda
                </p>
              ) : (
                <div className="space-y-4">
                  {timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        {index < timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="font-medium">{event.title}</p>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(event.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Documentos */}
        <TabsContent value="documentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos do Processo</CardTitle>
              <CardDescription>
                Todos os documentos anexados ao processo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum documento anexado ainda
                </p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.type} • {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Partes */}
        <TabsContent value="partes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Partes do Processo</CardTitle>
              <CardDescription>
                Informações sobre autor, réu e outras partes envolvidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Funcionalidade em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
