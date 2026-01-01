/**
 * Auto-Segmentation Engine
 *
 * Segmenta leads automaticamente baseado em:
 * - Comportamento (opens, clicks, conversions)
 * - Demografia (localização, produto de interesse)
 * - Engajamento (score, tempo desde último contato)
 * - Fit (qualificação, potencial de conversão)
 */

import { createClient } from '@/lib/supabase/client'

export interface Segment {
  id: string
  name: string
  description: string
  criteria: SegmentCriteria
  color: string
  priority: number
  emailSequence?: string
}

export interface SegmentCriteria {
  scoreMin?: number
  scoreMax?: number
  daysSinceSignup?: { min?: number; max?: number }
  daysSinceLastContact?: { min?: number; max?: number }
  openRate?: { min?: number; max?: number }
  clickRate?: { min?: number; max?: number }
  hasConverted?: boolean
  productInterest?: string[]
  location?: string[]
  tags?: string[]
}

export interface LeadSegment {
  leadId: string
  segmentId: string
  assignedAt: Date
  autoAssigned: boolean
}

// Segmentos pré-definidos
export const DEFAULT_SEGMENTS: Segment[] = [
  {
    id: 'hot-leads',
    name: 'Hot Leads',
    description: 'Leads altamente engajados com score 80+',
    criteria: {
      scoreMin: 80,
      openRate: { min: 60 },
      daysSinceLastContact: { max: 3 },
    },
    color: '#ef4444',
    priority: 1,
    emailSequence: 'upsell-sequence',
  },
  {
    id: 'warm-leads',
    name: 'Warm Leads',
    description: 'Leads engajados com score 50-79',
    criteria: {
      scoreMin: 50,
      scoreMax: 79,
      openRate: { min: 30 },
      daysSinceLastContact: { max: 7 },
    },
    color: '#f59e0b',
    priority: 2,
    emailSequence: 'welcome-sequence',
  },
  {
    id: 'cold-leads',
    name: 'Cold Leads',
    description: 'Leads com baixo engajamento (score < 50)',
    criteria: {
      scoreMax: 49,
      openRate: { max: 20 },
    },
    color: '#3b82f6',
    priority: 3,
    emailSequence: 'nurture-sequence',
  },
  {
    id: 'dormant-leads',
    name: 'Dormant Leads',
    description: 'Leads inativos há 30+ dias',
    criteria: {
      daysSinceLastContact: { min: 30 },
      hasConverted: false,
    },
    color: '#6b7280',
    priority: 4,
    emailSequence: 'reengagement-sequence',
  },
  {
    id: 'high-intent',
    name: 'High Intent',
    description: 'Leads com múltiplos cliques e visitas recentes',
    criteria: {
      clickRate: { min: 15 },
      daysSinceLastContact: { max: 2 },
      hasConverted: false,
    },
    color: '#8b5cf6',
    priority: 1,
    emailSequence: 'upsell-sequence',
  },
  {
    id: 'converted',
    name: 'Converted Customers',
    description: 'Leads que já converteram',
    criteria: {
      hasConverted: true,
    },
    color: '#10b981',
    priority: 5,
  },
  {
    id: 'at-risk',
    name: 'At Risk',
    description: 'Clientes que pararam de engajar',
    criteria: {
      hasConverted: true,
      daysSinceLastContact: { min: 14 },
      openRate: { max: 10 },
    },
    color: '#dc2626',
    priority: 1,
    emailSequence: 'reengagement-sequence',
  },
  {
    id: 'new-signups',
    name: 'New Signups',
    description: 'Leads cadastrados nos últimos 7 dias',
    criteria: {
      daysSinceSignup: { max: 7 },
    },
    color: '#06b6d4',
    priority: 2,
    emailSequence: 'welcome-sequence',
  },
]

export class AutoSegmenter {
  private supabase = createClient()

  /**
   * Segmenta um lead baseado em seus dados e comportamento
   */
  async segmentLead(leadId: string): Promise<string[]> {
    const lead = await this.getLeadWithStats(leadId)
    if (!lead) {
      throw new Error('Lead not found')
    }

    const matchedSegments: string[] = []

    for (const segment of DEFAULT_SEGMENTS) {
      if (this.matchesCriteria(lead, segment.criteria)) {
        matchedSegments.push(segment.id)

        // Salvar segmentação
        await this.assignSegment(leadId, segment.id, true)

        // Auto-subscrever em sequência se aplicável
        if (segment.emailSequence) {
          await this.autoSubscribeToSequence(leadId, segment.emailSequence)
        }
      }
    }

    console.log(`[AutoSegmenter] Lead ${leadId} matched ${matchedSegments.length} segments:`, matchedSegments)

    return matchedSegments
  }

  /**
   * Re-segmenta todos os leads (rodar via cron diariamente)
   */
  async segmentAllLeads(): Promise<{ total: number; segmented: number }> {
    const { data: leads, error } = await this.supabase
      .from('leads')
      .select('id')
      .eq('status', 'active')

    if (error) throw error

    let segmented = 0

    for (const lead of leads || []) {
      try {
        await this.segmentLead(lead.id)
        segmented++
      } catch (error) {
        console.error(`[AutoSegmenter] Error segmenting lead ${lead.id}:`, error)
      }
    }

    console.log(`[AutoSegmenter] Segmented ${segmented}/${leads?.length || 0} leads`)

    return {
      total: leads?.length || 0,
      segmented,
    }
  }

