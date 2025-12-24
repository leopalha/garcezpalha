'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Upload,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Scale,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

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
    <div className={cn('flex h-full flex-col bg-card border-r', className)}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Garcez Palha</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* User section */}
      <div className="p-4">
        <Button variant="outline" className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}
