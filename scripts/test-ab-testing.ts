/**
 * Script de Teste do Sistema de A/B Testing
 *
 * Demonstra:
 * - Criação de teste A/B
 * - Atribuição de variantes a leads
 * - Tracking de eventos
 * - Cálculo de significância estatística
 * - Declaração de vencedor
 */

import 'dotenv/config'
import { abTestManager } from '../src/lib/email/ab-testing/ab-test-manager'

async function testABSystem() {
  console.log('🧪 Iniciando testes do sistema de A/B Testing...\n')

  try {
    // 1. Criar teste A/B
    console.log('1️⃣ Criando teste A/B...')
    const test = await abTestManager.createTest({
      name: 'Teste Subject Line - Welcome Email',
      description: 'Testar qual subject line tem melhor open rate',
      sequenceId: 'welcome-sequence',
      stepId: 'welcome-1',
      status: 'running',
      variants: [
        {
          id: 'control',
          name: 'Control',
          subject: '{{firstName}}, bem-vindo à Garcez Palha!',
          stats: {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            converted: 0,
            openRate: 0,
            clickRate: 0,
            conversionRate: 0,
          },
        },
        {
          id: 'variant-a',
          name: 'Variant A',
          subject: '{{firstName}}, você tem direitos que nem imagina!',
          stats: {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            converted: 0,
            openRate: 0,
            clickRate: 0,
            conversionRate: 0,
          },
        },
      ],
      config: {
        trafficSplit: [50, 50],
        startDate: new Date(),
        minSampleSize: 100,
        confidenceLevel: 0.95,
      },
    })

    console.log(`✅ Teste criado: ${test.id}`)
    console.log(`   Variantes: ${test.variants.map(v => v.name).join(', ')}`)
    console.log(`   Traffic split: ${test.config.trafficSplit.join('/')}\n`)

    // 2. Simular atribuições de variantes
    console.log('2️⃣ Simulando atribuições de variantes...')

    const leadIds = Array.from({ length: 200 }, (_, i) => `lead-${i + 1}`)
    const assignments: { leadId: string; variantId: string }[] = []

    for (const leadId of leadIds) {
      const variant = await abTestManager.assignVariant(test.id, leadId)
      assignments.push({ leadId, variantId: variant.id })
    }

    const controlCount = assignments.filter(a => a.variantId === 'control').length
    const variantACount = assignments.filter(a => a.variantId === 'variant-a').length

    console.log(`✅ ${leadIds.length} leads atribuídos:`)
    console.log(`   Control: ${controlCount} (${((controlCount / leadIds.length) * 100).toFixed(1)}%)`)
    console.log(`   Variant A: ${variantACount} (${((variantACount / leadIds.length) * 100).toFixed(1)}%)\n`)

    // 3. Simular eventos (Variant A performa melhor)
    console.log('3️⃣ Simulando eventos de email...')

    for (const assignment of assignments) {
      // Todos recebem
      await abTestManager.trackEvent(test.id, assignment.leadId, 'delivered')

      // Control: 35% open rate
      // Variant A: 45% open rate (melhor!)
      const isControl = assignment.variantId === 'control'
      const openRate = isControl ? 0.35 : 0.45
      const clickRate = isControl ? 0.10 : 0.15
      const conversionRate = isControl ? 0.05 : 0.08

      if (Math.random() < openRate) {
        await abTestManager.trackEvent(test.id, assignment.leadId, 'opened')

        if (Math.random() < clickRate / openRate) {
          await abTestManager.trackEvent(test.id, assignment.leadId, 'clicked')

          if (Math.random() < conversionRate / clickRate) {
            await abTestManager.trackEvent(test.id, assignment.leadId, 'converted')
          }
        }
      }
    }

    console.log('✅ Eventos simulados\n')

    // 4. Verificar estatísticas
    console.log('4️⃣ Verificando estatísticas finais...')

    // @ts-expect-error - getTest é privado, mas necessário para teste
    const updatedTest = await abTestManager.getTest(test.id)

    if (!updatedTest) {
      throw new Error('Teste não encontrado')
    }

    console.log('\n📊 Resultados do Teste:\n')

    updatedTest.variants.forEach(variant => {
      console.log(`${variant.name}:`)
      console.log(`  Subject: "${variant.subject}"`)
      console.log(`  Enviados: ${variant.stats.sent}`)
      console.log(`  Open Rate: ${variant.stats.openRate.toFixed(2)}%`)
      console.log(`  Click Rate: ${variant.stats.clickRate.toFixed(2)}%`)
      console.log(`  Conversion Rate: ${variant.stats.conversionRate.toFixed(2)}%`)
      console.log()
    })

    // 5. Verificar vencedor
    if (updatedTest.results?.winner) {
      const winner = updatedTest.variants.find(v => v.id === updatedTest.results?.winner)
      const loser = updatedTest.variants.find(v => v.id !== updatedTest.results?.winner)

      console.log('🏆 VENCEDOR DECLARADO!\n')
      console.log(`✅ Vencedor: ${winner?.name}`)
      console.log(`   Subject: "${winner?.subject}"`)
      console.log(`   Confiança: ${((updatedTest.results.confidence || 0) * 100).toFixed(2)}%`)
      console.log()
      console.log(`📈 Melhorias vs Control:`)
      // @ts-expect-error - improvement property will be added in future implementation
      console.log(`   Open Rate: +${updatedTest.results.improvement?.openRate.toFixed(2)}%`)
      // @ts-expect-error - improvement property will be added in future implementation
      console.log(`   Click Rate: +${updatedTest.results.improvement?.clickRate.toFixed(2)}%`)
      // @ts-expect-error - improvement property will be added in future implementation
      console.log(`   Conversion: +${updatedTest.results.improvement?.conversionRate.toFixed(2)}%`)
      console.log()
      console.log(`💡 Recomendação:`)
      // @ts-expect-error - recommendation property will be added in future implementation
      console.log(`   ${updatedTest.results.recommendation || 'Continue testando'}`)
    } else {
      console.log('⏳ Ainda não há vencedor declarado')
      console.log('   Continue testando para atingir significância estatística')
    }

    console.log('\n✅ Teste de A/B Testing concluído com sucesso!')
  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
    throw error
  }
}

// Executar
testABSystem()
  .then(() => {
    console.log('\n🎉 Todos os testes passaram!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Erro fatal:', error)
    process.exit(1)
  })
