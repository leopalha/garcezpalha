/**
 * Unsubscribe Page
 * Permite que usuários cancelem inscrição de email sequences
 */

import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { CheckCircle2, XCircle, Mail } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cancelar Inscrição | Garcez Palha Advogados',
  description: 'Cancelar inscrição de emails',
  robots: 'noindex, nofollow',
}

interface UnsubscribePageProps {
  params: {
    token: string
  }
  searchParams: {
    email?: string
  }
}

export default async function UnsubscribePage({
  params,
  searchParams,
}: UnsubscribePageProps) {
  const { token } = params
  const { email } = searchParams

  // Decodificar token (formato: base64(subscriptionId))
  let subscriptionId: string
  try {
    subscriptionId = Buffer.from(token, 'base64').toString('utf-8')
  } catch (error) {
    return <InvalidTokenPage />
  }

  // Buscar subscription no banco
  const supabase = createClient()
  const { data: subscription, error } = await supabase
    .from('email_sequence_subscriptions')
    .select(`
      *,
      sequence:email_sequences(name),
      lead:leads(email, name)
    `)
    .eq('id', subscriptionId)
    .single()

  if (error || !subscription) {
    return <InvalidTokenPage />
  }

  // Se já está unsubscribed
  if (subscription.status === 'unsubscribed') {
    return (
      <AlreadyUnsubscribedPage
        email={subscription.lead?.email || email}
        sequenceName={subscription.sequence?.name}
      />
    )
  }

  // Processar unsubscribe
  const { error: updateError } = await supabase
    .from('email_sequence_subscriptions')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('id', subscriptionId)

  if (updateError) {
    return <ErrorPage error={updateError.message} />
  }

  // Sucesso
  return (
    <SuccessPage
      email={subscription.lead?.email || email}
      sequenceName={subscription.sequence?.name}
    />
  )
}

function SuccessPage({
  email,
  sequenceName,
}: {
  email?: string
  sequenceName?: string
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Inscrição Cancelada
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Você foi removido da lista de emails
            {sequenceName && (
              <span className="block mt-1 font-medium text-gray-900">
                "{sequenceName}"
              </span>
            )}
          </p>

          {email && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Email removido:</p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              Você não receberá mais emails desta sequência. Emails importantes
              relacionados a serviços contratados continuarão sendo enviados.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
            >
              Voltar ao Site
            </Link>

            <Link
              href="/contato"
              className="block w-full text-gray-600 hover:text-gray-900 text-sm transition-colors"
            >
              Precisa de ajuda? Entre em contato
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Garcez Palha Advogados Associados
        </p>
      </div>
    </div>
  )
}

function AlreadyUnsubscribedPage({
  email,
  sequenceName,
}: {
  email?: string
  sequenceName?: string
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Info Icon */}
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Já Cancelado
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Este email já foi removido da lista
            {sequenceName && (
              <span className="block mt-1 font-medium text-gray-900">
                "{sequenceName}"
              </span>
            )}
          </p>

          {email && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-900">{email}</p>
            </div>
          )}

          {/* Actions */}
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
          >
            Voltar ao Site
          </Link>
        </div>
      </div>
    </div>
  )
}

function InvalidTokenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Link Inválido
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Este link de cancelamento não é válido ou expirou.
          </p>

          {/* Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              Se você deseja cancelar sua inscrição, use o link fornecido no email
              mais recente que você recebeu.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
            >
              Voltar ao Site
            </Link>

            <Link
              href="/contato"
              className="block w-full text-gray-600 hover:text-gray-900 text-sm transition-colors"
            >
              Precisa de ajuda? Entre em contato
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorPage({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro</h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Ocorreu um erro ao processar seu cancelamento.
          </p>

          {/* Error Details */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 font-mono">{error}</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="block w-full bg-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
            >
              Tentar Novamente
            </button>

            <Link
              href="/contato"
              className="block w-full text-gray-600 hover:text-gray-900 text-sm transition-colors"
            >
              Entrar em contato com suporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
