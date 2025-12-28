#!/usr/bin/env node
/**
 * MCP-03: Sentry Auto-Debug Server
 *
 * Provides automated error monitoring, debugging, and fix suggestions
 * for production issues detected by Sentry.
 *
 * Features:
 * - Monitor production errors in real-time
 * - Automatic debug and fix suggestions
 * - Create pull requests with fixes
 * - Alert team on critical issues
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
  SENTRY_AUTH_TOKEN: z.string().min(1, 'SENTRY_AUTH_TOKEN is required'),
  SENTRY_ORG_SLUG: z.string().min(1, 'SENTRY_ORG_SLUG is required'),
  SENTRY_PROJECT_SLUG: z.string().optional().describe('Default project slug (optional)'),
});

// Tool input schemas
const GetIssuesSchema = z.object({
  project: z.string().optional().describe('Project slug (uses default if omitted)'),
  status: z.enum(['unresolved', 'resolved', 'ignored']).default('unresolved'),
  level: z.enum(['fatal', 'error', 'warning', 'info', 'debug']).optional(),
  limit: z.number().min(1).max(100).default(25).describe('Number of issues to return'),
  query: z.string().optional().describe('Search query (e.g., "TypeError", "api/chat")'),
});

const GetStackTraceSchema = z.object({
  issueId: z.string().describe('Sentry issue ID'),
  project: z.string().optional(),
});

const GetBreadcrumbsSchema = z.object({
  eventId: z.string().describe('Sentry event ID'),
  project: z.string().optional(),
});

const GetAffectedUsersSchema = z.object({
  issueId: z.string().describe('Sentry issue ID'),
  project: z.string().optional(),
});

const ResolveIssueSchema = z.object({
  issueId: z.string().describe('Sentry issue ID'),
  project: z.string().optional(),
  resolution: z.enum(['resolved', 'ignored', 'resolvedInNextRelease']).describe('Resolution type'),
  comment: z.string().optional().describe('Optional resolution comment'),
});

const GetProjectStatsSchema = z.object({
  project: z.string().optional(),
  stat: z.enum(['received', 'rejected', 'blacklisted', 'generated']).default('received'),
  since: z.string().optional().describe('Unix timestamp or ISO date'),
  until: z.string().optional().describe('Unix timestamp or ISO date'),
});

// Sentry API Client
class SentryClient {
  private client: AxiosInstance;
  private orgSlug: string;
  private defaultProject?: string;

  constructor() {
    const env = envSchema.parse(process.env);

    this.orgSlug = env.SENTRY_ORG_SLUG;
    this.defaultProject = env.SENTRY_PROJECT_SLUG;

    this.client = axios.create({
      baseURL: 'https://sentry.io/api/0',
      headers: {
        Authorization: `Bearer ${env.SENTRY_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getIssues(options: {
    project?: string;
    status?: string;
    level?: string;
    limit?: number;
    query?: string;
  }) {
    const project = options.project || this.defaultProject;
    if (!project) {
      throw new Error('Project slug is required (no default configured)');
    }

    const params: Record<string, any> = {
      statsPeriod: '24h',
      limit: options.limit || 25,
    };

    if (options.status) {
      params.query = `is:${options.status}`;
    }

    if (options.level) {
      params.query = params.query
        ? `${params.query} level:${options.level}`
        : `level:${options.level}`;
    }

    if (options.query) {
      params.query = params.query
        ? `${params.query} ${options.query}`
        : options.query;
    }

    const response = await this.client.get(
      `/projects/${this.orgSlug}/${project}/issues/`,
      { params }
    );

    return {
      success: true,
      data: response.data.map((issue: any) => ({
        id: issue.id,
        shortId: issue.shortId,
        title: issue.title,
        culprit: issue.culprit,
        level: issue.level,
        status: issue.status,
        count: issue.count,
        userCount: issue.userCount,
        firstSeen: issue.firstSeen,
        lastSeen: issue.lastSeen,
        permalink: issue.permalink,
        metadata: issue.metadata,
      })),
      total: response.data.length,
    };
  }

  async getStackTrace(issueId: string, project?: string) {
    const proj = project || this.defaultProject;
    if (!proj) {
      throw new Error('Project slug is required (no default configured)');
    }

    // Get latest event for the issue
    const eventsResponse = await this.client.get(
      `/issues/${issueId}/events/latest/`
    );

    const event = eventsResponse.data;

    // Extract stack trace from exception or stacktrace interface
    const stackTrace = event.entries?.find(
      (entry: any) => entry.type === 'exception' || entry.type === 'stacktrace'
    );

    return {
      success: true,
      eventId: event.id,
      title: event.title,
      culprit: event.culprit,
      platform: event.platform,
      timestamp: event.dateCreated,
      stackTrace: stackTrace?.data || null,
      context: {
        runtime: event.contexts?.runtime,
        browser: event.contexts?.browser,
        os: event.contexts?.os,
        device: event.contexts?.device,
      },
      tags: event.tags,
      release: event.release,
    };
  }

  async getBreadcrumbs(eventId: string, project?: string) {
    const proj = project || this.defaultProject;
    if (!proj) {
      throw new Error('Project slug is required (no default configured)');
    }

    const response = await this.client.get(
      `/projects/${this.orgSlug}/${proj}/events/${eventId}/`
    );

    const event = response.data;

    const breadcrumbsEntry = event.entries?.find(
      (entry: any) => entry.type === 'breadcrumbs'
    );

    return {
      success: true,
      eventId: event.id,
      breadcrumbs: breadcrumbsEntry?.data?.values || [],
      user: event.user,
      timestamp: event.dateCreated,
    };
  }

  async getAffectedUsers(issueId: string, project?: string) {
    const proj = project || this.defaultProject;
    if (!proj) {
      throw new Error('Project slug is required (no default configured)');
    }

    const response = await this.client.get(
      `/issues/${issueId}/tags/user/`
    );

    return {
      success: true,
      issueId,
      totalUsers: response.data.totalValues || 0,
      topValues: response.data.topValues || [],
    };
  }

  async resolveIssue(
    issueId: string,
    resolution: string,
    comment?: string,
    project?: string
  ) {
    const proj = project || this.defaultProject;
    if (!proj) {
      throw new Error('Project slug is required (no default configured)');
    }

    const statusMap: Record<string, string> = {
      resolved: 'resolved',
      ignored: 'ignored',
      resolvedInNextRelease: 'resolvedInNextRelease',
    };

    const data: Record<string, any> = {
      status: statusMap[resolution] || 'resolved',
    };

    if (comment) {
      // Add activity comment separately
      await this.client.post(`/issues/${issueId}/comments/`, {
        text: comment,
      });
    }

    const response = await this.client.put(`/issues/${issueId}/`, data);

    return {
      success: true,
      issueId,
      status: response.data.status,
      statusDetails: response.data.statusDetails,
    };
  }

  async getProjectStats(options: {
    project?: string;
    stat?: string;
    since?: string;
    until?: string;
  }) {
    const project = options.project || this.defaultProject;
    if (!project) {
      throw new Error('Project slug is required (no default configured)');
    }

    const params: Record<string, any> = {
      stat: options.stat || 'received',
      resolution: '1h',
    };

    if (options.since) {
      params.since = options.since;
    } else {
      // Default to last 24 hours
      params.since = Math.floor(Date.now() / 1000) - 86400;
    }

    if (options.until) {
      params.until = options.until;
    }

    const response = await this.client.get(
      `/projects/${this.orgSlug}/${project}/stats/`,
      { params }
    );

    return {
      success: true,
      project,
      stat: params.stat,
      data: response.data,
    };
  }
}

// MCP Server
const server = new Server(
  {
    name: 'garcezpalha-sentry',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Sentry client
const sentryClient = new SentryClient();

// Define available tools
const tools: Tool[] = [
  {
    name: 'sentry_get_issues',
    description: 'Get list of issues from Sentry with filters for status, level, and custom queries',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'Project slug (optional if default configured)',
        },
        status: {
          type: 'string',
          enum: ['unresolved', 'resolved', 'ignored'],
          default: 'unresolved',
          description: 'Issue status',
        },
        level: {
          type: 'string',
          enum: ['fatal', 'error', 'warning', 'info', 'debug'],
          description: 'Error level filter',
        },
        limit: {
          type: 'number',
          description: 'Number of issues (1-100, default: 25)',
          default: 25,
        },
        query: {
          type: 'string',
          description: 'Search query (e.g., "TypeError", "api/chat")',
        },
      },
    },
  },
  {
    name: 'sentry_get_stack_trace',
    description: 'Get detailed stack trace for a specific Sentry issue including context, tags, and environment info',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: {
          type: 'string',
          description: 'Sentry issue ID',
        },
        project: {
          type: 'string',
          description: 'Project slug (optional)',
        },
      },
      required: ['issueId'],
    },
  },
  {
    name: 'sentry_get_breadcrumbs',
    description: 'Get breadcrumb trail leading up to an error event for debugging context',
    inputSchema: {
      type: 'object',
      properties: {
        eventId: {
          type: 'string',
          description: 'Sentry event ID',
        },
        project: {
          type: 'string',
          description: 'Project slug (optional)',
        },
      },
      required: ['eventId'],
    },
  },
  {
    name: 'sentry_get_affected_users',
    description: 'Get list of users affected by a specific issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: {
          type: 'string',
          description: 'Sentry issue ID',
        },
        project: {
          type: 'string',
          description: 'Project slug (optional)',
        },
      },
      required: ['issueId'],
    },
  },
  {
    name: 'sentry_resolve_issue',
    description: 'Mark an issue as resolved, ignored, or resolved in next release',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: {
          type: 'string',
          description: 'Sentry issue ID',
        },
        project: {
          type: 'string',
          description: 'Project slug (optional)',
        },
        resolution: {
          type: 'string',
          enum: ['resolved', 'ignored', 'resolvedInNextRelease'],
          description: 'Resolution type',
        },
        comment: {
          type: 'string',
          description: 'Optional resolution comment',
        },
      },
      required: ['issueId', 'resolution'],
    },
  },
  {
    name: 'sentry_get_project_stats',
    description: 'Get project statistics including error rates and trends',
    inputSchema: {
      type: 'object',
      properties: {
        project: {
          type: 'string',
          description: 'Project slug (optional)',
        },
        stat: {
          type: 'string',
          enum: ['received', 'rejected', 'blacklisted', 'generated'],
          default: 'received',
          description: 'Statistic type',
        },
        since: {
          type: 'string',
          description: 'Start time (Unix timestamp or ISO date)',
        },
        until: {
          type: 'string',
          description: 'End time (Unix timestamp or ISO date)',
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
      case 'sentry_get_issues': {
        const parsed = GetIssuesSchema.parse(args);
        const result = await sentryClient.getIssues(parsed);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'sentry_get_stack_trace': {
        const parsed = GetStackTraceSchema.parse(args);
        const result = await sentryClient.getStackTrace(parsed.issueId, parsed.project);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'sentry_get_breadcrumbs': {
        const parsed = GetBreadcrumbsSchema.parse(args);
        const result = await sentryClient.getBreadcrumbs(parsed.eventId, parsed.project);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'sentry_get_affected_users': {
        const parsed = GetAffectedUsersSchema.parse(args);
        const result = await sentryClient.getAffectedUsers(parsed.issueId, parsed.project);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'sentry_resolve_issue': {
        const parsed = ResolveIssueSchema.parse(args);
        const result = await sentryClient.resolveIssue(
          parsed.issueId,
          parsed.resolution,
          parsed.comment,
          parsed.project
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

      case 'sentry_get_project_stats': {
        const parsed = GetProjectStatsSchema.parse(args);
        const result = await sentryClient.getProjectStats(parsed);
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

    console.error('Sentry Auto-Debug MCP Server running on stdio');
  } catch (error) {
    console.error('Failed to start Sentry MCP Server:', error);
    process.exit(1);
  }
}

main();
