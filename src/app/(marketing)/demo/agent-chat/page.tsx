'use client'

/**
 * Demo Page - Agent Flow Chat Widget
 * Demonstração do novo widget integrado ao agent-flow API
 */

import { AgentFlowChatWidget } from '@/components/chat'
import { Card } from '@/components/ui/card'

export default function AgentChatDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Agent Flow Chat Widget
          </h1>
          <p className="text-lg text-slate-600">
            Demonstração do widget integrado ao{' '}
            <code className="px-2 py-1 bg-slate-200 rounded text-sm">
              /api/chat/agent-flow
            </code>
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              State Machine
            </h3>
            <p className="text-sm text-slate-600">
              17 estados de conversação gerenciados automaticamente:
              greeting → identifying → classifying → qualifying → qualified
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Qualificação em Tempo Real
            </h3>
            <p className="text-sm text-slate-600">
              Barra de progresso mostrando perguntas respondidas, score e flags de
              qualificação
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="text-2xl">💾</span>
              Persistência Automática
            </h3>
            <p className="text-sm text-slate-600">
              Todas as conversas são salvas no Supabase com histórico completo de
              estados e transições
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="text-2xl">🚨</span>
              Escalação Inteligente
            </h3>
            <p className="text-sm text-slate-600">
              Casos complexos, alto valor ou clientes insatisfeitos são
              automaticamente escalados para humanos
            </p>
          </Card>
        </div>

        {/* States Reference */}
        <Card className="p-6 mb-12">
          <h3 className="font-semibold text-lg mb-4">Estados do Fluxo</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Greeting</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Identifying</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              <span>Classifying</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full" />
              <span>Qualifying</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Qualified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              <span>Rejected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
              <span>Proposing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              <span>Escalated</span>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-lg mb-3">Como Testar</h3>
          <ol className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="font-semibold">1.</span>
              <span>
                Clique no botão flutuante de chat no canto inferior direito
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">2.</span>
              <span>
                Digite uma mensagem como "Minha conta foi bloqueada" ou "Sofri um
                golpe PIX"
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">3.</span>
              <span>
                Observe o estado mudar de greeting → identifying → classifying →
                qualifying
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">4.</span>
              <span>
                Responda as perguntas de qualificação e veja o score aumentar
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">5.</span>
              <span>
                Ao final, você receberá uma proposta personalizada ou será escalado
                para um especialista
              </span>
            </li>
          </ol>
        </Card>
      </div>

      {/* Chat Widget */}
      <AgentFlowChatWidget
        productId="desbloqueio-conta"
        productName="Desbloqueio de Conta Bancária"
        autoOpen={false}
        channel="website"
        onConversationStart={(conversationId) => {
          console.log('[Demo] Conversation started:', conversationId)
        }}
        onQualificationComplete={(data) => {
          console.log('[Demo] Qualification complete:', data)
        }}
      />
    </div>
  )
}
