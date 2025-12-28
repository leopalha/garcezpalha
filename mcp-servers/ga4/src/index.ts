#!/usr/bin/env node
/**
 * MCP-02: Google Analytics 4 Server
 *
 * Provides automated GA4 data analysis and optimization suggestions
 * for data-driven decision making.
 *
 * Features:
 * - Query GA4 metrics automatically
 * - Identify low-performing pages
 * - Suggest data-driven optimizations
 * - Generate automated reports
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { google } from 'googleapis';
import { z } from 'zod';

// Environment variables validation
const envSchema = z.object({
  GA4_PROPERTY_ID: z.string().min(1, 'GA4_PROPERTY_ID is required'),
  GA4_CREDENTIALS_PATH: z.string().optional(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
});

// Tool input schemas
const PageMetricsSchema = z.object({
  page: z.string().describe('Page path (e.g., /solutions/aposentadoria-indevida)'),
  dateRange: z.object({
    startDate: z.string().describe('Start date (YYYY-MM-DD)'),
    endDate: z.string().describe('End date (YYYY-MM-DD)'),
  }).optional().describe('Date range for metrics (defaults to last 30 days)'),
});

const ConversionRateSchema = z.object({
  goal: z.string().describe('Conversion goal name'),
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).optional(),
});

const TopPagesSchema = z.object({
  limit: z.number().min(1).max(100).default(10).describe('Number of top pages to return'),
  metric: z.enum(['pageviews', 'sessions', 'conversions', 'engagementRate'])
    .default('pageviews')
    .describe('Metric to sort by'),
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).optional(),
});

const BounceRateSchema = z.object({
  page: z.string().optional().describe('Specific page path (optional, returns site-wide if omitted)'),
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).optional(),
});

const UserJourneySchema = z.object({
  userId: z.string().optional().describe('Specific user ID (optional)'),
  segment: z.string().optional().describe('User segment (e.g., "high-value", "churned")'),
  limit: z.number().min(1).max(100).default(50).describe('Number of events to return'),
});

// GA4 Client wrapper
class GA4Client {
  private analyticsData: any;
  private propertyId: string;

  constructor() {
    const env = envSchema.parse(process.env);
    this.propertyId = env.GA4_PROPERTY_ID;
  }

  async initialize() {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GA4_CREDENTIALS_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    this.analyticsData = google.analyticsdata({
      version: 'v1beta',
      auth,
    });
  }

  async getPageMetrics(page: string, dateRange?: { startDate: string; endDate: string }) {
    const { startDate, endDate } = dateRange || this.getDefaultDateRange();

    const response = await this.analyticsData.properties.runReport({
      property: `properties/${this.propertyId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'engagementRate' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
          { name: 'conversions' },
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: {
              matchType: 'EXACT',
              value: page,
            },
          },
        },
      },
    });

    return this.parseReportResponse(response.data);
  }

  async getConversionRate(goal: string, dateRange?: { startDate: string; endDate: string }) {
    const { startDate, endDate } = dateRange || this.getDefaultDateRange();

    const response = await this.analyticsData.properties.runReport({
      property: `properties/${this.propertyId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'sessions' },
          { name: 'conversions' },
          { name: 'conversionRate' },
        ],
        dimensionFilter: goal ? {
          filter: {
            fieldName: 'eventName',
            stringFilter: {
              matchType: 'EXACT',
              value: goal,
            },
          },
        } : undefined,
      },
    });

    return this.parseReportResponse(response.data);
  }

  async getTopPages(limit: number, metric: string, dateRange?: { startDate: string; endDate: string }) {
    const { startDate, endDate } = dateRange || this.getDefaultDateRange();

    const metricMap: Record<string, string> = {
      pageviews: 'screenPageViews',
      sessions: 'sessions',
      conversions: 'conversions',
      engagementRate: 'engagementRate',
    };

    const response = await this.analyticsData.properties.runReport({
      property: `properties/${this.propertyId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        dimensions: [
          { name: 'pagePath' },
          { name: 'pageTitle' },
        ],
        metrics: [
          { name: metricMap[metric] },
          { name: 'screenPageViews' },
          { name: 'engagementRate' },
          { name: 'bounceRate' },
        ],
        orderBys: [
          {
            metric: { metricName: metricMap[metric] },
            desc: true,
          },
        ],
        limit,
      },
    });

    return this.parseReportResponse(response.data);
  }

  async getBounceRate(page?: string, dateRange?: { startDate: string; endDate: string }) {
    const { startDate, endDate } = dateRange || this.getDefaultDateRange();

    const response = await this.analyticsData.properties.runReport({
      property: `properties/${this.propertyId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        dimensions: page ? [{ name: 'pagePath' }] : [],
        metrics: [
          { name: 'bounceRate' },
          { name: 'engagementRate' },
          { name: 'sessions' },
        ],
        dimensionFilter: page ? {
          filter: {
            fieldName: 'pagePath',
            stringFilter: {
              matchType: 'EXACT',
              value: page,
            },
          },
        } : undefined,
      },
    });

    return this.parseReportResponse(response.data);
  }

  async getUserJourney(userId?: string, segment?: string, limit: number = 50) {
    const response = await this.analyticsData.properties.runReport({
      property: `properties/${this.propertyId}`,
      requestBody: {
        dateRanges: [this.getDefaultDateRange()],
        dimensions: [
          { name: 'eventName' },
          { name: 'pagePath' },
          { name: 'eventTimestamp' },
        ],
        metrics: [
          { name: 'eventCount' },
        ],
        dimensionFilter: userId ? {
          filter: {
            fieldName: 'userId',
            stringFilter: {
              matchType: 'EXACT',
              value: userId,
            },
          },
        } : segment ? {
          filter: {
            fieldName: 'userSegment',
            stringFilter: {
              matchType: 'EXACT',
              value: segment,
            },
          },
        } : undefined,
        orderBys: [
          {
            dimension: { dimensionName: 'eventTimestamp' },
            desc: true,
          },
        ],
        limit,
      },
    });

    return this.parseReportResponse(response.data);
  }

  private getDefaultDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    return {
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate),
    };
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private parseReportResponse(data: any) {
    if (!data.rows || data.rows.length === 0) {
      return {
        success: true,
        data: [],
        message: 'No data found for the specified criteria',
      };
    }

    const headers = [
      ...(data.dimensionHeaders || []).map((h: any) => h.name),
      ...(data.metricHeaders || []).map((h: any) => h.name),
    ];

    const rows = data.rows.map((row: any) => {
      const result: Record<string, any> = {};

      (row.dimensionValues || []).forEach((value: any, index: number) => {
        result[headers[index]] = value.value;
      });

      (row.metricValues || []).forEach((value: any, index: number) => {
        const metricIndex = (data.dimensionHeaders?.length || 0) + index;
        result[headers[metricIndex]] = parseFloat(value.value) || value.value;
      });

      return result;
    });

    return {
      success: true,
      data: rows,
      summary: {
        rowCount: rows.length,
        dateRange: data.dateRanges?.[0],
      },
    };
  }
}

// MCP Server
const server = new Server(
  {
    name: 'garcezpalha-ga4',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize GA4 client
const ga4Client = new GA4Client();

// Define available tools
const tools: Tool[] = [
  {
    name: 'ga4_get_page_metrics',
    description: 'Get detailed metrics for a specific page including pageviews, sessions, engagement rate, bounce rate, and conversions',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'string',
          description: 'Page path (e.g., /solutions/aposentadoria-indevida)',
        },
        dateRange: {
          type: 'object',
          properties: {
            startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
            endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          },
          description: 'Optional date range (defaults to last 30 days)',
        },
      },
      required: ['page'],
    },
  },
  {
    name: 'ga4_get_conversion_rate',
    description: 'Get conversion rate for a specific goal or overall site conversion rate',
    inputSchema: {
      type: 'object',
      properties: {
        goal: {
          type: 'string',
          description: 'Conversion goal name (e.g., "contact_form", "whatsapp_click")',
        },
        dateRange: {
          type: 'object',
          properties: {
            startDate: { type: 'string' },
            endDate: { type: 'string' },
          },
        },
      },
      required: ['goal'],
    },
  },
  {
    name: 'ga4_get_top_pages',
    description: 'Get top performing pages sorted by specified metric',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of top pages (1-100, default: 10)',
          default: 10,
        },
        metric: {
          type: 'string',
          enum: ['pageviews', 'sessions', 'conversions', 'engagementRate'],
          description: 'Metric to sort by',
          default: 'pageviews',
        },
        dateRange: {
          type: 'object',
          properties: {
            startDate: { type: 'string' },
            endDate: { type: 'string' },
          },
        },
      },
    },
  },
  {
    name: 'ga4_get_bounce_rate',
    description: 'Get bounce rate for a specific page or site-wide',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'string',
          description: 'Optional page path (returns site-wide if omitted)',
        },
        dateRange: {
          type: 'object',
          properties: {
            startDate: { type: 'string' },
            endDate: { type: 'string' },
          },
        },
      },
    },
  },
  {
    name: 'ga4_get_user_journey',
    description: 'Get user journey events for analysis of user behavior patterns',
    inputSchema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'Optional specific user ID',
        },
        segment: {
          type: 'string',
          description: 'Optional user segment (e.g., "high-value", "churned")',
        },
        limit: {
          type: 'number',
          description: 'Number of events (1-100, default: 50)',
          default: 50,
        },
      },
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
      case 'ga4_get_page_metrics': {
        const parsed = PageMetricsSchema.parse(args);
        const result = await ga4Client.getPageMetrics(parsed.page, parsed.dateRange);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'ga4_get_conversion_rate': {
        const parsed = ConversionRateSchema.parse(args);
        const result = await ga4Client.getConversionRate(parsed.goal, parsed.dateRange);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'ga4_get_top_pages': {
        const parsed = TopPagesSchema.parse(args);
        const result = await ga4Client.getTopPages(
          parsed.limit,
          parsed.metric,
          parsed.dateRange
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'ga4_get_bounce_rate': {
        const parsed = BounceRateSchema.parse(args);
        const result = await ga4Client.getBounceRate(parsed.page, parsed.dateRange);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'ga4_get_user_journey': {
        const parsed = UserJourneySchema.parse(args);
        const result = await ga4Client.getUserJourney(
          parsed.userId,
          parsed.segment,
          parsed.limit
        );
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
    await ga4Client.initialize();

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error('Google Analytics 4 MCP Server running on stdio');
  } catch (error) {
    console.error('Failed to start GA4 MCP Server:', error);
    process.exit(1);
  }
}

main();
