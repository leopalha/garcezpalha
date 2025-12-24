'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert, Home, LogIn, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Acesso Não Autorizado</CardTitle>
          <CardDescription>
            Você não tem permissão para acessar esta página
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Esta área é restrita a usuários com permissões específicas.
              Se você acredita que deveria ter acesso, entre em contato com o administrador.
            </p>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Ir para Página Inicial
              </Button>
            </Link>

            <Link href="/login" className="block">
              <Button className="w-full">
                <LogIn className="h-4 w-4 mr-2" />
                Fazer Login com Outra Conta
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground">
              Precisa de ajuda?{' '}
              <Link href="/contato" className="text-primary hover:underline">
                Entre em contato
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
