'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  UserCheck,
  RefreshCw,
  Filter,
  ChevronDown,
  FileDown
} from 'lucide-react'
import { ErrorAlert } from '@/components/ui/error-alert'
import { EmptyState } from '@/components/ui/empty-state'

interface ReviewQueueItem {
  id: string
  documentId: string
  leadId: string
  documentType: string
  title: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_review' | 'approved' | 'rejected'
  assignedTo?: string
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
  reviewNotes?: string
}

interface ReviewStats {
  total: number
  pending: number
  inReview: number
  approved: number
  rejected: number
  avgReviewTimeMinutes: number
}

interface DocumentContent {
  item: ReviewQueueItem
  document: {
    id: string
    title: string
    content: string
    variables: Record<string, any>
    status: string
    createdAt: string
  }
}

const statusConfig = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    color: 'text-yellow-600 bg-yellow-100'
  },
  in_review: {
    label: 'Em Revisao',
    icon: Eye,
    color: 'text-blue-600 bg-blue-100'
  },
  approved: {
    label: 'Aprovado',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-100'
  },
  rejected: {
    label: 'Rejeitado',
    icon: XCircle,
    color: 'text-red-600 bg-red-100'
  }
}

const priorityConfig = {
  high: { label: 'Alta', color: 'text-red-600 bg-red-100' },
  medium: { label: 'Media', color: 'text-yellow-600 bg-yellow-100' },
  low: { label: 'Baixa', color: 'text-gray-600 bg-gray-100' }
}

const documentTypeLabels: Record<string, string> = {
  'peticao-desbloqueio-conta': 'Desbloqueio de Conta',
  'peticao-golpe-pix': 'Golpe PIX',
  'peticao-negativacao': 'Negativacao Indevida',
  'peticao-usucapiao': 'Usucapiao',
  'peticao-plano-saude': 'Plano de Saude',
  'peticao-auxilio-doenca': 'Auxilio Doenca',
  'contrato-honorarios': 'Contrato de Honorarios',
  'procuracao': 'Procuracao',
  'notificacao-extrajudicial': 'Notificacao Extrajudicial'
}

