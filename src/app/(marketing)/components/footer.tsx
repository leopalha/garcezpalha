import Link from 'next/link'
import { Logo } from '@/components/shared/logo'
import { MapPin, Mail, Phone } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Coluna 1: Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Logo variant="horizontal" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Tradição desde 1661 | Excelência desde sempre
              <br />
              364 anos de tradição, nobreza e excelência.
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              <strong>Leonardo Mendonça Palha da Silva</strong>
              <br />
              Advogado (OAB/RJ) | Perito (CONPEJ/RJ) | Corretor (CRECI/RJ)
            </p>
            <p className="text-xs text-muted-foreground italic">
              Descendente de Viscondes, Barões e Governadores Coloniais
            </p>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/historia"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Nossa História
                </Link>
              </li>
              <li>
                <Link
                  href="/servicos"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Serviços
                </Link>
              </li>
              <li>
                <Link
                  href="/equipe"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Equipe
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/parcerias"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Seja um Parceiro
                </Link>
              </li>
              <li className="pt-2 border-t">
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Área do Cliente →
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Av. das Américas 13685
                  <br />
                  Barra da Tijuca
                  <br />
                  Rio de Janeiro, RJ
                  <br />
                  CEP 22790-701
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href="mailto:contato@garcezpalha.com"
                  className="hover:text-foreground transition-colors"
                >
                  contato@garcezpalha.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:+5521995354010" className="hover:text-foreground transition-colors">
                  (21) 99535-4010
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} Garcez Palha Consultoria Jurídica & Pericial. Todos os direitos reservados.
          </p>
          <p className="mt-2">
            <Link href="/privacidade" className="hover:text-foreground transition-colors">
              Política de Privacidade
            </Link>
            {' · '}
            <Link href="/termos" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
