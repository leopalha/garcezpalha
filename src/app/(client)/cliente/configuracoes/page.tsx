'use client'

import { EmptyState } from '@/components/ui/empty-state'
import { Settings } from 'lucide-react'

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas preferências e dados pessoais
        </p>
      </div>

      <EmptyState
        icon={Settings}
        title="Configurações em Desenvolvimento"
        description="Em breve você poderá atualizar seus dados pessoais, alterar senha e gerenciar suas preferências."
      />
    </div>
  )
}
