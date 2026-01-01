'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-background dark:from-orange-950/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <XCircle className="h-12 w-12 text-orange-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-orange-600">
              Pagamento Cancelado
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Você cancelou o processo de pagamento
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-orange-600" />
                O que aconteceu?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Você interrompeu o processo de pagamento antes de finalizá-lo. Nenhuma cobrança foi
                realizada.
              </p>
              <p className="text-sm text-muted-foreground">
                Se você encontrou algum problema ou tem dúvidas, nossa equipe está pronta para
                ajudar! Entre em contato conosco.
              </p>
            </div>

            <div className="grid gap-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Possíveis motivos para cancelamento:
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Precisa de mais informações sobre os planos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Deseja conversar com nossa equipe antes de assinar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Problemas técnicos durante o checkout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Não estava pronto para finalizar agora</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>💡 Dica:</strong> Você pode salvar seu progresso e voltar mais tarde! Os
                planos e preços continuam os mesmos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1" size="lg">
                <Link href="/app/precos">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ver Planos Novamente
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link href="/app">Voltar ao Início</Link>
              </Button>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3 text-center">Precisa de ajuda?</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <Link href="/app/precos">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="pt-6 text-center">
                      <p className="font-medium text-sm mb-1">📋 Ver Planos</p>
                      <p className="text-xs text-muted-foreground">
                        Compare recursos e preços
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="pt-6 text-center">
                      <p className="font-medium text-sm mb-1">💬 WhatsApp</p>
                      <p className="text-xs text-muted-foreground">
                        Fale com nosso time
                      </p>
                    </CardContent>
                  </Card>
                </a>

                <Link href="/docs">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="pt-6 text-center">
                      <p className="font-medium text-sm mb-1">📚 Documentação</p>
                      <p className="text-xs text-muted-foreground">
                        Central de ajuda
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
