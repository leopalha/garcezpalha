import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Scale,
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Download,
  Clock,
  Building,
  MapPin,
  DollarSign,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

interface ProcessDetailsPageProps {
  params: {
    id: string
  }
}

interface ClientDocumentDB {
  id: string
  file_name?: string | null
  file_type?: string | null
  file_size?: number | null
  created_at: string
  public_url?: string | null
}

interface ProcessDeadlineDB {
  id: string
  deadline_type?: string | null
  due_date: string
  status?: string | null
  description?: string | null
}

export default async function ProcessDetailsPage({ params }: ProcessDetailsPageProps) {
  const session = await getServerSession(authOptions)
  const supabase = await createClient()

  // Fetch process data from database
  const { data: processData, error } = await supabase
    .from('process_alerts')
    .select('*')
    .eq('id', params.id)
    .single()

  // If not found, try to get from leads linked to user
  let process: any = null

  if (processData) {
    process = {
      id: processData.id,
      number: processData.process_number || 'Sem número',
      title: processData.description || 'Processo Jurídico',
      type: processData.area || 'Geral',
      status: processData.status === 'active' ? 'Em andamento' : processData.status === 'completed' ? 'Concluído' : 'Pendente',
      lawyer: {
        name: 'Dr. Francisco Garcez Palha',
        oab: 'OAB/RJ 123456',
        phone: '(21) 99535-4010',
        email: 'contato@garcezpalha.com',
      },
      court: processData.tribunal || 'Tribunal não informado',
      judge: 'Não informado',
      createdAt: processData.created_at ? new Date(processData.created_at).toLocaleDateString('pt-BR') : 'N/A',
      lastUpdate: processData.updated_at ? new Date(processData.updated_at).toLocaleDateString('pt-BR') : 'N/A',
      value: 'A definir',
      property: null,
      description: processData.description || 'Sem descrição disponível.',
    }
  } else {
    // Show mock data for demo purposes if no real data
    process = {
      id: params.id,
      number: '0001234-56.2024.8.19.0000',
      title: 'Processo Exemplo',
      type: 'Demonstração',
      status: 'Demo',
      lawyer: {
        name: 'Dr. Francisco Garcez Palha',
        oab: 'OAB/RJ 123456',
        phone: '(21) 99535-4010',
        email: 'contato@garcezpalha.com',
      },
      court: 'Este é um processo de demonstração',
      judge: 'N/A',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      lastUpdate: new Date().toLocaleDateString('pt-BR'),
      value: 'N/A',
      property: null,
      description: 'Este é um processo de demonstração. Para ver dados reais, certifique-se de que há processos cadastrados no sistema.',
      isDemo: true,
    }
  }

  // Fetch deadlines for this process
  const { data: deadlinesData } = await supabase
    .from('process_deadlines')
    .select('*')
    .eq('alert_id', params.id)
    .order('due_date', { ascending: true })

  // Build timeline from process events or use placeholder
  const timeline = processData ? [
    {
      id: 1,
      date: process.lastUpdate,
      title: 'Última Atualização',
      description: 'Atualização do status do processo',
      type: 'decisao',
    },
    {
      id: 2,
      date: process.createdAt,
      title: 'Processo Cadastrado',
      description: 'Processo registrado no sistema',
      type: 'distribuicao',
    },
  ] : [
    {
      id: 1,
      date: new Date().toLocaleDateString('pt-BR'),
      title: 'Demonstração',
      description: 'Este é um processo de demonstração',
      type: 'distribuicao',
    },
  ]

  // Fetch documents linked to this process
  const { data: documentsData } = await supabase
    .from('client_documents')
    .select('*')
    .eq('process_id', params.id)
    .order('created_at', { ascending: false })

  const documents = (documentsData || []).map((doc: ClientDocumentDB) => ({
    id: doc.id,
    name: doc.file_name,
    type: doc.file_type?.split('/')[1]?.toUpperCase() || 'FILE',
    size: doc.file_size ? `${(doc.file_size / 1024).toFixed(0)} KB` : 'N/A',
    date: new Date(doc.created_at).toLocaleDateString('pt-BR'),
    url: doc.public_url,
  }))

  // Build deadlines from database or use placeholder
  const deadlines = (deadlinesData || []).map((d: ProcessDeadlineDB) => ({
    id: d.id,
    title: d.deadline_type || 'Prazo',
    date: new Date(d.due_date).toLocaleDateString('pt-BR'),
    time: new Date(d.due_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    status: d.status || 'pending',
    description: d.description,
  }))

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'decisao':
        return 'bg-blue-500'
      case 'peticao':
        return 'bg-green-500'
      case 'audiencia':
        return 'bg-purple-500'
      case 'distribuicao':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/processos">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Processos
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
              <Scale className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {process.title}
              </h2>
              <p className="text-gray-600 mt-1">
                {process.number}
              </p>
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="text-base px-4 py-2">
          {process.status}
        </Badge>
      </div>

      {/* Main Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Advogado Responsável</p>
                <p className="text-sm font-medium text-gray-900">
                  {process.lawyer.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Tipo de Ação</p>
                <p className="text-sm font-medium text-gray-900">
                  {process.type}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Data de Distribuição</p>
                <p className="text-sm font-medium text-gray-900">
                  {process.createdAt}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Valor da Causa</p>
                <p className="text-sm font-medium text-gray-900">
                  {process.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="deadlines">Prazos</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Processo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
                <p className="text-gray-700">{process.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Órgão Julgador</h4>
                  <p className="text-sm text-gray-700">{process.court}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Juiz: {process.judge}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Advogado</h4>
                  <p className="text-sm text-gray-700">{process.lawyer.name}</p>
                  <p className="text-sm text-gray-600">{process.lawyer.oab}</p>
                  <p className="text-sm text-gray-600">{process.lawyer.phone}</p>
                  <p className="text-sm text-gray-600">{process.lawyer.email}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Imóvel</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700">
                        {process.property.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        {process.property.neighborhood} - {process.property.city}/{process.property.state}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Área: {process.property.area}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Andamento Processual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timeline.map((event, index) => (
                  <div key={event.id} className="relative">
                    {index !== timeline.length - 1 && (
                      <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
                    )}
                    <div className="flex gap-4">
                      <div className={`w-8 h-8 rounded-full ${getTypeColor(event.type)} flex items-center justify-center flex-shrink-0`}>
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {event.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {event.description}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {event.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documentos do Processo</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum documento anexado a este processo.</p>
                  <Link href="/dashboard/documentos">
                    <Button variant="outline" className="mt-4">
                      Ir para Documentos
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {doc.type} • {doc.size} • {doc.date}
                          </p>
                        </div>
                      </div>
                      {doc.url && (
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deadlines Tab */}
        <TabsContent value="deadlines">
          <Card>
            <CardHeader>
              <CardTitle>Prazos e Audiências</CardTitle>
            </CardHeader>
            <CardContent>
              {deadlines.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum prazo registrado para este processo.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className="p-4 border border-orange-200 bg-orange-50 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {deadline.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {deadline.date} às {deadline.time}
                          </p>
                          {deadline.description && (
                            <p className="text-sm text-gray-500 mt-2">
                              {deadline.description}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">
                          {deadline.status === 'completed' ? 'Concluído' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
