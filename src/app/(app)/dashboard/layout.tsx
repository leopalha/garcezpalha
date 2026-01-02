'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FileText,
  MessageSquare,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
  Palette,
  Users,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useSession, signOut } from 'next-auth/react'
import { ErrorBoundary } from '@/components/ui/error-boundary'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Produtos', href: '/dashboard/produtos', icon: Package },
  { name: 'Landing Pages', href: '/dashboard/landing-pages', icon: FileText },
  { name: 'Conversas IA', href: '/dashboard/conversas', icon: MessageSquare },
  { name: 'Clientes', href: '/dashboard/clientes', icon: Users },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Agent IA', href: '/dashboard/agent', icon: Sparkles },
  { name: 'White-Label', href: '/dashboard/white-label', icon: Palette },
  { name: 'Assinatura', href: '/dashboard/assinatura', icon: DollarSign },
  { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
]

export default function AppDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session, status } = useSession()

  // Mock tenant data (in production, this would come from user's session/tenant)
  const tenantData = {
    name: 'Silva & Advogados',
    plan: 'Pro',
    agent: 'Imobiliário',
    domain: 'silvaadvogados.com.br',
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r">
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/dashboard" className="font-display text-xl font-bold">
                <span className="text-primary">Garcez</span>
                <span className="text-secondary"> Palha</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Tenant info */}
            <div className="px-4 py-3 border-b bg-muted/30">
              <p className="font-medium text-sm truncate">{tenantData.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {tenantData.plan}
                </span>
                <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded">
                  {tenantData.agent}
                </span>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
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
            <Link href="/dashboard" className="font-display text-xl font-bold">
              <span className="text-primary">Garcez</span>
              <span className="text-secondary"> Palha</span>
            </Link>
          </div>

          {/* Tenant info */}
          <div className="px-4 py-3 border-b bg-muted/30">
            <p className="font-medium text-sm truncate">{tenantData.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                {tenantData.plan}
              </span>
              <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded">
                {tenantData.agent}
              </span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
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

          <div className="p-4 border-t">
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
            <h1 className="text-lg font-semibold">Plataforma de Gestão</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:inline">
              {session?.user?.name || session?.user?.email}
            </span>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
