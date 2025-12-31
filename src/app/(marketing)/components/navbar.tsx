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
  Phone,
  Zap,
  Lightbulb,
  ShoppingCart,
  Plane,
  Briefcase,
  GraduationCap,
  Building,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { NEW_PRODUCTS } from '@/lib/products/catalog'
import type { LucideIcon } from 'lucide-react'

// Mapeamento de categorias para ícones e metadados
const categoryMetadata: Record<string, { name: string; icon: LucideIcon; description: string; href: string }> = {
  bancario: {
    name: 'Bancário',
    icon: Banknote,
    description: 'Seguros, fraudes, revisões bancárias',
    href: '/solucoes#bancario',
  },
  consumidor: {
    name: 'Direito do Consumidor',
    icon: ShoppingCart,
    description: 'Telefonia, energia, produtos, voos',
    href: '/solucoes#consumidor',
  },
  previdenciario: {
    name: 'Direito Previdenciário',
    icon: Users,
    description: 'INSS, aposentadoria, benefícios',
    href: '/solucoes#previdenciario',
  },
  trabalhista: {
    name: 'Direito Trabalhista',
    icon: Briefcase,
    description: 'Rescisão, horas extras, verbas',
    href: '/solucoes#trabalhista',
  },
  administrativo: {
    name: 'Direito Administrativo',
    icon: Scale,
    description: 'Servidor público, FIES, concursos',
    href: '/solucoes#administrativo',
  },
  // Categorias legadas removidas (agora mapeadas em consumidor/administrativo)
  telecom: {
    name: 'Direito do Consumidor',
    icon: ShoppingCart,
    description: 'Operadoras, cobranças, portabilidade',
    href: '/solucoes#consumidor',
  },
  energia: {
    name: 'Direito do Consumidor',
    icon: ShoppingCart,
    description: 'Contas de luz, cobranças indevidas',
    href: '/solucoes#consumidor',
  },
  digital: {
    name: 'Direito do Consumidor',
    icon: ShoppingCart,
    description: 'Assinaturas, apps, streamings',
    href: '/solucoes#consumidor',
  },
  aereo: {
    name: 'Direito do Consumidor',
    icon: ShoppingCart,
    description: 'Voos, overbooking, bagagens',
    href: '/solucoes#consumidor',
  },
  servidor: {
    name: 'Direito Administrativo',
    icon: Scale,
    description: 'Gratificações, reajustes, diferenças',
    href: '/solucoes#administrativo',
  },
  educacional: {
    name: 'Direito Administrativo',
    icon: Scale,
    description: 'FIES, renegociações, contratos',
    href: '/solucoes#administrativo',
  },
  condominial: {
    name: 'Direito Imobiliário',
    icon: Home,
    description: 'Cobranças, multas, rateios',
    href: '/solucoes#imobiliario',
  },
  // Categorias legadas (mantidas para compatibilidade)
  financeiro: {
    name: 'Direito Bancário',
    icon: Banknote,
    description: 'Desbloqueio de conta, golpes, negativação',
    href: '/financeiro',
  },
  patrimonial: {
    name: 'Direito Imobiliário',
    icon: Home,
    description: 'Imóveis, usucapião, inventário, holding',
    href: '/patrimonial',
  },
  saude: {
    name: 'Direito da Saúde',
    icon: Heart,
    description: 'Planos de saúde, tratamentos, benefícios',
    href: '/saude',
  },
  pericia: {
    name: 'Perícia e Documentos',
    icon: FileCheck,
    description: 'Laudos, grafotecnia, análise documental',
    href: '/pericia',
  },
  criminal: {
    name: 'Direito Criminal',
    icon: Scale,
    description: 'Processos criminais, habeas corpus',
    href: '/criminal',
  },
  aeronautico: {
    name: 'Direito Aeronáutico',
    icon: Plane,
    description: 'Problemas com companhias aéreas',
    href: '/aeronautico',
  },
  automacao: {
    name: 'Automação Jurídica',
    icon: Lightbulb,
    description: 'Secretaria remota com IA',
    href: '/automacao',
  },
}

