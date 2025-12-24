import { router } from '../init'
import { leadsRouter } from './leads'
import { clientsRouter } from './clients'
import { appointmentsRouter } from './appointments'
import { chatRouter } from './chat'
import { analyticsRouter } from './analytics'
import { referralsRouter } from './referrals'
import { invoicesRouter } from './invoices'
import { productsRouter } from './products'
import { usersRouter } from './users'

export const appRouter = router({
  leads: leadsRouter,
  clients: clientsRouter,
  appointments: appointmentsRouter,
  chat: chatRouter,
  analytics: analyticsRouter,
  referrals: referralsRouter,
  invoices: invoicesRouter,
  products: productsRouter,
  users: usersRouter,
})

export type AppRouter = typeof appRouter
