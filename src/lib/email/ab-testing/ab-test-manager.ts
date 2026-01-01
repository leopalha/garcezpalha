/**
 * A/B Test Manager
 *
 * Gerencia testes A/B de subject lines e conteúdo
 * Calcula significância estatística e declara vencedores
 */

import { createClient } from '@supabase/supabase-js'
import type { ABTest, ABTestVariant, ABTestAssignment, ABTestResult } from './types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export class ABTestManager {
  /**
   * Cria um novo teste A/B
   */
  async createTest(test: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ABTest> {
    // Validar que soma dos splits = 100
    const totalSplit = test.config.trafficSplit.reduce((a, b) => a + b, 0)
    if (totalSplit !== 100) {
      throw new Error('Traffic split must sum to 100')
    }

    // Validar que tem pelo menos 2 variantes
    if (test.variants.length < 2) {
      throw new Error('AB test must have at least 2 variants')
    }

    const { data, error } = await supabase
      .from('ab_tests')
      .insert({
        ...test,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return this.mapToABTest(data)
  }

  /**
   * Atribui uma variante para um lead
   * Usa weighted random baseado no traffic split
   */
  async assignVariant(testId: string, leadId: string): Promise<ABTestVariant> {
    // Buscar teste
    const test = await this.getTest(testId)
    if (!test) throw new Error('AB Test not found')

    // Verificar se lead já foi atribuído
    const { data: existing } = await supabase
      .from('ab_test_assignments')
      .select('*')
      .eq('test_id', testId)
      .eq('lead_id', leadId)
      .single()

    if (existing) {
      // Já foi atribuído, retornar variante existente
      return test.variants.find(v => v.id === existing.variant_id)!
    }

    // Selecionar variante baseado em weighted random
    const variant = this.selectVariantWeighted(test.variants, test.config.trafficSplit)

    // Salvar atribuição
    await supabase.from('ab_test_assignments').insert({
      test_id: testId,
      variant_id: variant.id,
      lead_id: leadId,
      assigned_at: new Date().toISOString(),
    })

    console.log(`[ABTest] Lead ${leadId} assigned to variant ${variant.name}`)

    return variant
  }

  /**
   * Registra evento (delivered, opened, clicked, converted)
   */
  async trackEvent(
    testId: string,
    leadId: string,
    event: 'delivered' | 'opened' | 'clicked' | 'converted'
  ): Promise<void> {
    const { data, error } = await supabase
      .from('ab_test_assignments')
      .update({
        [`events.${event}`]: new Date().toISOString(),
      })
      .eq('test_id', testId)
      .eq('lead_id', leadId)

    if (error) {
      console.error('[ABTest] Error tracking event:', error)
      throw error
    }

    console.log(`[ABTest] Event ${event} tracked for lead ${leadId}`)

    // Atualizar estatísticas da variante
    await this.updateVariantStats(testId)

    // Verificar se teste atingiu tamanho mínimo de amostra
    await this.checkTestCompletion(testId)
  }

  /**
   * Calcula estatísticas de cada variante
   */
  private async updateVariantStats(testId: string): Promise<void> {
    const { data: assignments } = await supabase
      .from('ab_test_assignments')
      .select('*')
      .eq('test_id', testId)

    if (!assignments) return

    // Agrupar por variante
    const variantStats = new Map<string, any>()

    assignments.forEach(assignment => {
      const variantId = assignment.variant_id
      if (!variantStats.has(variantId)) {
        variantStats.set(variantId, {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
        })
      }

      const stats = variantStats.get(variantId)
      stats.sent++
      if (assignment.events?.delivered) stats.delivered++
      if (assignment.events?.opened) stats.opened++
      if (assignment.events?.clicked) stats.clicked++
      if (assignment.events?.converted) stats.converted++
    })

    // Atualizar cada variante
    for (const [variantId, stats] of variantStats.entries()) {
      const openRate = stats.delivered > 0 ? (stats.opened / stats.delivered) * 100 : 0
      const clickRate = stats.delivered > 0 ? (stats.clicked / stats.delivered) * 100 : 0
      const conversionRate = stats.delivered > 0 ? (stats.converted / stats.delivered) * 100 : 0

      await supabase
        .from('ab_test_variants')
        .update({
          stats: {
            ...stats,
            openRate,
            clickRate,
            conversionRate,
          },
        })
        .eq('id', variantId)
    }
  }

  /**
   * Verifica se teste atingiu tamanho mínimo e calcula vencedor
   */
  private async checkTestCompletion(testId: string): Promise<void> {
    const test = await this.getTest(testId)
    if (!test || test.status !== 'running') return

    // Verificar se todas as variantes atingiram min sample size
    const allReachedMinSize = test.variants.every(
      v => v.stats.sent >= test.config.minSampleSize
    )

    if (!allReachedMinSize) return

    // Calcular significância estatística
    const result = this.calculateStatisticalSignificance(test)

    // Se temos um vencedor com confiança suficiente
    if (result.confidence >= test.config.confidenceLevel) {
      await supabase
        .from('ab_tests')
        .update({
          status: 'completed',
          results: {
            winner: result.winner.id,
            confidence: result.confidence,
            conclusionDate: new Date().toISOString(),
          },
        })
        .eq('id', testId)

      console.log(`[ABTest] Test ${testId} completed. Winner: ${result.winner.name}`)
      console.log(`[ABTest] Improvement: ${result.improvement.openRate.toFixed(2)}% open rate`)
    }
  }

  /**
   * Calcula significância estatística usando Z-test
   */
  private calculateStatisticalSignificance(test: ABTest): ABTestResult {
    // Ordenar variantes por conversion rate
    const sorted = [...test.variants].sort(
      (a, b) => b.stats.conversionRate - a.stats.conversionRate
    )

    const winner = sorted[0]
    const loser = sorted[1]

    // Z-test para proporções
    const p1 = winner.stats.conversionRate / 100
    const p2 = loser.stats.conversionRate / 100
    const n1 = winner.stats.sent
    const n2 = loser.stats.sent

    const pPool = (p1 * n1 + p2 * n2) / (n1 + n2)
    const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2))
    const z = (p1 - p2) / se

    // P-value (two-tailed)
    const pValue = 2 * (1 - this.normalCDF(Math.abs(z)))

    // Confidence = 1 - p-value
    const confidence = 1 - pValue

    return {
      testId: test.id,
      winner,
      loser,
      improvement: {
        openRate: ((winner.stats.openRate - loser.stats.openRate) / loser.stats.openRate) * 100,
        clickRate:
          ((winner.stats.clickRate - loser.stats.clickRate) / loser.stats.clickRate) * 100,
        conversionRate:
          ((winner.stats.conversionRate - loser.stats.conversionRate) /
            loser.stats.conversionRate) *
          100,
      },
      confidence,
      pValue,
      recommendation: this.generateRecommendation(winner, loser, confidence),
    }
  }

  /**
   * Cumulative Distribution Function (CDF) da distribuição normal
   */
  private normalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x))
    const d = 0.3989423 * Math.exp((-x * x) / 2)
    const prob =
      d *
      t *
      (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    return x > 0 ? 1 - prob : prob
  }

  /**
   * Seleciona variante baseado em weighted random
   */
  private selectVariantWeighted(
    variants: ABTestVariant[],
    weights: number[]
  ): ABTestVariant {
    const random = Math.random() * 100
    let cumulative = 0

    for (let i = 0; i < variants.length; i++) {
      cumulative += weights[i]
      if (random <= cumulative) {
        return variants[i]
      }
    }

    return variants[0] // Fallback
  }

  private generateRecommendation(
    winner: ABTestVariant,
    loser: ABTestVariant,
    confidence: number
  ): string {
    if (confidence >= 0.95) {
      return `Use "${winner.subject}" permanently. It has ${((winner.stats.conversionRate - loser.stats.conversionRate) / loser.stats.conversionRate * 100).toFixed(1)}% better conversion with 95%+ confidence.`
    } else if (confidence >= 0.80) {
      return `"${winner.subject}" is likely better, but continue testing to reach 95% confidence.`
    } else {
      return `No clear winner yet. Continue testing or try different variants.`
    }
  }

  private async getTest(id: string): Promise<ABTest | null> {
    const { data, error } = await supabase
      .from('ab_tests')
      .select('*, variants:ab_test_variants(*)')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return this.mapToABTest(data)
  }

  private mapToABTest(data: any): ABTest {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      sequenceId: data.sequence_id,
      stepId: data.step_id,
      status: data.status,
      variants: data.variants || [],
      config: data.config,
      results: data.results,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }
}

export const abTestManager = new ABTestManager()
