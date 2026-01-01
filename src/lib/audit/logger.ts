/**
 * Audit Logger
 * LGPD Art. 37 compliance - Rastreabilidade de acesso a dados pessoais
 *
 * P1-008: Audit Logs System
 */

import { createClient } from '@/lib/supabase/server'

export type AuditEventType =
  // Authentication
  | 'auth.login'
  | 'auth.logout'
  | 'auth.signup'
  | 'auth.password_reset'
  | 'auth.2fa_enabled'
  | 'auth.2fa_disabled'
  | 'auth.2fa_failed'
  | 'auth.2fa_verified'
  // Data Access (LGPD)
  | 'data.read'
  | 'data.create'
  | 'data.update'
  | 'data.delete'
  | 'data.export'
  | 'data.anonymize'
  // Security
  | 'security.suspicious_request'
  | 'security.rate_limit_exceeded'
  | 'security.csrf_violation'
  | 'security.unauthorized_access'
  // Payment
  | 'payment.checkout_started'
  | 'payment.checkout_completed'
  | 'payment.subscription_created'
  | 'payment.subscription_canceled'
  | 'payment.refund_issued'
  // Admin
  | 'admin.user_impersonation'
  | 'admin.settings_changed'
  | 'admin.role_changed'
  // System
  | 'system.error'
  | 'system.api_call'
  | 'api'
  | 'auth'
  | 'contact'
  | 'chat'
  | 'webhook'
  | 'cron'
  | 'checkout'

export interface AuditLogEntry {
  event_type: AuditEventType
  user_id?: string
  tenant_id?: string
  resource_type?: string // 'user', 'lead', 'conversation', etc.
  resource_id?: string
  action?: string
  metadata?: Record<string, any>
  ip_address?: string
  user_agent?: string
  success?: boolean
  error_message?: string
}

/**
 * Log an audit event
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from('audit_logs').insert({
      event_type: entry.event_type,
      user_id: entry.user_id || null,
      tenant_id: entry.tenant_id || null,
      resource_type: entry.resource_type || null,
      resource_id: entry.resource_id || null,
      action: entry.action || null,
      metadata: entry.metadata || {},
      ip_address: entry.ip_address || null,
      user_agent: entry.user_agent || null,
      success: entry.success !== false, // default to true
      error_message: entry.error_message || null,
      created_at: new Date().toISOString(),
    })

    if (error) {
      // Don't throw - logging should never break the app
      console.error('Audit log error:', error)
    }
  } catch (error) {
    console.error('Audit log exception:', error)
  }
}

/**
 * Log authentication event
 */
export async function logAuthEvent(
  eventType: Extract<AuditEventType, `auth.${string}`>,
  userId: string,
  metadata?: Record<string, any>,
  success: boolean = true
): Promise<void> {
  await logAuditEvent({
    event_type: eventType,
    user_id: userId,
    metadata,
    success,
  })
}

/**
 * Log data access event (LGPD compliance)
 */
export async function logDataAccess(
  action: 'read' | 'create' | 'update' | 'delete' | 'export' | 'anonymize',
  resourceType: string,
  resourceId: string,
  userId?: string,
  tenantId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    event_type: `data.${action}` as AuditEventType,
    user_id: userId,
    tenant_id: tenantId,
    resource_type: resourceType,
    resource_id: resourceId,
    action,
    metadata,
  })
}

/**
 * Log security event
 */
export async function logSecurityEvent(
  eventType: Extract<AuditEventType, `security.${string}`>,
  metadata?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logAuditEvent({
    event_type: eventType,
    metadata,
    ip_address: ipAddress,
    user_agent: userAgent,
    success: false, // security events are always failures
  })
}

/**
 * Log payment event
 */
export async function logPaymentEvent(
  eventType: Extract<AuditEventType, `payment.${string}`>,
  userId: string,
  metadata: Record<string, any>,
  success: boolean = true
): Promise<void> {
  await logAuditEvent({
    event_type: eventType,
    user_id: userId,
    metadata,
    success,
  })
}

/**
 * Query audit logs
 */
export interface AuditLogQuery {
  userId?: string
  tenantId?: string
  eventType?: AuditEventType
  resourceType?: string
  resourceId?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

export async function queryAuditLogs(
  query: AuditLogQuery
): Promise<any[]> {
  try {
    const supabase = await createClient()

    let queryBuilder = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })

    if (query.userId) {
      queryBuilder = queryBuilder.eq('user_id', query.userId)
    }

    if (query.tenantId) {
      queryBuilder = queryBuilder.eq('tenant_id', query.tenantId)
    }

    if (query.eventType) {
      queryBuilder = queryBuilder.eq('event_type', query.eventType)
    }

    if (query.resourceType) {
      queryBuilder = queryBuilder.eq('resource_type', query.resourceType)
    }

    if (query.resourceId) {
      queryBuilder = queryBuilder.eq('resource_id', query.resourceId)
    }

    if (query.startDate) {
      queryBuilder = queryBuilder.gte('created_at', query.startDate.toISOString())
    }

    if (query.endDate) {
      queryBuilder = queryBuilder.lte('created_at', query.endDate.toISOString())
    }

    if (query.limit) {
      queryBuilder = queryBuilder.limit(query.limit)
    }

    if (query.offset) {
      queryBuilder = queryBuilder.range(query.offset, query.offset + (query.limit || 100))
    }

    const { data, error } = await queryBuilder

    if (error) {
      console.error('Query audit logs error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Query audit logs exception:', error)
    return []
  }
}

/**
 * Get audit log statistics
 */
export interface AuditStats {
  totalEvents: number
  successRate: number
  topEvents: Array<{ event_type: string; count: number }>
  topUsers: Array<{ user_id: string; count: number }>
  securityIncidents: number
}

export async function getAuditStats(
  startDate?: Date,
  endDate?: Date
): Promise<AuditStats> {
  try {
    const supabase = await createClient()

    // This would require custom SQL queries or RPC functions
    // For now, return placeholder
    return {
      totalEvents: 0,
      successRate: 0,
      topEvents: [],
      topUsers: [],
      securityIncidents: 0,
    }
  } catch (error) {
    console.error('Get audit stats exception:', error)
    return {
      totalEvents: 0,
      successRate: 0,
      topEvents: [],
      topUsers: [],
      securityIncidents: 0,
    }
  }
}