// Produtos legados (hardcoded) para manter rotas antigas funcionando
const legacyProducts = [
  { name: 'Desbloqueio de Conta', href: '/financeiro/desbloqueio-conta', category: 'financeiro' },
  { name: 'Golpe do PIX', href: '/financeiro/golpe-pix', category: 'financeiro' },
  { name: 'Negativação Indevida', href: '/financeiro/negativacao-indevida', category: 'financeiro' },
  { name: 'Defesa em Execução', href: '/financeiro/defesa-execucao', category: 'financeiro' },
  { name: 'Direito Imobiliário', href: '/patrimonial/direito-imobiliario', category: 'patrimonial' },
  { name: 'Usucapião', href: '/patrimonial/usucapiao', category: 'patrimonial' },
  { name: 'Holding Familiar', href: '/patrimonial/holding-familiar', category: 'patrimonial' },
  { name: 'Inventário', href: '/patrimonial/inventario', category: 'patrimonial' },
  { name: 'Plano de Saúde Negou', href: '/saude/plano-saude-negou', category: 'saude' },
  { name: 'Cirurgia Bariátrica', href: '/saude/cirurgia-bariatrica', category: 'saude' },
  { name: 'Tratamento TEA', href: '/saude/tea', category: 'saude' },
  { name: 'BPC / LOAS', href: '/saude/bpc-loas', category: 'saude' },
  { name: 'Perícia Documental', href: '/pericia/pericia-documental', category: 'pericia' },
  { name: 'Grafotecnia', href: '/pericia/grafotecnia', category: 'pericia' },
  { name: 'Laudo Técnico', href: '/pericia/laudo-tecnico', category: 'pericia' },
  { name: 'Direito Criminal', href: '/criminal/direito-criminal', category: 'criminal' },
  { name: 'Direito Aeronáutico', href: '/aeronautico/direito-aeronautico', category: 'aeronautico' },
  { name: 'Secretaria Remota', href: '/automacao/secretaria-remota', category: 'automacao' },
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

  // Gerar categorias dinamicamente a partir do catalog.ts
  const solutionCategories = useMemo(() => {
    // Agrupar produtos novos por categoria
    const newProductsByCategory = NEW_PRODUCTS.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = []
      }
      acc[product.category].push({
        name: product.name,
        href: `/solucoes/${product.category}/${product.slug}`,
      })
      return acc
    }, {} as Record<string, Array<{ name: string; href: string }>>)

    // Agrupar produtos legados por categoria
    const legacyByCategory = legacyProducts.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = []
      }
      acc[product.category].push({
        name: product.name,
        href: product.href,
      })
      return acc
    }, {} as Record<string, Array<{ name: string; href: string }>>)

    // Combinar todas as categorias (novas + legadas)
    const allCategories = new Set([
      ...Object.keys(newProductsByCategory),
      ...Object.keys(legacyByCategory),
    ])

    // Montar array final de categorias com produtos
    return Array.from(allCategories)
      .map(category => {
        const meta = categoryMetadata[category]
        if (!meta) return null

        return {
          name: meta.name,
          href: meta.href,
          icon: meta.icon,
          description: meta.description,
          items: [
            ...(newProductsByCategory[category] || []),
            ...(legacyByCategory[category] || []),
          ],
        }
      })
      .filter((cat): cat is NonNullable<typeof cat> => cat !== null)
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  // Contar total de produtos
  const totalProducts = solutionCategories.reduce((sum, cat) => sum + cat.items.length, 0)
  const totalCategories = solutionCategories.length

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 flex items-center justify-between h-16" aria-label="Navegação principal">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Voltar para página inicial - Garcez Palha">
          <Logo variant="horizontal" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Solutions Mega Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger aria-label="Menu de Soluções Jurídicas">Solucoes</NavigationMenuTrigger>
                <NavigationMenuContent role="menu" aria-label="Submenu de soluções jurídicas">
                  <div className="w-[800px] p-4">
                    {/* Link to all solutions */}
                    <Link
                      href="/solucoes"
                      className="block mb-4 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/20"
                      aria-label={`Ver todas as ${totalProducts} soluções jurídicas em ${totalCategories} categorias`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-primary">Ver Todas as Soluções</div>
                          <div className="text-sm text-muted-foreground">{totalProducts} produtos em {totalCategories} categorias</div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-primary rotate-[-90deg]" />
                      </div>
                    </Link>

                    <div className="grid grid-cols-3 gap-4">
                      {solutionCategories.map((category) => {
                        const Icon = category.icon
                        return (
                          <div key={category.name} className="space-y-3">
                            <Link
                              href={category.href}
                              className="flex items-center gap-2 font-semibold hover:text-primary transition-colors"
                              aria-label={`${category.name} - ${category.description}`}
                            >
                              <Icon className="w-4 h-4" aria-hidden="true" />
                              {category.name}
                            </Link>
                            <ul className="space-y-1" role="list" aria-label={`Serviços de ${category.name}`}>
                              {category.items.map((item) => (
                                <li key={item.name} role="listitem">
                                  <Link
                                    href={item.href}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-1"
                                    aria-label={`${item.name} - ${category.name}`}
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
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} aria-label={`Navegar para ${item.name}`}>
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <ThemeSwitcher />

          <Button variant="outline" asChild>
            <Link href="/login" aria-label="Acessar área do cliente - Login">Area do Cliente</Link>
          </Button>
        </div>

        {/* Mobile menu button and theme switcher */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t max-h-[80vh] overflow-y-auto" role="navigation" aria-label="Menu mobile">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Solutions Accordion */}
            <div>
              <button
                onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Menu de Soluções Jurídicas"
                aria-expanded={mobileSolutionsOpen}
                aria-controls="mobile-solutions"
              >
                Solucoes
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    mobileSolutionsOpen && 'rotate-180'
                  )}
                  aria-hidden="true"
                />
              </button>

              {mobileSolutionsOpen && (
                <div id="mobile-solutions" className="mt-2 ml-4 space-y-4">
                  {solutionCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <div key={category.name} className="space-y-2">
                        <Link
                          href={category.href}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                          aria-label={`${category.name} - ${category.description}`}
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" />
                          {category.name}
                        </Link>
                        <ul className="ml-6 space-y-1" role="list" aria-label={`Serviços de ${category.name}`}>
                          {category.items.map((item) => (
                            <li key={item.name} role="listitem">
                              <Link
                                href={item.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-1"
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label={`${item.name} - ${category.name}`}
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
          </div>
        </div>
      )}
    </header>
  )
}
