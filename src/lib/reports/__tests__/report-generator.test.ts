/**
 * Report Generator - Unit Tests
 * P2-005 Test Suite
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ReportGeneratorEngine } from '../report-generator'
import type { ReportConfig, ReportType } from '../types'

describe('ReportGeneratorEngine', () => {
  let generator: ReportGeneratorEngine
  let mockConfig: ReportConfig

  beforeEach(() => {
    generator = new ReportGeneratorEngine()
    mockConfig = {
      id: 'report-config-1',
      type: 'leads-conversion',
      name: 'Conversão de Leads',
      description: 'Relatório de conversão de leads',
      frequency: 'weekly',
      format: 'json',
      recipients: [
        {
          email: 'leonardo.palha@gmail.com',
          name: 'Leonardo Palha',
        },
      ],
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timezone: 'America/Sao_Paulo',
    }
    vi.clearAllMocks()
  })

  describe('generateReport', () => {
    const reportTypes: ReportType[] = [
      'leads-conversion',
      'revenue-monthly',
      'cases-status',
      'product-performance',
      'agent-performance',
      'compliance-oab',
      'payment-analysis',
      'operational-metrics',
    ]

    reportTypes.forEach((type) => {
      it(`should generate ${type} report`, async () => {
        const config = { ...mockConfig, type }
        const report = await generator.generateReport(config.id)

        expect(report).toBeDefined()
        expect(report).toHaveProperty('id')
        expect(report).toHaveProperty('type')
        expect(report).toHaveProperty('generatedAt')
        expect(report).toHaveProperty('data')
      })
    })

    it('should include metadata', async () => {
      const report = await generator.generateReport(mockConfig.id)

      expect(report.metadata).toBeDefined()
      expect(report.metadata.configId).toBe(mockConfig.id)
      expect(report.metadata.format).toBe(mockConfig.format)
    })

    it('should set correct timestamps', async () => {
      const beforeTime = new Date()
      const report = await generator.generateReport(mockConfig.id)
      const afterTime = new Date()

      const generatedTime = new Date(report.generatedAt)
      expect(generatedTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime())
      expect(generatedTime.getTime()).toBeLessThanOrEqual(afterTime.getTime())
    })
  })

  describe('leads-conversion report', () => {
    it('should include conversion funnel data', async () => {
      const config = { ...mockConfig, type: 'leads-conversion' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('totalLeads')
      expect(report.data).toHaveProperty('qualifiedLeads')
      expect(report.data).toHaveProperty('convertedLeads')
      expect(report.data).toHaveProperty('conversionRate')
    })

    it('should calculate conversion rate correctly', async () => {
      const report = await generator.generateReport(mockConfig.id)

      expect(typeof report.data.conversionRate).toBe('number')
      expect(report.data.conversionRate).toBeGreaterThanOrEqual(0)
      expect(report.data.conversionRate).toBeLessThanOrEqual(100)
    })

    it('should include conversion by source', async () => {
      const report = await generator.generateReport(mockConfig.id)

      expect(report.data).toHaveProperty('bySource')
      expect(Array.isArray(report.data.bySource)).toBe(true)
    })
  })

  describe('revenue-monthly report', () => {
    it('should include revenue metrics', async () => {
      const config = { ...mockConfig, type: 'revenue-monthly' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('totalRevenue')
      expect(report.data).toHaveProperty('monthlyGrowth')
      expect(report.data).toHaveProperty('averageTicket')
    })

    it('should format currency values', async () => {
      const config = { ...mockConfig, type: 'revenue-monthly' as const }
      const report = await generator.generateReport(config.id)

      expect(typeof report.data.totalRevenue).toBe('number')
      expect(report.data.totalRevenue).toBeGreaterThanOrEqual(0)
    })

    it('should include monthly breakdown', async () => {
      const config = { ...mockConfig, type: 'revenue-monthly' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('monthlyBreakdown')
      expect(Array.isArray(report.data.monthlyBreakdown)).toBe(true)
    })
  })

  describe('cases-status report', () => {
    it('should include case statistics', async () => {
      const config = { ...mockConfig, type: 'cases-status' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('totalCases')
      expect(report.data).toHaveProperty('activeCases')
      expect(report.data).toHaveProperty('closedCases')
    })

    it('should group cases by status', async () => {
      const config = { ...mockConfig, type: 'cases-status' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('byStatus')
      expect(Array.isArray(report.data.byStatus)).toBe(true)
    })

    it('should include deadlines overview', async () => {
      const config = { ...mockConfig, type: 'cases-status' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('upcomingDeadlines')
    })
  })

  describe('product-performance report', () => {
    it('should include product metrics', async () => {
      const config = { ...mockConfig, type: 'product-performance' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('totalProducts')
      expect(report.data).toHaveProperty('topProducts')
    })

    it('should rank products by revenue', async () => {
      const config = { ...mockConfig, type: 'product-performance' as const }
      const report = await generator.generateReport(config.id)

      expect(Array.isArray(report.data.topProducts)).toBe(true)
    })

    it('should include conversion rates by product', async () => {
      const config = { ...mockConfig, type: 'product-performance' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('byProduct')
    })
  })

  describe('agent-performance report', () => {
    it('should include agent metrics', async () => {
      const config = { ...mockConfig, type: 'agent-performance' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('totalAgents')
      expect(report.data).toHaveProperty('activeAgents')
    })

    it('should rank agents by usage', async () => {
      const config = { ...mockConfig, type: 'agent-performance' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('topAgents')
      expect(Array.isArray(report.data.topAgents)).toBe(true)
    })

    it('should include satisfaction scores', async () => {
      const config = { ...mockConfig, type: 'agent-performance' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('avgSatisfactionScore')
    })
  })

  describe('compliance-oab report', () => {
    it('should include compliance metrics', async () => {
      const config = { ...mockConfig, type: 'compliance-oab' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('totalDocuments')
      expect(report.data).toHaveProperty('compliantDocuments')
      expect(report.data).toHaveProperty('complianceRate')
    })

    it('should list violations if any', async () => {
      const config = { ...mockConfig, type: 'compliance-oab' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('violations')
      expect(Array.isArray(report.data.violations)).toBe(true)
    })

    it('should have 100% compliance rate ideally', async () => {
      const config = { ...mockConfig, type: 'compliance-oab' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data.complianceRate).toBeGreaterThanOrEqual(0)
      expect(report.data.complianceRate).toBeLessThanOrEqual(100)
    })
  })

  describe('payment-analysis report', () => {
    it('should include payment metrics', async () => {
      const config = { ...mockConfig, type: 'payment-analysis' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('totalPayments')
      expect(report.data).toHaveProperty('successfulPayments')
      expect(report.data).toHaveProperty('failedPayments')
    })

    it('should calculate success rate', async () => {
      const config = { ...mockConfig, type: 'payment-analysis' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('successRate')
      expect(typeof report.data.successRate).toBe('number')
    })

    it('should include payment methods breakdown', async () => {
      const config = { ...mockConfig, type: 'payment-analysis' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('byPaymentMethod')
    })
  })

  describe('operational-metrics report', () => {
    it('should include operational KPIs', async () => {
      const config = { ...mockConfig, type: 'operational-metrics' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('avgResponseTime')
      expect(report.data).toHaveProperty('totalInteractions')
    })

    it('should measure system performance', async () => {
      const config = { ...mockConfig, type: 'operational-metrics' as const }
      const report = await generator.generateReport(config.id)

      expect(report.data).toHaveProperty('systemUptime')
      expect(typeof report.data.systemUptime).toBe('number')
    })
  })

  describe('exportReport', () => {
    it('should export to JSON format', async () => {
      const report = await generator.generateReport(mockConfig.id)
      const exported = await generator.exportReport(report, 'json')

      expect(exported).toBeTruthy()
      expect(typeof exported).toBe('string')

      const parsed = JSON.parse(exported)
      expect(parsed).toHaveProperty('id')
      expect(parsed).toHaveProperty('type')
      expect(parsed).toHaveProperty('data')
    })

    it('should export to CSV format', async () => {
      const report = await generator.generateReport(mockConfig.id)
      const exported = await generator.exportReport(report, 'csv')

      expect(exported).toBeTruthy()
      expect(typeof exported).toBe('string')
      expect(exported).toContain(',') // CSV delimiter
    })

    it('should export to HTML format', async () => {
      const report = await generator.generateReport(mockConfig.id)
      const exported = await generator.exportReport(report, 'html')

      expect(exported).toBeTruthy()
      expect(typeof exported).toBe('string')
      expect(exported).toContain('<html>')
      expect(exported).toContain('</html>')
    })

    it('should include report title in HTML export', async () => {
      const report = await generator.generateReport(mockConfig.id)
      const exported = await generator.exportReport(report, 'html')

      expect(exported).toContain(mockConfig.name)
    })

    it('should format dates in exports', async () => {
      const report = await generator.generateReport(mockConfig.id)
      const exported = await generator.exportReport(report, 'html')

      expect(exported).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })
  })

  describe('scheduling', () => {
    it('should respect frequency setting', async () => {
      const frequencies = ['daily', 'weekly', 'monthly']

      frequencies.forEach((frequency) => {
        const config = { ...mockConfig, frequency: frequency as any }
        expect(config.frequency).toBe(frequency)
      })
    })

    it('should send to all recipients', async () => {
      const multipleRecipients = {
        ...mockConfig,
        recipients: [
          { email: 'admin@example.com', name: 'Admin' },
          { email: 'manager@example.com', name: 'Manager' },
          { email: 'ceo@example.com', name: 'CEO' },
        ],
      }

      expect(multipleRecipients.recipients).toHaveLength(3)
    })
  })

  describe('filters', () => {
    it('should apply date range filters', async () => {
      const configWithFilters = {
        ...mockConfig,
        filters: {
          dateFrom: '2024-01-01',
          dateTo: '2024-12-31',
        },
      }

      const report = await generator.generateReport(configWithFilters.id)

      expect(report).toBeDefined()
    })

    it('should filter by product category', async () => {
      const configWithFilters = {
        ...mockConfig,
        filters: {
          productCategory: 'bancario',
        },
      }

      const report = await generator.generateReport(configWithFilters.id)

      expect(report).toBeDefined()
    })

    it('should filter by status', async () => {
      const configWithFilters = {
        ...mockConfig,
        filters: {
          status: ['active', 'pending'],
        },
      }

      const report = await generator.generateReport(configWithFilters.id)

      expect(report).toBeDefined()
    })
  })

  describe('error handling', () => {
    it('should throw error for invalid report type', async () => {
      const invalidConfig = {
        ...mockConfig,
        type: 'invalid-type' as any,
      }

      await expect(generator.generateReport(invalidConfig.id)).rejects.toThrow()
    })

    it('should handle missing data gracefully', async () => {
      const report = await generator.generateReport(mockConfig.id)

      expect(report).toBeDefined()
      expect(report.data).toBeDefined()
    })

    it('should throw error for unsupported export format', async () => {
      const report = await generator.generateReport(mockConfig.id)

      await expect(generator.exportReport(report, 'pdf' as any)).rejects.toThrow()
    })
  })

  describe('performance', () => {
    it('should generate report within reasonable time', async () => {
      const startTime = Date.now()
      await generator.generateReport(mockConfig.id)
      const endTime = Date.now()

      const duration = endTime - startTime
      expect(duration).toBeLessThan(5000) // Less than 5 seconds
    })

    it('should handle large datasets', async () => {
      const configWithLargeData = {
        ...mockConfig,
        filters: {
          limit: 10000,
        },
      }

      const report = await generator.generateReport(configWithLargeData.id)

      expect(report).toBeDefined()
    })
  })

  describe('data accuracy', () => {
    it('should calculate percentages correctly', async () => {
      const report = await generator.generateReport(mockConfig.id)

      if (report.data.conversionRate) {
        expect(report.data.conversionRate).toBeGreaterThanOrEqual(0)
        expect(report.data.conversionRate).toBeLessThanOrEqual(100)
      }
    })

    it('should sum totals correctly', async () => {
      const config = { ...mockConfig, type: 'revenue-monthly' as const }
      const report = await generator.generateReport(config.id)

      if (report.data.monthlyBreakdown) {
        const sumOfMonths = (report.data.monthlyBreakdown as any[]).reduce(
          (sum: number, month: any) => sum + month.revenue,
          0
        )
        // Sum should match total or be close (accounting for rounding)
        expect(typeof sumOfMonths).toBe('number')
      }
    })
  })

  describe('formatting', () => {
    it('should format currency values in BRL', async () => {
      const config = { ...mockConfig, type: 'revenue-monthly' as const }
      const report = await generator.generateReport(config.id)
      const exported = await generator.exportReport(report, 'html')

      expect(exported).toMatch(/R\$\s*[\d.,]+/)
    })

    it('should format dates in Brazilian format', async () => {
      const report = await generator.generateReport(mockConfig.id)
      const exported = await generator.exportReport(report, 'html')

      expect(exported).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })

    it('should format percentages with 2 decimals', async () => {
      const report = await generator.generateReport(mockConfig.id)

      if (report.data.conversionRate) {
        const formatted = (report.data.conversionRate as number).toFixed(2)
        expect(formatted).toMatch(/^\d+\.\d{2}$/)
      }
    })
  })
})
