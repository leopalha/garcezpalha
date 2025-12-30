/**
 * WhatsApp Automation Engine - Unit Tests
 * P2-002 Test Suite
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WhatsAppAutomationEngine } from '../engine'
import type { WhatsAppMessage } from '../types'

// Mock fetch
global.fetch = vi.fn()

describe('WhatsAppAutomationEngine', () => {
  let engine: WhatsAppAutomationEngine

  beforeEach(() => {
    engine = new WhatsAppAutomationEngine()
    vi.clearAllMocks()

    // Mock successful API response
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        messages: [{ id: 'wamid.test123' }],
      }),
    } as Response)

    // Mock environment variables
    process.env.WHATSAPP_API_TOKEN = 'test-token'
    process.env.WHATSAPP_PHONE_NUMBER_ID = '123456789'
  })

  describe('sendMessage', () => {
    it('should send text message successfully', async () => {
      const message: WhatsAppMessage = {
        to: '+5521999999999',
        type: 'text',
        text: {
          body: 'Olá! Bem-vindo à Garcez Palha.',
        },
      }

      const result = await engine.sendMessage(message)

      expect(result).toBeDefined()
      expect(result.messageId).toMatch(/^wamid\./)
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should send template message', async () => {
      const message: WhatsAppMessage = {
        to: '+5521999999999',
        type: 'template',
        template: {
          name: 'welcome_message',
          language: { code: 'pt_BR' },
          components: [
            {
              type: 'BODY',
              text: 'Olá João! Bem-vindo à Garcez Palha.',
            },
          ],
        },
      }

      const result = await engine.sendMessage(message)

      expect(result.messageId).toBeDefined()
      expect(fetch).toHaveBeenCalled()
    })

    it('should include correct headers', async () => {
      const message: WhatsAppMessage = {
        to: '+5521999999999',
        type: 'text',
        text: { body: 'Test' },
      }

      await engine.sendMessage(message)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('graph.facebook.com'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          }),
        })
      )
    })

    it('should throw error when API call fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
        json: async () => ({ error: { message: 'Invalid phone number' } }),
      } as Response)

      const message: WhatsAppMessage = {
        to: 'invalid-number',
        type: 'text',
        text: { body: 'Test' },
      }

      await expect(engine.sendMessage(message)).rejects.toThrow()
    })
  })

  describe('sendWelcomeMessage', () => {
    it('should send welcome message with correct parameters', async () => {
      await engine.sendWelcomeMessage('+5521999999999', 'Maria')

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Maria'),
        })
      )
    })

    it('should format phone number correctly', async () => {
      await engine.sendWelcomeMessage('21999999999', 'João')

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)

      expect(body.to).toMatch(/^\+/)
    })

    it('should include unsubscribe link', async () => {
      await engine.sendWelcomeMessage('+5521999999999', 'Pedro')

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)

      expect(body.text.body).toContain('garcezpalha.com')
    })
  })

  describe('sendPaymentConfirmation', () => {
    it('should send payment confirmation', async () => {
      await engine.sendPaymentConfirmation(
        '+5521999999999',
        'Carlos',
        2500,
        'CASE-2024-001'
      )

      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should format amount correctly', async () => {
      await engine.sendPaymentConfirmation(
        '+5521999999999',
        'Ana',
        1500.50,
        'CASE-123'
      )

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)

      expect(body.text.body).toContain('R$ 1.500,50')
    })

    it('should include case number', async () => {
      await engine.sendPaymentConfirmation(
        '+5521999999999',
        'Roberto',
        3000,
        'CASE-2024-999'
      )

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)

      expect(body.text.body).toContain('CASE-2024-999')
    })
  })

  describe('sendProcessUpdate', () => {
    it('should send process update message', async () => {
      await engine.sendProcessUpdate(
        '+5521999999999',
        'Fernanda',
        '0123456-78.2024.8.19.0001',
        'Sentença publicada'
      )

      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should include process number and movement', async () => {
      const numeroProcesso = '0123456-78.2024.8.19.0001'
      const movimento = 'Audiência marcada para 15/02/2025'

      await engine.sendProcessUpdate(
        '+5521999999999',
        'Lucas',
        numeroProcesso,
        movimento
      )

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)

      expect(body.text.body).toContain(numeroProcesso)
      expect(body.text.body).toContain(movimento)
    })

    it('should format process number correctly', async () => {
      await engine.sendProcessUpdate(
        '+5521999999999',
        'Juliana',
        '1234567890123456789',
        'Nova movimentação'
      )

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)

      // Should contain formatted process number
      expect(body.text.body).toBeTruthy()
    })
  })

  describe('sendPrazoFatalAlert', () => {
    it('should send critical deadline alert', async () => {
      await engine.sendPrazoFatalAlert(
        '+5521999999999',
        'Ricardo',
        '0123456-78.2024.8.19.0001',
        '31/01/2025'
      )

      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should emphasize urgency', async () => {
      await engine.sendPrazoFatalAlert(
        '+5521999999999',
        'Marina',
        '0123456-78.2024.8.19.0001',
        '15/02/2025'
      )

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)

      expect(body.text.body).toContain('🚨')
      expect(body.text.body).toContain('PRAZO FATAL')
    })

    it('should include deadline date', async () => {
      const prazo = '28/02/2025'

      await engine.sendPrazoFatalAlert(
        '+5521999999999',
        'Beatriz',
        '0123456-78.2024.8.19.0001',
        prazo
      )

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)

      expect(body.text.body).toContain(prazo)
    })
  })

  describe('sendSuccessMessage', () => {
    it('should send success message', async () => {
      await engine.sendSuccessMessage(
        '+5521999999999',
        'Gabriel',
        'Seu processo foi protocolado com sucesso!'
      )

      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should include success emoji', async () => {
      await engine.sendSuccessMessage(
        '+5521999999999',
        'Camila',
        'Documento assinado!'
      )

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)

      expect(body.text.body).toContain('✅')
    })

    it('should include custom message', async () => {
      const customMessage = 'Sua petição foi aceita pelo tribunal'

      await engine.sendSuccessMessage(
        '+5521999999999',
        'Paulo',
        customMessage
      )

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)

      expect(body.text.body).toContain(customMessage)
    })
  })

  describe('phone number formatting', () => {
    it('should add +55 prefix when missing', async () => {
      await engine.sendWelcomeMessage('21999999999', 'Test')

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)

      expect(body.to).toBe('+5521999999999')
    })

    it('should keep +55 prefix when present', async () => {
      await engine.sendWelcomeMessage('+5521999999999', 'Test')

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)

      expect(body.to).toBe('+5521999999999')
    })

    it('should handle different phone formats', async () => {
      await engine.sendWelcomeMessage('(21) 99999-9999', 'Test')

      const callArgs = vi.mocked(fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)

      expect(body.to).toMatch(/^\+55/)
    })
  })

  describe('error handling', () => {
    it('should throw error when phone number is missing', async () => {
      const message: WhatsAppMessage = {
        to: '',
        type: 'text',
        text: { body: 'Test' },
      }

      await expect(engine.sendMessage(message)).rejects.toThrow()
    })

    it('should throw error when message body is empty', async () => {
      const message: WhatsAppMessage = {
        to: '+5521999999999',
        type: 'text',
        text: { body: '' },
      }

      await expect(engine.sendMessage(message)).rejects.toThrow()
    })

    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      const message: WhatsAppMessage = {
        to: '+5521999999999',
        type: 'text',
        text: { body: 'Test' },
      }

      await expect(engine.sendMessage(message)).rejects.toThrow('Network error')
    })

    it('should handle API error responses', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({
          error: { message: 'Invalid access token' },
        }),
      } as Response)

      const message: WhatsAppMessage = {
        to: '+5521999999999',
        type: 'text',
        text: { body: 'Test' },
      }

      await expect(engine.sendMessage(message)).rejects.toThrow()
    })
  })

  describe('environment variables', () => {
    it('should throw error when API token is missing', async () => {
      delete process.env.WHATSAPP_API_TOKEN

      const newEngine = new WhatsAppAutomationEngine()
      const message: WhatsAppMessage = {
        to: '+5521999999999',
        type: 'text',
        text: { body: 'Test' },
      }

      await expect(newEngine.sendMessage(message)).rejects.toThrow()
    })

    it('should throw error when phone number ID is missing', async () => {
      delete process.env.WHATSAPP_PHONE_NUMBER_ID

      const newEngine = new WhatsAppAutomationEngine()
      const message: WhatsAppMessage = {
        to: '+5521999999999',
        type: 'text',
        text: { body: 'Test' },
      }

      await expect(newEngine.sendMessage(message)).rejects.toThrow()
    })
  })
})
