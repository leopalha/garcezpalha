import { router } from '../init'
import { leadsRouter } from './leads'
import { clientsRouter } from './clients'
import { appointmentsRouter } from './appointments'
import { chatRouter } from './chat'
import { analyticsRouter } from './analytics'
import { referralsRouter } from './referrals'

export const appRouter = router({
  leads: leadsRouter,
  clients: clientsRouter,
  appointments: appointmentsRouter,
  chat: chatRouter,
  analytics: analyticsRouter,
  referrals: referralsRouter,
})

export type AppRouter = typeof appRouter
