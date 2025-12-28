#!/usr/bin/env node
/**
 * MCP-04: WhatsApp Business API Server
 *
 * Provides automated WhatsApp Business integration for customer service,
 * lead qualification, and marketing automation.
 *
 * Features:
 * - Send and receive WhatsApp messages
 * - Template message management
 * - Media support (images, documents, audio)
 * - Read receipts and status tracking
 * - Contact management
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';

// Environment variables validation
const envSchema = z.object({
  WHATSAPP_ACCESS_TOKEN: z.string().min(1, 'WHATSAPP_ACCESS_TOKEN is required'),
  WHATSAPP_PHONE_NUMBER_ID: z.string().min(1, 'WHATSAPP_PHONE_NUMBER_ID is required'),
  WHATSAPP_BUSINESS_ACCOUNT_ID: z.string().optional(),
});

// Tool input schemas
const SendMessageSchema = z.object({
  to: z.string().describe('Recipient phone number in international format (e.g., 5511999887766)'),
  type: z.enum(['text', 'template', 'image', 'document', 'audio']).default('text'),
  text: z.string().optional().describe('Message text (required for type=text)'),
  templateName: z.string().optional().describe('Template name (required for type=template)'),
  templateLanguage: z.string().optional().default('pt_BR'),
  templateComponents: z.array(z.any()).optional().describe('Template parameter values'),
  mediaUrl: z.string().optional().describe('Media URL (for image/document/audio)'),
  caption: z.string().optional().describe('Media caption (for image/document)'),
  filename: z.string().optional().describe('File name (for document)'),
});

const SendTemplateSchema = z.object({
  to: z.string().describe('Recipient phone number'),
  templateName: z.string().describe('Approved template name'),
  language: z.string().default('pt_BR').describe('Template language code'),
  components: z.array(z.object({
    type: z.enum(['header', 'body', 'button']),
    parameters: z.array(z.object({
      type: z.enum(['text', 'image', 'document', 'video']),
      text: z.string().optional(),
      image: z.object({ link: z.string() }).optional(),
      document: z.object({ link: z.string(), filename: z.string() }).optional(),
      video: z.object({ link: z.string() }).optional(),
    })),
  })).optional().describe('Template components with parameters'),
});

const GetMessageStatusSchema = z.object({
  messageId: z.string().describe('WhatsApp message ID'),
});

const MarkAsReadSchema = z.object({
  messageId: z.string().describe('Message ID to mark as read'),
});

const GetContactInfoSchema = z.object({
  phoneNumber: z.string().describe('Phone number in international format'),
});

const SendInteractiveSchema = z.object({
  to: z.string().describe('Recipient phone number'),
  type: z.enum(['button', 'list']).describe('Interactive message type'),
  header: z.string().optional().describe('Message header text'),
  body: z.string().describe('Message body text'),
  footer: z.string().optional().describe('Message footer text'),
  buttons: z.array(z.object({
    id: z.string(),
    title: z.string(),
  })).optional().describe('Buttons (max 3, for type=button)'),
  listButton: z.string().optional().describe('List button text (for type=list)'),
  sections: z.array(z.object({
    title: z.string().optional(),
    rows: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
    })),
  })).optional().describe('List sections (for type=list)'),
});

// WhatsApp Business API Client
class WhatsAppClient {
  private client: AxiosInstance;
  private phoneNumberId: string;
  private businessAccountId?: string;

  constructor() {
    const env = envSchema.parse(process.env);

    this.phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
    this.businessAccountId = env.WHATSAPP_BUSINESS_ACCOUNT_ID;

    this.client = axios.create({
      baseURL: 'https://graph.facebook.com/v18.0',
      headers: {
        'Authorization': `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMessage(params: {
    to: string;
    type: string;
    text?: string;
    templateName?: string;
    templateLanguage?: string;
    templateComponents?: any[];
    mediaUrl?: string;
    caption?: string;
    filename?: string;
  }) {
    const { to, type } = params;

    let message: any = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: this.formatPhoneNumber(to),
    };

    switch (type) {
      case 'text':
        if (!params.text) {
          throw new Error('text is required for type=text');
        }
        message.type = 'text';
        message.text = { body: params.text };
        break;

      case 'template':
        if (!params.templateName) {
          throw new Error('templateName is required for type=template');
        }
        message.type = 'template';
        message.template = {
          name: params.templateName,
          language: { code: params.templateLanguage || 'pt_BR' },
          components: params.templateComponents || [],
        };
        break;

      case 'image':
        if (!params.mediaUrl) {
          throw new Error('mediaUrl is required for type=image');
        }
        message.type = 'image';
        message.image = {
          link: params.mediaUrl,
          caption: params.caption,
        };
        break;

      case 'document':
        if (!params.mediaUrl) {
          throw new Error('mediaUrl is required for type=document');
        }
        message.type = 'document';
        message.document = {
          link: params.mediaUrl,
          caption: params.caption,
          filename: params.filename,
        };
        break;

      case 'audio':
        if (!params.mediaUrl) {
          throw new Error('mediaUrl is required for type=audio');
        }
        message.type = 'audio';
        message.audio = {
          link: params.mediaUrl,
        };
        break;

      default:
        throw new Error(`Unsupported message type: ${type}`);
    }

    const response = await this.client.post(
      `/${this.phoneNumberId}/messages`,
      message
    );

    return {
      success: true,
      messageId: response.data.messages[0].id,
      to: to,
      status: 'sent',
    };
  }

  async sendTemplate(params: {
    to: string;
    templateName: string;
    language?: string;
    components?: any[];
  }) {
    const message = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: this.formatPhoneNumber(params.to),
      type: 'template',
      template: {
        name: params.templateName,
        language: {
          code: params.language || 'pt_BR',
        },
        components: params.components || [],
      },
    };

    const response = await this.client.post(
      `/${this.phoneNumberId}/messages`,
      message
    );

    return {
      success: true,
      messageId: response.data.messages[0].id,
      to: params.to,
      status: 'sent',
      template: params.templateName,
    };
  }

  async sendInteractive(params: {
    to: string;
    type: 'button' | 'list';
    header?: string;
    body: string;
    footer?: string;
    buttons?: Array<{ id: string; title: string }>;
    listButton?: string;
    sections?: Array<{
      title?: string;
      rows: Array<{ id: string; title: string; description?: string }>;
    }>;
  }) {
    const interactive: any = {
      type: params.type,
      body: { text: params.body },
    };

    if (params.header) {
      interactive.header = {
        type: 'text',
        text: params.header,
      };
    }

    if (params.footer) {
      interactive.footer = { text: params.footer };
    }

    if (params.type === 'button') {
      if (!params.buttons || params.buttons.length === 0 || params.buttons.length > 3) {
        throw new Error('Buttons must have 1-3 items for type=button');
      }
      interactive.action = {
        buttons: params.buttons.map(btn => ({
          type: 'reply',
          reply: {
            id: btn.id,
            title: btn.title,
          },
        })),
      };
    } else if (params.type === 'list') {
      if (!params.sections || !params.listButton) {
        throw new Error('sections and listButton are required for type=list');
      }
      interactive.action = {
        button: params.listButton,
        sections: params.sections,
      };
    }

    const message = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: this.formatPhoneNumber(params.to),
      type: 'interactive',
      interactive,
    };

    const response = await this.client.post(
      `/${this.phoneNumberId}/messages`,
      message
    );

    return {
      success: true,
      messageId: response.data.messages[0].id,
      to: params.to,
      status: 'sent',
      type: params.type,
    };
  }

  async getMessageStatus(messageId: string) {
    // Note: WhatsApp Cloud API doesn't have a direct endpoint for message status
    // Status is received via webhooks. This would query a local database
    // where webhook events are stored.
    return {
      success: true,
      messageId,
      note: 'Message status is tracked via webhooks. Check your webhook handler for delivery status.',
    };
  }

  async markAsRead(messageId: string) {
    const response = await this.client.post(
      `/${this.phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      }
    );

    return {
      success: true,
      messageId,
      status: 'read',
    };
  }

  async getContactInfo(phoneNumber: string) {
    // This would typically query your local database for contact info
    // WhatsApp API doesn't provide a direct contact lookup
    return {
      success: true,
      phoneNumber: this.formatPhoneNumber(phoneNumber),
      note: 'Contact info should be retrieved from your local database. WhatsApp API does not provide contact lookup.',
    };
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Ensure it starts with country code
    if (!cleaned.startsWith('55') && cleaned.length === 11) {
      // Brazilian number without country code
      return `55${cleaned}`;
    }

    return cleaned;
  }
}

// MCP Server
const server = new Server(
  {
    name: 'garcezpalha-whatsapp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize WhatsApp client
const whatsappClient = new WhatsAppClient();

// Define available tools
const tools: Tool[] = [
  {
    name: 'whatsapp_send_message',
    description: 'Send a WhatsApp message (text, template, image, document, or audio)',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient phone number (e.g., 5511999887766)',
        },
        type: {
          type: 'string',
          enum: ['text', 'template', 'image', 'document', 'audio'],
          default: 'text',
        },
        text: {
          type: 'string',
          description: 'Message text (for type=text)',
        },
        templateName: {
          type: 'string',
          description: 'Template name (for type=template)',
        },
        templateLanguage: {
          type: 'string',
          default: 'pt_BR',
        },
        templateComponents: {
          type: 'array',
          description: 'Template parameters',
        },
        mediaUrl: {
          type: 'string',
          description: 'Media URL (for image/document/audio)',
        },
        caption: {
          type: 'string',
          description: 'Media caption',
        },
        filename: {
          type: 'string',
          description: 'File name (for document)',
        },
      },
      required: ['to'],
    },
  },
  {
    name: 'whatsapp_send_template',
    description: 'Send an approved WhatsApp template message with parameters',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient phone number',
        },
        templateName: {
          type: 'string',
          description: 'Approved template name',
        },
        language: {
          type: 'string',
          default: 'pt_BR',
        },
        components: {
          type: 'array',
          description: 'Template components with parameters',
        },
      },
      required: ['to', 'templateName'],
    },
  },
  {
    name: 'whatsapp_send_interactive',
    description: 'Send an interactive message with buttons or list',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient phone number',
        },
        type: {
          type: 'string',
          enum: ['button', 'list'],
          description: 'Interactive type',
        },
        header: {
          type: 'string',
          description: 'Header text (optional)',
        },
        body: {
          type: 'string',
          description: 'Body text (required)',
        },
        footer: {
          type: 'string',
          description: 'Footer text (optional)',
        },
        buttons: {
          type: 'array',
          description: 'Buttons (1-3, for type=button)',
        },
        listButton: {
          type: 'string',
          description: 'List button text (for type=list)',
        },
        sections: {
          type: 'array',
          description: 'List sections (for type=list)',
        },
      },
      required: ['to', 'type', 'body'],
    },
  },
  {
    name: 'whatsapp_mark_as_read',
    description: 'Mark a message as read',
    inputSchema: {
      type: 'object',
      properties: {
        messageId: {
          type: 'string',
          description: 'Message ID to mark as read',
        },
      },
      required: ['messageId'],
    },
  },
  {
    name: 'whatsapp_get_message_status',
    description: 'Get delivery status of a sent message (requires webhook setup)',
    inputSchema: {
      type: 'object',
      properties: {
        messageId: {
          type: 'string',
          description: 'WhatsApp message ID',
        },
      },
      required: ['messageId'],
    },
  },
  {
    name: 'whatsapp_get_contact_info',
    description: 'Get contact information from local database',
    inputSchema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
          description: 'Phone number',
        },
      },
      required: ['phoneNumber'],
    },
  },
];

// Handle tool list requests
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'whatsapp_send_message': {
        const parsed = SendMessageSchema.parse(args);
        const result = await whatsappClient.sendMessage(parsed);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'whatsapp_send_template': {
        const parsed = SendTemplateSchema.parse(args);
        const result = await whatsappClient.sendTemplate(parsed);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'whatsapp_send_interactive': {
        const parsed = SendInteractiveSchema.parse(args);
        const result = await whatsappClient.sendInteractive(parsed);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'whatsapp_mark_as_read': {
        const parsed = MarkAsReadSchema.parse(args);
        const result = await whatsappClient.markAsRead(parsed.messageId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'whatsapp_get_message_status': {
        const parsed = GetMessageStatusSchema.parse(args);
        const result = await whatsappClient.getMessageStatus(parsed.messageId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'whatsapp_get_contact_info': {
        const parsed = GetContactInfoSchema.parse(args);
        const result = await whatsappClient.getContactInfo(parsed.phoneNumber);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: errorMessage,
            success: false,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error('WhatsApp Business MCP Server running on stdio');
  } catch (error) {
    console.error('Failed to start WhatsApp MCP Server:', error);
    process.exit(1);
  }
}

main();
