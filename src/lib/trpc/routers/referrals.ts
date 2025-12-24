import { z } from 'zod'
import { publicProcedure, router } from '../init'

// Referral types
const ReferralStatus = z.enum(['pending', 'qualified', 'converted', 'rejected', 'paid'])

const ReferralSchema = z.object({
  id: z.string(),
  partnerId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  status: ReferralStatus,
  caseType: z.string(),
  notes: z.string().nullable(),
  commission: z.number().nullable(),
  createdAt: z.string(),
  qualifiedAt: z.string().nullable(),
  convertedAt: z.string().nullable(),
  paidAt: z.string().nullable(),
})

// Mock data for demo mode
const mockReferrals: Array<z.infer<typeof ReferralSchema>> = [
  {
    id: '1',
    partnerId: 'partner-1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(21) 99999-1111',
    status: 'converted',
    caseType: 'Trabalhista',
    notes: 'Cliente muito satisfeito',
    commission: 2500,
    createdAt: '2024-01-15T10:00:00Z',
    qualifiedAt: '2024-01-16T14:00:00Z',
    convertedAt: '2024-01-20T09:00:00Z',
    paidAt: null,
  },
  {
    id: '2',
    partnerId: 'partner-1',
    name: 'João Santos',
    email: 'joao.santos@email.com',
    phone: '(21) 98888-2222',
    status: 'qualified',
    caseType: 'Cível',
    notes: 'Em negociação',
    commission: null,
    createdAt: '2024-01-14T08:30:00Z',
    qualifiedAt: '2024-01-15T16:00:00Z',
    convertedAt: null,
    paidAt: null,
  },
  {
    id: '3',
    partnerId: 'partner-1',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(21) 97777-3333',
    status: 'pending',
    caseType: 'Família',
    notes: 'Aguardando contato inicial',
    commission: null,
    createdAt: '2024-01-13T11:00:00Z',
    qualifiedAt: null,
    convertedAt: null,
    paidAt: null,
  },
]

const mockPartnerStats = {
  totalReferrals: 15,
  pendingReferrals: 3,
  qualifiedReferrals: 2,
  convertedReferrals: 10,
  rejectedReferrals: 0,
  totalEarnings: 12500,
  pendingEarnings: 4300,
  paidEarnings: 8200,
  conversionRate: 66.7,
  averageCommission: 1250,
}

const mockLinkStats = {
  totalClicks: 245,
  uniqueVisitors: 189,
  conversions: 15,
  conversionRate: 7.9,
}

export const referralsRouter = router({
  // Get partner's referrals
  list: publicProcedure
    .input(
      z.object({
        partnerId: z.string().optional(),
        status: ReferralStatus.optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      // In production, this would query the database
      // For now, return mock data
      let filtered = mockReferrals

      if (input.status) {
        filtered = filtered.filter((r) => r.status === input.status)
      }

      const total = filtered.length
      const referrals = filtered.slice(input.offset, input.offset + input.limit)

      return {
        referrals,
        total,
        hasMore: input.offset + referrals.length < total,
      }
    }),

  // Get single referral by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const referral = mockReferrals.find((r) => r.id === input.id)
      if (!referral) {
        throw new Error('Referral not found')
      }
      return referral
    }),

  // Create new referral
  create: publicProcedure
    .input(
      z.object({
        partnerId: z.string(),
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string(),
        caseType: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // In production, this would insert into database
      const newReferral: z.infer<typeof ReferralSchema> = {
        id: `ref-${Date.now()}`,
        partnerId: input.partnerId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        caseType: input.caseType,
        status: 'pending',
        notes: input.notes || null,
        commission: null,
        createdAt: new Date().toISOString(),
        qualifiedAt: null,
        convertedAt: null,
        paidAt: null,
      }

      // Mock adding to array
      mockReferrals.push(newReferral)

      return newReferral
    }),

  // Update referral status
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: ReferralStatus,
        commission: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const referralIndex = mockReferrals.findIndex((r) => r.id === input.id)
      if (referralIndex === -1) {
        throw new Error('Referral not found')
      }

      const referral = mockReferrals[referralIndex]
      const now = new Date().toISOString()

      // Update status and relevant timestamps
      const updated: z.infer<typeof ReferralSchema> = {
        ...referral,
        status: input.status,
        notes: input.notes !== undefined ? input.notes : referral.notes,
      }

      if (input.status === 'qualified' && !referral.qualifiedAt) {
        updated.qualifiedAt = now
      }
      if (input.status === 'converted' && !referral.convertedAt) {
        updated.convertedAt = now
        if (input.commission) {
          updated.commission = input.commission
        }
      }
      if (input.status === 'paid' && !referral.paidAt) {
        updated.paidAt = now
      }

      mockReferrals[referralIndex] = updated
      return updated
    }),

  // Get partner statistics
  getStats: publicProcedure
    .input(z.object({ partnerId: z.string().optional() }))
    .query(async () => {
      // In production, this would aggregate from database
      return mockPartnerStats
    }),

  // Get link click statistics
  getLinkStats: publicProcedure
    .input(z.object({ partnerId: z.string().optional() }))
    .query(async () => {
      // In production, this would query analytics data
      return mockLinkStats
    }),

  // Track a link click
  trackClick: publicProcedure
    .input(
      z.object({
        partnerCode: z.string(),
        source: z.string().optional(),
        userAgent: z.string().optional(),
        ipAddress: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // In production, this would log the click to database/analytics
      console.log('Tracking click:', input)
      return { success: true, timestamp: new Date().toISOString() }
    }),

  // Get commission summary
  getCommissions: publicProcedure
    .input(
      z.object({
        partnerId: z.string().optional(),
        status: z.enum(['pending', 'processing', 'paid']).optional(),
      })
    )
    .query(async () => {
      // Calculate commissions from referrals
      const commissions = mockReferrals
        .filter((r) => r.commission !== null)
        .map((r) => ({
          id: `comm-${r.id}`,
          referralId: r.id,
          referralName: r.name,
          amount: r.commission!,
          status: r.paidAt ? 'paid' : 'pending',
          createdAt: r.convertedAt || r.createdAt,
          paidAt: r.paidAt,
        }))

      return {
        commissions,
        totalPending: commissions
          .filter((c) => c.status === 'pending')
          .reduce((sum, c) => sum + c.amount, 0),
        totalPaid: commissions
          .filter((c) => c.status === 'paid')
          .reduce((sum, c) => sum + c.amount, 0),
      }
    }),

  // Request withdrawal
  requestWithdrawal: publicProcedure
    .input(
      z.object({
        partnerId: z.string(),
        amount: z.number().min(100),
        paymentMethod: z.enum(['pix', 'bank_transfer']),
      })
    )
    .mutation(async ({ input }) => {
      // In production, this would create a withdrawal request
      return {
        id: `wd-${Date.now()}`,
        ...input,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedPaymentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      }
    }),
})

export type ReferralsRouter = typeof referralsRouter
