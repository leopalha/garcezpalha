import { z } from 'zod'
import { router, protectedProcedure, adminProcedure } from '../init'
import { TRPCError } from '@trpc/server'

export const invoicesRouter = router({
  // List all invoices
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.supabase
        .from('invoices')
        .select('*, clients(company_name)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(input.offset, input.offset + input.limit - 1)

      if (input.status) {
        query = query.eq('status', input.status)
      }

      const { data, error, count } = await query

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao listar faturas',
          cause: error,
        })
      }

      return {
        invoices: data,
        total: count ?? 0,
      }
    }),

  // Get single invoice by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('invoices')
        .select('*, clients(*)')
        .eq('id', input.id)
        .single()

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Fatura não encontrada',
          cause: error,
        })
      }

      return data
    }),

  // Create new invoice
  create: protectedProcedure
    .input(
      z.object({
        client_id: z.string().uuid(),
        invoice_number: z.string(),
        amount: z.number().positive(),
        description: z.string(),
        issue_date: z.string(),
        due_date: z.string(),
        status: z.enum(['draft', 'sent']).default('draft'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('invoices')
        .insert(input)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao criar fatura',
          cause: error,
        })
      }

      return data
    }),

  // Update invoice
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        invoice_number: z.string().optional(),
        amount: z.number().positive().optional(),
        description: z.string().optional(),
        issue_date: z.string().optional(),
        due_date: z.string().optional(),
        status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
        payment_method: z.string().optional(),
        paid_date: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input

      const { data, error } = await ctx.supabase
        .from('invoices')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao atualizar fatura',
          cause: error,
        })
      }

      return data
    }),

  // Mark invoice as paid
  markAsPaid: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        payment_method: z.string(),
        paid_date: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('invoices')
        .update({
          status: 'paid',
          payment_method: input.payment_method,
          paid_date: input.paid_date || new Date().toISOString(),
        })
        .eq('id', input.id)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao marcar fatura como paga',
          cause: error,
        })
      }

      return data
    }),

  // Send invoice to client (update status to sent)
  send: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('invoices')
        .update({ status: 'sent' })
        .eq('id', input.id)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao enviar fatura',
          cause: error,
        })
      }

      // TODO: Send email to client with invoice
      // await sendInvoiceEmail(data)

      return data
    }),

  // Delete invoice (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from('invoices')
        .delete()
        .eq('id', input.id)

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao deletar fatura',
          cause: error,
        })
      }

      return { success: true }
    }),

  // Get stats
  stats: protectedProcedure.query(async ({ ctx }) => {
    const { data: all } = await ctx.supabase.from('invoices').select('amount, status')

    if (!all) {
      return {
        totalRevenue: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        totalInvoices: 0,
      }
    }

    const totalRevenue = all.filter((i) => i.status === 'paid').reduce((acc, i) => acc + (i.amount || 0), 0)
    const pendingAmount = all
      .filter((i) => i.status === 'sent' || i.status === 'overdue')
      .reduce((acc, i) => acc + (i.amount || 0), 0)
    const overdueAmount = all.filter((i) => i.status === 'overdue').reduce((acc, i) => acc + (i.amount || 0), 0)

    return {
      totalRevenue,
      pendingAmount,
      overdueAmount,
      totalInvoices: all.length,
    }
  }),
})
