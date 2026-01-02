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
  Upload,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  case_id: string
}

const DOCUMENT_TYPES = [
  { value: 'identity', label: 'Documento Pessoal (RG/CPF)' },
  { value: 'proof_residence', label: 'Comprovante de Residência' },
  { value: 'financial', label: 'Comprovante Financeiro' },
  { value: 'legal', label: 'Documento Jurídico' },
  { value: 'contract', label: 'Contrato' },
  { value: 'other', label: 'Outro' },
]

const STATUS_CONFIG = {
  pending: {
    label: 'Pendente Revisão',
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

export default function DocumentosPage() {
  const { data: session } = useSession()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('')
  const [documentDescription, setDocumentDescription] = useState('')

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/client/documents')
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validações
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

    if (file.size > maxSize) {
      setError('Arquivo muito grande. Tamanho máximo: 10MB')
      return
    }

    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não permitido. Use PDF, JPG ou PNG')
      return
    }

    setSelectedFile(file)
    setError(null)
  }

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      setError('Selecione um arquivo e o tipo de documento')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('type', documentType)
      formData.append('description', documentDescription)

      const response = await fetch('/api/client/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao fazer upload')
      }

      // Reset form
      setSelectedFile(null)
      setDocumentType('')
      setDocumentDescription('')
      setUploadDialogOpen(false)

      // Refresh list
      await fetchDocuments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (document: Document) => {
    try {
      const response = await fetch(`/api/client/documents/${document.id}/download`)
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

  const handleDelete = async (documentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return

    try {
      const response = await fetch(`/api/client/documents/${documentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Erro ao excluir documento')

      await fetchDocuments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir documento')
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

  // Loading state
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Documentos</h1>
          <p className="text-muted-foreground mt-1">
            Envie e gerencie seus documentos com segurança
          </p>
        </div>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Enviar Documento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar Novo Documento</DialogTitle>
              <DialogDescription>
                Envie documentos em PDF, JPG ou PNG (máx 10MB)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file">Arquivo</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Documento</Label>
                <Select value={documentType} onValueChange={setDocumentType} disabled={uploading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                  id="description"
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  placeholder="Ex: RG frente e verso"
                  disabled={uploading}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !documentType || uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar Documento
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && !uploadDialogOpen && (
        <ErrorAlert error={error} retry={fetchDocuments} title="Erro ao carregar documentos" />
      )}

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum documento enviado"
          description="Envie seus primeiros documentos para que possamos analisar seu caso"
          action={
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Enviar Primeiro Documento
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => {
            const statusConfig = STATUS_CONFIG[doc.status]
            const StatusIcon = statusConfig.icon

            return (
              <Card key={doc.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <Badge variant={statusConfig.variant}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-1">{doc.name}</CardTitle>
                  <CardDescription>
                    {DOCUMENT_TYPES.find((t) => t.value === doc.type)?.label || doc.type}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Tamanho: {formatFileSize(doc.file_size)}</p>
                    <p>Enviado em: {formatDate(doc.uploaded_at)}</p>
                  </div>

                  {doc.review_notes && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-1">Observações:</p>
                      <p className="text-sm text-muted-foreground">{doc.review_notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                      className="flex-1"
                      disabled={doc.status === 'approved'}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
