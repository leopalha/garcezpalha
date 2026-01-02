/**
 * Distributed Tracing - D7-010
 * OpenTelemetry integration for request tracing across services
 */

import { createLogger } from '@/lib/logger'

const logger = createLogger('tracing')

// ============================================================================
// TYPES
// ============================================================================

export interface Span {
  traceId: string
  spanId: string
  parentSpanId?: string
  name: string
  kind: 'SERVER' | 'CLIENT' | 'INTERNAL' | 'PRODUCER' | 'CONSUMER'
  startTime: number
  endTime?: number
  status: 'OK' | 'ERROR' | 'UNSET'
  attributes: Record<string, string | number | boolean>
  events: Array<{
    name: string
    timestamp: number
    attributes?: Record<string, any>
  }>
}

export interface TracingConfig {
  serviceName: string
  environment: string
  sampleRate: number // 0.0 to 1.0 (1.0 = trace everything)
  exportEndpoint?: string // e.g., Jaeger, Datadog
  enableConsoleExport: boolean
}

// ============================================================================
// TRACER CLASS
// ============================================================================

export class Tracer {
  private config: TracingConfig
  private activeSpans: Map<string, Span> = new Map()

  constructor(config: Partial<TracingConfig> = {}) {
    this.config = {
      serviceName: config.serviceName || 'garcez-palha',
      environment: config.environment || process.env.NODE_ENV || 'development',
      sampleRate: config.sampleRate ?? 1.0,
      exportEndpoint: config.exportEndpoint || process.env.OTEL_EXPORTER_ENDPOINT,
      enableConsoleExport: config.enableConsoleExport ?? process.env.NODE_ENV === 'development',
    }

    logger.info('[Tracer] Initialized', {
      serviceName: this.config.serviceName,
      environment: this.config.environment,
    })
  }

  /**
   * Start a new span
   */
  startSpan(
    name: string,
    options: {
      kind?: Span['kind']
      parentSpanId?: string
      attributes?: Record<string, string | number | boolean>
    } = {}
  ): Span {
    // Check if we should sample this trace
    if (Math.random() > this.config.sampleRate) {
      // Return a no-op span
      return this._createNoOpSpan(name)
    }

    const span: Span = {
      traceId: options.parentSpanId
        ? this._getTraceIdFromSpanId(options.parentSpanId)
        : this._generateTraceId(),
      spanId: this._generateSpanId(),
      parentSpanId: options.parentSpanId,
      name,
      kind: options.kind || 'INTERNAL',
      startTime: Date.now(),
      status: 'UNSET',
      attributes: {
        'service.name': this.config.serviceName,
        'service.environment': this.config.environment,
        ...options.attributes,
      },
      events: [],
    }

    this.activeSpans.set(span.spanId, span)

    if (this.config.enableConsoleExport) {
      logger.debug('[Tracer] Span started', {
        traceId: span.traceId,
        spanId: span.spanId,
        name: span.name,
      })
    }

    return span
  }

  /**
   * End a span
   */
  endSpan(spanId: string, status: Span['status'] = 'OK'): void {
    const span = this.activeSpans.get(spanId)
    if (!span) {
      logger.warn('[Tracer] Span not found', { spanId })
      return
    }

    span.endTime = Date.now()
    span.status = status

    const duration = span.endTime - span.startTime

    if (this.config.enableConsoleExport) {
      logger.debug('[Tracer] Span ended', {
        traceId: span.traceId,
        spanId: span.spanId,
        name: span.name,
        duration: `${duration}ms`,
        status: span.status,
      })
    }

    // Export span
    this._exportSpan(span)

    // Remove from active spans
    this.activeSpans.delete(spanId)
  }

  /**
   * Add event to span
   */
  addEvent(
    spanId: string,
    eventName: string,
    attributes?: Record<string, any>
  ): void {
    const span = this.activeSpans.get(spanId)
    if (!span) {
      logger.warn('[Tracer] Span not found for event', { spanId, eventName })
      return
    }

    span.events.push({
      name: eventName,
      timestamp: Date.now(),
      attributes,
    })
  }

  /**
   * Set span attributes
   */
  setAttributes(
    spanId: string,
    attributes: Record<string, string | number | boolean>
  ): void {
    const span = this.activeSpans.get(spanId)
    if (!span) {
      logger.warn('[Tracer] Span not found for attributes', { spanId })
      return
    }

    span.attributes = {
      ...span.attributes,
      ...attributes,
    }
  }

  /**
   * Record exception in span
   */
  recordException(spanId: string, error: Error): void {
    const span = this.activeSpans.get(spanId)
    if (!span) {
      logger.warn('[Tracer] Span not found for exception', { spanId })
      return
    }

    span.status = 'ERROR'
    span.attributes['error'] = true
    span.attributes['error.type'] = error.name
    span.attributes['error.message'] = error.message

    span.events.push({
      name: 'exception',
      timestamp: Date.now(),
      attributes: {
        'exception.type': error.name,
        'exception.message': error.message,
        'exception.stacktrace': error.stack,
      },
    })
  }

  /**
   * Trace an async function
   */
  async trace<T>(
    name: string,
    fn: (span: Span) => Promise<T>,
    options: {
      kind?: Span['kind']
      parentSpanId?: string
      attributes?: Record<string, string | number | boolean>
    } = {}
  ): Promise<T> {
    const span = this.startSpan(name, options)

    try {
      const result = await fn(span)
      this.endSpan(span.spanId, 'OK')
      return result
    } catch (error) {
      this.recordException(span.spanId, error as Error)
      this.endSpan(span.spanId, 'ERROR')
      throw error
    }
  }

