import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
          <div className="-mt-16">
            <h2 className="text-3xl font-display font-bold mb-4">
              Página Não Encontrada
            </h2>
            <p className="text-muted-foreground mb-8">
              A página que você está procurando pode ter sido removida, teve seu nome alterado ou está temporariamente indisponível.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Voltar para Página Inicial
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/contato">
              <Button variant="outline" className="w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2" />
                Fale Conosco
              </Button>
            </Link>

            <Link href="/servicos/direito-imobiliario">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ver Serviços
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Se você acredita que isso é um erro, entre em contato conosco pelo telefone{' '}
            <a href="tel:+5521995354010" className="text-primary hover:underline">
              (21) 99535-4010
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
