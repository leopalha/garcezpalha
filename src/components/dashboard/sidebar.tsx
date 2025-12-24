'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Upload,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react'
import { Logo } from '@/components/shared/logo'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Meus Processos', href: '/dashboard/processos', icon: FileText },
  { name: 'Documentos', href: '/dashboard/documentos', icon: Upload },
  { name: 'Prazos', href: '/dashboard/prazos', icon: Calendar },
  { name: 'Pagamentos', href: '/dashboard/pagamentos', icon: CreditCard },
  { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn('flex h-full flex-col bg-card', className)}>
      {/* Logo */}
      <div className="flex items-center gap-2 p-6 border-b">
        <Link href="/dashboard">
          <Logo variant="horizontal" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname?.startsWith(item.href))
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

      {/* Logout button */}
      <div className="p-4 border-t space-y-2">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  )
}
