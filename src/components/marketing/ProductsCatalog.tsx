'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Banknote,
  Home,
  Heart,
  Shield,
  ArrowRight,
  AlertTriangle,
  BadgeDollarSign,
  Building2,
  FileText,
  Stethoscope,
  Plane,
  Scale,
  Users,
  FileCheck,
} from 'lucide-react'

// Catalogo Unificado - Todos os produtos apontam para checkout
const products = [
  {
    category: 'Protecao Financeira',
    icon: Banknote,
    description: 'Recupere seu dinheiro e proteja suas financas',
    items: [
      { name: 'Desbloqueio de Conta', href: '/checkout?service=desbloqueio-conta', icon: Shield, price: 'a partir de R$ 1.500' },
      { name: 'Golpe do PIX', href: '/checkout?service=golpe-pix', icon: AlertTriangle, price: 'a partir de R$ 2.000' },
      { name: 'Negativacao Indevida', href: '/checkout?service=negativacao-indevida', icon: BadgeDollarSign, price: 'a partir de R$ 800' },
      { name: 'Defesa em Execucao', href: '/checkout?service=defesa-execucao', icon: Scale, price: 'a partir de R$ 2.500' },
    ],
  },
  {
    category: 'Protecao Patrimonial',
    icon: Home,
    description: 'Regularize e proteja seu patrimonio',
    items: [
      { name: 'Direito Imobiliario', href: '/checkout?service=direito-imobiliario', icon: Building2, price: 'consulte' },
      { name: 'Usucapiao', href: '/checkout?service=usucapiao', icon: FileText, price: 'a partir de R$ 5.000' },
      { name: 'Holding Familiar', href: '/checkout?service=holding-familiar', icon: Building2, price: 'a partir de R$ 8.000' },
      { name: 'Inventario', href: '/checkout?service=inventario', icon: FileText, price: 'a partir de R$ 3.000' },
      { name: 'Regularizacao de Imovel', href: '/checkout?service=regularizacao-imovel', icon: Home, price: 'a partir de R$ 2.000' },
      { name: 'Avaliacao de Imoveis', href: '/checkout?service=avaliacao-imoveis', icon: Home, price: 'a partir de R$ 1.500' },
    ],
  },
  {
    category: 'Protecao de Saude',
    icon: Heart,
    description: 'Garanta seus direitos de saude e previdencia',
    items: [
      { name: 'Plano de Saude Negou', href: '/checkout?service=plano-saude', icon: Stethoscope, price: 'a partir de R$ 1.500' },
      { name: 'Cirurgia Bariatrica', href: '/checkout?service=cirurgia-bariatrica', icon: Heart, price: 'a partir de R$ 2.000' },
      { name: 'Tratamento TEA', href: '/checkout?service=tratamento-tea', icon: Heart, price: 'a partir de R$ 2.000' },
      { name: 'BPC / LOAS', href: '/checkout?service=bpc-loas', icon: Shield, price: 'a partir de R$ 1.500' },
      { name: 'Pericia Medica', href: '/checkout?service=pericia-medica', icon: Stethoscope, price: 'a partir de R$ 800' },
    ],
  },
  {
    category: 'Pericia e Documentos',
    icon: FileCheck,
    description: 'Laudos tecnicos e analise documental',
    items: [
      { name: 'Pericia Documental', href: '/checkout?service=pericia-documental', icon: FileCheck, price: 'a partir de R$ 1.200' },
      { name: 'Grafotecnia', href: '/checkout?service=grafotecnia', icon: FileText, price: 'a partir de R$ 1.500' },
      { name: 'Laudo Tecnico', href: '/checkout?service=laudo-tecnico', icon: FileText, price: 'a partir de R$ 1.000' },
    ],
  },
  {
    category: 'Defesa Criminal',
    icon: Scale,
    description: 'Proteja seus direitos em processos criminais',
    items: [
      { name: 'Direito Criminal', href: '/checkout?service=direito-criminal', icon: Scale, price: 'a partir de R$ 3.000' },
      { name: 'Direito Aeronautico', href: '/checkout?service=direito-aeronautico', icon: Plane, price: 'consulte' },
    ],
  },
  {
    category: 'Automacao Juridica',
    icon: Users,
    description: 'Tecnologia para seu escritorio',
    items: [
      { name: 'Secretaria Remota', href: '/checkout?service=secretaria-remota', icon: Users, price: 'a partir de R$ 500/mes' },
      { name: 'Aposentadoria', href: '/checkout?service=aposentadoria', icon: Shield, price: 'a partir de R$ 2.000' },
    ],
  },
]

export function ProductsCatalog() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Qual e o seu problema?
          </h2>
          <p className="text-xl text-muted-foreground">
            Selecione a area mais proxima da sua situacao para uma solucao especializada
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const CategoryIcon = product.icon

            return (
              <motion.div
                key={product.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <CategoryIcon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-lg">
                      {product.category}
                    </CardTitle>
                    <CardDescription>
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {product.items.map((item) => {
                        const ItemIcon = item.icon
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                            >
                              <ItemIcon className="w-4 h-4 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="block">{item.name}</span>
                                <span className="text-xs text-primary/70 group-hover:text-primary">
                                  {item.price}
                                </span>
                              </div>
                              <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
