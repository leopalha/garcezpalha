/**
 * Two-Factor Authentication Settings Page
 * P1-001: MFA/2FA for Admin Users
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Shield, Smartphone, Mail, Key, Copy, Check, AlertTriangle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import QRCode from 'qrcode'
import Image from 'next/image'

export default function TwoFactorPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [method, setMethod] = useState<'totp' | 'sms' | 'email'>('totp')
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup')

  // Setup data
  const [secret, setSecret] = useState('')
  const [qrCodeURL, setQrCodeURL] = useState('')
  const [qrCodeImage, setQrCodeImage] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copiedCodes, setCopiedCodes] = useState(false)

  // Verification
  const [verificationCode, setVerificationCode] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    checkStatus()
  }, [])

  useEffect(() => {
    if (qrCodeURL) {
      QRCode.toDataURL(qrCodeURL, { width: 256 })
        .then(setQrCodeImage)
        .catch(console.error)
    }
  }, [qrCodeURL])

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/auth/2fa/status')
      if (res.ok) {
        const data = await res.json()
        setEnabled(data.enabled)
        setMethod(data.method || 'totp')
      }
    } catch (error) {
      console.error('Failed to check 2FA status:', error)
    }
  }

  const handleEnable = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, phone: method === 'sms' ? phone : undefined }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to enable 2FA')
      }

      const data = await res.json()
      setSecret(data.secret)
      setQrCodeURL(data.qrCodeURL || '')
      setBackupCodes(data.backupCodes || [])
      setStep('verify')

      toast({
        title: '2FA configurado',
        description: 'Agora escaneie o QR code e insira o código de verificação.',
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao ativar 2FA',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Código inválido')
      }

      setStep('complete')
      setEnabled(true)

      toast({
        title: '2FA ativado com sucesso!',
        description: 'Sua conta agora está protegida com autenticação de dois fatores.',
      })
    } catch (error: any) {
      toast({
        title: 'Código inválido',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = async () => {
    if (!confirm('Tem certeza que deseja desativar 2FA? Isso reduzirá a segurança da sua conta.')) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to disable 2FA')
      }

      setEnabled(false)
      setStep('setup')

      toast({
        title: '2FA desativado',
        description: 'Autenticação de dois fatores foi removida da sua conta.',
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao desativar 2FA',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'))
    setCopiedCodes(true)
    toast({
      title: 'Códigos copiados',
      description: 'Salve estes códigos em um local seguro!',
    })
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Autenticação de Dois Fatores (2FA)</h1>
        <p className="text-muted-foreground">
          Adicione uma camada extra de segurança à sua conta
        </p>
      </div>

      {enabled && step !== 'verify' && (
        <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900 dark:text-green-100">
            <strong>2FA está ativado</strong> - Sua conta está protegida com {method === 'totp' ? 'autenticador app' : method === 'sms' ? 'SMS' : 'email'}.
          </AlertDescription>
        </Alert>
      )}

      {!enabled && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Recomendado para admins:</strong> Ative 2FA para proteger sua conta contra acesso não autorizado.
          </AlertDescription>
        </Alert>
      )}

      {/* Setup Step */}
      {step === 'setup' && !enabled && (
        <Card>
          <CardHeader>
            <CardTitle>Configurar 2FA</CardTitle>
            <CardDescription>
              Escolha o método de autenticação de dois fatores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {/* TOTP Method */}
              <Card
                className={`cursor-pointer transition-all ${
                  method === 'totp' ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'
                }`}
                onClick={() => setMethod('totp')}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Smartphone className="w-6 h-6 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">App Autenticador (Recomendado)</h3>
                      <p className="text-sm text-muted-foreground">
                        Use Google Authenticator, Authy ou similar. Funciona offline.
                      </p>
                    </div>
                    {method === 'totp' && <Check className="w-5 h-5 text-primary" />}
                  </div>
                </CardContent>
              </Card>

              {/* SMS Method */}
              <Card
                className={`cursor-pointer transition-all ${
                  method === 'sms' ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'
                }`}
                onClick={() => setMethod('sms')}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">SMS</h3>
                      <p className="text-sm text-muted-foreground">
                        Receba códigos por mensagem de texto. Requer número de telefone.
                      </p>
                    </div>
                    {method === 'sms' && <Check className="w-5 h-5 text-primary" />}
                  </div>
                </CardContent>
              </Card>
            </div>

            {method === 'sms' && (
              <div>
                <Label htmlFor="phone">Número de Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            <Button onClick={handleEnable} disabled={loading} className="w-full">
              {loading ? 'Configurando...' : 'Continuar'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Verify Step */}
      {step === 'verify' && (
        <div className="space-y-6">
          {method === 'totp' && qrCodeImage && (
            <Card>
              <CardHeader>
                <CardTitle>Escaneie o QR Code</CardTitle>
                <CardDescription>
                  Use seu app autenticador para escanear este código
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Image src={qrCodeImage} alt="QR Code" width={256} height={256} />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Ou insira manualmente:</p>
                  <code className="text-xs break-all">{secret}</code>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Verificar Código</CardTitle>
              <CardDescription>
                Insira o código de 6 dígitos do seu {method === 'totp' ? 'app autenticador' : 'SMS'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="code">Código de Verificação</Label>
                <Input
                  id="code"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <Button
                onClick={handleVerify}
                disabled={loading || verificationCode.length !== 6}
                className="w-full"
              >
                {loading ? 'Verificando...' : 'Verificar e Ativar'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-6 h-6 text-green-600" />
              2FA Ativado com Sucesso!
            </CardTitle>
            <CardDescription>
              Salve seus códigos de recuperação em um local seguro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Key className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Guarde estes códigos em um local seguro. Você pode usá-los para acessar sua conta se perder acesso ao seu método de 2FA.
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Códigos de Recuperação</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyBackupCodes}
                  className="gap-2"
                >
                  {copiedCodes ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedCodes ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, i) => (
                  <code key={i} className="text-sm bg-background p-2 rounded">
                    {code}
                  </code>
                ))}
              </div>
            </div>

            <Button onClick={() => setStep('setup')} className="w-full">
              Concluir
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Disable 2FA */}
      {enabled && step === 'setup' && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle>Desativar 2FA</CardTitle>
            <CardDescription>
              Remover autenticação de dois fatores da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Desativar 2FA reduzirá a segurança da sua conta. Apenas faça isso se absolutamente necessário.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleDisable}
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              {loading ? 'Desativando...' : 'Desativar 2FA'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
