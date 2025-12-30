'use client'

import { ReactNode } from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface AdminPageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  onRefresh?: () => void | Promise<void>
  refreshing?: boolean
  breadcrumbs?: Array<{ label: string; href: string }>
}

/**
 * Header padrão para páginas admin
 *
 * Inclui:
 * - Breadcrumbs automáticos
 * - Título e descrição
 * - Botão de refresh opcional
 * - Action button customizado opcional
 *
 * @example
 * <AdminPageHeader
 *   title="Gestão de Leads"
 *   description="Gerencie todos os leads da plataforma"
 *   onRefresh={handleRefresh}
 *   refreshing={isRefreshing}
 *   action={<Button>Novo Lead</Button>}
 * />
 */
export function AdminPageHeader({
  title,
  description,
  action,
  onRefresh,
  refreshing = false,
  breadcrumbs,
}: AdminPageHeaderProps) {
  return (
    <div className="space-y-4 pb-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Title + Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
              />
              Atualizar
            </Button>
          )}

          {/* Custom Action */}
          {action}
        </div>
      </div>
    </div>
  )
}
