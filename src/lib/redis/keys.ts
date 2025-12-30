// Redis Key Naming Convention
// Garcez Palha - Redis Cache Strategy
// MANUS v7.0 (29/12/2025)

export const REDIS_KEYS = {
  // Cache de dados
  product: (id: string) => `product:${id}`,
  productBySlug: (slug: string) => `product:slug:${slug}`,
  products: () => 'products:all',
  productsByCategory: (category: string) => `products:category:${category}`,
  productPackages: (productId: string) => `product:${productId}:packages`,
  agent: (id: string) => `agent:${id}`,
  agents: () => 'agents:all',

  // Conversation & Chat
  conversation: (id: string) => `conversation:${id}`,
  chatHistory: (sessionId: string) => `chat:${sessionId}:history`,

  // Sessões
  session: (token: string) => `session:${token}`,
  user: (id: string) => `user:${id}`,

  // Qualification flows
  flow: (id: string) => `flow:${id}`,
  flowState: (id: string) => `flow:${id}:state`,

  // Rate limiting
  rateLimit: (ip: string, endpoint: string) => `ratelimit:${ip}:${endpoint}`,

  // Pub/Sub channels
  channel: {
    chat: (conversationId: string) => `chat:${conversationId}`,
    notifications: (userId: string) => `notifications:${userId}`,
  },

  // Queues
  queue: {
    emails: 'queue:emails',
    webhooks: 'queue:webhooks',
    whatsapp: 'queue:whatsapp',
  },

  // Analytics
  analytics: {
    pageViews: (path: string) => `analytics:pageviews:${path}`,
    events: (event: string) => `analytics:events:${event}`,
  },
} as const

export default REDIS_KEYS
