import { z } from 'zod'
import { router, protectedProcedure } from '../init'
import { TRPCError } from '@trpc/server'

export const appointmentsRouter = router({
  // Protected - List appointments
  list: protectedProcedure
    .input(
      z.object({
        client_id: z.string().uuid().optional(),
        lawyer_id: z.string().uuid().optional(),
        status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show']).optional(),
        from_date: z.string().optional(),
        to_date: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.supabase
        .from('appointments')
        .select('*', { count: 'exact' })
        .order('scheduled_at', { ascending: true })
        .range(input.offset, input.offset + input.limit - 1)

      if (input.client_id) {
        query = query.eq('client_id', input.client_id)
      }

      if (input.lawyer_id) {
        query = query.eq('lawyer_id', input.lawyer_id)
      }

      if (input.status) {
        query = query.eq('status', input.status)
      }

      if (input.from_date) {
        query = query.gte('scheduled_at', input.from_date)
      }

      if (input.to_date) {
        query = query.lte('scheduled_at', input.to_date)
      }

      const { data, error, count } = await query

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao listar agendamentos',
          cause: error,
        })
      }

      return {
        appointments: data,
        total: count ?? 0,
      }
    }),

  // Protected - Get single appointment
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('appointments')
        .select('*')
        .eq('id', input.id)
        .single()

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agendamento não encontrado',
          cause: error,
        })
      }

      return data
    }),

  // Protected - Create appointment
  create: protectedProcedure
    .input(
      z.object({
        client_id: z.string().uuid(),
        lawyer_id: z.string().uuid(),
        title: z.string().min(1, 'Título é obrigatório'),
        description: z.string().optional(),
        appointment_type: z.enum(['consultation', 'meeting', 'court', 'other']),
        scheduled_at: z.string(),
        duration_minutes: z.number().min(15).default(60),
        meeting_link: z.string().url().optional(),
        location: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('appointments')
        .insert({
          ...input,
          status: 'scheduled',
        })
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao criar agendamento',
          cause: error,
        })
      }

      return data
    }),

  // Protected - Update appointment
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().optional(),
        description: z.string().optional(),
        appointment_type: z.enum(['consultation', 'meeting', 'court', 'other']).optional(),
        scheduled_at: z.string().optional(),
        duration_minutes: z.number().min(15).optional(),
        status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show']).optional(),
        meeting_link: z.string().url().optional(),
        location: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input

      const { data, error } = await ctx.supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao atualizar agendamento',
          cause: error,
        })
      }

      return data
    }),

  // Protected - Cancel appointment
  cancel: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', input.id)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao cancelar agendamento',
          cause: error,
        })
      }

      return data
    }),
})
