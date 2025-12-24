import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/lib/trpc/routers'
import { createContext } from '@/lib/trpc/init'
import superjson from 'superjson'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
    responseMeta: () => ({ headers: {} }),
    onError: ({ path, error }) => {
      console.error(`tRPC Error on ${path}:`, error)
    },
  })

export { handler as GET, handler as POST }
