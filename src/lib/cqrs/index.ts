/**
 * CQRS Pattern - P2-001
 * Command Query Responsibility Segregation
 * Separates read and write operations for better scalability and performance
 */

import { createLogger } from '@/lib/logger'
import { tracer } from '@/lib/tracing'

const logger = createLogger('cqrs')

// ============================================================================
// TYPES
// ============================================================================

export interface Command<TPayload = any, TResult = any> {
  type: string
  payload: TPayload
  metadata?: {
    userId?: string
    timestamp?: number
    correlationId?: string
  }
}

export interface Query<TParams = any, TResult = any> {
  type: string
  params: TParams
  metadata?: {
    userId?: string
    useCache?: boolean
    timeout?: number
  }
}

export interface CommandHandler<TPayload = any, TResult = any> {
  handle(command: Command<TPayload>): Promise<TResult>
  validate?(payload: TPayload): Promise<boolean>
}

export interface QueryHandler<TParams = any, TResult = any> {
  handle(query: Query<TParams>): Promise<TResult>
  cache?: {
    key: (params: TParams) => string
    ttl: number
  }
}

export interface Event<TPayload = any> {
  type: string
  payload: TPayload
  aggregateId: string
  timestamp: number
  version: number
  metadata?: Record<string, any>
}

// ============================================================================
// COMMAND BUS
// ============================================================================

export class CommandBus {
  private handlers: Map<string, CommandHandler> = new Map()
  private middleware: Array<(command: Command) => Promise<void>> = []

  /**
   * Register a command handler
   */
  register<TPayload, TResult>(
    commandType: string,
    handler: CommandHandler<TPayload, TResult>
  ): void {
    if (this.handlers.has(commandType)) {
      throw new Error(`Command handler already registered for: ${commandType}`)
    }

    this.handlers.set(commandType, handler)
    logger.info(`[CommandBus] Registered handler for ${commandType}`)
  }

  /**
   * Add middleware to command pipeline
   */
  use(middleware: (command: Command) => Promise<void>): void {
    this.middleware.push(middleware)
  }

  /**
   * Execute a command
   */
  async execute<TPayload, TResult>(
    command: Command<TPayload, TResult>
  ): Promise<TResult> {
    return tracer.trace(`COMMAND ${command.type}`, async (span) => {
      tracer.setAttributes(span.spanId, {
        'command.type': command.type,
        'command.userId': command.metadata?.userId || '',
      })

      // Run middleware
      for (const mw of this.middleware) {
        await mw(command)
      }

      // Get handler
      const handler = this.handlers.get(command.type)
      if (!handler) {
        throw new Error(`No handler registered for command: ${command.type}`)
      }

      // Validate
      if (handler.validate) {
        const isValid = await handler.validate(command.payload)
        if (!isValid) {
          throw new Error(`Command validation failed: ${command.type}`)
        }
      }

      // Execute
      logger.info(`[CommandBus] Executing ${command.type}`)
      const result = await handler.handle(command)

      tracer.addEvent(span.spanId, 'command_executed', {
        type: command.type,
      })

      return result
    })
  }
}

// ============================================================================
// QUERY BUS
// ============================================================================

export class QueryBus {
  private handlers: Map<string, QueryHandler> = new Map()
  private cache: Map<string, { data: any; expiresAt: number }> = new Map()
  private middleware: Array<(query: Query) => Promise<void>> = []

  /**
   * Register a query handler
   */
  register<TParams, TResult>(
    queryType: string,
    handler: QueryHandler<TParams, TResult>
  ): void {
    if (this.handlers.has(queryType)) {
      throw new Error(`Query handler already registered for: ${queryType}`)
    }

    this.handlers.set(queryType, handler)
    logger.info(`[QueryBus] Registered handler for ${queryType}`)
  }

  /**
   * Add middleware to query pipeline
   */
  use(middleware: (query: Query) => Promise<void>): void {
    this.middleware.push(middleware)
  }

