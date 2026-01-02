'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  MessageSquare,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Document = {
  id: string
  name: string
  type: string
  description: string | null
  file_url: string
  file_size: number
  mime_type: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  uploaded_at: string
  review_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  uploaded_by: string
  case_id: string | null
  // Relations
  uploader?: { full_name: string; email: string }
  case?: { case_number: string; service_type: string }
}

const DOCUMENT_TYPES = {
  identity: 'Documento Pessoal (RG/CPF)',
  proof_residence: 'Comprovante de Residência',
  financial: 'Comprovante Financeiro',
  legal: 'Documento Jurídico',
  contract: 'Contrato',
  other: 'Outro',
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    variant: 'secondary' as const,
    color: 'text-yellow-600',
  },
  under_review: {
    label: 'Em Revisão',
    icon: AlertCircle,
    variant: 'default' as const,
    color: 'text-blue-600',
  },
  approved: {
    label: 'Aprovado',
    icon: CheckCircle,
    variant: 'default' as const,
    color: 'text-green-600',
  },
  rejected: {
    label: 'Rejeitado',
    icon: XCircle,
    variant: 'destructive' as const,
    color: 'text-red-600',
  },
}

export default function DocumentosClientesPage() {
  const { data: session } = useSession()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve')
  const [reviewNotes, setReviewNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [filterStatus])

  const fetchDocuments = async () => {
    setLoading(true)
    setError(null)
    try {
      const url = new URL('/api/admin/documents/review', window.location.origin)
      if (filterStatus !== 'all') {
        url.searchParams.set('status', filterStatus)
      }

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error('Erro ao carregar documentos')
      }
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar documentos')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenReview = (document: Document, action: 'approve' | 'reject') => {
    setSelectedDocument(document)
    setReviewAction(action)
    setReviewNotes('')
    setReviewDialogOpen(true)
  }

  const handleSubmitReview = async () => {
    if (!selectedDocument) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/documents/${selectedDocument.id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: reviewAction === 'approve' ? 'approved' : 'rejected',
          notes: reviewNotes || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao revisar documento')
      }

      setReviewDialogOpen(false)
      await fetchDocuments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao revisar documento')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownload = async (document: Document) => {
    try {
      const response = await fetch(`/api/admin/documents/${document.id}/download`)
      if (!response.ok) throw new Error('Erro ao baixar documento')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      a.href = url
      a.download = document.name
      window.document.body.appendChild(a)
      a.click()
      window.document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao baixar documento')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const pendingCount = documents.filter((d) => d.status === 'pending').length
  const underReviewCount = documents.filter((d) => d.status === 'under_review').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentos de Clientes</h1>
        <p className="text-muted-foreground mt-1">
          Revise e aprove documentos enviados pelos clientes
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Em Revisão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{underReviewCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {documents.filter((d) => d.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {documents.filter((d) => d.status === 'rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Label htmlFor="status-filter">Filtrar por status:</Label>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="under_review">Em Revisão</SelectItem>
            <SelectItem value="approved">Aprovados</SelectItem>
            <SelectItem value="rejected">Rejeitados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert error={error} retry={fetchDocuments} />}

      {/* Documents Table */}
      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum documento encontrado"
          description={
            filterStatus === 'all'
              ? 'Não há documentos enviados pelos clientes'
              : `Não há documentos com status "${STATUS_CONFIG[filterStatus as keyof typeof STATUS_CONFIG]?.label}"`
          }
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => {
                const statusConfig = STATUS_CONFIG[doc.status]
                const StatusIcon = statusConfig.icon

                return (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {(doc.uploader as any)?.full_name || 'Cliente'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {(doc.uploader as any)?.email || ''}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium line-clamp-1">{doc.name}</div>
                        {doc.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {doc.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {DOCUMENT_TYPES[doc.type as keyof typeof DOCUMENT_TYPES] || doc.type}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig.variant}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(doc.uploaded_at)}</TableCell>
                    <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {doc.status === 'pending' || doc.status === 'under_review' ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenReview(doc, 'approve')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenReview(doc, 'reject')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Aprovar Documento' : 'Rejeitar Documento'}
            </DialogTitle>
            <DialogDescription>
              {selectedDocument?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="review-notes">
                {reviewAction === 'approve' ? 'Observações (opcional)' : 'Motivo da rejeição'}
              </Label>
              <Textarea
                id="review-notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder={
                  reviewAction === 'approve'
                    ? 'Adicione observações se necessário'
                    : 'Explique o motivo da rejeição para o cliente'
                }
                rows={4}
                disabled={submitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={submitting || (reviewAction === 'reject' && !reviewNotes)}
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {reviewAction === 'approve' ? 'Aprovando...' : 'Rejeitando...'}
                </>
              ) : (
                <>
                  {reviewAction === 'approve' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeitar
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
