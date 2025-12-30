'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

/**
 * Componente de Breadcrumbs para navegação hierárquica
 *
 * Uso automático (baseado na URL):
 * <Breadcrumbs />
 *
 * Uso manual (com items customizados):
 * <Breadcrumbs items={[
 *   { label: 'Leads', href: '/admin/leads' },
 *   { label: 'João Silva', href: '/admin/leads/123' }
 * ]} />
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Se items não for fornecido, gerar automaticamente da URL
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname)

  if (breadcrumbItems.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm text-muted-foreground ${className}`}
    >
      {/* Home Link */}
      <Link
        href="/admin"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>

      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1

        return (
          <Fragment key={item.href}>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />

            {isLast ? (
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}

/**
 * Gera breadcrumbs automaticamente baseado no pathname
 */
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  // Remover leading slash e split
  const segments = pathname.replace(/^\//, '').split('/').filter(Boolean)

  // Se estiver na home do admin, não mostrar breadcrumbs
  if (segments.length === 1 && segments[0] === 'admin') {
    return []
  }

  const breadcrumbs: BreadcrumbItem[] = []
  let currentPath = ''

  segments.forEach((segment, index) => {
    // Pular o primeiro 'admin' pois já temos o Home
    if (index === 0 && segment === 'admin') {
      currentPath = '/admin'
      return
    }

    currentPath += `/${segment}`

    // Formatar label (converter kebab-case para Title Case)
    const label = formatSegmentLabel(segment)

    breadcrumbs.push({
      label,
      href: currentPath,
    })
  })

  return breadcrumbs
}

/**
 * Converte segment da URL para label legível
 */
function formatSegmentLabel(segment: string): string {
  // Se for UUID/ID numérico, retornar como está
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
    return `#${segment.substring(0, 8)}`
  }

  if (/^\d+$/.test(segment)) {
    return `#${segment}`
  }

  // Mapeamento de rotas conhecidas
  const routeLabels: Record<string, string> = {
    admin: 'Admin',
    leads: 'Leads',
    clientes: 'Clientes',
    conversations: 'Conversas',
    analytics: 'Analytics',
    conversao: 'Conversão',
    agendamentos: 'Agendamentos',
    documentos: 'Documentos',
    processos: 'Processos',
    prazos: 'Prazos',
    faturas: 'Faturas',
    produtos: 'Produtos',
    usuarios: 'Usuários',
    configuracoes: 'Configurações',
    qualificados: 'Qualificados',
  }

  // Se existir mapeamento, usar
  if (routeLabels[segment]) {
    return routeLabels[segment]
  }

  // Caso contrário, converter kebab-case para Title Case
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Componente de Breadcrumbs com loading skeleton
 */
export function BreadcrumbsSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="h-4 w-4 bg-muted rounded animate-pulse" />
      <div className="h-4 w-2 bg-muted rounded animate-pulse" />
      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
      <div className="h-4 w-2 bg-muted rounded animate-pulse" />
      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
    </div>
  )
}
