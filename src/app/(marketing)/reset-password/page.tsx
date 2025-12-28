'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CoatOfArms } from '@/components/ui/coat-of-arms'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    }
  }, [searchParams])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!token) {
      newErrors.token = 'Token inválido ou ausente'
    }

    if (password.length < 8) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ submit: data.error || 'Erro ao redefinir senha' })
        return
      }

      setSuccessMessage(data.message)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      console.error('Reset password error:', error)
      setErrors({ submit: 'Erro ao redefinir senha. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (!token && !searchParams.get('token')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <CoatOfArms variant="simplified" className="h-16 w-16 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Token inválido</h2>
          <p className="text-gray-600">
            O link de recuperação de senha está inválido ou expirado.
          </p>
          <Link href="/forgot-password">
            <Button>Solicitar novo link</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CoatOfArms variant="simplified" className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Redefinir senha
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Digite sua nova senha
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Password */}
            <div>
              <Label htmlFor="password">Nova senha *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) {
                    setErrors(prev => {
                      const newErrors = { ...prev }
                      delete newErrors.password
                      return newErrors
                    })
                  }
                }}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 8 caracteres
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Confirmar nova senha *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword) {
                    setErrors(prev => {
                      const newErrors = { ...prev }
                      delete newErrors.confirmPassword
                      return newErrors
                    })
                  }
                }}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {errors.token && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {errors.token}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !token}
          >
            {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
