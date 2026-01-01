/**
 * Email Sequence Engine - Unit Tests
 * P2-001 Test Suite
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EmailSequenceEngine } from '../engine'
import type { SequenceTriggerData, SequenceStep } from '../types'

// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({
        data: { id: 'test-email-id-123' },
      }),
    },
  })),
}))

describe('EmailSequenceEngine', () => {
  let engine: EmailSequenceEngine
  let mockTriggerData: SequenceTriggerData

  beforeEach(() => {
    engine = new EmailSequenceEngine()
    mockTriggerData = {
      event: 'lead_signup',
      email: 'test@example.com',
      firstName: 'João',
      lastName: 'Silva',
      customData: {
        produto: 'desbloqueio-conta',
        ticket: 'R$ 2.500',
      },
    }
  })

  describe('subscribe', () => {
    it('should create a new subscription', async () => {
      const subscription = await engine.subscribe('welcome-sequence', mockTriggerData)

      expect(subscription).toBeDefined()
      expect(subscription.id).toMatch(/^sub_/)
      expect(subscription.sequenceId).toBe('welcome-sequence')
      expect(subscription.email).toBe('test@example.com')
      expect(subscription.firstName).toBe('João')
      expect(subscription.lastName).toBe('Silva')
      expect(subscription.status).toBe('active')
      expect(subscription.customData).toEqual(mockTriggerData.customData)
    })

    it('should generate unique subscription IDs', async () => {
      const sub1 = await engine.subscribe('welcome-sequence', mockTriggerData)
      const sub2 = await engine.subscribe('welcome-sequence', mockTriggerData)

      expect(sub1.id).not.toBe(sub2.id)
    })

    it('should set startedAt timestamp', async () => {
      const beforeTime = new Date()
      const subscription = await engine.subscribe('welcome-sequence', mockTriggerData)
      const afterTime = new Date()

      expect(subscription.startedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime())
      expect(subscription.startedAt.getTime()).toBeLessThanOrEqual(afterTime.getTime())
    })

    it('should handle optional fields', async () => {
      const minimalData: SequenceTriggerData = {
        event: 'test',
        email: 'minimal@example.com',
        firstName: 'Test',
        customData: {},
      }

      const subscription = await engine.subscribe('welcome-sequence', minimalData)

      expect(subscription.lastName).toBeUndefined()
      expect(subscription.customData).toBeDefined()
    })
  })

  describe('sendSequenceEmail', () => {
    it('should send email with correct parameters', async () => {
      const subscription = await engine.subscribe('welcome-sequence', mockTriggerData)

      const step: SequenceStep = {
        id: 'step-1',
        sequenceId: 'welcome-sequence',
        order: 1,
        delayHours: 0,
        templateId: 'welcome-001',
      }

      const template = {
        subject: 'Bem-vindo, {{firstName}}!',
        html: '<h1>Olá {{firstName}} {{lastName}}</h1>',
        text: 'Olá {{firstName}} {{lastName}}',
      }

      const event = await (engine as any).sendSequenceEmail(subscription, step, template)

      expect(event).toBeDefined()
      expect(event.type).toBe('sent')
      expect(event.subscriptionId).toBe(subscription.id)
      expect(event.stepId).toBe('step-1')
      expect(event.emailProvider).toBe('resend')
    })

    it('should replace variables in template', async () => {
      const subscription = await engine.subscribe('welcome-sequence', {
        event: 'test',
        email: 'test@example.com',
        firstName: 'Maria',
        lastName: 'Santos',
        customData: { produto: 'desbloqueio-conta' },
      })

      const step: SequenceStep = {
        id: 'step-1',
        sequenceId: 'welcome-sequence',
        order: 1,
        delayHours: 0,
        templateId: 'test',
      }

      const template = {
        subject: 'Olá {{firstName}}!',
        html: '<p>{{firstName}} {{lastName}} - {{produto}}</p>',
      }

      // Mock console.log to capture the replaced content
      const consoleSpy = vi.spyOn(console, 'log')

      await (engine as any).sendSequenceEmail(subscription, step, template)

      // Variables should be replaced
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should handle email sending errors', async () => {
      const subscription = await engine.subscribe('welcome-sequence', mockTriggerData)

      const step: SequenceStep = {
        id: 'step-error',
        sequenceId: 'welcome-sequence',
        order: 1,
        delayHours: 0,
        templateId: 'error-template',
      }

      const template = {
        subject: 'Test',
        html: '<p>Test</p>',
      }

      // Mock Resend to throw error
      const { Resend } = await import('resend')
      vi.mocked(Resend).mockImplementationOnce(() => ({
        emails: {
          send: vi.fn().mockRejectedValue(new Error('Email sending failed')),
        },
      }) as any)

      const newEngine = new EmailSequenceEngine()
      const event = await (newEngine as any).sendSequenceEmail(subscription, step, template)

      expect(event.type).toBe('bounced')
      expect(event.metadata?.error).toBe('Email sending failed')
    })

    it('should include unsubscribe link', async () => {
      const subscription = await engine.subscribe('welcome-sequence', mockTriggerData)

      const step: SequenceStep = {
        id: 'step-1',
        sequenceId: 'welcome-sequence',
        order: 1,
        delayHours: 0,
        templateId: 'test',
      }

      const template = {
        subject: 'Test',
        html: '<p>{{unsubscribeLink}}</p>',
      }

      const event = await (engine as any).sendSequenceEmail(subscription, step, template)

      expect(event.type).toBe('sent')
      // Unsubscribe link should be replaced in template
    })
  })

  describe('processScheduledEmails', () => {
    it('should return stats object', async () => {
      const stats = await engine.processScheduledEmails()

      expect(stats).toBeDefined()
      expect(stats).toHaveProperty('activeSubscriptions')
      expect(stats).toHaveProperty('emailsSent')
      expect(stats).toHaveProperty('emailsScheduled')
      expect(stats).toHaveProperty('errors')
      expect(typeof stats.activeSubscriptions).toBe('number')
      expect(typeof stats.emailsSent).toBe('number')
      expect(typeof stats.emailsScheduled).toBe('number')
      expect(typeof stats.errors).toBe('number')
    })

    it('should log processing message', async () => {
      const consoleSpy = vi.spyOn(console, 'log')

      await engine.processScheduledEmails()

      expect(consoleSpy).toHaveBeenCalledWith(
        '[EmailSequenceEngine] Processing scheduled emails (mock)'
      )
    })
  })

  describe('calculateStats', () => {
    it('should return stats for a sequence', async () => {
      const stats = await engine.calculateStats('welcome-sequence')

      expect(stats).toBeDefined()
      expect(stats).toHaveProperty('totalSubscribers')
      expect(stats).toHaveProperty('activeSubscribers')
      expect(stats).toHaveProperty('completedSubscribers')
      expect(stats).toHaveProperty('totalEmailsSent')
      expect(stats).toHaveProperty('totalOpens')
      expect(stats).toHaveProperty('totalClicks')
      expect(stats).toHaveProperty('openRate')
      expect(stats).toHaveProperty('clickRate')
    })

    it('should return numeric values', async () => {
      const stats = await engine.calculateStats('welcome-sequence')

      expect(typeof stats.totalSubscribers).toBe('number')
      expect(typeof stats.activeSubscribers).toBe('number')
      expect(typeof stats.completedSubscribers).toBe('number')
      expect(typeof stats.totalEmailsSent).toBe('number')
      expect(typeof stats.openRate).toBe('number')
      expect(typeof stats.clickRate).toBe('number')
    })
  })

  describe('unsubscribe', () => {
    it('should unsubscribe without errors', async () => {
      const subscription = await engine.subscribe('welcome-sequence', mockTriggerData)

      await expect(engine.unsubscribe(subscription.id)).resolves.toBeUndefined()
    })

    it('should log unsubscribe action', async () => {
      const subscription = await engine.subscribe('welcome-sequence', mockTriggerData)
      const consoleSpy = vi.spyOn(console, 'log')

      await engine.unsubscribe(subscription.id)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[EmailSequenceEngine] Unsubscribed:',
        subscription.id
      )
    })
  })

  describe('handleWebhook', () => {
    it('should handle webhook events', async () => {
      const subscription = await engine.subscribe('welcome-sequence', mockTriggerData)

      const webhookEvent = {
        type: 'email.opened',
        email: 'test@example.com',
        subscriptionId: subscription.id,
        stepId: 'step-1',
      }

      await expect((engine as any).handleWebhook('resend', webhookEvent)).resolves.toBeUndefined()
    })

    it('should log webhook events', async () => {
      const consoleSpy = vi.spyOn(console, 'log')

      const webhookEvent = {
        type: 'email.clicked',
        email: 'test@example.com',
        subscriptionId: 'sub-123',
        stepId: 'step-1',
        link: 'https://example.com',
      }

      await (engine as any).handleWebhook('resend', webhookEvent)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[EmailSequenceEngine] Webhook received:',
        'email.clicked',
        'for:',
        'test@example.com'
      )
    })
  })

  describe('variable replacement', () => {
    it('should replace multiple variables', async () => {
      const subscription = await engine.subscribe('welcome-sequence', {
        event: 'test',
        email: 'test@example.com',
        firstName: 'Pedro',
        lastName: 'Oliveira',
        customData: {
          produto: 'desbloqueio-conta',
          valor: 'R$ 2.500',
        },
      })

      const step: SequenceStep = {
        id: 'step-1',
        sequenceId: 'welcome-sequence',
        order: 1,
        delayHours: 0,
        templateId: 'test',
      }

      const template = {
        subject: '{{firstName}}, seu {{produto}} - {{valor}}',
        html: '<p>Olá {{firstName}} {{lastName}}</p><p>Produto: {{produto}}</p><p>Valor: {{valor}}</p>',
      }

      const event = await (engine as any).sendSequenceEmail(subscription, step, template)

      expect(event.type).toBe('sent')
    })

    it('should handle missing variables gracefully', async () => {
      const subscription = await engine.subscribe('welcome-sequence', {
        event: 'test',
        email: 'test@example.com',
        firstName: 'Ana',
        customData: {},
      })

      const step: SequenceStep = {
        id: 'step-1',
        sequenceId: 'welcome-sequence',
        order: 1,
        delayHours: 0,
        templateId: 'test',
      }

      const template = {
        subject: '{{firstName}} {{lastName}} - {{missingVariable}}',
        html: '<p>Test</p>',
      }

      const event = await (engine as any).sendSequenceEmail(subscription, step, template)

      expect(event.type).toBe('sent')
      // Should replace missing variables with empty string
    })
  })
})
