/**
 * Circuit Breaker Pattern - D7-004
 * Prevent cascading failures in external API calls
 */

import { createLogger } from '@/lib/logger'

const logger = createLogger('circuit-breaker')

export enum CircuitState {
  CLOSED = 'CLOSED', // Normal operation
  OPEN = 'OPEN', // Failing, reject all requests
  HALF_OPEN = 'HALF_OPEN', // Testing if service recovered
}

export interface CircuitBreakerConfig {
  failureThreshold: number // Number of failures before opening circuit
  successThreshold: number // Number of successes in HALF_OPEN to close circuit
  timeout: number // Time in ms to wait before trying HALF_OPEN
  monitoringPeriod: number // Time window for counting failures (ms)
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED
  private failureCount: number = 0
  private successCount: number = 0
  private nextAttempt: number = Date.now()
  private failures: number[] = [] // Timestamps of failures

  constructor(
    private name: string,
    private config: CircuitBreakerConfig = {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 60000, // 1 minute
      monitoringPeriod: 120000, // 2 minutes
    }
  ) {
    logger.info(`[CircuitBreaker] Created circuit breaker: ${name}`, config)
  }

  async execute<T>(fn: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        logger.warn(`[CircuitBreaker:${this.name}] Circuit is OPEN, rejecting request`)

        if (fallback) {
          logger.info(`[CircuitBreaker:${this.name}] Using fallback`)
          return fallback()
        }

        throw new Error(`Circuit breaker is OPEN for ${this.name}`)
      }

      // Try transitioning to HALF_OPEN
      this.state = CircuitState.HALF_OPEN
      this.successCount = 0
      logger.info(`[CircuitBreaker:${this.name}] Transitioning to HALF_OPEN`)
    }

    try {
      const result = await fn()

      this.onSuccess()

      return result
    } catch (error) {
      this.onFailure()

      if (fallback) {
        logger.info(`[CircuitBreaker:${this.name}] Using fallback after failure`)
        return fallback()
      }

      throw error
    }
  }

  private onSuccess(): void {
    this.failureCount = 0

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++

      logger.info(`[CircuitBreaker:${this.name}] Success in HALF_OPEN (${this.successCount}/${this.config.successThreshold})`)

      if (this.successCount >= this.config.successThreshold) {
        this.state = CircuitState.CLOSED
        this.successCount = 0
        this.failures = []
        logger.info(`[CircuitBreaker:${this.name}] Circuit CLOSED`)
      }
    }
  }

  private onFailure(): void {
    const now = Date.now()
    this.failures.push(now)

    // Remove old failures outside monitoring period
    this.failures = this.failures.filter(
      (timestamp) => now - timestamp < this.config.monitoringPeriod
    )

    this.failureCount = this.failures.length

    logger.warn(`[CircuitBreaker:${this.name}] Failure recorded (${this.failureCount}/${this.config.failureThreshold})`)

    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN
      this.nextAttempt = Date.now() + this.config.timeout
      logger.warn(`[CircuitBreaker:${this.name}] Circuit OPENED (failed in HALF_OPEN)`)
    } else if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN
      this.nextAttempt = Date.now() + this.config.timeout
      logger.warn(`[CircuitBreaker:${this.name}] Circuit OPENED (threshold reached)`)
    }
  }

  getState(): CircuitState {
    return this.state
  }

  getStats() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      nextAttempt: this.state === CircuitState.OPEN ? this.nextAttempt : null,
      failures: this.failures.length,
    }
  }

  reset(): void {
    this.state = CircuitState.CLOSED
    this.failureCount = 0
    this.successCount = 0
    this.failures = []
    logger.info(`[CircuitBreaker:${this.name}] Circuit manually reset`)
  }
}

// ============================================================================
// PRE-CONFIGURED CIRCUIT BREAKERS
// ============================================================================

export const circuitBreakers = {
  // External APIs
  openai: new CircuitBreaker('openai', {
    failureThreshold: 3,
    successThreshold: 2,
    timeout: 30000, // 30 seconds
    monitoringPeriod: 60000,
  }),

  stripe: new CircuitBreaker('stripe', {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 60000,
    monitoringPeriod: 120000,
  }),

  mercadopago: new CircuitBreaker('mercadopago', {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 60000,
    monitoringPeriod: 120000,
  }),

  whatsapp: new CircuitBreaker('whatsapp', {
    failureThreshold: 10,
    successThreshold: 3,
    timeout: 30000,
    monitoringPeriod: 60000,
  }),

  clicksign: new CircuitBreaker('clicksign', {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 60000,
    monitoringPeriod: 120000,
  }),

  pje: new CircuitBreaker('pje', {
    failureThreshold: 3,
    successThreshold: 2,
    timeout: 120000, // 2 minutes (PJe can be slow)
    monitoringPeriod: 300000,
  }),
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getAllCircuitBreakerStats() {
  return Object.entries(circuitBreakers).map(([name, breaker]) => breaker.getStats())
}

export function resetAllCircuitBreakers() {
  Object.values(circuitBreakers).forEach((breaker) => breaker.reset())
  logger.info('[CircuitBreaker] All circuit breakers reset')
}
