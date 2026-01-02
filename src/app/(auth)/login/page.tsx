'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/shared/logo'
import { Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const error = searchParams.get('error')

  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError(null)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setFormError(result.error)
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setFormError('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-6">
          <Link href="/" className="inline-flex justify-center">
            <Logo variant="horizontal" />
          </Link>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-semibold tracking-tight">Área do Cliente</CardTitle>
            <CardDescription className="text-base">Entre com suas credenciais para acessar o sistema</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {(error || formError) && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-center gap-3 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{formError || 'Erro ao fazer login'}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Senha</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Esqueceu?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                className="h-11 text-base"
              />
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar na Conta'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="text-center mb-4">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
                Credenciais de Demonstração
              </p>
              <div className="space-y-2.5 text-sm bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <div className="flex justify-between items-center gap-3">
                  <span className="font-semibold text-slate-700">Admin:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200">admin@garcezpalha.com</code>
                    <span className="text-slate-400">/</span>
                    <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200 font-semibold text-primary">admin123</code>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="font-semibold text-slate-700">Advogado:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200">advogado@garcezpalha.com</code>
                    <span className="text-slate-400">/</span>
                    <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200 font-semibold text-primary">advogado123</code>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="font-semibold text-slate-700">Cliente:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200">cliente@garcezpalha.com</code>
                    <span className="text-slate-400">/</span>
                    <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200 font-semibold text-primary">cliente123</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm border-t border-slate-200 pt-6">
            <span className="text-slate-600">Ainda não tem conta? </span>
            <Link href="/signup" className="text-primary hover:underline font-semibold">
              Cadastre-se gratuitamente
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
