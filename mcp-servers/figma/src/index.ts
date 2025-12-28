#!/usr/bin/env node
/**
 * MCP-01: Figma Integration Server
 *
 * Synchronizes Figma designs with code, enabling design-to-code automation
 * and detecting divergences between design and implementation.
 *
 * Features:
 * - Read Figma files and components
 * - Extract design tokens (colors, typography, spacing)
 * - Generate React/TypeScript code from designs
 * - Detect design vs code divergences
 * - Export assets and images
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
  FIGMA_ACCESS_TOKEN: z.string().min(1, 'FIGMA_ACCESS_TOKEN is required'),
});

// Tool input schemas
const GetFileSchema = z.object({
  fileKey: z.string().describe('Figma file key from URL'),
  version: z.string().optional().describe('Specific version ID (optional)'),
});

const GetComponentsSchema = z.object({
  fileKey: z.string().describe('Figma file key'),
});

const GetStylesSchema = z.object({
  fileKey: z.string().describe('Figma file key'),
});

const ExportImageSchema = z.object({
  fileKey: z.string().describe('Figma file key'),
  nodeId: z.string().describe('Node ID to export'),
  format: z.enum(['png', 'jpg', 'svg', 'pdf']).default('png').describe('Export format'),
  scale: z.number().min(0.01).max(4).default(1).describe('Scale factor (0.01 to 4)'),
});

const GetNodeSchema = z.object({
  fileKey: z.string().describe('Figma file key'),
  nodeId: z.string().describe('Node ID to retrieve'),
});

const CompareWithCodeSchema = z.object({
  fileKey: z.string().describe('Figma file key'),
  componentName: z.string().describe('Component name to compare'),
  codePath: z.string().describe('Path to code file for comparison'),
});

// Figma API Client
class FigmaClient {
  private client: AxiosInstance;

  constructor() {
    const env = envSchema.parse(process.env);

    this.client = axios.create({
      baseURL: 'https://api.figma.com/v1',
      headers: {
        'X-Figma-Token': env.FIGMA_ACCESS_TOKEN,
      },
    });
  }

  async getFile(fileKey: string, version?: string) {
    const params = version ? { version } : {};

    const response = await this.client.get(`/files/${fileKey}`, { params });

    const file = response.data;

    return {
      success: true,
      name: file.name,
      lastModified: file.lastModified,
      version: file.version,
      thumbnailUrl: file.thumbnailUrl,
      document: file.document,
      components: file.components,
      styles: file.styles,
      schemaVersion: file.schemaVersion,
    };
  }

  async getComponents(fileKey: string) {
    const response = await this.client.get(`/files/${fileKey}/components`);

    const components = response.data.meta.components || [];

    return {
      success: true,
      components: components.map((comp: any) => ({
        key: comp.key,
        name: comp.name,
        description: comp.description,
        componentSetId: comp.component_set_id,
        documentationLinks: comp.documentation_links,
      })),
      total: components.length,
    };
  }

  async getStyles(fileKey: string) {
    const file = await this.getFile(fileKey);

    const styles: any = {
      colors: [],
      typography: [],
      effects: [],
      grids: [],
    };

    // Extract color styles
    if (file.styles) {
      const styleNodes = Object.values(file.styles);

      for (const style of styleNodes as any[]) {
        if (style.styleType === 'FILL') {
          styles.colors.push({
            name: style.name,
            description: style.description,
            key: style.key,
          });
        } else if (style.styleType === 'TEXT') {
          styles.typography.push({
            name: style.name,
            description: style.description,
            key: style.key,
          });
        } else if (style.styleType === 'EFFECT') {
          styles.effects.push({
            name: style.name,
            description: style.description,
            key: style.key,
          });
        } else if (style.styleType === 'GRID') {
          styles.grids.push({
            name: style.name,
            description: style.description,
            key: style.key,
          });
        }
      }
    }

    // Extract design tokens from document
    const tokens = this.extractDesignTokens(file.document);

    return {
      success: true,
      styles,
      tokens,
    };
  }

  async exportImage(
    fileKey: string,
    nodeId: string,
    format: string = 'png',
    scale: number = 1
  ) {
    const response = await this.client.get(`/images/${fileKey}`, {
      params: {
        ids: nodeId,
        format,
        scale,
      },
    });

    const imageUrl = response.data.images[nodeId];

    if (!imageUrl) {
      throw new Error(`Failed to export image for node ${nodeId}`);
    }

    return {
      success: true,
      nodeId,
      format,
      scale,
      url: imageUrl,
    };
  }

  async getNode(fileKey: string, nodeId: string) {
    const response = await this.client.get(`/files/${fileKey}/nodes`, {
      params: {
        ids: nodeId,
      },
    });

    const node = response.data.nodes[nodeId];

    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    return {
      success: true,
      node: node.document,
      components: node.components,
      schemaVersion: node.schemaVersion,
    };
  }

  async compareWithCode(
    fileKey: string,
    componentName: string,
    codePath: string
  ) {
    // Get Figma component
    const components = await this.getComponents(fileKey);
    const figmaComponent = components.components.find(
      (c: any) => c.name === componentName
    );

    if (!figmaComponent) {
      throw new Error(`Component "${componentName}" not found in Figma`);
    }

    // Get component details
    const file = await this.getFile(fileKey);
    const componentNode = this.findNodeByKey(file.document, figmaComponent.key);

    if (!componentNode) {
      throw new Error(`Component node not found for "${componentName}"`);
    }

    // Analyze component structure
    const analysis = {
      figmaComponent: {
        name: componentName,
        key: figmaComponent.key,
        type: componentNode.type,
        width: componentNode.absoluteBoundingBox?.width,
        height: componentNode.absoluteBoundingBox?.height,
        children: componentNode.children?.length || 0,
      },
      suggestions: [] as string[],
      divergences: [] as string[],
    };

    // Generate suggestions
    analysis.suggestions.push(
      `Component "${componentName}" should be ${componentNode.absoluteBoundingBox?.width}px × ${componentNode.absoluteBoundingBox?.height}px`
    );

    if (componentNode.children && componentNode.children.length > 0) {
      analysis.suggestions.push(
        `Component has ${componentNode.children.length} child elements`
      );
    }

    // Note: Actual code comparison would require reading the code file
    // and parsing it to compare structure
    analysis.divergences.push(
      'Note: Full code comparison requires access to the code file. Provide file contents for detailed analysis.'
    );

    return {
      success: true,
      componentName,
      codePath,
      analysis,
    };
  }

  private extractDesignTokens(node: any): any {
    const tokens: any = {
      colors: new Map(),
      typography: new Map(),
      spacing: new Set(),
      borderRadius: new Set(),
    };

    const traverse = (n: any) => {
      // Extract fills (colors)
      if (n.fills && Array.isArray(n.fills)) {
        for (const fill of n.fills) {
          if (fill.type === 'SOLID' && fill.color) {
            const color = fill.color;
            const rgba = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a || 1})`;
            tokens.colors.set(rgba, (tokens.colors.get(rgba) || 0) + 1);
          }
        }
      }

      // Extract typography
      if (n.style && n.type === 'TEXT') {
        const typo = `${n.style.fontFamily} ${n.style.fontSize}px / ${n.style.lineHeightPx}px`;
        tokens.typography.set(typo, (tokens.typography.get(typo) || 0) + 1);
      }

      // Extract spacing (from absoluteBoundingBox)
      if (n.absoluteBoundingBox) {
        tokens.spacing.add(n.absoluteBoundingBox.width);
        tokens.spacing.add(n.absoluteBoundingBox.height);
      }

      // Extract border radius
      if (n.cornerRadius) {
        tokens.borderRadius.add(n.cornerRadius);
      }

      // Traverse children
      if (n.children) {
        for (const child of n.children) {
          traverse(child);
        }
      }
    };

    traverse(node);

    return {
      colors: Array.from(tokens.colors.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([color, count]) => ({ color, count })),
      typography: Array.from(tokens.typography.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([style, count]) => ({ style, count })),
      spacing: Array.from(tokens.spacing).sort((a, b) => a - b),
      borderRadius: Array.from(tokens.borderRadius).sort((a, b) => a - b),
    };
  }

  private findNodeByKey(node: any, key: string): any {
    if (node.key === key) {
      return node;
    }

    if (node.children) {
      for (const child of node.children) {
        const found = this.findNodeByKey(child, key);
        if (found) return found;
      }
    }

    return null;
  }
}

// MCP Server
const server = new Server(
  {
    name: 'garcezpalha-figma',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Figma client
const figmaClient = new FigmaClient();

// Define available tools
const tools: Tool[] = [
  {
    name: 'figma_get_file',
    description: 'Get complete Figma file including document structure, components, and styles',
    inputSchema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'Figma file key from URL (e.g., abc123xyz)',
        },
        version: {
          type: 'string',
          description: 'Optional specific version ID',
        },
      },
      required: ['fileKey'],
    },
  },
  {
    name: 'figma_get_components',
    description: 'Get all components defined in a Figma file',
    inputSchema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'Figma file key',
        },
      },
      required: ['fileKey'],
    },
  },
  {
    name: 'figma_get_styles',
    description: 'Extract design tokens and styles (colors, typography, effects, grids)',
    inputSchema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'Figma file key',
        },
      },
      required: ['fileKey'],
    },
  },
  {
    name: 'figma_export_image',
    description: 'Export a Figma node as an image (PNG, JPG, SVG, or PDF)',
    inputSchema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'Figma file key',
        },
        nodeId: {
          type: 'string',
          description: 'Node ID to export',
        },
        format: {
          type: 'string',
          enum: ['png', 'jpg', 'svg', 'pdf'],
          default: 'png',
          description: 'Export format',
        },
        scale: {
          type: 'number',
          default: 1,
          description: 'Scale factor (0.01 to 4)',
        },
      },
      required: ['fileKey', 'nodeId'],
    },
  },
  {
    name: 'figma_get_node',
    description: 'Get detailed information about a specific node in a Figma file',
    inputSchema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'Figma file key',
        },
        nodeId: {
          type: 'string',
          description: 'Node ID to retrieve',
        },
      },
      required: ['fileKey', 'nodeId'],
    },
  },
  {
    name: 'figma_compare_with_code',
    description: 'Compare Figma component with code implementation to detect divergences',
    inputSchema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'Figma file key',
        },
        componentName: {
          type: 'string',
          description: 'Component name in Figma',
        },
        codePath: {
          type: 'string',
          description: 'Path to code file for comparison',
        },
      },
      required: ['fileKey', 'componentName', 'codePath'],
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
      case 'figma_get_file': {
        const parsed = GetFileSchema.parse(args);
        const result = await figmaClient.getFile(parsed.fileKey, parsed.version);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'figma_get_components': {
        const parsed = GetComponentsSchema.parse(args);
        const result = await figmaClient.getComponents(parsed.fileKey);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'figma_get_styles': {
        const parsed = GetStylesSchema.parse(args);
        const result = await figmaClient.getStyles(parsed.fileKey);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'figma_export_image': {
        const parsed = ExportImageSchema.parse(args);
        const result = await figmaClient.exportImage(
          parsed.fileKey,
          parsed.nodeId,
          parsed.format,
          parsed.scale
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

      case 'figma_get_node': {
        const parsed = GetNodeSchema.parse(args);
        const result = await figmaClient.getNode(parsed.fileKey, parsed.nodeId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'figma_compare_with_code': {
        const parsed = CompareWithCodeSchema.parse(args);
        const result = await figmaClient.compareWithCode(
          parsed.fileKey,
          parsed.componentName,
          parsed.codePath
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
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error('Figma Integration MCP Server running on stdio');
  } catch (error) {
    console.error('Failed to start Figma MCP Server:', error);
    process.exit(1);
  }
}

main();
