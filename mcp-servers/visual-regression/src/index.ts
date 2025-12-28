#!/usr/bin/env node
/**
 * MCP-05: Visual Regression Testing Server
 *
 * Automated visual testing to detect UI bugs and regressions using Playwright.
 *
 * Features:
 * - Screenshot capture and comparison
 * - Multi-viewport responsive testing
 * - Cross-browser validation
 * - Pixel-perfect diff detection
 * - Baseline management
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { chromium, firefox, webkit, Browser, Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

// Tool input schemas
const CaptureScreenshotSchema = z.object({
  url: z.string().url().describe('URL to capture'),
  name: z.string().describe('Screenshot name/identifier'),
  viewport: z.object({
    width: z.number().default(1920),
    height: z.number().default(1080),
  }).optional().describe('Viewport size'),
  browser: z.enum(['chromium', 'firefox', 'webkit']).default('chromium'),
  fullPage: z.boolean().default(false).describe('Capture full page'),
  waitFor: z.string().optional().describe('CSS selector to wait for'),
});

const CompareScreenshotsSchema = z.object({
  baseline: z.string().describe('Baseline screenshot name'),
  current: z.string().describe('Current screenshot name'),
  threshold: z.number().min(0).max(1).default(0.1).describe('Diff threshold (0-1)'),
});

const ResponsiveTestSchema = z.object({
  url: z.string().url(),
  name: z.string(),
  viewports: z.array(z.object({
    width: z.number(),
    height: z.number(),
    name: z.string(),
  })).optional().describe('Custom viewports or use defaults'),
});

const CrossBrowserTestSchema = z.object({
  url: z.string().url(),
  name: z.string(),
  browsers: z.array(z.enum(['chromium', 'firefox', 'webkit'])).optional(),
});

const SetBaselineSchema = z.object({
  screenshot: z.string().describe('Screenshot to set as baseline'),
});

// Visual Regression Client
class VisualRegressionClient {
  private screenshotsDir: string;
  private baselinesDir: string;
  private diffsDir: string;

  constructor() {
    const baseDir = process.env.VRT_SCREENSHOTS_DIR || './visual-tests';
    this.screenshotsDir = path.join(baseDir, 'screenshots');
    this.baselinesDir = path.join(baseDir, 'baselines');
    this.diffsDir = path.join(baseDir, 'diffs');
  }

  async initialize() {
    await fs.mkdir(this.screenshotsDir, { recursive: true });
    await fs.mkdir(this.baselinesDir, { recursive: true });
    await fs.mkdir(this.diffsDir, { recursive: true });
  }

  async captureScreenshot(options: {
    url: string;
    name: string;
    viewport?: { width: number; height: number };
    browser: 'chromium' | 'firefox' | 'webkit';
    fullPage?: boolean;
    waitFor?: string;
  }) {
    const browserType = this.getBrowserType(options.browser);
    const browser = await browserType.launch();

    try {
      const context = await browser.newContext({
        viewport: options.viewport || { width: 1920, height: 1080 },
      });

      const page = await context.newPage();
      await page.goto(options.url, { waitUntil: 'networkidle' });

      if (options.waitFor) {
        await page.waitForSelector(options.waitFor, { timeout: 10000 });
      }

      const screenshotPath = path.join(
        this.screenshotsDir,
        `${options.name}.png`
      );

      await page.screenshot({
        path: screenshotPath,
        fullPage: options.fullPage || false,
      });

      await context.close();

      return {
        success: true,
        name: options.name,
        path: screenshotPath,
        url: options.url,
        viewport: options.viewport,
        browser: options.browser,
      };
    } finally {
      await browser.close();
    }
  }

  async compareScreenshots(options: {
    baseline: string;
    current: string;
    threshold: number;
  }) {
    const baselinePath = path.join(this.baselinesDir, `${options.baseline}.png`);
    const currentPath = path.join(this.screenshotsDir, `${options.current}.png`);

    // Check if files exist
    try {
      await fs.access(baselinePath);
    } catch {
      throw new Error(`Baseline not found: ${options.baseline}`);
    }

    try {
      await fs.access(currentPath);
    } catch {
      throw new Error(`Current screenshot not found: ${options.current}`);
    }

    // Read images
    const baselineBuffer = await fs.readFile(baselinePath);
    const currentBuffer = await fs.readFile(currentPath);

    const baseline = PNG.sync.read(baselineBuffer);
    const current = PNG.sync.read(currentBuffer);

    // Check dimensions match
    if (baseline.width !== current.width || baseline.height !== current.height) {
      throw new Error(
        `Dimension mismatch: baseline ${baseline.width}x${baseline.height} vs current ${current.width}x${current.height}`
      );
    }

    // Create diff image
    const diff = new PNG({ width: baseline.width, height: baseline.height });

    const numDiffPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      baseline.width,
      baseline.height,
      { threshold: options.threshold }
    );

    const totalPixels = baseline.width * baseline.height;
    const diffPercentage = (numDiffPixels / totalPixels) * 100;

    // Save diff if there are differences
    if (numDiffPixels > 0) {
      const diffPath = path.join(
        this.diffsDir,
        `${options.baseline}-vs-${options.current}.png`
      );
      await fs.writeFile(diffPath, PNG.sync.write(diff));

      return {
        success: true,
        identical: false,
        diffPixels: numDiffPixels,
        totalPixels,
        diffPercentage: parseFloat(diffPercentage.toFixed(2)),
        diffPath,
        baseline: options.baseline,
        current: options.current,
      };
    }

    return {
      success: true,
      identical: true,
      diffPixels: 0,
      totalPixels,
      diffPercentage: 0,
      baseline: options.baseline,
      current: options.current,
    };
  }

  async responsiveTest(options: {
    url: string;
    name: string;
    viewports?: Array<{ width: number; height: number; name: string }>;
  }) {
    const defaultViewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' },
    ];

    const viewports = options.viewports || defaultViewports;
    const results = [];

    for (const viewport of viewports) {
      const screenshotName = `${options.name}-${viewport.name}`;
      const result = await this.captureScreenshot({
        url: options.url,
        name: screenshotName,
        viewport: { width: viewport.width, height: viewport.height },
        browser: 'chromium',
      });

      results.push({
        viewport: viewport.name,
        width: viewport.width,
        height: viewport.height,
        screenshot: result.path,
      });
    }

    return {
      success: true,
      url: options.url,
      name: options.name,
      viewports: results,
    };
  }

  async crossBrowserTest(options: {
    url: string;
    name: string;
    browsers?: Array<'chromium' | 'firefox' | 'webkit'>;
  }) {
    const browsers = options.browsers || ['chromium', 'firefox', 'webkit'];
    const results = [];

    for (const browser of browsers) {
      const screenshotName = `${options.name}-${browser}`;
      const result = await this.captureScreenshot({
        url: options.url,
        name: screenshotName,
        browser,
      });

      results.push({
        browser,
        screenshot: result.path,
      });
    }

    return {
      success: true,
      url: options.url,
      name: options.name,
      browsers: results,
    };
  }

  async setBaseline(screenshot: string) {
    const sourcePath = path.join(this.screenshotsDir, `${screenshot}.png`);
    const targetPath = path.join(this.baselinesDir, `${screenshot}.png`);

    try {
      await fs.access(sourcePath);
    } catch {
      throw new Error(`Screenshot not found: ${screenshot}`);
    }

    await fs.copyFile(sourcePath, targetPath);

    return {
      success: true,
      screenshot,
      baselinePath: targetPath,
    };
  }

  private getBrowserType(browser: 'chromium' | 'firefox' | 'webkit') {
    switch (browser) {
      case 'chromium':
        return chromium;
      case 'firefox':
        return firefox;
      case 'webkit':
        return webkit;
    }
  }
}

// MCP Server
const server = new Server(
  {
    name: 'garcezpalha-visual-regression',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize client
const vrtClient = new VisualRegressionClient();

// Define available tools
const tools: Tool[] = [
  {
    name: 'vrt_capture_screenshot',
    description: 'Capture a screenshot of a webpage for visual testing',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'URL to capture',
        },
        name: {
          type: 'string',
          description: 'Screenshot identifier',
        },
        viewport: {
          type: 'object',
          properties: {
            width: { type: 'number', default: 1920 },
            height: { type: 'number', default: 1080 },
          },
        },
        browser: {
          type: 'string',
          enum: ['chromium', 'firefox', 'webkit'],
          default: 'chromium',
        },
        fullPage: {
          type: 'boolean',
          default: false,
        },
        waitFor: {
          type: 'string',
          description: 'CSS selector to wait for',
        },
      },
      required: ['url', 'name'],
    },
  },
  {
    name: 'vrt_compare_screenshots',
    description: 'Compare two screenshots and detect visual differences',
    inputSchema: {
      type: 'object',
      properties: {
        baseline: {
          type: 'string',
          description: 'Baseline screenshot name',
        },
        current: {
          type: 'string',
          description: 'Current screenshot name',
        },
        threshold: {
          type: 'number',
          default: 0.1,
          description: 'Diff sensitivity (0-1)',
        },
      },
      required: ['baseline', 'current'],
    },
  },
  {
    name: 'vrt_responsive_test',
    description: 'Test responsive design across multiple viewports',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'URL to test',
        },
        name: {
          type: 'string',
          description: 'Test identifier',
        },
        viewports: {
          type: 'array',
          description: 'Custom viewports (optional)',
        },
      },
      required: ['url', 'name'],
    },
  },
  {
    name: 'vrt_cross_browser_test',
    description: 'Test across multiple browsers (Chromium, Firefox, WebKit)',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'URL to test',
        },
        name: {
          type: 'string',
          description: 'Test identifier',
        },
        browsers: {
          type: 'array',
          description: 'Browsers to test (optional)',
        },
      },
      required: ['url', 'name'],
    },
  },
  {
    name: 'vrt_set_baseline',
    description: 'Set a screenshot as the baseline for future comparisons',
    inputSchema: {
      type: 'object',
      properties: {
        screenshot: {
          type: 'string',
          description: 'Screenshot name to set as baseline',
        },
      },
      required: ['screenshot'],
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
      case 'vrt_capture_screenshot': {
        const parsed = CaptureScreenshotSchema.parse(args);
        const result = await vrtClient.captureScreenshot(parsed);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vrt_compare_screenshots': {
        const parsed = CompareScreenshotsSchema.parse(args);
        const result = await vrtClient.compareScreenshots(parsed);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vrt_responsive_test': {
        const parsed = ResponsiveTestSchema.parse(args);
        const result = await vrtClient.responsiveTest(parsed);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vrt_cross_browser_test': {
        const parsed = CrossBrowserTestSchema.parse(args);
        const result = await vrtClient.crossBrowserTest(parsed);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'vrt_set_baseline': {
        const parsed = SetBaselineSchema.parse(args);
        const result = await vrtClient.setBaseline(parsed.screenshot);
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
    await vrtClient.initialize();

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error('Visual Regression Testing MCP Server running on stdio');
  } catch (error) {
    console.error('Failed to start VRT MCP Server:', error);
    process.exit(1);
  }
}

main();
