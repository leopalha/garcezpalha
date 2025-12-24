import { initTRPC, TRPCError } from '@trpc/server'
import { createClient } from '@/lib/supabase/server'
import superjson from 'superjson'

export async function createContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return {
    supabase,
    user,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // now user is guaranteed to be defined
    },
  })
})

// Admin procedure - requires admin role
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const { data: profile } = await ctx.supabase
    .from('profiles')
    .select('role')
    .eq('id', ctx.user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' })
  }

  return next({ ctx })
})