  /**
   * Create trace context for propagation
   */
  createTraceContext(spanId: string): string {
    const span = this.activeSpans.get(spanId)
    if (!span) {
      return ''
    }

    // W3C Trace Context format
    return `00-${span.traceId}-${span.spanId}-01`
  }

  /**
   * Parse trace context from headers
   */
  parseTraceContext(traceParent: string): { traceId: string; spanId: string } | null {
    try {
      const parts = traceParent.split('-')
      if (parts.length !== 4) {
        return null
      }

      return {
        traceId: parts[1],
        spanId: parts[2],
      }
    } catch (error) {
      logger.warn('[Tracer] Invalid trace context', { traceParent })
      return null
    }
  }

  /**
   * Export span to configured endpoint
   */
  private async _exportSpan(span: Span): Promise<void> {
    try {
      if (this.config.exportEndpoint) {
        // Export to external tracing backend (Jaeger, Datadog, etc.)
        await fetch(this.config.exportEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            spans: [this._formatSpanForExport(span)],
          }),
        })
      }
    } catch (error) {
      logger.error('[Tracer] Failed to export span', error)
    }
  }

  /**
   * Format span for OTLP export
   */
  private _formatSpanForExport(span: Span): any {
    return {
      traceId: span.traceId,
      spanId: span.spanId,
      parentSpanId: span.parentSpanId,
      name: span.name,
      kind: span.kind,
      startTimeUnixNano: span.startTime * 1000000,
      endTimeUnixNano: span.endTime ? span.endTime * 1000000 : undefined,
      status: {
        code: span.status === 'OK' ? 1 : span.status === 'ERROR' ? 2 : 0,
      },
      attributes: Object.entries(span.attributes).map(([key, value]) => ({
        key,
        value: {
          stringValue: typeof value === 'string' ? value : undefined,
          intValue: typeof value === 'number' ? Math.floor(value) : undefined,
          boolValue: typeof value === 'boolean' ? value : undefined,
        },
      })),
      events: span.events.map((event) => ({
        name: event.name,
        timeUnixNano: event.timestamp * 1000000,
        attributes: event.attributes
          ? Object.entries(event.attributes).map(([key, value]) => ({
              key,
              value: { stringValue: String(value) },
            }))
          : [],
      })),
    }
  }

  /**
   * Generate trace ID (32 hex characters)
   */
  private _generateTraceId(): string {
    return Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
  }

  /**
   * Generate span ID (16 hex characters)
   */
  private _generateSpanId(): string {
    return Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
  }

  /**
   * Get trace ID from span ID (for child spans)
   */
  private _getTraceIdFromSpanId(spanId: string): string {
    const span = this.activeSpans.get(spanId)
    return span?.traceId || this._generateTraceId()
  }

  /**
   * Create a no-op span (when not sampled)
   */
  private _createNoOpSpan(name: string): Span {
    return {
      traceId: '',
      spanId: '',
      name,
      kind: 'INTERNAL',
      startTime: Date.now(),
      status: 'UNSET',
      attributes: {},
      events: [],
    }
  }
}

// ============================================================================
// DEFAULT INSTANCE
// ============================================================================

export const tracer = new Tracer()

// ============================================================================
// MIDDLEWARE HELPER
// ============================================================================

/**
 * Extract trace context from Next.js request headers
 */
export function getTraceContextFromHeaders(headers: Headers): string | undefined {
  return headers.get('traceparent') || undefined
}

/**
 * Inject trace context into response headers
 */
export function injectTraceContext(headers: Headers, traceContext: string): void {
  headers.set('traceparent', traceContext)
}

// ============================================================================
// INSTRUMENTATION HELPERS
// ============================================================================

/**
 * Trace HTTP request
 */
export async function traceHTTPRequest<T>(
  method: string,
  url: string,
  fn: (span: Span) => Promise<T>,
  parentSpanId?: string
): Promise<T> {
  return tracer.trace(
    `HTTP ${method} ${url}`,
    async (span) => {
      tracer.setAttributes(span.spanId, {
        'http.method': method,
        'http.url': url,
        'http.scheme': new URL(url).protocol.replace(':', ''),
        'http.host': new URL(url).host,
      })

      try {
        const result = await fn(span)

        tracer.setAttributes(span.spanId, {
          'http.status_code': 200,
        })

        return result
      } catch (error) {
        tracer.setAttributes(span.spanId, {
          'http.status_code': 500,
        })
        throw error
      }
    },
    {
      kind: 'CLIENT',
      parentSpanId,
    }
  )
}

/**
 * Trace database query
 */
export async function traceDBQuery<T>(
  operation: string,
  table: string,
  fn: (span: Span) => Promise<T>,
  parentSpanId?: string
): Promise<T> {
  return tracer.trace(
    `DB ${operation} ${table}`,
    async (span) => {
      tracer.setAttributes(span.spanId, {
        'db.system': 'postgresql',
        'db.operation': operation,
        'db.table': table,
      })

      return fn(span)
    },
    {
      kind: 'CLIENT',
      parentSpanId,
    }
  )
}

/**
 * Trace AI/LLM call
 */
export async function traceAICall<T>(
  model: string,
  operation: string,
  fn: (span: Span) => Promise<T>,
  parentSpanId?: string
): Promise<T> {
  return tracer.trace(
    `AI ${model} ${operation}`,
    async (span) => {
      tracer.setAttributes(span.spanId, {
        'ai.model': model,
        'ai.operation': operation,
        'ai.provider': 'openai',
      })

      return fn(span)
    },
    {
      kind: 'CLIENT',
      parentSpanId,
    }
  )
}
