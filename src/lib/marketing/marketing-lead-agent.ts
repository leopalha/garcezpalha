/**
 * Marketing Lead Agent
 *
 * Orchestrates lead evaluation and scoring
 * Integrates user tracking + lead scoring + automated actions
 */

import { LeadScorer, LeadData, LeadScore } from './lead-scorer'
import { UserSession } from './user-tracker'
import { createClient } from '@/lib/supabase/server'

export interface EvaluatedLead {
  leadId: string
  score: LeadScore
  userSession?: UserSession
  createdAt: string
  nextAction: {
    type: 'call' | 'email' | 'whatsapp' | 'nurture'
    priority: 'immediate' | 'today' | 'this_week' | 'this_month'
    message: string
  }
}

export class MarketingLeadAgent {
  /**
   * Evaluate a new lead
   */
  public static async evaluateLead(leadData: LeadData): Promise<EvaluatedLead> {
    // Calculate score
    const score = LeadScorer.calculateScore(leadData)

    // Determine next action
    const nextAction = this.determineNextAction(score, leadData)

    // Store evaluation (if lead ID provided)
    let leadId = leadData.metadata?.leadId

    if (!leadId) {
      // Create lead in database first
      leadId = await this.createLead(leadData)
    }

    // Store score in database
    await this.storeLeadScore(leadId, score, leadData.userSession)

    // Trigger automated actions based on score
    await this.triggerAutomatedActions(leadId, score, nextAction)

    return {
      leadId,
      score,
      userSession: leadData.userSession,
      createdAt: new Date().toISOString(),
      nextAction,
    }
  }

  /**
   * Create lead in database
   */
  private static async createLead(leadData: LeadData): Promise<string> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('leads')
      .insert({
        full_name: leadData.fullName,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        service_interest: leadData.serviceInterest,
        message: leadData.message,
        source: leadData.source,
        status: 'new',
        metadata: leadData.metadata,
      })
      .select('id')
      .single()

    if (error) {
      throw new Error(`Failed to create lead: ${error.message}`)
    }

