'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorAlert } from '@/components/ui/error-alert'
import {
  Briefcase,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  User,
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
    oab: string
  }
  createdAt: Date
  updatedAt: Date
  currentPhase: string
  progress: number
  nextStep: string
}

export default function CasosPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [cases, setCases] = useState<ClientCase[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadCases()
  }, [])

  async function loadCases() {
    try {
      setIsLoading(true)

      const response = await fetch('/api/client/cases')
      if (!response.ok) {
        throw new Error('Falha ao carregar casos')
      }
      const data = await response.json()

      setCases(data.cases.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt)
      })))

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar casos'))
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

  const filteredCases = cases.filter(caso => {
    const matchesSearch = caso.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caso.lawyer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || caso.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeCases = filteredCases.filter(c => c.status !== 'concluido')
  const completedCases = filteredCases.filter(c => c.status === 'concluido')

  if (error) {
    return <ErrorAlert error={error} retry={loadCases} title="Erro ao carregar casos" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Casos</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe todos os seus processos e serviços contratados
          </p>
        </div>
        <Button asChild>
          <Link href="/servicos">Contratar Serviço</Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por serviço ou advogado..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos os status</option>
          <option value="aguardando_documentos">Aguardando Documentos</option>
          <option value="em_analise">Em Análise</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="concluido">Concluído</option>
        </select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Em Andamento ({activeCases.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Concluídos ({completedCases.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : activeCases.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="Nenhum caso em andamento"
              description={searchTerm ? "Nenhum caso encontrado com esse termo de busca." : "Quando você contratar um serviço, ele aparecerá aqui."}
              action={
                !searchTerm && (
                  <Button asChild>
                    <Link href="/servicos">Contratar Serviço</Link>
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid gap-4">
              {activeCases.map((caso) => (
                <Card key={caso.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{caso.serviceType}</CardTitle>
                        <CardDescription>
                          Iniciado em {caso.createdAt.toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={cn('border', getStatusColor(caso.status))}>
                        {getStatusLabel(caso.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Lawyer info */}
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{caso.lawyer.name}</p>
                        <p className="text-xs text-muted-foreground">{caso.lawyer.oab}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
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

                    {/* Current phase */}
                    <div className="flex items-start gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Fase Atual</p>
                        <p className="text-muted-foreground">{caso.currentPhase}</p>
                      </div>
                    </div>

                    {/* Next step */}
                    <div className="flex items-start gap-2 text-sm p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <Calendar className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-primary">Próximo Passo</p>
                        <p className="text-sm">{caso.nextStep}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="default" size="sm" asChild className="flex-1">
                        <Link href={`/cliente/casos/${caso.id}`}>Ver Detalhes</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/cliente/mensagens?caso=${caso.id}`}>Enviar Mensagem</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : completedCases.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="Nenhum caso concluído"
              description="Casos finalizados aparecerão aqui."
            />
          ) : (
            <div className="grid gap-4">
              {completedCases.map((caso) => (
                <Card key={caso.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{caso.serviceType}</CardTitle>
                        <CardDescription>
                          Concluído em {caso.updatedAt.toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                        Concluído
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{caso.lawyer.name}</p>
                        <p className="text-xs text-muted-foreground">{caso.lawyer.oab}</p>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/cliente/casos/${caso.id}`}>Ver Detalhes e Documentos</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
