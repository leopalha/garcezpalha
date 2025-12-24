'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  DollarSign,
  LinkIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useRequireRole } from '@/lib/auth/hooks'
import { signOut } from 'next-auth/react'

const navigation = [
  { name: 'Dashboard', href: '/parceiro', icon: LayoutDashboard },
  { name: 'Indicações', href: '/parceiro/indicacoes', icon: Users },
  { name: 'Comissões', href: '/parceiro/comissoes', icon: DollarSign },
  { name: 'Link de Referência', href: '/parceiro/link', icon: LinkIcon },
  { name: 'Configurações', href: '/parceiro/configuracoes', icon: Settings },
]

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isLoading, hasAccess, user } = useRequireRole(['partner', 'admin'])

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
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r">
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/parceiro" className="font-display text-xl font-bold">
                <span className="text-primary">Garcez</span>
                <span className="text-secondary"> Palha</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/parceiro' && pathname.startsWith(item.href))
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
            <Link href="/parceiro" className="font-display text-xl font-bold">
              <span className="text-primary">Garcez</span>
              <span className="text-secondary"> Palha</span>
            </Link>
          </div>
          <div className="px-4 py-2 border-b bg-gold/10">
            <p className="text-xs font-medium text-gold">Portal do Parceiro</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/parceiro' && pathname.startsWith(item.href))
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
            <h1 className="text-lg font-semibold">Portal do Parceiro</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{user?.name || user?.email}</span>
            <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded">Parceiro</span>
          </div>
        </header>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
