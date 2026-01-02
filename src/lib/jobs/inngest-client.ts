/**
 * Inngest Client Configuration
 * Serverless-first job queue for webhooks e background tasks
 */

import { Inngest } from 'inngest'

export const inngest = new Inngest({
  id: 'garcez-palha',
  name: 'Garcez Palha Legal Platform',
  eventKey: process.env.INNGEST_EVENT_KEY,
  env: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  // Retry configuration
  retryFunction: async (attempt: number) => {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s (max 6 tentativas)
    const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 32000)
    return delayMs
  },
})

// Event types com tipagem forte
export type InngestEvents = {
  // Webhook events
  'stripe/webhook.received': {
    data: {
      eventId: string
      type: string
      payload: any
    }
  }
  'mercadopago/webhook.received': {
    data: {
      eventId: string
      type: string
      payload: any
    }
  }
  'whatsapp/webhook.received': {
    data: {
      eventId: string
      from: string
      message: string
      timestamp: number
    }
  }

  // Email events
  'email/send': {
    data: {
      to: string
      subject: string
      template: string
      variables: Record<string, any>
    }
  }
  'email/sequence.trigger': {
    data: {
      userId: string
      sequenceType: 'abandoned-cart' | 'nurture' | 'reengagement' | 'upsell'
      metadata?: Record<string, any>
    }
  }

  // Document events
  'document/analyze': {
    data: {
      documentId: string
      userId: string
      fileUrl: string
    }
  }
  'document/generate': {
    data: {
      caseId: string
      templateId: string
      variables: Record<string, any>
    }
  }

  // Follow-up events
  'followup/schedule': {
    data: {
      leadId: string
      conversationId: string
      delayHours: number
      message: string
    }
  }

  // Notification events
  'notification/send': {
    data: {
      userId: string
      type: 'message' | 'document' | 'case_update' | 'deadline' | 'payment'
      title: string
      message: string
      link?: string
      sendEmail?: boolean
    }
  }

  // Deadline events
  'deadline/reminder': {
    data: {
      deadlineId: string
      caseId: string
      assignedTo: string
      dueDate: string
      type: string
    }
  }

  // Payment events
  'payment/process': {
    data: {
      paymentId: string
      amount: number
      method: 'stripe' | 'mercadopago'
      metadata: Record<string, any>
    }
  }
  'payment/retry': {
    data: {
      paymentId: string
      attempt: number
    }
  }

  // Analytics events
  'analytics/track': {
    data: {
      userId?: string
      event: string
      properties: Record<string, any>
    }
  }
}

// Type-safe event sender
export const sendEvent = <K extends keyof InngestEvents>(
  eventName: K,
  eventData: InngestEvents[K]
) => {
  return inngest.send({
    name: eventName,
    data: eventData.data,
  })
}

// Batch event sender
export const sendEvents = async (events: Array<{
  name: keyof InngestEvents
  data: any
}>) => {
  return inngest.send(events as any)
}
