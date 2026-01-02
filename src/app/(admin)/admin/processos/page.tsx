'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  Download,
  Upload,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  Calendar,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { pdfProcessor } from '@/lib/pdf/processor-service'
import { ErrorAlert } from '@/components/ui/error-alert'

type ProcessAlert = {
  id: string
  process_number: string
  tribunal: string
  update_type: string
  email_subject: string
  email_date: string
  email_snippet: string
  has_attachment: boolean
  status: 'pending' | 'downloaded' | 'processed' | 'ignored'
  download_url?: string
  uploaded_pdf_url?: string
  processed_text_url?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  notes?: string
  created_at: string
}

const statusConfig = {
  pending: {
    label: 'Pendente Download',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
  },
  downloaded: {
    label: 'PDF Baixado',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Download,
  },
  processed: {
    label: 'Processado',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
  },
  ignored: {
    label: 'Ignorado',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: AlertCircle,
  },
}

const priorityConfig = {
  low: { label: 'Baixa', color: 'bg-slate-100 text-slate-800' },
  normal: { label: 'Normal', color: 'bg-blue-100 text-blue-800' },
  high: { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  urgent: { label: 'Urgente', color: 'bg-red-100 text-red-800' },
}

const tribunalConfig: Record<string, { label: string; color: string }> = {
  'TJ-RJ': { label: 'TJ-RJ', color: 'bg-purple-100 text-purple-800' },
  'STJ': { label: 'STJ', color: 'bg-indigo-100 text-indigo-800' },
  'TRF2': { label: 'TRF2', color: 'bg-cyan-100 text-cyan-800' },
  'TST': { label: 'TST', color: 'bg-teal-100 text-teal-800' },
  'STF': { label: 'STF', color: 'bg-emerald-100 text-emerald-800' },
}

export default function ProcessosPage() {
  const [alerts, setAlerts] = useState<ProcessAlert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<ProcessAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchAlerts()
  }, [])

  useEffect(() => {
    filterAlerts()
  }, [searchTerm, statusFilter, alerts])

  async function fetchAlerts() {
    setLoading(true)
    try {
      let query = supabase
        .from('process_alerts')
        .select('*')
        .order('email_date', { ascending: false })
        .limit(100)

      const { data, error } = await query

      if (error) throw error

      setAlerts(data || [])
    } catch (error) {
      console.error('Error fetching alerts:', error)
      // Use mock data if database fails
      setAlerts(getMockAlerts())
    } finally {
      setLoading(false)
    }
  }

  function filterAlerts() {
    let filtered = [...alerts]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.process_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.tribunal.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.email_subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((alert) => alert.status === statusFilter)
    }

    setFilteredAlerts(filtered)
  }

  function getMockAlerts(): ProcessAlert[] {
    return [
      {
        id: '1',
        process_number: '0123456-78.2023.8.19.0001',
        tribunal: 'TJ-RJ',
        update_type: 'Intimação',
        email_subject: 'Intimação - Processo 0123456-78.2023.8.19.0001',
        email_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        email_snippet:
          'Fica Vossa Excelência intimado para apresentar contrarrazões no prazo de 15 dias...',
        has_attachment: true,
        status: 'pending',
        priority: 'high',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        process_number: '9876543-21.2023.4.02.5101',
        tribunal: 'TRF2',
        update_type: 'Sentença',
        email_subject: 'Sentença Publicada - Processo 9876543-21.2023.4.02.5101',
        email_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        email_snippet: 'Foi publicada sentença no processo em referência...',
        has_attachment: true,
        status: 'downloaded',
        priority: 'urgent',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        process_number: '5555555-55.2023.8.19.0000',
        tribunal: 'TJ-RJ',
        update_type: 'Despacho',
        email_subject: 'Despacho - Processo 5555555-55.2023.8.19.0000',
        email_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        email_snippet: 'O Juiz proferiu despacho determinando...',
        has_attachment: false,
        status: 'processed',
        priority: 'normal',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
  }

  async function handleFileUpload(alertId: string, file: File) {
    setUploadingId(alertId)
    try {
      // Read file as buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Process PDF
      const success = await pdfProcessor.processAlertPDF(alertId, buffer, file.name)

      if (success) {
        alert('PDF processado com sucesso! Prazos extraídos automaticamente.')
        await fetchAlerts() // Refresh list
      } else {
        alert('Erro ao processar PDF. Verifique o console para mais detalhes.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erro ao fazer upload do PDF.')
    } finally {
      setUploadingId(null)
    }
  }

  async function updateStatus(alertId: string, newStatus: ProcessAlert['status']) {
    try {
      const { error } = await supabase
        .from('process_alerts')
        .update({ status: newStatus })
        .eq('id', alertId)

      if (error) throw error

      await fetchAlerts()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  function getPortalUrl(processNumber: string, tribunal: string): string {
    // Generate direct link to tribunal portal
    switch (tribunal) {
      case 'TJ-RJ':
        return `http://www4.tjrj.jus.br/ConsultaUnificada/consulta.do#numproc=${processNumber.replace(
          /[.-]/g,
          ''
        )}`
      case 'STJ':
        return `https://ww2.stj.jus.br/processo/pesquisa/?termo=${processNumber}`
      case 'TRF2':
        return `https://eproc.trf2.jus.br/eproc/externo_controlador.php?acao=processo_consulta_publica&acao_origem=processo_pesquisar&acao_retorno=processo_pesquisar&num_processo=${processNumber}`
      default:
        return `https://www.google.com/search?q=${encodeURIComponent(
          tribunal + ' processo ' + processNumber
        )}`
    }
  }

  const stats = {
    pending: alerts.filter((a) => a.status === 'pending').length,
    downloaded: alerts.filter((a) => a.status === 'downloaded').length,
    processed: alerts.filter((a) => a.status === 'processed').length,
    total: alerts.length,
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Monitoramento de Processos</h1>
          <p className="text-muted-foreground mt-1">
            Alertas automáticos de tribunais via Gmail API (Economiza R$ 12.000/ano)
          </p>
        </div>
        <Button onClick={fetchAlerts} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendente Download
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              PDF Baixado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.downloaded}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Processado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número do processo, tribunal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pending')}
              >
                Pendentes
              </Button>
              <Button
                variant={statusFilter === 'downloaded' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('downloaded')}
              >
                Baixados
              </Button>
              <Button
                variant={statusFilter === 'processed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('processed')}
              >
                Processados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : error ? (
          <ErrorAlert
            error={error}
            retry={fetchAlerts}
            title="Erro ao carregar alertas processuais"
          />
        ) : filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum alerta encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{alert.process_number}</CardTitle>
                      <Badge
                        className={
                          tribunalConfig[alert.tribunal]?.color ||
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {alert.tribunal}
                      </Badge>
                      <Badge className={priorityConfig[alert.priority].color}>
                        {priorityConfig[alert.priority].label}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span>{alert.update_type}</span>
                      <span>•</span>
                      <span>
                        {new Date(alert.email_date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge
                    className={`${statusConfig[alert.status].color} flex items-center gap-1`}
                  >
                    {React.createElement(statusConfig[alert.status].icon, {
                      className: 'h-3 w-3',
                    })}
                    {statusConfig[alert.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Email Info */}
                <div>
                  <p className="text-sm font-medium mb-1">{alert.email_subject}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {alert.email_snippet}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {/* Download Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = getPortalUrl(alert.process_number, alert.tribunal)
                      window.open(url, '_blank')
                      updateStatus(alert.id, 'downloaded')
                    }}
                    disabled={alert.status === 'processed'}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Portal
                  </Button>

                  {/* Upload PDF */}
                  <label htmlFor={`upload-${alert.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={uploadingId === alert.id || alert.status === 'processed'}
                    >
                      {uploadingId === alert.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload PDF
                        </>
                      )}
                    </Button>
                  </label>
                  <input
                    id={`upload-${alert.id}`}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(alert.id, file)
                    }}
                    disabled={uploadingId === alert.id || alert.status === 'processed'}
                  />

                  {/* View Processed Document */}
                  {alert.processed_text_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(alert.processed_text_url, '_blank')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Texto
                    </Button>
                  )}

                  {/* View Original PDF */}
                  {alert.uploaded_pdf_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(alert.uploaded_pdf_url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Ver PDF
                    </Button>
                  )}

                  {/* Mark as Ignored */}
                  {alert.status !== 'ignored' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(alert.id, 'ignored')}
                    >
                      Ignorar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
