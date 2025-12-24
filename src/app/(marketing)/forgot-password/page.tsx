'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CoatOfArms } from '@/components/ui/coat-of-arms'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [devResetUrl, setDevResetUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Email é obrigatório')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    setDevResetUrl('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao processar solicitação')
        return
      }

      setSuccessMessage(data.message)
      
      // Show reset URL in development
      if (data.resetUrl) {
        setDevResetUrl(data.resetUrl)
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setError('Erro ao processar solicitação. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CoatOfArms variant="simplified" className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Recuperar senha
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Digite seu email para receber instruções de recuperação de senha
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            <p className="font-medium">{successMessage}</p>
            {devResetUrl && (
              <div className="mt-3 pt-3 border-t border-green-300">
                <p className="text-xs font-semibold mb-2">🔧 Modo Desenvolvimento:</p>
                <a 
                  href={devResetUrl} 
                  className="text-xs underline break-all hover:text-green-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {devResetUrl}
                </a>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error ? 'border-red-500' : ''}
              placeholder="seu@email.com"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : 'Enviar instruções'}
          </Button>

          <div className="text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
