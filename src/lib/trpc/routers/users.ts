import { z } from 'zod'
import { router, protectedProcedure } from '../init'
import { TRPCError } from '@trpc/server'

export const usersRouter = router({
  // Admin - Listar todos os usuários
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const { supabase, user } = ctx

      // Verificar se usuário é admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userData?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem listar usuários',
        })
      }

      // Buscar todos os usuários com seus profiles
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          role,
          created_at,
          updated_at,
          profiles (
            full_name,
            phone
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })

      return data
    }),

  // Admin - Atualizar role de usuário
  updateRole: protectedProcedure
    .input(z.object({
      userId: z.string().uuid(),
      role: z.enum(['admin', 'lawyer', 'partner', 'client']),
    }))
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx

      // Verificar se usuário atual é admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userData?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem alterar roles',
        })
      }

      // Impedir que admin mude seu próprio role
      if (input.userId === user.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Você não pode alterar seu próprio role',
        })
      }

      // Atualizar role
      const { data, error } = await supabase
        .from('users')
        .update({ role: input.role })
        .eq('id', input.userId)
        .select()
        .single()

      if (error) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      })

      return data
    }),

  // Admin - Deletar usuário
  delete: protectedProcedure
    .input(z.object({
      userId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx

      // Verificar se usuário atual é admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userData?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem excluir usuários',
        })
      }

      // Impedir que admin delete a si mesmo
      if (input.userId === user.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Você não pode excluir sua própria conta',
        })
      }

      // Chamar função do banco que faz a exclusão com segurança
      const { data, error } = await supabase.rpc('admin_delete_user', {
        user_id_to_delete: input.userId,
      })

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        })
      }

      // Verificar resultado da função
      if (data && !data.success) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: data.error || 'Erro ao excluir usuário',
        })
      }

      return { success: true, data }
    }),

  // Admin - Obter estatísticas de usuários
  stats: protectedProcedure
    .query(async ({ ctx }) => {
      const { supabase, user } = ctx

      // Verificar se usuário é admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userData?.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Apenas administradores podem ver estatísticas',
        })
      }

      // Contar usuários por role
      const { data: allUsers } = await supabase
        .from('users')
        .select('role')

      const stats = {
        total: allUsers?.length || 0,
        admins: allUsers?.filter(u => u.role === 'admin').length || 0,
        lawyers: allUsers?.filter(u => u.role === 'lawyer').length || 0,
        partners: allUsers?.filter(u => u.role === 'partner').length || 0,
        clients: allUsers?.filter(u => u.role === 'client').length || 0,
      }

      return stats
    }),
})
