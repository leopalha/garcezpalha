/**
 * CQRS Handlers for Leads Domain
 * Example implementation of Command and Query handlers
 */

import { CommandHandler, QueryHandler, Command, Query, eventBus } from '../index'
import { createClient } from '@/lib/supabase/server'
import { createReadReplicaServerClient } from '@/lib/supabase/server-with-replicas'
import { createLogger } from '@/lib/logger'

const logger = createLogger('cqrs:leads')

// ============================================================================
// COMMANDS
// ============================================================================

/**
 * Command: Create Lead
 */
export interface CreateLeadPayload {
  name: string
  email: string
  phone: string
  source: string
  productId?: string
  metadata?: Record<string, any>
}

export class CreateLeadHandler implements CommandHandler<CreateLeadPayload, { id: string }> {
  async validate(payload: CreateLeadPayload): Promise<boolean> {
    // Validate required fields
    if (!payload.name || !payload.email || !payload.phone) {
      throw new Error('Name, email, and phone are required')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(payload.email)) {
      throw new Error('Invalid email format')
    }

    return true
  }

  async handle(command: Command<CreateLeadPayload>): Promise<{ id: string }> {
    const supabase = await createClient()

    // Create lead
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name: command.payload.name,
        email: command.payload.email,
        phone: command.payload.phone,
        source: command.payload.source,
        product_id: command.payload.productId,
        metadata: command.payload.metadata || {},
        status: 'new',
        created_at: new Date().toISOString(),
        created_by: command.metadata?.userId,
      })
      .select('id')
      .single()

    if (error) {
      logger.error('[CreateLead] Failed to create lead', error)
      throw new Error('Failed to create lead')
    }

    // Publish event
    await eventBus.publish({
      type: 'LeadCreated',
      payload: {
        leadId: lead.id,
        name: command.payload.name,
        email: command.payload.email,
        source: command.payload.source,
      },
      aggregateId: lead.id,
      timestamp: Date.now(),
      version: 1,
      metadata: {
        userId: command.metadata?.userId,
      },
    })

    logger.info('[CreateLead] Lead created', { leadId: lead.id })

    return { id: lead.id }
  }
}

/**
 * Command: Qualify Lead
 */
export interface QualifyLeadPayload {
  leadId: string
  qualificationNotes: string
  assignedTo?: string
}

export class QualifyLeadHandler implements CommandHandler<QualifyLeadPayload, void> {
  async validate(payload: QualifyLeadPayload): Promise<boolean> {
    if (!payload.leadId || !payload.qualificationNotes) {
      throw new Error('Lead ID and qualification notes are required')
    }
    return true
  }

