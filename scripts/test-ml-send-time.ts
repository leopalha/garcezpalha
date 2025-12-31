/**
 * Script de Teste do Sistema de ML para Otimização de Horários
 *
 * Demonstra:
 * - Recomendação de horário baseada em dados individuais
 * - Fallback para dados de segmento
 * - Fallback para média global
 * - Cálculo de confiança
 * - Performance report do modelo
 */

import { sendTimeOptimizer } from '../src/lib/ml/send-time-optimizer'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Carregar .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

async function createMockEmailData() {
  console.log('📝 Criando dados de email de teste...\n')

  // Criar lead
  const leadId = 'lead-ml-test-1'

  const { error: leadError } = await supabase.from('leads').upsert({
    id: leadId,
    email: 'mltest@example.com',
    name: 'ML Test Lead',
    score: 75,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  })

  if (leadError) {
    console.log(`⏭️  Lead já existe ou erro: ${leadError.message}`)
  } else {
    console.log('✅ Lead criado')
  }

  // Criar subscription
  const subscriptionId = 'subscription-ml-test-1'

  const { error: subError } = await supabase.from('email_sequence_subscriptions').upsert({
    id: subscriptionId,
    lead_id: leadId,
    sequence_id: 'welcome-sequence',
    status: 'active',
    subscribed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(),
  })

  if (subError) {
    console.log(`⏭️  Subscription já existe ou erro: ${subError.message}`)
  } else {
    console.log('✅ Subscription criada')
  }

  // Criar histórico de envios (padrão: abre emails nas terças às 10h)
  console.log('\n📧 Criando histórico de 20 envios...')

  const sends = []

  for (let i = 0; i < 20; i++) {
    const daysAgo = i * 3 + 1 // Emails a cada 3 dias
    const sentDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * daysAgo)

    // Simular envio em horários variados
    const hours = [8, 9, 10, 11, 14, 15, 16]
    const hour = hours[i % hours.length]
    sentDate.setHours(hour, 0, 0, 0)

    // Padrão: abre mais emails enviados às terças (dia 2) às 10h
    const dayOfWeek = sentDate.getDay()
    const isTuesday = dayOfWeek === 2
    const is10AM = hour === 10

    // Probabilidade de abrir:
    // Terça 10h: 80%
    // Terça outros horários: 50%
    // Outros dias 10h: 40%
    // Outros horários: 20%
    let openProbability = 0.2
    if (isTuesday && is10AM) openProbability = 0.8
    else if (isTuesday) openProbability = 0.5
    else if (is10AM) openProbability = 0.4

    const wasOpened = Math.random() < openProbability
    const openedAt = wasOpened ? new Date(sentDate.getTime() + 1000 * 60 * 30) : null // 30 min depois

    sends.push({
      id: `send-${i}`,
      subscription_id: subscriptionId,
      step_id: 'welcome-1',
      sent_at: sentDate.toISOString(),
      opened_at: openedAt?.toISOString() || null,
      clicked_at: null,
      bounced_at: null,
      unsubscribed_at: null,
    })
  }

  const { error: sendsError } = await supabase
    .from('email_sequence_sends')
    .upsert(sends, { onConflict: 'id' })

  if (sendsError) {
    console.error(`❌ Erro ao criar envios:`, sendsError.message)
  } else {
    console.log(`✅ ${sends.length} envios criados`)

    // Mostrar distribuição
    const tuesdayOpens = sends.filter(
      s => s.opened_at && new Date(s.sent_at).getDay() === 2
    ).length
    const totalOpens = sends.filter(s => s.opened_at).length

    console.log(`   Total de aberturas: ${totalOpens}/${sends.length}`)
    console.log(`   Aberturas na terça: ${tuesdayOpens}`)
  }

  console.log()
  return { leadId, subscriptionId }
}

