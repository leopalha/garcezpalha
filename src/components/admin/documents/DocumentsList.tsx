'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Image,
  Download,
  Eye,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileImage,
} from 'lucide-react'

interface Document {
  id: string
  file_name: string
  file_type: string
  file_size: number
  public_url: string
  category: string
  description: string | null
  created_at: string
  ai_analyzed: boolean
  ai_analysis?: {
    type: string
    summary: string
    extractedData: Record<string, any>
    confidence: number
    warnings?: string[]
  }
}

interface DocumentsListProps {
  leadId: string
}

export function DocumentsList({ leadId }: DocumentsListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [leadId])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/documents?leadId=${leadId}`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      handleUpload(file)
    }
  }

  const handleUpload = async (file: File) => {
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'Processo')
      formData.append('processId', leadId)
      formData.append('description', `Documento enviado pelo cliente`)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro ao fazer upload')
      }

      const data = await response.json()

      // Add new document to list
      setDocuments((prev) => [data.document, ...prev])
      setSelectedFile(null)

      // Refresh after 2 seconds to get AI analysis
      setTimeout(fetchDocuments, 2000)
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Erro ao fazer upload do documento. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <FileImage className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload de Documentos</CardTitle>
          <CardDescription>
            Envie RG, CPF, comprovantes ou contratos para análise automática
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label htmlFor="file-upload" className="flex-1">
              <Button
                variant="outline"
                className="w-full"
                disabled={uploading}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Escolher Arquivo
                  </>
                )}
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Formatos aceitos: PDF, JPG, PNG, DOC, DOCX (máx. 10MB)
          </p>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Enviados ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum documento enviado ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                        {getFileIcon(doc.file_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.file_name}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{doc.category}</span>
                          <span>•</span>
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>•</span>
                          <span>
                            {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>

                        {/* AI Analysis Status */}
                        {doc.ai_analyzed && doc.ai_analysis ? (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <p className="text-sm font-medium text-green-900">
                                Análise IA Completa
                              </p>
                              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">
                                {(doc.ai_analysis.confidence * 100).toFixed(0)}% confiança
                              </span>
                            </div>

                            <p className="text-sm text-green-800 mb-2">
                              {doc.ai_analysis.summary}
                            </p>

                            {Object.keys(doc.ai_analysis.extractedData).length > 0 && (
                              <div className="bg-white p-2 rounded border border-green-100">
                                <p className="text-xs font-medium text-gray-700 mb-1">
                                  Dados Extraídos:
                                </p>
                                <div className="space-y-1">
                                  {Object.entries(doc.ai_analysis.extractedData)
                                    .slice(0, 3)
                                    .map(([key, value]) => (
                                      <div
                                        key={key}
                                        className="flex items-center gap-2 text-xs"
                                      >
                                        <span className="font-medium text-gray-600">
                                          {key}:
                                        </span>
                                        <span className="text-gray-900">
                                          {typeof value === 'object'
                                            ? JSON.stringify(value)
                                            : String(value)}
                                        </span>
                                      </div>
                                    ))}
                                  {Object.keys(doc.ai_analysis.extractedData).length > 3 && (
                                    <p className="text-xs text-gray-500">
                                      +{Object.keys(doc.ai_analysis.extractedData).length - 3}{' '}
                                      campos adicionais
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {doc.ai_analysis.warnings && doc.ai_analysis.warnings.length > 0 && (
                              <div className="mt-2 flex items-start gap-2 text-xs text-amber-700">
                                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>{doc.ai_analysis.warnings[0]}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Analisando com IA...</span>
                          </div>
                        )}

                        {doc.description && (
                          <p className="mt-2 text-sm text-muted-foreground">{doc.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.public_url, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const a = document.createElement('a')
                          a.href = doc.public_url
                          a.download = doc.file_name
                          a.click()
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
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
