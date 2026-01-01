'use client'

import { useState, useEffect } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Mail, MessageSquare, FileText, Plus, Search, Edit, Eye } from 'lucide-react'
import Link from 'next/link'

interface Template {
  id: string
  name: string
  type: 'email' | 'whatsapp' | 'contract'
  category: string
  description: string
  lastModified: string
  status: 'active' | 'draft' | 'archived'
  usageCount: number
}

const EXISTING_EMAIL_TEMPLATES: Template[] = [
  {
    id: 'welcome-email',
    name: 'Email de Boas-vindas',
    type: 'email',
    category: 'Onboarding',
    description: 'Primeiro email enviado após cadastro de novo lead',
    lastModified: '2024-12-30',
    status: 'active',
    usageCount: 1247,
  },
  {
    id: 'appointment-confirmation',
    name: 'Confirmação de Agendamento',
    type: 'email',
    category: 'Agendamento',
    description: 'Email de confirmação com link do Google Meet',
    lastModified: '2024-12-30',
    status: 'active',
    usageCount: 583,
  },
  {
    id: 'contract-signed',
    name: 'Contrato Assinado',
    type: 'email',
    category: 'Contratos',
    description: 'Notificação de contrato assinado com próximos passos',
    lastModified: '2024-12-30',
    status: 'active',
    usageCount: 342,
  },
  {
    id: 'lead-notification',
    name: 'Notificação de Novo Lead',
    type: 'email',
    category: 'Admin',
    description: 'Alerta para admin quando novo lead qualificado entra',
    lastModified: '2024-12-30',
    status: 'active',
    usageCount: 892,
  },
  {
    id: 'payment-receipt',
    name: 'Recibo de Pagamento',
    type: 'email',
    category: 'Financeiro',
    description: 'Confirmação de pagamento recebido',
    lastModified: '2024-12-30',
    status: 'active',
    usageCount: 456,
  },
  {
    id: 'payment-reminder',
    name: 'Lembrete de Pagamento',
    type: 'email',
    category: 'Financeiro',
    description: 'Lembrete com 4 níveis de urgência e QR Code PIX',
    lastModified: '2024-12-30',
    status: 'active',
    usageCount: 231,
  },
  {
    id: 'nps-feedback',
    name: 'Pesquisa NPS',
    type: 'email',
    category: 'Feedback',
    description: 'Solicitação de feedback com escala 0-10',
    lastModified: '2024-12-30',
    status: 'active',
    usageCount: 178,
  },
  {
    id: 'partner-welcome',
    name: 'Boas-vindas Parceiro',
    type: 'email',
    category: 'Parcerias',
    description: 'Email de onboarding para novos parceiros',
    lastModified: '2024-12-30',
    status: 'active',
    usageCount: 45,
  },
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(EXISTING_EMAIL_TEMPLATES)
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(templates)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'email' | 'whatsapp' | 'contract'>('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let filtered = templates

    // Filtro por tipo
    if (selectedType !== 'all') {
      filtered = filtered.filter((t) => t.type === selectedType)
    }

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredTemplates(filtered)
  }, [searchQuery, selectedType, templates])

  const handleRefresh = async () => {
    setLoading(true)
    // TODO: Fetch templates from API
    setTimeout(() => setLoading(false), 1000)
  }

  const getTypeIcon = (type: Template['type']) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />
      case 'contract':
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: Template['type']) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'whatsapp':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'contract':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
  }

  const getStatusColor = (status: Template['status']) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'draft':
        return 'secondary'
      case 'archived':
        return 'outline'
    }
  }

  const stats = {
    total: templates.length,
    email: templates.filter((t) => t.type === 'email').length,
    whatsapp: templates.filter((t) => t.type === 'whatsapp').length,
    contract: templates.filter((t) => t.type === 'contract').length,
    active: templates.filter((t) => t.status === 'active').length,
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gerenciamento de Templates"
        description="Gerencie templates de email, WhatsApp e contratos"
        onRefresh={handleRefresh}
        refreshing={loading}
        action={
          <Button asChild>
            <Link href="/admin/templates/new">
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Link>
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">templates cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.email}</div>
            <p className="text-xs text-muted-foreground">templates de email</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.whatsapp}</div>
            <p className="text-xs text-muted-foreground">templates WhatsApp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contract}</div>
            <p className="text-xs text-muted-foreground">templates legais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">em uso no sistema</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Templates</CardTitle>
              <CardDescription>
                {filteredTemplates.length} template(s) encontrado(s)
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full sm:w-[250px]"
                />
              </div>

              {/* Type Filter */}
              <div className="flex gap-1 bg-muted p-1 rounded-lg">
                {(['all', 'email', 'whatsapp', 'contract'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {type === 'all' ? 'Todos' : type === 'email' ? 'Email' : type === 'whatsapp' ? 'WhatsApp' : 'Contratos'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${getTypeColor(template.type)}`}>
                    {getTypeIcon(template.type)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{template.name}</h3>
                      <Badge variant={getStatusColor(template.status)}>
                        {template.status === 'active' ? 'Ativo' : template.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Categoria: {template.category}</span>
                      <span>•</span>
                      <span>Usado {template.usageCount}x</span>
                      <span>•</span>
                      <span>Modificado em {new Date(template.lastModified).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/templates/${template.id}/preview`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Link>
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <Link href={`/admin/templates/${template.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum template encontrado com os filtros aplicados.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
