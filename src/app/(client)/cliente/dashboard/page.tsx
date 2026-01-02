'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorAlert } from '@/components/ui/error-alert'
import {
  Briefcase,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Upload,
  Calendar,
  TrendingUp,
  Bell,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ClientCase {
  id: string
  serviceType: string
  status: 'aguardando_documentos' | 'em_analise' | 'em_andamento' | 'concluido'
  lawyer: {
    name: string
    photo?: string
  }
  progress: number
  updatedAt: Date
  nextStep: string
}

interface Notification {
  id: string
  type: 'message' | 'document' | 'case_update' | 'deadline'
  title: string
  description: string
  read: boolean
  createdAt: Date
}

interface DashboardStats {
  activeCases: number
  pendingDocuments: number
  unreadMessages: number
  upcomingDeadlines: number
}

export default function ClientDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    activeCases: 0,
    pendingDocuments: 0,
    unreadMessages: 0,
    upcomingDeadlines: 0,
  })
  const [cases, setCases] = useState<ClientCase[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setIsLoading(true)

      const response = await fetch('/api/client/dashboard')
      if (!response.ok) {
        throw new Error('Falha ao carregar dashboard')
      }
      const data = await response.json()

      setStats(data.stats)
      setCases(data.cases.map((c: any) => ({
        ...c,
        updatedAt: new Date(c.updatedAt)
      })))
      setNotifications(data.notifications.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt)
      })))

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar dashboard'))
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: ClientCase['status']) => {
    switch (status) {
      case 'aguardando_documentos':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'em_analise':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'em_andamento':
        return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'concluido':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const getStatusLabel = (status: ClientCase['status']) => {
    switch (status) {
      case 'aguardando_documentos':
        return 'Aguardando Documentos'
      case 'em_analise':
        return 'Em Análise'
      case 'em_andamento':
        return 'Em Andamento'
      case 'concluido':
        return 'Concluído'
    }
  }

  if (error) {
    return <ErrorAlert error={error} retry={loadDashboard} title="Erro ao carregar dashboard" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta!</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe o andamento dos seus casos e mantenha-se atualizado.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Ativos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeCases}</div>
                <p className="text-xs text-muted-foreground">
                  Em andamento
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.pendingDocuments}</div>
                <p className="text-xs text-muted-foreground">
                  Aguardando envio
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                <p className="text-xs text-muted-foreground">
                  Não lidas
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prazos Próximos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
                <p className="text-xs text-muted-foreground">
                  Esta semana
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Meus Casos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Meus Casos</CardTitle>
            <CardDescription>Acompanhe o andamento dos seus processos</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : cases.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="Nenhum caso em andamento"
                description="Quando você contratar um serviço, ele aparecerá aqui."
                action={
                  <Button asChild>
                    <Link href="/servicos">Ver Serviços</Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {cases.map((caso) => (
                  <div
                    key={caso.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold">{caso.serviceType}</h3>
                        <p className="text-sm text-muted-foreground">
                          Advogado: {caso.lawyer.name}
                        </p>
                      </div>
                      <Badge variant="outline" className={cn('border', getStatusColor(caso.status))}>
                        {getStatusLabel(caso.status)}
                      </Badge>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">{caso.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${caso.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>Próximo: {caso.nextStep}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/cliente/casos/${caso.id}`}>Ver Detalhes</Link>
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/cliente/casos">Ver Todos os Casos</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>O que você precisa fazer?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/cliente/documentos">
                <Upload className="mr-2 h-4 w-4" />
                Enviar Documentos
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/cliente/mensagens">
                <MessageSquare className="mr-2 h-4 w-4" />
                Falar com Advogado
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/cliente/casos">
                <Briefcase className="mr-2 h-4 w-4" />
                Ver Meus Casos
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/servicos">
                <Calendar className="mr-2 h-4 w-4" />
                Contratar Novo Serviço
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Notificações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações Recentes</CardTitle>
            <CardDescription>Fique por dentro das atualizações</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : notifications.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="Nenhuma notificação"
                description="Você está em dia com tudo!"
              />
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      'p-3 border rounded-lg text-sm',
                      !notif.read && 'bg-primary/5 border-primary/20'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {notif.type === 'message' && <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5" />}
                      {notif.type === 'document' && <FileText className="h-4 w-4 text-green-500 mt-0.5" />}
                      {notif.type === 'case_update' && <Briefcase className="h-4 w-4 text-purple-500 mt-0.5" />}
                      {notif.type === 'deadline' && <Clock className="h-4 w-4 text-red-500 mt-0.5" />}
                      <div className="flex-1">
                        <p className="font-medium">{notif.title}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">{notif.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/cliente/notificacoes">Ver Todas</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