  async handle(command: Command<QualifyLeadPayload>): Promise<void> {
    const supabase = await createClient()

    // Update lead status
    const { error } = await supabase
      .from('leads')
      .update({
        status: 'qualified',
        qualification_notes: command.payload.qualificationNotes,
        assigned_to: command.payload.assignedTo,
        qualified_at: new Date().toISOString(),
        qualified_by: command.metadata?.userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', command.payload.leadId)

    if (error) {
      logger.error('[QualifyLead] Failed to qualify lead', error)
      throw new Error('Failed to qualify lead')
    }

    // Publish event
    await eventBus.publish({
      type: 'LeadQualified',
      payload: {
        leadId: command.payload.leadId,
        assignedTo: command.payload.assignedTo,
        qualificationNotes: command.payload.qualificationNotes,
      },
      aggregateId: command.payload.leadId,
      timestamp: Date.now(),
      version: 2,
      metadata: {
        userId: command.metadata?.userId,
      },
    })

    logger.info('[QualifyLead] Lead qualified', { leadId: command.payload.leadId })
  }
}

/**
 * Command: Convert Lead to Client
 */
export interface ConvertLeadPayload {
  leadId: string
  serviceId: string
  contractValue: number
}

export class ConvertLeadHandler implements CommandHandler<ConvertLeadPayload, { clientId: string }> {
  async validate(payload: ConvertLeadPayload): Promise<boolean> {
    if (!payload.leadId || !payload.serviceId || !payload.contractValue) {
      throw new Error('Lead ID, service ID, and contract value are required')
    }
    return true
  }

  async handle(
    command: Command<ConvertLeadPayload>
  ): Promise<{ clientId: string }> {
    const supabase = await createClient()

    // Get lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', command.payload.leadId)
      .single()

    if (leadError || !lead) {
      throw new Error('Lead not found')
    }

    // Create client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        created_from_lead_id: lead.id,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (clientError) {
      logger.error('[ConvertLead] Failed to create client', clientError)
      throw new Error('Failed to create client')
    }

    // Update lead status
    await supabase
      .from('leads')
      .update({
        status: 'converted',
        converted_to_client_id: client.id,
        converted_at: new Date().toISOString(),
        converted_by: command.metadata?.userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', command.payload.leadId)

    // Publish event
    await eventBus.publish({
      type: 'LeadConverted',
      payload: {
        leadId: command.payload.leadId,
        clientId: client.id,
        serviceId: command.payload.serviceId,
        contractValue: command.payload.contractValue,
      },
      aggregateId: command.payload.leadId,
      timestamp: Date.now(),
      version: 3,
      metadata: {
        userId: command.metadata?.userId,
      },
    })

    logger.info('[ConvertLead] Lead converted to client', {
      leadId: command.payload.leadId,
      clientId: client.id,
    })

    return { clientId: client.id }
  }
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Query: Get Lead by ID
 */
export interface GetLeadByIdParams {
  leadId: string
}

export class GetLeadByIdHandler implements QueryHandler<GetLeadByIdParams, any> {
  cache = {
    key: (params: GetLeadByIdParams) => params.leadId,
    ttl: 60000, // 1 minute
  }

  async handle(query: Query<GetLeadByIdParams>): Promise<any> {
    // Use read replica for queries
    const supabase = await createReadReplicaServerClient()

    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', query.params.leadId)
      .single()

    if (error) {
      logger.error('[GetLeadById] Failed to get lead', error)
      throw new Error('Failed to get lead')
    }

    return lead
  }
}

/**
 * Query: List Leads with Filters
 */
export interface ListLeadsParams {
  status?: string
  source?: string
  assignedTo?: string
  limit?: number
  offset?: number
}

export class ListLeadsHandler implements QueryHandler<ListLeadsParams, any[]> {
  cache = {
    key: (params: ListLeadsParams) =>
      `${params.status || 'all'}-${params.source || 'all'}-${params.assignedTo || 'all'}-${params.limit || 50}-${params.offset || 0}`,
    ttl: 30000, // 30 seconds
  }

  async handle(query: Query<ListLeadsParams>): Promise<any[]> {
    // Use read replica for queries
    const supabase = await createReadReplicaServerClient()

    let queryBuilder = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (query.params.status) {
      queryBuilder = queryBuilder.eq('status', query.params.status)
    }

    if (query.params.source) {
      queryBuilder = queryBuilder.eq('source', query.params.source)
    }

    if (query.params.assignedTo) {
      queryBuilder = queryBuilder.eq('assigned_to', query.params.assignedTo)
    }

    const limit = query.params.limit || 50
    const offset = query.params.offset || 0

    queryBuilder = queryBuilder.range(offset, offset + limit - 1)

    const { data: leads, error } = await queryBuilder

    if (error) {
      logger.error('[ListLeads] Failed to list leads', error)
      throw new Error('Failed to list leads')
    }

    return leads || []
  }
}

/**
 * Query: Get Lead Stats
 */
export interface GetLeadStatsParams {
  startDate?: string
  endDate?: string
}

export class GetLeadStatsHandler implements QueryHandler<GetLeadStatsParams, any> {
  cache = {
    key: (params: GetLeadStatsParams) =>
      `${params.startDate || 'all'}-${params.endDate || 'all'}`,
    ttl: 300000, // 5 minutes
  }

  async handle(query: Query<GetLeadStatsParams>): Promise<any> {
    // Use read replica for analytics
    const supabase = await createReadReplicaServerClient()

    let queryBuilder = supabase.from('leads').select('status, source, created_at')

    if (query.params.startDate) {
      queryBuilder = queryBuilder.gte('created_at', query.params.startDate)
    }

    if (query.params.endDate) {
      queryBuilder = queryBuilder.lte('created_at', query.params.endDate)
    }

    const { data: leads, error } = await queryBuilder

    if (error) {
      logger.error('[GetLeadStats] Failed to get stats', error)
      throw new Error('Failed to get stats')
    }

    // Calculate stats
    const stats = {
      total: leads?.length || 0,
      byStatus: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      conversionRate: 0,
    }

    leads?.forEach((lead) => {
      // Count by status
      stats.byStatus[lead.status] = (stats.byStatus[lead.status] || 0) + 1

      // Count by source
      stats.bySource[lead.source] = (stats.bySource[lead.source] || 0) + 1
    })

    // Calculate conversion rate
    const converted = stats.byStatus['converted'] || 0
    stats.conversionRate = stats.total > 0 ? (converted / stats.total) * 100 : 0

    return stats
  }
}
