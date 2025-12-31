'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function CheckoutSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-green-600">
              Pagamento Confirmado!
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Sua assinatura foi ativada com sucesso
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Próximos Passos
              </h3>
              <ol className="space-y-3 ml-7">
                <li className="text-sm">
                  <strong>1. Configure sua plataforma</strong>
                  <br />
                  <span className="text-muted-foreground">
                    Complete o onboarding e escolha seu nicho de atuação
                  </span>
                </li>
                <li className="text-sm">
                  <strong>2. Crie seus primeiros produtos</strong>
                  <br />
                  <span className="text-muted-foreground">
                    Use nosso wizard para criar produtos e landing pages
                  </span>
                </li>
                <li className="text-sm">
                  <strong>3. Configure seu Agent IA</strong>
                  <br />
                  <span className="text-muted-foreground">
                    Personalize as respostas e o comportamento do assistente
                  </span>
                </li>
                <li className="text-sm">
                  <strong>4. Lance sua plataforma</strong>
                  <br />
                  <span className="text-muted-foreground">
                    Comece a receber leads qualificados automaticamente
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>📧 Confirmação enviada</strong>
                <br />
                Enviamos um email com os detalhes da sua assinatura e credenciais de acesso.
                Verifique sua caixa de entrada (e spam, só por precaução).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1" size="lg">
                <Link href="/app/onboarding">
                  Começar Configuração
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link href="/app/dashboard">Ir para Dashboard</Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Precisa de ajuda?</p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <Link href="/docs" className="text-primary hover:underline">
                  Central de Ajuda
                </Link>
                <span className="text-muted-foreground">•</span>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp Suporte
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
