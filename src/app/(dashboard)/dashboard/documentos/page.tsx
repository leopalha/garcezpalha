'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  FolderOpen,
  Upload,
  Search,
  FileText,
  Download,
  Trash2,
  Eye,
  Filter,
  Grid,
  List,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

interface Document {
  id: string
  file_name: string
  file_type: string
  file_size: number
  storage_path: string
  public_url: string
  category: string
  process_id: string | null
  description: string | null
  created_at: string
}

export default function DocumentosPage() {
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadForm, setUploadForm] = useState({
    category: 'Pessoal',
    processId: '',
    description: '',
  })

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      toast({
        title: 'Erro',
        description: 'Selecione um arquivo para enviar.',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', uploadForm.category)
      if (uploadForm.processId) formData.append('processId', uploadForm.processId)
      if (uploadForm.description) formData.append('description', uploadForm.description)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar arquivo')
      }

      toast({
        title: 'Sucesso!',
        description: 'Documento enviado com sucesso.',
      })

      // Refresh documents list
      await fetchDocuments()
      setUploadDialogOpen(false)

      // Reset form
      if (fileInputRef.current) fileInputRef.current.value = ''
      setUploadForm({ category: 'Pessoal', processId: '', description: '' })
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao enviar documento.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return

    try {
      const response = await fetch(`/api/documents?id=${documentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir documento')
      }

      toast({
        title: 'Sucesso!',
        description: 'Documento excluído com sucesso.',
      })

      await fetchDocuments()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir documento.',
        variant: 'destructive',
      })
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getFileTypeLabel = (mimeType: string): string => {
    const types: Record<string, string> = {
      'application/pdf': 'PDF',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'image/jpeg': 'JPG',
      'image/png': 'PNG',
    }
    return types[mimeType] || 'Arquivo'
  }

  // Calculate categories from actual documents
  const categories = [
    { name: 'Pessoal', count: documents.filter(d => d.category === 'Pessoal').length, color: 'bg-blue-500' },
    { name: 'Processo', count: documents.filter(d => d.category === 'Processo').length, color: 'bg-green-500' },
    { name: 'Empresarial', count: documents.filter(d => d.category === 'Empresarial').length, color: 'bg-purple-500' },
  ]

  const filteredDocuments = documents.filter(doc =>
    doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getCategoryColor = (category: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (category) {
      case 'Pessoal':
        return 'default'
      case 'Processo':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Meus Documentos
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie todos os seus documentos em um só lugar
          </p>
        </div>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Enviar Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Enviar Novo Documento</DialogTitle>
              <DialogDescription>
                Faça upload de documentos relacionados aos seus processos ou documentos pessoais.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Arquivo</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  ref={fileInputRef}
                />
                <p className="text-xs text-gray-500">
                  Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={uploadForm.category}
                  onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pessoal">Pessoal</SelectItem>
                    <SelectItem value="Processo">Processo</SelectItem>
                    <SelectItem value="Empresarial">Empresarial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                  id="description"
                  placeholder="Breve descrição do documento"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)} disabled={isUploading}>
                Cancelar
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isUploading ? 'Enviando...' : 'Enviar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.name}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">
                      {category.count} {category.count === 1 ? 'documento' : 'documentos'}
                    </p>
                  </div>
                </div>
                <FolderOpen className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar documentos..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <div className="flex border border-gray-200 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none border-l"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Documentos ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'Nenhum documento encontrado' : 'Nenhum documento enviado'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? 'Tente buscar com outros termos.'
                  : 'Comece enviando seu primeiro documento.'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Documento
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">
                          {doc.file_name}
                        </p>
                        <Badge variant={getCategoryColor(doc.category)} className="flex-shrink-0">
                          {doc.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-500">
                          {getFileTypeLabel(doc.file_type)} • {formatFileSize(doc.file_size)}
                        </p>
                        {doc.description && (
                          <p className="text-sm text-gray-500 truncate">
                            {doc.description}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Enviado em {formatDate(doc.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.public_url && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(doc.public_url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = doc.public_url
                            link.download = doc.file_name
                            link.click()
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