export default function DocumentosPage() {
  const { data: session } = useSession()
  const [items, setItems] = useState<ReviewQueueItem[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<DocumentContent | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [actionLoading, setActionLoading] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Fetch queue items and stats
  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch stats
      const statsRes = await fetch('/api/documents/review?stats=true')
      if (!statsRes.ok) throw new Error('Erro ao carregar estatísticas')
      const statsData = await statsRes.json()
      if (statsData.stats) {
        setStats(statsData.stats)
      }

      // Fetch items
      const status = filter !== 'all' ? `&status=${filter}` : ''
      const itemsRes = await fetch(`/api/documents/review?limit=50${status}`)
      if (!itemsRes.ok) throw new Error('Erro ao carregar documentos')
      const itemsData = await itemsRes.json()
      if (itemsData.items) {
        setItems(itemsData.items)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err : new Error('Erro ao carregar dados'))
    } finally {
      setLoading(false)
    }
  }

  const fetchItemDetails = async (itemId: string) => {
    try {
      const res = await fetch(`/api/documents/review?itemId=${itemId}`)
      const data = await res.json()
      if (data.item && data.document) {
        setSelectedItem(data)
        setReviewNotes(data.item.reviewNotes || '')
      }
    } catch (error) {
      console.error('Error fetching item details:', error)
    }
  }

  const handleAction = async (action: string, notes?: string) => {
    if (!selectedItem) return

    setActionLoading(true)
    try {
      const body: {
        action: string
        itemId: string
        reviewerId: string
        notes?: string
        reason?: string
        feedback?: string
      } = {
        action,
        itemId: selectedItem.item.id,
        reviewerId: session?.user?.id || session?.user?.email || 'admin'
      }

      if (action === 'approve') {
        body.notes = notes || reviewNotes
      } else if (action === 'reject' || action === 'request-revision') {
        body.reason = notes || reviewNotes
        body.feedback = notes || reviewNotes
      }

      const res = await fetch('/api/documents/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const result = await res.json()
      if (result.success) {
        setSelectedItem(null)
        fetchData()
      } else {
        alert(`Erro: ${result.message}`)
      }
    } catch (error) {
      console.error('Error performing action:', error)
      alert('Erro ao processar acao')
    }
    setActionLoading(false)
  }

  const handleExport = async (documentId: string, format: string = 'docx') => {
    try {
      window.open(`/api/documents/export?documentId=${documentId}&format=${format}`, '_blank')
    } catch (error) {
      console.error('Error exporting:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Documentos Juridicos</h1>
            <p className="text-muted-foreground">Fila de revisao de documentos gerados por IA</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Documentos Juridicos</h1>
            <p className="text-muted-foreground">Fila de revisao de documentos gerados por IA</p>
          </div>
        </div>
        <ErrorAlert
          error={error.message}
          retry={fetchData}
          title="Erro ao carregar documentos"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Documentos Juridicos</h1>
          <p className="text-muted-foreground">
            Fila de revisao de documentos gerados por IA
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.total}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-muted-foreground">Pendentes</span>
            </div>
            <p className="text-2xl font-bold mt-2 text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">Em Revisao</span>
            </div>
            <p className="text-2xl font-bold mt-2 text-blue-600">{stats.inReview}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Aprovados</span>
            </div>
            <p className="text-2xl font-bold mt-2 text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tempo Medio</span>
            </div>
            <p className="text-2xl font-bold mt-2">{stats.avgReviewTimeMinutes}min</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          <ChevronDown className={cn('h-4 w-4 ml-2 transition-transform', showFilters && 'rotate-180')} />
        </Button>

        <div className="flex gap-2">
          {['all', 'pending', 'in_review', 'approved', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'Todos' : statusConfig[status as keyof typeof statusConfig]?.label || status}
            </Button>
          ))}
        </div>
      </div>

      {/* Document List */}
      <div className="bg-card border rounded-lg overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={FileText}
              title={filter !== 'all' ? 'Nenhum documento encontrado' : 'Nenhum documento na fila'}
              description={filter !== 'all'
                ? `Não há documentos com status "${statusConfig[filter as keyof typeof statusConfig]?.label || filter}"`
                : 'Não há documentos para revisar no momento'
              }
            />
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item) => {
              const status = statusConfig[item.status]
              const priority = priorityConfig[item.priority]
              const StatusIcon = status.icon

              return (
                <div
                  key={item.id}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => fetchItemDetails(item.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium truncate">
                          {item.title || documentTypeLabels[item.documentType] || item.documentType}
                        </h3>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', status.color)}>
                          <StatusIcon className="h-3 w-3 inline mr-1" />
                          {status.label}
                        </span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', priority.color)}>
                          {priority.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {documentTypeLabels[item.documentType] || item.documentType}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Criado em {formatDate(item.createdAt)}
                        {item.reviewedAt && ` • Revisado em ${formatDate(item.reviewedAt)}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation()
                        handleExport(item.documentId)
                      }}>
                        <FileDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Document Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">{selectedItem.document.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {documentTypeLabels[selectedItem.item.documentType]}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('text-xs px-2 py-0.5 rounded-full', statusConfig[selectedItem.item.status].color)}>
                  {statusConfig[selectedItem.item.status].label}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                  ✕
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Variables Summary */}
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Dados do Documento</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Cliente:</span>{' '}
                    {selectedItem.document.variables.CLIENTE_NOME}
                  </div>
                  <div>
                    <span className="text-muted-foreground">CPF:</span>{' '}
                    {selectedItem.document.variables.CLIENTE_CPF}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Advogado:</span>{' '}
                    {selectedItem.document.variables.ADVOGADO_NOME}
                  </div>
                  <div>
                    <span className="text-muted-foreground">OAB:</span>{' '}
                    {selectedItem.document.variables.ADVOGADO_OAB}
                  </div>
                </div>
              </div>

              {/* Document Content */}
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm bg-background border rounded-lg p-4 max-h-96 overflow-y-auto">
                  {selectedItem.document.content}
                </pre>
              </div>

              {/* Review Notes */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Notas de Revisao
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full h-24 p-3 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Adicione notas sobre a revisao..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleExport(selectedItem.item.documentId, 'docx')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar DOCX
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport(selectedItem.item.documentId, 'text')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Baixar TXT
                </Button>
              </div>

              <div className="flex gap-2">
                {selectedItem.item.status === 'pending' && (
                  <Button
                    variant="outline"
                    onClick={() => handleAction('assign')}
                    disabled={actionLoading}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Assumir Revisao
                  </Button>
                )}

                {(selectedItem.item.status === 'pending' || selectedItem.item.status === 'in_review') && (
                  <>
                    <Button
                      variant="outline"
                      className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                      onClick={() => handleAction('request-revision', reviewNotes)}
                      disabled={actionLoading || !reviewNotes}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Solicitar Revisao
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleAction('reject', reviewNotes)}
                      disabled={actionLoading || !reviewNotes}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeitar
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAction('approve', reviewNotes)}
                      disabled={actionLoading}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
