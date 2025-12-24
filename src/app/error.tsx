'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="text-center max-w-lg">
        <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>

        <h2 className="text-3xl font-display font-bold mb-4">
          Algo deu errado
        </h2>

        <p className="text-muted-foreground mb-8">
          Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.
        </p>

        {error.digest && (
          <p className="text-xs text-muted-foreground mb-4">
            Código do erro: {error.digest}
          </p>
        )}

        <div className="space-y-4">
          <Button onClick={reset} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>

          <div>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Voltar para Página Inicial
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Se o problema persistir, entre em contato pelo telefone{' '}
            <a href="tel:+5521995354010" className="text-primary hover:underline">
              (21) 99535-4010
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
