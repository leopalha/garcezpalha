import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, adminProcedure } from '../init'
import { TRPCError } from '@trpc/server'
import { sendLeadWelcomeEmail } from '@/lib/email/send'

export const leadsRouter = router({
  // Public - Create a new lead from contact form
  create: publicProcedure
    .input(
      z.object({
        full_name: z.string().min(1, 'Nome completo é obrigatório'),
        email: z.string().email('Email inválido'),
        phone: z.string().min(10, 'Telefone inválido'),
        company: z.string().optional(),
        service_interest: z.string().min(1, 'Serviço de interesse é obrigatório'),
        message: z.string().optional(),
        source: z.enum(['website', 'whatsapp', 'chatbot', 'referral']).default('website'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('leads')
        .insert({
          full_name: input.full_name,
          email: input.email,
          phone: input.phone,
          company: input.company,
          service_interest: input.service_interest,
          message: input.message,
          source: input.source,
          status: 'new',
        })
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao criar lead',
          cause: error,
        })
      }

      // Send welcome email asynchronously (don't block the response)
      sendLeadWelcomeEmail(input.email, {
        name: input.full_name.split(' ')[0], // First name only
        service: input.service_interest,
      }).catch((err) => {
        console.error('Failed to send welcome email:', err)
      })

      return data
    }),

  // Protected - List all leads (admins and lawyers only)
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
        source: z.enum(['website', 'whatsapp', 'chatbot', 'referral']).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(input.offset, input.offset + input.limit - 1)

      if (input.status) {
        query = query.eq('status', input.status)
      }

      if (input.source) {
        query = query.eq('source', input.source)
      }

      const { data, error, count } = await query

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao listar leads',
          cause: error,
        })
      }

      return {
        leads: data,
        total: count ?? 0,
      }
    }),

  // Protected - Get single lead by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('leads')
        .select('*')
        .eq('id', input.id)
        .single()

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Lead não encontrado',
          cause: error,
        })
      }

      return data
    }),

  // Protected - Update lead status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']),
        assigned_to: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('leads')
        .update({
          status: input.status,
          assigned_to: input.assigned_to,
        })
        .eq('id', input.id)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao atualizar lead',
          cause: error,
        })
      }

      return data
    }),

  // Admin - Delete lead
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from('leads')
        .delete()
        .eq('id', input.id)

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao deletar lead',
          cause: error,
        })
      }

      return { success: true }
    }),
})
