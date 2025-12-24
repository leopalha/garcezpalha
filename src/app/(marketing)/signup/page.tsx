'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CoatOfArms } from '@/components/ui/coat-of-arms'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    document: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[e.target.name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter no mínimo 3 caracteres'
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          document: formData.document || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ submit: data.error || 'Erro ao criar conta' })
        return
      }

      setSuccessMessage('Conta criada com sucesso! Redirecionando para login...')
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      console.error('Signup error:', error)
      setErrors({ submit: 'Erro ao criar conta. Tente novamente.' })
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
            Criar nova conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Fazer login
            </Link>
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone (optional) */}
            <div>
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(21) 99999-9999"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Document (optional) */}
            <div>
              <Label htmlFor="document">CPF/CNPJ (opcional)</Label>
              <Input
                id="document"
                name="document"
                type="text"
                placeholder="000.000.000-00"
                value={formData.document}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
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
              <Label htmlFor="confirmPassword">Confirmar senha *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
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

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link href="/termos" className="text-primary hover:underline">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link href="/privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
