'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  ClipboardCheck,
  Scale,
  Package,
  Shield,
  Mail,
  Zap,
  Plug,
  UserPlus,
  DollarSign,
  Receipt,
  TrendingDown,
  FolderOpen,
  CheckSquare,
  FileBarChart,
  Bot,
  FileCode,
  Lock,
  Activity,
  List
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useRequireRole } from '@/lib/auth/hooks'
import { signOut } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { Logo } from '@/components/shared/logo'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/ui/error-boundary'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Conversas', href: '/admin/conversations', icon: MessageSquare },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Clientes', href: '/admin/clientes', icon: UserCheck },
  { name: 'Processos', href: '/admin/processos', icon: Scale },
  { name: 'Prazos', href: '/admin/prazos', icon: ClipboardCheck },
  { name: 'Documentos', href: '/admin/documentos', icon: FileText },
  { name: 'Agendamentos', href: '/admin/agendamentos', icon: Calendar },
  { name: 'Produtos', href: '/admin/produtos', icon: Package },
  { name: 'Marketing', href: '/admin/marketing/campanhas', icon: Mail },
  { name: 'Automações', href: '/admin/automations', icon: Zap },
  { name: 'Integrações', href: '/admin/integrations', icon: Plug },
  { name: 'Equipe', href: '/admin/equipe', icon: UserPlus },
  { name: 'Financeiro', href: '/admin/financeiro', icon: DollarSign },
  { name: 'Faturas', href: '/admin/faturas', icon: Receipt },
  { name: 'Despesas', href: '/admin/despesas', icon: TrendingDown },
  { name: 'Docs Clientes', href: '/admin/documentos-clientes', icon: FolderOpen },
  { name: 'Tarefas', href: '/admin/tarefas', icon: CheckSquare },
  { name: 'Relatórios', href: '/admin/relatorios', icon: FileBarChart },
  { name: 'Mensagens', href: '/admin/mensagens', icon: MessageSquare },
  { name: 'Agentes IA', href: '/admin/agents', icon: Bot },
  { name: 'Templates', href: '/admin/templates', icon: FileCode },
  { name: 'Segurança', href: '/admin/security', icon: Lock },
  { name: 'Monitoring', href: '/admin/monitoring', icon: Activity },
  { name: 'Logs', href: '/admin/logs', icon: List },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Usuários', href: '/admin/usuarios', icon: Shield },
  { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isLoading, hasAccess, user } = useRequireRole(['admin', 'lawyer'])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  // Redirect happens in hook, but show message
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Acesso não autorizado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r">
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/admin">
                <Logo variant="horizontal" />
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:block">
        <div className="flex h-full flex-col bg-card border-r">
          <div className="flex items-center gap-2 p-6 border-b">
            <Link href="/admin">
              <Logo variant="horizontal" />
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t space-y-2">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Painel Administrativo</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block text-sm text-muted-foreground">
                {user?.name || user?.email || 'Admin'}
              </span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {user?.role === 'admin' ? 'Admin' : 'Advogado'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/' })}
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
