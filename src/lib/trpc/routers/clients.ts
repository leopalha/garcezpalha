import { z } from 'zod'
import { router, protectedProcedure, adminProcedure } from '../init'
import { TRPCError } from '@trpc/server'

export const clientsRouter = router({
  // Protected - List all clients
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(['active', 'inactive', 'archived']).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.supabase
        .from('clients')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(input.offset, input.offset + input.limit - 1)

      if (input.status) {
        query = query.eq('status', input.status)
      }

      const { data, error, count } = await query

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao listar clientes',
          cause: error,
        })
      }

      return {
        clients: data,
        total: count ?? 0,
      }
    }),

  // Protected - Get single client by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('clients')
        .select('*')
        .eq('id', input.id)
        .single()

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Cliente não encontrado',
          cause: error,
        })
      }

      return data
    }),

  // Protected - Create client (usually from converted lead)
  create: protectedProcedure
    .input(
      z.object({
        user_id: z.string().uuid().optional(),
        lead_id: z.string().uuid().optional(),
        company_name: z.string().optional(),
        cpf_cnpj: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip_code: z.string().optional(),
        assigned_lawyer: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('clients')
        .insert({
          ...input,
          status: 'active',
        })
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao criar cliente',
          cause: error,
        })
      }

      // If created from lead, update lead status to converted
      if (input.lead_id) {
        await ctx.supabase
          .from('leads')
          .update({ status: 'converted' })
          .eq('id', input.lead_id)
      }

      return data
    }),

  // Protected - Update client
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        company_name: z.string().optional(),
        cpf_cnpj: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip_code: z.string().optional(),
        status: z.enum(['active', 'inactive', 'archived']).optional(),
        assigned_lawyer: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input

      const { data, error } = await ctx.supabase
        .from('clients')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao atualizar cliente',
          cause: error,
        })
      }

      return data
    }),

  // Admin - Delete client
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from('clients')
        .delete()
        .eq('id', input.id)

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao deletar cliente',
          cause: error,
        })
      }

      return { success: true }
    }),
})