  /**
   * Verifica se lead corresponde aos critérios de um segmento
   */
  private matchesCriteria(lead: any, criteria: SegmentCriteria): boolean {
    // Score
    if (criteria.scoreMin !== undefined && lead.score < criteria.scoreMin) {
      return false
    }
    if (criteria.scoreMax !== undefined && lead.score > criteria.scoreMax) {
      return false
    }

    // Days since signup
    if (criteria.daysSinceSignup) {
      const daysSince = this.daysSince(lead.created_at)
      if (criteria.daysSinceSignup.min !== undefined && daysSince < criteria.daysSinceSignup.min) {
        return false
      }
      if (criteria.daysSinceSignup.max !== undefined && daysSince > criteria.daysSinceSignup.max) {
        return false
      }
    }

    // Days since last contact
    if (criteria.daysSinceLastContact) {
      const daysSince = this.daysSince(lead.last_contact_at)
      if (
        criteria.daysSinceLastContact.min !== undefined &&
        daysSince < criteria.daysSinceLastContact.min
      ) {
        return false
      }
      if (
        criteria.daysSinceLastContact.max !== undefined &&
        daysSince > criteria.daysSinceLastContact.max
      ) {
        return false
      }
    }

    // Open rate
    if (criteria.openRate) {
      const openRate = lead.stats?.openRate || 0
      if (criteria.openRate.min !== undefined && openRate < criteria.openRate.min) {
        return false
      }
      if (criteria.openRate.max !== undefined && openRate > criteria.openRate.max) {
        return false
      }
    }

    // Click rate
    if (criteria.clickRate) {
      const clickRate = lead.stats?.clickRate || 0
      if (criteria.clickRate.min !== undefined && clickRate < criteria.clickRate.min) {
        return false
      }
      if (criteria.clickRate.max !== undefined && clickRate > criteria.clickRate.max) {
        return false
      }
    }

    // Has converted
    if (criteria.hasConverted !== undefined && lead.has_converted !== criteria.hasConverted) {
      return false
    }

    // Product interest
    if (criteria.productInterest && criteria.productInterest.length > 0) {
      if (!criteria.productInterest.includes(lead.product_interest)) {
        return false
      }
    }

    // Location
    if (criteria.location && criteria.location.length > 0) {
      if (!criteria.location.includes(lead.location)) {
        return false
      }
    }

    // Tags
    if (criteria.tags && criteria.tags.length > 0) {
      const leadTags = lead.tags || []
      const hasAnyTag = criteria.tags.some((tag) => leadTags.includes(tag))
      if (!hasAnyTag) {
        return false
      }
    }

    return true
  }

  /**
   * Busca lead com estatísticas calculadas
   */
  private async getLeadWithStats(leadId: string): Promise<any> {
    const { data: lead, error } = await this.supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (error || !lead) return null

    // Calcular estatísticas de email
    const { data: sends } = await this.supabase
      .from('email_sequence_sends')
      .select('opened_at, clicked_at')
      .eq('subscription_id', leadId) // TODO: Join correto via subscriptions

    const totalSent = sends?.length || 0
    const totalOpened = sends?.filter((s) => s.opened_at).length || 0
    const totalClicked = sends?.filter((s) => s.clicked_at).length || 0

    return {
      ...lead,
      stats: {
        openRate: totalSent > 0 ? (totalOpened / totalSent) * 100 : 0,
        clickRate: totalSent > 0 ? (totalClicked / totalSent) * 100 : 0,
      },
    }
  }

  /**
   * Atribui lead a um segmento
   */
  private async assignSegment(
    leadId: string,
    segmentId: string,
    autoAssigned: boolean
  ): Promise<void> {
    // Verificar se já está no segmento
    const { data: existing } = await this.supabase
      .from('lead_segments')
      .select('id')
      .eq('lead_id', leadId)
      .eq('segment_id', segmentId)
      .single()

    if (existing) {
      return // Já está neste segmento
    }

    // Criar atribuição
    const { error } = await this.supabase.from('lead_segments').insert({
      lead_id: leadId,
      segment_id: segmentId,
      auto_assigned: autoAssigned,
      assigned_at: new Date().toISOString(),
    })

    if (error) {
      console.error('[AutoSegmenter] Error assigning segment:', error)
    }
  }

  /**
   * Subscreve lead em sequência automaticamente
   */
  private async autoSubscribeToSequence(leadId: string, sequenceId: string): Promise<void> {
    // Verificar se já está subscrito
    const { data: existing } = await this.supabase
      .from('email_sequence_subscriptions')
      .select('id')
      .eq('lead_id', leadId)
      .eq('sequence_id', sequenceId)
      .single()

    if (existing) {
      return // Já está subscrito
    }

    // Subscrever
    const { error } = await this.supabase.from('email_sequence_subscriptions').insert({
      lead_id: leadId,
      sequence_id: sequenceId,
      status: 'active',
      subscribed_at: new Date().toISOString(),
    })

    if (error) {
      console.error('[AutoSegmenter] Error subscribing to sequence:', error)
    } else {
      console.log(`[AutoSegmenter] Lead ${leadId} auto-subscribed to ${sequenceId}`)
    }
  }

  /**
   * Calcula dias desde uma data
   */
  private daysSince(date: string | null): number {
    if (!date) return 999999 // Muito tempo atrás
    const diff = Date.now() - new Date(date).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  /**
   * Busca segmentos de um lead
   */
  async getLeadSegments(leadId: string): Promise<Segment[]> {
    const { data, error } = await this.supabase
      .from('lead_segments')
      .select('segment_id')
      .eq('lead_id', leadId)

    if (error) throw error

    const segmentIds = data?.map((d) => d.segment_id) || []
    return DEFAULT_SEGMENTS.filter((s) => segmentIds.includes(s.id))
  }

  /**
   * Busca leads em um segmento específico
   */
  async getSegmentLeads(segmentId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('lead_segments')
      .select('lead_id')
      .eq('segment_id', segmentId)

    if (error) throw error

    return data?.map((d) => d.lead_id) || []
  }
}

export const autoSegmenter = new AutoSegmenter()
