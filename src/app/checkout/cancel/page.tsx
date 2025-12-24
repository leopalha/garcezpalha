import { XCircle, ArrowLeft, Home, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            <div>
              <CardTitle className="text-3xl font-bold text-navy-900">
                Pagamento Cancelado
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Sua transação foi cancelada e nenhuma cobrança foi realizada
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Information */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-navy-900">O que aconteceu?</h3>
              <p className="text-muted-foreground">
                O processo de pagamento foi interrompido. Isso pode ter acontecido por diversos motivos:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Você decidiu cancelar a operação</li>
                <li>Houve algum problema técnico durante o processamento</li>
                <li>O prazo de pagamento expirou</li>
              </ul>
            </div>

            {/* What to do next */}
            <div className="space-y-4">
              <h3 className="font-semibold text-navy-900">O que fazer agora?</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <ArrowLeft className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Tentar Novamente</p>
                    <p className="text-sm text-muted-foreground">
                      Volte à página de checkout e tente realizar o pagamento novamente
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Falar com um Especialista</p>
                    <p className="text-sm text-muted-foreground">
                      Entre em contato conosco para esclarecer dúvidas ou discutir outras formas de pagamento
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Home className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Explorar Serviços</p>
                    <p className="text-sm text-muted-foreground">
                      Volte ao site para conhecer melhor nossos serviços antes de contratar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gold-50 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-navy-900">Precisa de ajuda?</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>📞 Telefone: (21) 3495-3046 / (21) 97503-0018</p>
                <p>✉️ E-mail: contato@garcezpalha.com</p>
                <p>⏰ Horário: Segunda a sexta, 9h às 18h</p>
                <p className="pt-2">
                  💬 Ou use o chat ao vivo no canto inferior direito para falar conosco agora!
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-3 pt-4">
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Checkout
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/contato">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Falar com Especialista
                </Link>
              </Button>

              <Button asChild variant="ghost" size="lg" className="w-full">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar para Início
                </Link>
              </Button>
            </div>

            {/* Footer Message */}
            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
              <p>
                Estamos aqui para ajudar!
                <br />
                Entre em contato a qualquer momento.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
