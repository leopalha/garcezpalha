'use client'

import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { Logo } from '@/components/shared/logo'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Menu,
  X,
  Banknote,
  Home,
  Heart,
  FileCheck,
  Scale,
  Users,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const solutionCategories = [
  {
    name: 'Protecao Financeira',
    href: '/financeiro',
    icon: Banknote,
    description: 'Desbloqueio de conta, golpes, negativacao',
    items: [
      { name: 'Desbloqueio de Conta', href: '/financeiro/desbloqueio-conta' },
      { name: 'Golpe do PIX', href: '/financeiro/golpe-pix' },
      { name: 'Negativacao Indevida', href: '/financeiro/negativacao-indevida' },
      { name: 'Defesa em Execucao', href: '/checkout?service=defesa-execucao' },
    ],
  },
  {
    name: 'Protecao Patrimonial',
    href: '/patrimonial',
    icon: Home,
    description: 'Imoveis, usucapiao, inventario, holding',
    items: [
      { name: 'Direito Imobiliario', href: '/checkout?service=direito-imobiliario' },
      { name: 'Usucapiao', href: '/checkout?service=usucapiao' },
      { name: 'Holding Familiar', href: '/checkout?service=holding-familiar' },
      { name: 'Inventario', href: '/checkout?service=inventario' },
    ],
  },
  {
    name: 'Protecao de Saude',
    href: '/saude',
    icon: Heart,
    description: 'Planos de saude, INSS, pericias',
    items: [
      { name: 'Plano de Saude Negou', href: '/checkout?service=plano-saude' },
      { name: 'Cirurgia Bariatrica', href: '/checkout?service=cirurgia-bariatrica' },
      { name: 'Tratamento TEA', href: '/checkout?service=tratamento-tea' },
      { name: 'BPC / LOAS', href: '/checkout?service=bpc-loas' },
    ],
  },
  {
    name: 'Pericia e Documentos',
    href: '/pericia',
    icon: FileCheck,
    description: 'Laudos, grafotecnia, analise documental',
    items: [
      { name: 'Pericia Documental', href: '/checkout?service=pericia-documental' },
      { name: 'Grafotecnia', href: '/checkout?service=grafotecnia' },
      { name: 'Laudo Tecnico', href: '/checkout?service=laudo-tecnico' },
    ],
  },
  {
    name: 'Defesa Criminal',
    href: '/criminal',
    icon: Scale,
    description: 'Processos criminais, habeas corpus',
    items: [
      { name: 'Direito Criminal', href: '/checkout?service=direito-criminal' },
      { name: 'Direito Aeronautico', href: '/checkout?service=direito-aeronautico' },
    ],
  },
  {
    name: 'Automacao Juridica',
    href: '/automacao',
    icon: Users,
    description: 'Secretaria remota, aposentadoria',
    items: [
      { name: 'Secretaria Remota', href: '/checkout?service=secretaria-remota' },
      { name: 'Aposentadoria', href: '/checkout?service=aposentadoria' },
    ],
  },
]

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Nossa Historia', href: '/historia' },
  { name: 'Equipe', href: '/equipe' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contato', href: '/contato' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo variant="horizontal" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Solutions Mega Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Solucoes</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[800px] p-4">
                    <div className="grid grid-cols-3 gap-4">
                      {solutionCategories.map((category) => {
                        const Icon = category.icon
                        return (
                          <div key={category.name} className="space-y-3">
                            <Link
                              href={category.href}
                              className="flex items-center gap-2 font-semibold hover:text-primary transition-colors"
                            >
                              <Icon className="w-4 h-4" />
                              {category.name}
                            </Link>
                            <ul className="space-y-1">
                              {category.items.map((item) => (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-1"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Link
                        href="/checkout"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Ver todas as solucoes →
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Other Navigation Items */}
              {navigation.slice(1).map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <ThemeSwitcher />

          <Button variant="outline" asChild>
            <Link href="/login">Area do Cliente</Link>
          </Button>

          <Button asChild>
            <Link href="/contato">Fale Conosco</Link>
          </Button>
        </div>

        {/* Mobile menu button and theme switcher */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Solutions Accordion */}
            <div>
              <button
                onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Solucoes
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    mobileSolutionsOpen && 'rotate-180'
                  )}
                />
              </button>

              {mobileSolutionsOpen && (
                <div className="mt-2 ml-4 space-y-4">
                  {solutionCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <div key={category.name} className="space-y-2">
                        <Link
                          href={category.href}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="w-4 h-4" />
                          {category.name}
                        </Link>
                        <ul className="ml-6 space-y-1">
                          {category.items.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-1"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {navigation.slice(1).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <Button variant="outline" className="w-full" asChild>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                Area do Cliente
              </Link>
            </Button>
            <Button className="w-full" asChild>
              <Link href="/contato" onClick={() => setMobileMenuOpen(false)}>
                Fale Conosco
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