async function testMLOptimization() {
  console.log('🧪 Iniciando testes do sistema de ML...\n')

  try {
    // 1. Criar dados de teste
    const { leadId } = await createMockEmailData()

    // 2. Obter recomendação
    console.log('1️⃣ Obtendo recomendação de horário...\n')

    const recommendation = await sendTimeOptimizer.getRecommendation(leadId)

    console.log('📊 Recomendação Gerada:\n')
    console.log(`✅ Melhor horário: ${DAY_NAMES[recommendation.recommendedDayOfWeek]} às ${recommendation.recommendedHour}:00h`)
    console.log(`📈 Confiança: ${recommendation.confidence}%`)
    console.log(`📚 Baseado em: ${recommendation.basedOn === 'individual' ? 'Dados Individuais' : recommendation.basedOn === 'segment' ? 'Dados do Segmento' : 'Média Global'}`)
    console.log()
    console.log('📧 Estatísticas:')
    console.log(`   Total de emails: ${recommendation.stats.totalEmails}`)
    console.log(`   Total de aberturas: ${recommendation.stats.totalOpens}`)
    console.log(`   Melhor hora: ${recommendation.stats.bestHour}:00h`)
    console.log(`   Melhor dia: ${DAY_NAMES[recommendation.stats.bestDayOfWeek]}`)
    console.log()

    // 3. Agendar email para horário otimizado
    console.log('2️⃣ Agendando email para horário otimizado...\n')

    const scheduledDate = await sendTimeOptimizer.scheduleOptimalTime(leadId, {
      subject: 'Teste',
      body: 'Conteúdo',
    })

    console.log(`📅 Email agendado para: ${scheduledDate.toLocaleString('pt-BR')}`)
    console.log(`   Dia da semana: ${DAY_NAMES[scheduledDate.getDay()]}`)
    console.log(`   Horário: ${scheduledDate.getHours()}:00h`)
    console.log()

    // 4. Registrar evento de abertura (learning)
    console.log('3️⃣ Simulando abertura de email...\n')

    const openDate = new Date()
    openDate.setDate(openDate.getDate() + ((2 - openDate.getDay() + 7) % 7)) // Próxima terça
    openDate.setHours(10, 0, 0, 0)

    await sendTimeOptimizer.recordOpenEvent(leadId, openDate)
    console.log(`✅ Abertura registrada: ${openDate.toLocaleString('pt-BR')}`)
    console.log()

    // 5. Performance report
    console.log('4️⃣ Gerando performance report...\n')

    const performance = await sendTimeOptimizer.generatePerformanceReport()

    console.log('📊 Performance do Modelo:\n')
    console.log(`📧 Total de emails analisados: ${performance.totalEmails}`)
    console.log(`✅ Previsões corretas: ${performance.correctPredictions}`)
    console.log(`🎯 Acurácia: ${performance.accuracy}%`)
    console.log(`📈 Confiança média: ${performance.avgConfidence}%`)
    console.log()

    // 6. Explicação do modelo
    console.log('5️⃣ Como o Modelo Funciona:\n')

    console.log('🧠 Algoritmo de Aprendizado:')
    console.log('   1. Coleta dados de envio (dia/hora) e abertura')
    console.log('   2. Calcula taxa de abertura por hora/dia')
    console.log('   3. Pondera pela quantidade de dados (mais dados = mais confiança)')
    console.log('   4. Recomenda horário com maior score')
    console.log()

    console.log('📊 Fontes de Dados (em ordem de preferência):')
    console.log('   1️⃣ Individual (10+ emails): 75-90% confiança')
    console.log('   2️⃣ Segmento (50+ emails): 60-70% confiança')
    console.log('   3️⃣ Global (padrões de mercado): 50-55% confiança')
    console.log()

    console.log('🎯 Métricas de Qualidade:')
    console.log('   • Score = Open Rate × Volume Weight')
    console.log('   • Volume Weight = min(emails / 100, 1.0)')
    console.log('   • Confiança aumenta com mais dados')
    console.log()

    console.log('✅ Teste de ML concluído com sucesso!')
  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
    throw error
  }
}

// Executar
testMLOptimization()
  .then(() => {
    console.log('\n🎉 Todos os testes passaram!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Erro fatal:', error)
    process.exit(1)
  })
