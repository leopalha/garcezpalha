'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorAlert } from '@/components/ui/error-alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface TimelineEvent {
  id: string
  date: Date
  title: string
  description: string
  type: 'created' | 'document_submitted' | 'status_changed' | 'message' | 'deadline'
}

interface CaseDocument {
  id: string
  name: string
  type: string
  uploadedAt: Date
  status: 'pending' | 'approved' | 'rejected'
}

export default function CaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const caseId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [caso, setCaso] = useState<any>(null)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [documents, setDocuments] = useState<CaseDocument[]>([])

  // Default caso structure for when loading
  const defaultCaso = {
    id: caseId,
    serviceType: 'Divórcio Consensual',
    status: 'em_andamento' as const,
    lawyer: {
      name: 'Dr. João Silva',
      photo: null,
      oab: 'OAB/SP 123456',
      email: 'joao.silva@example.com',
      phone: '(11) 98765-4321',
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    currentPhase: 'Aguardando homologação judicial',
    progress: 65,
    nextStep: 'Aguardando homologação do juiz',
    description: 'Processo de divórcio consensual com partilha de bens',
  }

  useEffect(() => {
    loadCaseDetails()
  }, [caseId])

  async function loadCaseDetails() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/client/cases/${caseId}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Caso não encontrado')
        }
        throw new Error('Falha ao carregar caso')
      }

      const data = await response.json()
      setCaso({
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      })
      setTimeline(data.timeline.map((t: any) => ({
        ...t,
        date: new Date(t.date)
      })))
      setDocuments(data.documents.map((d: any) => ({
        ...d,
        uploadedAt: new Date(d.uploadedAt)
      })))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar caso'))
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: typeof caso.status) => {
    switch (status) {
      case 'em_andamento':
        return 'bg-green-500/10 text-green-600 border-green-500/20'
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const getDocStatusColor = (status: CaseDocument['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-600'
      case 'rejected':
        return 'bg-red-500/10 text-red-600'
      default:
        return 'bg-yellow-500/10 text-yellow-600'
    }
  }

  if (error) {
    return (
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <ErrorAlert error={error} retry={loadCaseDetails} title="Erro ao carregar caso" />
      </div>
    )
  }

  if (isLoading || !caso) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Casos
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{caso.serviceType}</h1>
            <Badge variant="outline" className={cn('border', getStatusColor(caso.status))}>
              Em Andamento
            </Badge>
          </div>
          <p className="text-muted-foreground">{caso.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/cliente/mensagens?caso=${caseId}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Enviar Mensagem
            </Link>
          </Button>
          <Button asChild>
            <Link href="/cliente/documentos">
              <FileText className="mr-2 h-4 w-4" />
              Enviar Documento
            </Link>
          </Button>
        </div>
      </div>

      {/* Progress card */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso do Caso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">{caso.progress}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${caso.progress}%` }}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Fase Atual</p>
                <p className="text-sm text-muted-foreground">{caso.currentPhase}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Próximo Passo</p>
                <p className="text-sm text-muted-foreground">{caso.nextStep}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lawyer info */}
      <Card>
        <CardHeader>
          <CardTitle>Advogado Responsável</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{caso.lawyer.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{caso.lawyer.oab}</p>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>{caso.lawyer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{caso.lawyer.phone}</span>
                </div>
              </div>
            </div>
            <Button asChild>
              <Link href={`/cliente/mensagens?advogado=${caso.lawyer.name}`}>
                Enviar Mensagem
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documentos ({documents.length})</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Histórico do Caso</CardTitle>
              <CardDescription>Todas as atualizações e marcos importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        index === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        {event.type === 'created' && <Calendar className="h-4 w-4" />}
                        {event.type === 'document_submitted' && <FileText className="h-4 w-4" />}
                        {event.type === 'status_changed' && <CheckCircle className="h-4 w-4" />}
                        {event.type === 'message' && <MessageSquare className="h-4 w-4" />}
                        {event.type === 'deadline' && <AlertCircle className="h-4 w-4" />}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-border flex-1 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {event.date.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documentos do Caso</CardTitle>
              <CardDescription>Todos os documentos enviados e gerados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type} • Enviado em {doc.uploadedAt.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={getDocStatusColor(doc.status)}>
                        {doc.status === 'approved' && 'Aprovado'}
                        {doc.status === 'rejected' && 'Rejeitado'}
                        {doc.status === 'pending' && 'Pendente'}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Caso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Data de Início</p>
                  <p className="font-medium">{caso.createdAt.toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Última Atualização</p>
                  <p className="font-medium">{caso.updatedAt.toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tipo de Serviço</p>
                  <p className="font-medium">{caso.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                  <Badge variant="outline" className={cn('border', getStatusColor(caso.status))}>
                    Em Andamento
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-2">Descrição</p>
                <p className="text-sm">{caso.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
