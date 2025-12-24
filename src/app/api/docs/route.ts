import { NextResponse } from 'next/server'

// API Documentation endpoint
export const dynamic = 'force-static'

interface ApiEndpoint {
  method: string
  path: string
  description: string
  auth: boolean
  rateLimit?: string
  requestBody?: object
  responseExample?: object
  headers?: Record<string, string>
}

const apiDocumentation = {
  info: {
    title: 'Garcez Palha API',
    version: '1.0.0',
    description: 'API documentation for Garcez Palha legal services platform',
    contact: {
      name: 'Garcez Palha Support',
      email: 'suporte@garcezpalha.com',
      url: 'https://garcezpalha.com',
    },
  },
  servers: [
    {
      url: 'https://garcezpalha.com/api',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  endpoints: {
    health: {
      method: 'GET',
      path: '/api/health',
      description: 'Check API health status and service availability',
      auth: false,
      responseExample: {
        status: 'healthy',
        timestamp: '2024-01-15T10:30:00.000Z',
        uptime: 86400,
        version: '1.0.0',
        environment: 'production',
        services: {
          database: { status: 'healthy', latency: 15 },
          auth: { status: 'healthy' },
          openai: { status: 'configured' },
          stripe: { status: 'configured' },
        },
      },
    } as ApiEndpoint,

    // Authentication endpoints
    auth: {
      login: {
        method: 'POST',
        path: '/api/auth/signin',
        description: 'Authenticate user and create session',
        auth: false,
        rateLimit: '5 requests per minute',
        requestBody: {
          email: 'string (required)',
          password: 'string (required)',
        },
        responseExample: {
          token: 'jwt_token_here',
          user: {
            id: 'uuid',
            email: 'user@example.com',
            role: 'client',
          },
        },
      } as ApiEndpoint,
      register: {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register new user account',
        auth: false,
        rateLimit: '3 requests per hour',
        requestBody: {
          name: 'string (required)',
          email: 'string (required)',
          password: 'string (required, min 8 chars)',
          role: 'client | partner (optional)',
        },
      } as ApiEndpoint,
      logout: {
        method: 'POST',
        path: '/api/auth/signout',
        description: 'End user session',
        auth: true,
      } as ApiEndpoint,
    },

    // Contact and leads
    contact: {
      submit: {
        method: 'POST',
        path: '/api/contact',
        description: 'Submit contact form and create lead',
        auth: false,
        rateLimit: '10 requests per hour',
        requestBody: {
          name: 'string (required)',
          email: 'string (required)',
          phone: 'string (required)',
          message: 'string (required)',
          service: 'string (optional)',
          source: 'string (optional)',
        },
        responseExample: {
          success: true,
          message: 'Mensagem enviada com sucesso',
          leadId: 'uuid',
        },
      } as ApiEndpoint,
    },

    // Chat / AI Assistant
    chat: {
      message: {
        method: 'POST',
        path: '/api/chat',
        description: 'Send message to AI legal assistant',
        auth: false,
        rateLimit: '30 requests per hour',
        requestBody: {
          message: 'string (required)',
          threadId: 'string (optional)',
          context: 'object (optional)',
        },
        responseExample: {
          reply: 'AI response message',
          threadId: 'thread_abc123',
          suggestions: ['Follow up question 1', 'Follow up question 2'],
        },
      } as ApiEndpoint,
    },

    // Payments
    payments: {
      createCheckout: {
        method: 'POST',
        path: '/api/payments/checkout',
        description: 'Create Stripe checkout session',
        auth: true,
        requestBody: {
          serviceId: 'string (required)',
          amount: 'number (required)',
          currency: 'BRL (default)',
        },
        responseExample: {
          sessionId: 'cs_live_abc123',
          url: 'https://checkout.stripe.com/...',
        },
      } as ApiEndpoint,
      createPixPayment: {
        method: 'POST',
        path: '/api/payments/pix',
        description: 'Create MercadoPago PIX payment',
        auth: true,
        requestBody: {
          amount: 'number (required)',
          description: 'string (required)',
          payerEmail: 'string (required)',
        },
        responseExample: {
          pixCode: 'pix_copy_paste_code',
          qrCodeBase64: 'base64_encoded_qr',
          expirationDate: '2024-01-15T12:00:00.000Z',
        },
      } as ApiEndpoint,
      webhook: {
        method: 'POST',
        path: '/api/webhooks/stripe',
        description: 'Handle Stripe webhook events',
        auth: false,
        headers: {
          'stripe-signature': 'Stripe webhook signature',
        },
      } as ApiEndpoint,
    },

    // Partner referrals
    referrals: {
      create: {
        method: 'POST',
        path: '/api/referrals',
        description: 'Create new partner referral',
        auth: true,
        requestBody: {
          clientName: 'string (required)',
          clientEmail: 'string (required)',
          clientPhone: 'string (required)',
          serviceType: 'string (required)',
          notes: 'string (optional)',
        },
        responseExample: {
          id: 'uuid',
          status: 'pending',
          potentialCommission: 150.0,
          createdAt: '2024-01-15T10:00:00.000Z',
        },
      } as ApiEndpoint,
      list: {
        method: 'GET',
        path: '/api/referrals',
        description: 'List partner referrals with filters',
        auth: true,
        requestBody: {
          status: 'pending | contacted | converted | lost (optional)',
          page: 'number (optional)',
          limit: 'number (optional)',
        },
        responseExample: {
          referrals: [],
          total: 50,
          page: 1,
          totalPages: 5,
        },
      } as ApiEndpoint,
      stats: {
        method: 'GET',
        path: '/api/referrals/stats',
        description: 'Get partner referral statistics',
        auth: true,
        responseExample: {
          totalReferrals: 50,
          converted: 25,
          conversionRate: 50,
          totalEarnings: 3750.0,
          pendingCommissions: 450.0,
        },
      } as ApiEndpoint,
    },

    // Admin endpoints
    admin: {
      leads: {
        method: 'GET',
        path: '/api/admin/leads',
        description: 'List all leads (admin only)',
        auth: true,
        headers: {
          Authorization: 'Bearer <admin_token>',
        },
        responseExample: {
          leads: [],
          total: 100,
          stats: {
            newToday: 5,
            conversionRate: 35,
          },
        },
      } as ApiEndpoint,
      dashboard: {
        method: 'GET',
        path: '/api/admin/dashboard',
        description: 'Get admin dashboard statistics',
        auth: true,
        responseExample: {
          revenue: {
            total: 150000,
            thisMonth: 25000,
            growth: 15.5,
          },
          leads: {
            total: 500,
            converted: 175,
            pending: 50,
          },
          partners: {
            total: 25,
            activeThisMonth: 18,
          },
        },
      } as ApiEndpoint,
    },

    // tRPC endpoints
    trpc: {
      description: 'Type-safe API using tRPC',
      baseUrl: '/api/trpc',
      procedures: {
        'referrals.getStats': {
          type: 'query',
          description: 'Get referral statistics',
          auth: true,
        },
        'referrals.getList': {
          type: 'query',
          description: 'Get paginated referral list',
          auth: true,
          input: {
            page: 'number (optional)',
            limit: 'number (optional)',
            status: 'string (optional)',
          },
        },
        'referrals.create': {
          type: 'mutation',
          description: 'Create new referral',
          auth: true,
        },
      },
    },
  },

  authentication: {
    type: 'JWT Bearer Token',
    description: 'Include token in Authorization header',
    example: 'Authorization: Bearer <your_jwt_token>',
    tokenExpiry: '7 days',
    refreshStrategy: 'Automatic refresh on activity',
  },

  rateLimiting: {
    description: 'Rate limits are applied per IP address',
    defaults: {
      api: '100 requests per 15 minutes',
      auth: '5 requests per 15 minutes',
      contact: '10 requests per hour',
      chat: '30 requests per hour',
    },
    headers: {
      'X-RateLimit-Limit': 'Maximum requests allowed',
      'X-RateLimit-Remaining': 'Requests remaining',
      'X-RateLimit-Reset': 'Time when limit resets',
    },
  },

  errorResponses: {
    400: {
      description: 'Bad Request - Invalid input',
      example: {
        error: 'Validation Error',
        message: 'Email is required',
        code: 'VALIDATION_ERROR',
      },
    },
    401: {
      description: 'Unauthorized - Authentication required',
      example: {
        error: 'Unauthorized',
        message: 'Invalid or expired token',
        code: 'AUTH_REQUIRED',
      },
    },
    403: {
      description: 'Forbidden - Insufficient permissions',
      example: {
        error: 'Forbidden',
        message: 'Admin access required',
        code: 'FORBIDDEN',
      },
    },
    404: {
      description: 'Not Found - Resource does not exist',
      example: {
        error: 'Not Found',
        message: 'Referral not found',
        code: 'NOT_FOUND',
      },
    },
    429: {
      description: 'Too Many Requests - Rate limit exceeded',
      example: {
        error: 'Rate Limit Exceeded',
        message: 'Please try again in 15 minutes',
        code: 'RATE_LIMIT',
      },
    },
    500: {
      description: 'Internal Server Error',
      example: {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
      },
    },
  },

  sdks: {
    javascript: {
      installation: 'npm install @garcezpalha/sdk',
      example: `
import { GarcezPalhaClient } from '@garcezpalha/sdk';

const client = new GarcezPalhaClient({
  apiKey: 'your_api_key'
});

const referrals = await client.referrals.list();
      `,
    },
  },

  changelog: [
    {
      version: '1.0.0',
      date: '2024-01-15',
      changes: [
        'Initial API release',
        'Authentication endpoints',
        'Contact form submission',
        'AI chat integration',
        'Payment processing (Stripe & PIX)',
        'Partner referral system',
        'Admin dashboard APIs',
      ],
    },
  ],
}

export async function GET() {
  return NextResponse.json(apiDocumentation, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
