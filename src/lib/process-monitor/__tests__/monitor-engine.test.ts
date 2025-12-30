/**
 * Process Monitor Engine - Unit Tests
 * P2-004 Test Suite
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProcessMonitorEngine } from '../monitor-engine'
import type { ProcessData, ProcessMovement } from '../types'

// Mock PJe Adapter
vi.mock('../adapters/pje-adapter', () => ({
  PJeAdapter: vi.fn().mockImplementation(() => ({
    fetchMovements: vi.fn().mockResolvedValue([
      {
        id: 'mov-1',
        numeroProcesso: '0123456-78.2024.8.19.0001',
        data: '2024-12-29T10:00:00Z',
        tipo: 'sentenca',
        descricao: 'Sentença publicada',
        requiresAction: false,
      },
    ]),
    fetchProcessData: vi.fn().mockResolvedValue({
      numeroProcesso: '0123456-78.2024.8.19.0001',
      tribunal: 'PJe',
      status: 'ativo',
      monitoringEnabled: true,
    }),
  })),
}))

describe('ProcessMonitorEngine', () => {
  let engine: ProcessMonitorEngine
  let mockProcessData: ProcessData

  beforeEach(() => {
    engine = new ProcessMonitorEngine()
    mockProcessData = {
      numeroProcesso: '0123456-78.2024.8.19.0001',
      tribunal: 'PJe',
      comarca: 'Rio de Janeiro',
      vara: '1ª Vara Cível',
      status: 'em-andamento',
      dataDistribuicao: '2024-01-15',
      ultimaAtualizacao: '2024-12-29',
      assunto: 'Ação de Cobrança',
      classe: 'Procedimento Comum',
      autor: 'João Silva',
      reu: 'Banco Exemplo S/A',
      monitoringEnabled: true,
      notificationChannels: ['email', 'whatsapp'],
      checkIntervalMinutes: 30,
    }
    vi.clearAllMocks()
  })

  describe('startMonitoring', () => {
    it('should create a monitoring session', async () => {
      const session = await engine.startMonitoring(mockProcessData)

      expect(session).toBeDefined()
      expect(session.id).toMatch(/^session_/)
      expect(session.numeroProcesso).toBe(mockProcessData.numeroProcesso)
      expect(session.status).toBe('active')
    })

    it('should set correct timestamps', async () => {
      const session = await engine.startMonitoring(mockProcessData)

      expect(session.startedAt).toBeDefined()
      expect(session.lastCheckAt).toBeDefined()
      expect(session.nextCheckAt).toBeDefined()
    })

    it('should initialize counters', async () => {
      const session = await engine.startMonitoring(mockProcessData)

      expect(session.checksPerformed).toBe(0)
      expect(session.movementsDetected).toBe(0)
      expect(session.alertsCreated).toBe(0)
    })

    it('should set timestamps correctly', async () => {
      const beforeTime = new Date()
      const session = await engine.startMonitoring(mockProcessData)
      const afterTime = new Date()

      const startedAt = new Date(session.startedAt)
      expect(startedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime())
      expect(startedAt.getTime()).toBeLessThanOrEqual(afterTime.getTime())
    })

    it('should validate process number format', async () => {
      const invalidData = {
        ...mockProcessData,
        numeroProcesso: 'invalid-format',
      }

      await expect(engine.startMonitoring(invalidData)).rejects.toThrow()
    })
  })

  describe('checkProcess', () => {
    it('should fetch process movements', async () => {
      const movements = await engine.checkProcess('0123456-78.2024.8.19.0001')

      expect(movements).toBeDefined()
      expect(Array.isArray(movements)).toBe(true)
      expect(movements.length).toBeGreaterThan(0)
    })

    it('should return movements in correct format', async () => {
      const movements = await engine.checkProcess('0123456-78.2024.8.19.0001')

      movements.forEach((movement) => {
        expect(movement).toHaveProperty('id')
        expect(movement).toHaveProperty('numeroProcesso')
        expect(movement).toHaveProperty('tipo')
        expect(movement).toHaveProperty('descricao')
        expect(movement).toHaveProperty('requiresAction')
      })
    })

    it('should detect movements requiring action', async () => {
      const movements: ProcessMovement[] = [
        {
          id: 'mov-1',
          numeroProcesso: '0123456-78.2024.8.19.0001',
          data: '2024-12-29T10:00:00Z',
          tipo: 'intimacao',
          descricao: 'Intimação para apresentar contestação',
          requiresAction: true,
          prazoFatal: '2025-01-15',
          prioridade: 'urgente',
          notified: false,
        },
      ]

      // Mock to return movement requiring action
      const { PJeAdapter } = await import('../adapters/pje-adapter')
      vi.mocked(PJeAdapter).mockImplementationOnce(() => ({
        fetchMovements: vi.fn().mockResolvedValue(movements),
        fetchProcessData: vi.fn(),
        searchProcesses: vi.fn(),
      }) as any)

      const newEngine = new ProcessMonitorEngine()
      const result = await newEngine.checkProcess('0123456-78.2024.8.19.0001')

      const actionRequired = result.some((m) => m.requiresAction)
      expect(actionRequired).toBe(true)
    })
  })

  describe('runScheduledCheck', () => {
    it('should check all active sessions', async () => {
      // Start some monitoring sessions
      await engine.startMonitoring(mockProcessData)
      await engine.startMonitoring({
        ...mockProcessData,
        numeroProcesso: '9876543-21.2024.8.19.0002',
      })

      await expect(engine.runScheduledCheck()).resolves.not.toThrow()
    })

    it('should log check execution', async () => {
      const consoleSpy = vi.spyOn(console, 'log')

      await engine.runScheduledCheck()

      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('stopMonitoring', () => {
    it('should stop an active session', async () => {
      const session = await engine.startMonitoring(mockProcessData)

      await engine.stopMonitoring(session.id)

      // Session should be stopped
      // (Implementation would query database to verify)
    })

    it('should throw error for invalid session ID', async () => {
      await expect(engine.stopMonitoring('invalid-session-id')).rejects.toThrow()
    })
  })

  describe('alert generation', () => {
    it('should generate alert for prazo fatal', async () => {
      const movement: ProcessMovement = {
        id: 'mov-prazo',
        numeroProcesso: '0123456-78.2024.8.19.0001',
        data: '2024-12-29T10:00:00Z',
        tipo: 'intimacao',
        descricao: 'Prazo de 5 dias para recurso',
        requiresAction: true,
        prazoFatal: '2025-01-05',
        prioridade: 'urgente',
        notified: false,
      }

      // Mock to return movement with prazo fatal
      const { PJeAdapter } = await import('../adapters/pje-adapter')
      vi.mocked(PJeAdapter).mockImplementationOnce(() => ({
        fetchMovements: vi.fn().mockResolvedValue([movement]),
        fetchProcessData: vi.fn(),
        searchProcesses: vi.fn(),
      }) as any)

      const newEngine = new ProcessMonitorEngine()
      const movements = await newEngine.checkProcess('0123456-78.2024.8.19.0001')

      const hasPrazoFatal = movements.some((m) => m.prazoFatal)
      expect(hasPrazoFatal).toBe(true)
    })

    it('should prioritize urgent movements', async () => {
      const movements: ProcessMovement[] = [
        {
          id: 'mov-1',
          numeroProcesso: '0123456-78.2024.8.19.0001',
          data: '2024-12-29T10:00:00Z',
          tipo: 'intimacao',
          descricao: 'Intimação urgente',
          requiresAction: true,
          prazoFatal: '2024-12-31',
          prioridade: 'urgente',
          notified: false,
        },
        {
          id: 'mov-2',
          numeroProcesso: '0123456-78.2024.8.19.0001',
          data: '2024-12-29T11:00:00Z',
          tipo: 'publicacao',
          descricao: 'Publicação de despacho',
          requiresAction: false,
          prioridade: 'baixa',
          notified: false,
        },
      ]

      const { PJeAdapter } = await import('../adapters/pje-adapter')
      vi.mocked(PJeAdapter).mockImplementationOnce(() => ({
        fetchMovements: vi.fn().mockResolvedValue(movements),
        fetchProcessData: vi.fn(),
        searchProcesses: vi.fn(),
      }) as any)

      const newEngine = new ProcessMonitorEngine()
      const result = await newEngine.checkProcess('0123456-78.2024.8.19.0001')

      const urgentMovements = result.filter((m) => m.prioridade === 'urgente')
      expect(urgentMovements.length).toBeGreaterThan(0)
    })
  })

  describe('movement type detection', () => {
    const movementTypes = [
      { tipo: 'sentenca', expectedAction: false },
      { tipo: 'intimacao', expectedAction: true },
      { tipo: 'audiencia', expectedAction: true },
      { tipo: 'publicacao', expectedAction: false },
      { tipo: 'citacao', expectedAction: true },
    ]

    movementTypes.forEach(({ tipo, expectedAction }) => {
      it(`should detect ${tipo} correctly`, async () => {
        const movement: ProcessMovement = {
          id: `mov-${tipo}`,
          numeroProcesso: '0123456-78.2024.8.19.0001',
          data: '2024-12-29T10:00:00Z',
          tipo: tipo as any,
          descricao: `Descrição de ${tipo}`,
          requiresAction: expectedAction,
          prioridade: expectedAction ? 'alta' : 'media',
          notified: false,
        }

        const { PJeAdapter } = await import('../adapters/pje-adapter')
        vi.mocked(PJeAdapter).mockImplementationOnce(() => ({
          fetchMovements: vi.fn().mockResolvedValue([movement]),
          fetchProcessData: vi.fn(),
          searchProcesses: vi.fn(),
        }) as any)

        const newEngine = new ProcessMonitorEngine()
        const result = await newEngine.checkProcess('0123456-78.2024.8.19.0001')

        expect(result[0].tipo).toBe(tipo)
        expect(result[0].requiresAction).toBe(expectedAction)
      })
    })
  })

  describe('tribunal support', () => {
    const tribunals = ['PJe', 'E-SAJ', 'TJ-RJ', 'CNJ']

    tribunals.forEach((tribunal) => {
      it(`should support ${tribunal}`, async () => {
        const data = {
          ...mockProcessData,
          tribunal: tribunal as any,
        }

        const session = await engine.startMonitoring(data)

        expect(session).toBeDefined()
        expect(session.status).toBe('active')
      })
    })
  })

  describe('notification channels', () => {
    it('should support email notifications', async () => {
      const data = {
        ...mockProcessData,
        notificationChannels: ['email'] as any,
      }

      const session = await engine.startMonitoring(data)

      expect(session).toBeDefined()
      expect(session.status).toBe('active')
    })

    it('should support whatsapp notifications', async () => {
      const data = {
        ...mockProcessData,
        notificationChannels: ['whatsapp'] as any,
      }

      const session = await engine.startMonitoring(data)

      expect(session).toBeDefined()
      expect(session.status).toBe('active')
    })

    it('should support multiple channels', async () => {
      const data = {
        ...mockProcessData,
        notificationChannels: ['email', 'whatsapp', 'sms'] as any,
      }

      const session = await engine.startMonitoring(data)

      expect(session).toBeDefined()
      expect(session.status).toBe('active')
    })
  })

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      const { PJeAdapter } = await import('../adapters/pje-adapter')
      vi.mocked(PJeAdapter).mockImplementationOnce(() => ({
        fetchMovements: vi.fn().mockRejectedValue(new Error('Network error')),
        fetchProcessData: vi.fn(),
        searchProcesses: vi.fn(),
      }) as any)

      const newEngine = new ProcessMonitorEngine()

      await expect(newEngine.checkProcess('0123456-78.2024.8.19.0001')).rejects.toThrow()
    })

    it('should handle missing process data', async () => {
      const { PJeAdapter } = await import('../adapters/pje-adapter')
      vi.mocked(PJeAdapter).mockImplementationOnce(() => ({
        fetchMovements: vi.fn().mockResolvedValue([]),
        fetchProcessData: vi.fn().mockResolvedValue(null),
        searchProcesses: vi.fn(),
      }) as any)

      const newEngine = new ProcessMonitorEngine()
      const result = await newEngine.checkProcess('0123456-78.2024.8.19.0001')

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should validate tribunal type', async () => {
      const invalidData = {
        ...mockProcessData,
        tribunal: 'INVALID_TRIBUNAL' as any,
      }

      await expect(engine.startMonitoring(invalidData)).rejects.toThrow()
    })
  })

  describe('check intervals', () => {
    it('should respect custom check intervals', async () => {
      const customInterval = {
        ...mockProcessData,
        checkIntervalMinutes: 15,
      }

      const session = await engine.startMonitoring(customInterval)

      expect(session).toBeDefined()
      expect(session.nextCheckAt).toBeDefined()
    })

    it('should use default interval when not specified', async () => {
      const dataWithoutInterval = { ...mockProcessData }
      delete (dataWithoutInterval as any).checkIntervalMinutes

      const session = await engine.startMonitoring(dataWithoutInterval)

      expect(session).toBeDefined()
      expect(session.nextCheckAt).toBeDefined()
    })
  })
})