    return data.id
  }

  /**
   * Store lead score in database
   */
  private static async storeLeadScore(
    leadId: string,
    score: LeadScore,
    userSession?: UserSession
  ): Promise<void> {
    const supabase = await createClient()

    // Update lead with score
    await supabase
      .from('leads')
      .update({
        lead_score: score.total,
        qualification_status: score.classification === 'hot' ? 'qualified' : 'pending',
        metadata: {
          score_breakdown: score.breakdown,
          classification: score.classification,
          priority: score.priority,
          reasons: score.reasons,
          recommendations: score.recommendations,
          user_session: userSession ? {
            sessionId: userSession.sessionId,
            events_count: userSession.events.length,
            duration_seconds: (userSession.lastActivity - userSession.startTime) / 1000,
          } : undefined,
        },
      })
      .eq('id', leadId)

    // Create agent decision log
    await supabase
      .from('agent_decisions')
      .insert({
        agent_id: 'marketing-lead-agent',
        decision_type: 'lead_scoring',
        input_data: {
          leadId,
          hasUserSession: !!userSession,
        },
        output_data: {
          score: score.total,
          classification: score.classification,
          priority: score.priority,
        },
        confidence_score: this.calculateConfidence(score, userSession),
        lead_id: leadId,
      })
  }

  /**
   * Determine next action based on score
   */
  private static determineNextAction(
    score: LeadScore,
    leadData: LeadData
  ): EvaluatedLead['nextAction'] {
    const { classification, total } = score

    // Hot leads (70-100)
    if (classification === 'hot') {
      return {
        type: 'call',
        priority: 'immediate',
        message: `Lead quente com score ${total}. Contato IMEDIATO recomendado (dentro de 1 hora). ${score.reasons.join('. ')}.`,
      }
    }

    // Warm leads with phone (40-69)
    if (classification === 'warm' && leadData.phone) {
      return {
        type: 'call',
        priority: 'today',
        message: `Lead morno com score ${total}. Contato via telefone recomendado hoje. ${score.reasons.join('. ')}.`,
      }
    }

    // Warm leads without phone (40-69)
    if (classification === 'warm') {
      return {
        type: 'email',
        priority: 'today',
        message: `Lead morno com score ${total}. Enviar email personalizado hoje. ${score.reasons.join('. ')}.`,
      }
    }

    // Cold leads (0-39)
    return {
      type: 'nurture',
      priority: 'this_month',
      message: `Lead frio com score ${total}. Incluir em sequência de nurturing. ${score.reasons.join('. ')}.`,
    }
  }

  /**
   * Trigger automated actions
   */
  private static async triggerAutomatedActions(
    leadId: string,
    score: LeadScore,
    nextAction: EvaluatedLead['nextAction']
  ): Promise<void> {
    const supabase = await createClient()

    // Create follow-up task for sales team
    await supabase
      .from('follow_up_tasks')
      .insert({
        lead_id: leadId,
        task_type: nextAction.type === 'call' ? 'call' : 'email',
        description: nextAction.message,
        due_date: this.calculateDueDate(nextAction.priority),
        status: 'pending',
        priority: score.priority,
      })

    // Create agent alert for hot leads
    if (score.classification === 'hot') {
      await supabase
        .from('agent_alerts')
        .insert({
          agent_id: 'marketing-lead-agent',
          alert_type: 'escalation_needed',
          severity: 'high',
          message: `Novo lead quente (score ${score.total}): contato imediato necessário!`,
          context: {
            leadId,
            score: score.total,
            classification: score.classification,
            reasons: score.reasons,
          },
          lead_id: leadId,
        })
    }

    // Log agent metric
    await supabase
      .from('agent_metrics')
      .insert({
        agent_id: 'marketing-lead-agent',
        metric_type: 'lead_scoring',
        value: {
          score: score.total,
          classification: score.classification,
          priority: score.priority,
        },
        lead_id: leadId,
      })
  }

  /**
   * Calculate confidence score for decision
   */
  private static calculateConfidence(score: LeadScore, userSession?: UserSession): number {
    let confidence = 0.5 // Base confidence

    // Increase confidence if we have user session data
    if (userSession && userSession.events.length > 0) {
      confidence += 0.2
    }

    // Increase confidence for extreme scores
    if (score.total >= 80 || score.total <= 20) {
      confidence += 0.2
    }

    // Increase confidence based on data completeness
    const demographicCompleteness = score.breakdown.demographic / 25
    confidence += demographicCompleteness * 0.1

    return Math.min(confidence, 1.0)
  }

  /**
   * Calculate due date based on priority
   */
  private static calculateDueDate(priority: EvaluatedLead['nextAction']['priority']): string {
    const now = new Date()

    switch (priority) {
      case 'immediate':
        // 1 hour from now
        now.setHours(now.getHours() + 1)
        break
      case 'today':
        // End of today
        now.setHours(23, 59, 59)
        break
      case 'this_week':
        // 3 days from now
        now.setDate(now.getDate() + 3)
        break
      case 'this_month':
        // 7 days from now
        now.setDate(now.getDate() + 7)
        break
    }

    return now.toISOString()
  }

  /**
   * Re-evaluate existing lead (after new interaction)
   */
  public static async reevaluateLead(leadId: string, newSession?: UserSession): Promise<EvaluatedLead> {
    const supabase = await createClient()

    // Fetch existing lead data
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (error || !lead) {
      throw new Error(`Lead not found: ${leadId}`)
    }

    // Prepare lead data
    const leadData: LeadData = {
      fullName: lead.full_name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      serviceInterest: lead.service_interest,
      message: lead.message,
      source: lead.source,
      userSession: newSession,
      metadata: { leadId, ...lead.metadata },
    }

    // Re-evaluate
    return this.evaluateLead(leadData)
  }

  /**
   * Batch evaluate leads (for existing leads without scores)
   */
  public static async batchEvaluateLeads(limit: number = 100): Promise<EvaluatedLead[]> {
    const supabase = await createClient()

    // Get leads without scores
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .is('lead_score', null)
      .limit(limit)

    if (error || !leads) {
      return []
    }

    const evaluatedLeads: EvaluatedLead[] = []

    for (const lead of leads) {
      try {
        const leadData: LeadData = {
          fullName: lead.full_name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          serviceInterest: lead.service_interest,
          message: lead.message,
          source: lead.source,
          metadata: { leadId: lead.id, ...lead.metadata },
        }

        const evaluated = await this.evaluateLead(leadData)
        evaluatedLeads.push(evaluated)
      } catch (error) {
        console.error(`Failed to evaluate lead ${lead.id}:`, error)
      }
    }

    return evaluatedLeads
  }
}