  /**
   * Execute a query
   */
  async execute<TParams, TResult>(query: Query<TParams, TResult>): Promise<TResult> {
    return tracer.trace(`QUERY ${query.type}`, async (span) => {
      tracer.setAttributes(span.spanId, {
        'query.type': query.type,
        'query.userId': query.metadata?.userId || '',
      })

      // Run middleware
      for (const mw of this.middleware) {
        await mw(query)
      }

      // Get handler
      const handler = this.handlers.get(query.type)
      if (!handler) {
        throw new Error(`No handler registered for query: ${query.type}`)
      }

      // Check cache
      if (handler.cache && query.metadata?.useCache !== false) {
        const cacheKey = `${query.type}:${handler.cache.key(query.params)}`
        const cached = this.cache.get(cacheKey)

        if (cached && cached.expiresAt > Date.now()) {
          logger.debug(`[QueryBus] Cache HIT for ${query.type}`)
          tracer.addEvent(span.spanId, 'cache_hit', { key: cacheKey })
          return cached.data
        }
      }

      // Execute query
      logger.info(`[QueryBus] Executing ${query.type}`)
      const result = await handler.handle(query)

      // Store in cache
      if (handler.cache && query.metadata?.useCache !== false) {
        const cacheKey = `${query.type}:${handler.cache.key(query.params)}`
        this.cache.set(cacheKey, {
          data: result,
          expiresAt: Date.now() + handler.cache.ttl,
        })
        logger.debug(`[QueryBus] Cached result for ${query.type}`)
      }

      tracer.addEvent(span.spanId, 'query_executed', {
        type: query.type,
      })

      return result
    })
  }

  /**
   * Clear cache for a query type
   */
  clearCache(queryType?: string): void {
    if (queryType) {
      // Clear specific query type
      const keys = Array.from(this.cache.keys()).filter((key) =>
        key.startsWith(`${queryType}:`)
      )
      keys.forEach((key) => this.cache.delete(key))
      logger.info(`[QueryBus] Cleared cache for ${queryType}`)
    } else {
      // Clear all cache
      this.cache.clear()
      logger.info('[QueryBus] Cleared all cache')
    }
  }
}

// ============================================================================
// EVENT BUS
// ============================================================================

export class EventBus {
  private subscribers: Map<string, Array<(event: Event) => Promise<void>>> = new Map()

  /**
   * Subscribe to an event
   */
  subscribe(eventType: string, handler: (event: Event) => Promise<void>): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, [])
    }

    this.subscribers.get(eventType)!.push(handler)
    logger.info(`[EventBus] Subscribed to ${eventType}`)
  }

  /**
   * Publish an event
   */
  async publish(event: Event): Promise<void> {
    return tracer.trace(`EVENT ${event.type}`, async (span) => {
      tracer.setAttributes(span.spanId, {
        'event.type': event.type,
        'event.aggregateId': event.aggregateId,
        'event.version': event.version,
      })

      const handlers = this.subscribers.get(event.type) || []

      logger.info(`[EventBus] Publishing ${event.type} to ${handlers.length} subscribers`)

      // Execute all handlers in parallel
      await Promise.all(
        handlers.map(async (handler) => {
          try {
            await handler(event)
          } catch (error) {
            logger.error(`[EventBus] Handler failed for ${event.type}`, error)
            tracer.recordException(span.spanId, error as Error)
          }
        })
      )

      tracer.addEvent(span.spanId, 'event_published', {
        type: event.type,
        subscriberCount: handlers.length,
      })
    })
  }
}

// ============================================================================
// DEFAULT INSTANCES
// ============================================================================

export const commandBus = new CommandBus()
export const queryBus = new QueryBus()
export const eventBus = new EventBus()

// ============================================================================
// MIDDLEWARE
// ============================================================================

/**
 * Logging middleware for commands
 */
export function commandLoggingMiddleware() {
  return async (command: Command) => {
    logger.info('[Command] Received', {
      type: command.type,
      userId: command.metadata?.userId,
      timestamp: command.metadata?.timestamp,
    })
  }
}

/**
 * Logging middleware for queries
 */
export function queryLoggingMiddleware() {
  return async (query: Query) => {
    logger.info('[Query] Received', {
      type: query.type,
      userId: query.metadata?.userId,
      useCache: query.metadata?.useCache,
    })
  }
}

/**
 * Authorization middleware for commands
 */
export function commandAuthMiddleware(
  authorizer: (command: Command) => Promise<boolean>
) {
  return async (command: Command) => {
    const isAuthorized = await authorizer(command)
    if (!isAuthorized) {
      throw new Error(`Unauthorized command: ${command.type}`)
    }
  }
}

/**
 * Authorization middleware for queries
 */
export function queryAuthMiddleware(authorizer: (query: Query) => Promise<boolean>) {
  return async (query: Query) => {
    const isAuthorized = await authorizer(query)
    if (!isAuthorized) {
      throw new Error(`Unauthorized query: ${query.type}`)
    }
  }
}

// Register default middleware
commandBus.use(commandLoggingMiddleware())
queryBus.use(queryLoggingMiddleware())
