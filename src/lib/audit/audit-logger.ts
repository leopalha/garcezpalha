import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'

const logger = createLogger('audit-logger')

export type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'export' | 'login' | 'logout' | 'approve' | 'reject'

export type AuditResourceType =
  | 'case'
  | 'document'
  | 'invoice'
  | 'user'
  | 'settings'
  | 'consent'
  | 'data_export'
  | 'data_deletion'
  | 'privacy_settings'
  | 'signature_document'
  | 'process_query'
  | 'deadline'
  | 'expense'
  | 'financial_transaction'

export type AuditSeverity = 'debug' | 'info' | 'warning' | 'error' | 'critical'

export interface AuditLogOptions {
  userId: string
  action: AuditAction
  resourceType: AuditResourceType
  resourceId?: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  severity?: AuditSeverity
  status?: 'success' | 'failure' | 'partial'
  errorMessage?: string
  requestPath?: string
  requestMethod?: string
}

/**
 * Log an audit event
 */
export async function logAuditEvent(options: AuditLogOptions): Promise<string | null> {
  try {
    const supabase = await createClient()

    const { data: auditLog, error } = await supabase.rpc('log_audit_event', {
      p_user_id: options.userId,
      p_action: options.action,
      p_resource_type: options.resourceType,
      p_resource_id: options.resourceId || null,
      p_old_values: options.oldValues || null,
      p_new_values: options.newValues || null,
      p_ip_address: options.ipAddress || null,
      p_user_agent: options.userAgent || null
    })

    if (error) {
      logger.error('Failed to log audit event', error)
      return null
    }

    logger.debug('Audit event logged', {
      auditId: auditLog,
      action: options.action,
      resourceType: options.resourceType
    })

    return auditLog as string

  } catch (error) {
    logger.error('Error in logAuditEvent', error)
    return null
  }
}

/**
 * Extract IP address from request
 */
export function getIpAddress(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  return cfConnectingIp || forwardedFor?.split(',')[0] || realIp || 'unknown'
}

/**
 * Extract user agent from request
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown'
}

/**
 * Create audit context from request
 */
export function createAuditContext(request: Request) {
  return {
    ipAddress: getIpAddress(request),
    userAgent: getUserAgent(request),
    requestPath: new URL(request.url).pathname,
    requestMethod: request.method
  }
}

/**
 * Middleware-style audit logger
 * Use in API routes to automatically log all operations
 */
export async function withAudit<T>(
  options: Omit<AuditLogOptions, 'status'>,
  operation: () => Promise<T>
): Promise<T> {
  const startTime = Date.now()

  try {
    const result = await operation()

    await logAuditEvent({
      ...options,
      status: 'success',
      severity: options.severity || 'info'
    })

    const duration = Date.now() - startTime
    logger.debug('Audit operation completed', {
      action: options.action,
      resourceType: options.resourceType,
      duration
    })

    return result

  } catch (error) {
    await logAuditEvent({
      ...options,
      status: 'failure',
      severity: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}

/**
 * Log security event
 */
export async function logSecurityEvent(options: {
  eventType: 'failed_login' | 'suspicious_activity' | 'data_breach' | 'unauthorized_access' | 'brute_force' | 'sql_injection' | 'xss_attempt'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  metadata?: Record<string, any>
  userId?: string
  userEmail?: string
  ipAddress?: string
  userAgent?: string
}): Promise<string | null> {
  try {
    const supabase = await createClient()

    const { data: event, error } = await supabase
      .from('security_events')
      .insert({
        event_type: options.eventType,
        severity: options.severity,
        description: options.description,
        metadata: options.metadata || {},
        user_id: options.userId || null,
        user_email: options.userEmail || null,
        ip_address: options.ipAddress || null,
        user_agent: options.userAgent || null,
        status: 'open'
      })
      .select('id')
      .single()

    if (error) {
      logger.error('Failed to log security event', error)
      return null
    }

    // Log to application logger as well
    if (options.severity === 'critical' || options.severity === 'high') {
      logger.error('SECURITY EVENT', {
        eventId: event.id,
        eventType: options.eventType,
        severity: options.severity,
        description: options.description
      })
    } else {
      logger.warn('Security event', {
        eventId: event.id,
        eventType: options.eventType,
        severity: options.severity
      })
    }

    return event.id

  } catch (error) {
    logger.error('Error in logSecurityEvent', error)
    return null
  }
}

/**
 * Track failed login attempts
 * Call this in login API to detect brute force
 */
const failedLoginAttempts = new Map<string, number>()
const FAILED_LOGIN_THRESHOLD = 5
const FAILED_LOGIN_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export async function trackFailedLogin(
  email: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  const key = `${email}:${ipAddress}`
  const attempts = (failedLoginAttempts.get(key) || 0) + 1

  failedLoginAttempts.set(key, attempts)

  // Clear after window
  setTimeout(() => {
    failedLoginAttempts.delete(key)
  }, FAILED_LOGIN_WINDOW_MS)

  // Log failed login
  await logSecurityEvent({
    eventType: 'failed_login',
    severity: attempts >= FAILED_LOGIN_THRESHOLD ? 'high' : 'low',
    description: `Failed login attempt ${attempts} for ${email}`,
    metadata: { email, attempts },
    userEmail: email,
    ipAddress,
    userAgent
  })

  // If threshold exceeded, log brute force
  if (attempts >= FAILED_LOGIN_THRESHOLD) {
    await logSecurityEvent({
      eventType: 'brute_force',
      severity: 'critical',
      description: `Possible brute force attack: ${attempts} failed login attempts for ${email}`,
      metadata: { email, attempts },
      userEmail: email,
      ipAddress,
      userAgent
    })
  }
}

/**
 * Clear failed login attempts on successful login
 */
export function clearFailedLoginAttempts(email: string, ipAddress: string): void {
  const key = `${email}:${ipAddress}`
  failedLoginAttempts.delete(key)
}

/**
 * Check if IP is blocked due to brute force
 */
export function isIpBlocked(email: string, ipAddress: string): boolean {
  const key = `${email}:${ipAddress}`
  const attempts = failedLoginAttempts.get(key) || 0
  return attempts >= FAILED_LOGIN_THRESHOLD
}
