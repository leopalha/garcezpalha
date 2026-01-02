/**
 * Performance Metrics API Endpoint
 *
 * Receives performance metrics from clients and provides summary data
 */

import { NextRequest, NextResponse } from 'next/server';
import type { PerformanceSummary, WebVitalsMetric, TimingMetric, PerformanceMetric } from '@/lib/performance';
import { logger } from '@/lib/logger'

// In-memory storage for performance metrics
interface StoredMetrics {
  webVitals: WebVitalsMetric[];
  customMetrics: PerformanceMetric[];
  timings: TimingMetric[];
  apiMetrics: TimingMetric[];
  componentMetrics: TimingMetric[];
  databaseMetrics: TimingMetric[];
  receivedAt: number;
}

// Global in-memory storage (persists across requests in development)
const metricsStorage: StoredMetrics[] = [];

// Maximum number of metric batches to store
const MAX_BATCHES = 1000;

// Maximum age of metrics in milliseconds (1 hour)
const MAX_AGE_MS = 60 * 60 * 1000;

/**
 * Clean up old metrics
 */
function cleanupOldMetrics(): void {
  const cutoffTime = Date.now() - MAX_AGE_MS;
  let i = 0;
  while (i < metricsStorage.length && metricsStorage[i].receivedAt < cutoffTime) {
    i++;
  }
  if (i > 0) {
    metricsStorage.splice(0, i);
  }
}

/**
 * Calculate statistics for a numeric array
 */
function calculateStats(values: number[]): {
  min: number;
  max: number;
  avg: number;
  median: number;
  p95: number;
  p99: number;
  count: number;
} {
  if (values.length === 0) {
    return { min: 0, max: 0, avg: 0, median: 0, p95: 0, p99: 0, count: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);

  const p95Index = Math.floor(sorted.length * 0.95);
  const p99Index = Math.floor(sorted.length * 0.99);
  const medianIndex = Math.floor(sorted.length / 2);

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: sum / sorted.length,
    median: sorted[medianIndex],
    p95: sorted[Math.min(p95Index, sorted.length - 1)],
    p99: sorted[Math.min(p99Index, sorted.length - 1)],
    count: sorted.length,
  };
}

/**
 * Generate performance summary from stored metrics
 */
function generateSummary(): {
  totalBatches: number;
  totalMetrics: number;
  webVitals: Record<string, ReturnType<typeof calculateStats> & { ratings: Record<string, number> }>;
  apiPerformance: {
    overall: ReturnType<typeof calculateStats>;
    byEndpoint: Record<string, ReturnType<typeof calculateStats>>;
  };
  componentPerformance: {
    overall: ReturnType<typeof calculateStats>;
    byComponent: Record<string, ReturnType<typeof calculateStats>>;
  };
  databasePerformance: {
    overall: ReturnType<typeof calculateStats>;
    byQuery: Record<string, ReturnType<typeof calculateStats>>;
  };
  customMetrics: Record<string, ReturnType<typeof calculateStats>>;
  oldestMetricAge: number;
  newestMetricAge: number;
} {
  cleanupOldMetrics();

  const now = Date.now();

  // Aggregate all metrics
  const allWebVitals: Record<string, number[]> = {
    LCP: [],
    FID: [],
    CLS: [],
    TTFB: [],
    FCP: [],
  };
  const webVitalRatings: Record<string, Record<string, number>> = {
    LCP: { good: 0, 'needs-improvement': 0, poor: 0 },
    FID: { good: 0, 'needs-improvement': 0, poor: 0 },
    CLS: { good: 0, 'needs-improvement': 0, poor: 0 },
    TTFB: { good: 0, 'needs-improvement': 0, poor: 0 },
    FCP: { good: 0, 'needs-improvement': 0, poor: 0 },
  };

  const allApiTimings: number[] = [];
  const apiTimingsByEndpoint: Record<string, number[]> = {};

  const allComponentTimings: number[] = [];
  const componentTimingsByName: Record<string, number[]> = {};

  const allDatabaseTimings: number[] = [];
  const databaseTimingsByQuery: Record<string, number[]> = {};

  const customMetricsByName: Record<string, number[]> = {};

  let totalMetrics = 0;
  let oldestTimestamp = now;
  let newestTimestamp = 0;

  for (const batch of metricsStorage) {
    // Process web vitals
    for (const vital of batch.webVitals) {
      if (allWebVitals[vital.name]) {
        allWebVitals[vital.name].push(vital.value);
        webVitalRatings[vital.name][vital.rating]++;
        totalMetrics++;
        oldestTimestamp = Math.min(oldestTimestamp, vital.timestamp);
        newestTimestamp = Math.max(newestTimestamp, vital.timestamp);
      }
    }

    // Process API metrics
    for (const metric of batch.apiMetrics) {
      allApiTimings.push(metric.duration);
      if (!apiTimingsByEndpoint[metric.name]) {
        apiTimingsByEndpoint[metric.name] = [];
      }
      apiTimingsByEndpoint[metric.name].push(metric.duration);
      totalMetrics++;
      oldestTimestamp = Math.min(oldestTimestamp, metric.timestamp);
      newestTimestamp = Math.max(newestTimestamp, metric.timestamp);
    }

    // Process component metrics
    for (const metric of batch.componentMetrics) {
      allComponentTimings.push(metric.duration);
      if (!componentTimingsByName[metric.name]) {
        componentTimingsByName[metric.name] = [];
      }
      componentTimingsByName[metric.name].push(metric.duration);
      totalMetrics++;
      oldestTimestamp = Math.min(oldestTimestamp, metric.timestamp);
      newestTimestamp = Math.max(newestTimestamp, metric.timestamp);
    }

    // Process database metrics
    for (const metric of batch.databaseMetrics) {
      allDatabaseTimings.push(metric.duration);
      if (!databaseTimingsByQuery[metric.name]) {
        databaseTimingsByQuery[metric.name] = [];
      }
      databaseTimingsByQuery[metric.name].push(metric.duration);
      totalMetrics++;
      oldestTimestamp = Math.min(oldestTimestamp, metric.timestamp);
      newestTimestamp = Math.max(newestTimestamp, metric.timestamp);
    }

    // Process custom metrics
    for (const metric of batch.customMetrics) {
      if (!customMetricsByName[metric.name]) {
        customMetricsByName[metric.name] = [];
      }
      customMetricsByName[metric.name].push(metric.value);
      totalMetrics++;
      oldestTimestamp = Math.min(oldestTimestamp, metric.timestamp);
      newestTimestamp = Math.max(newestTimestamp, metric.timestamp);
    }

    // Process generic timings
    for (const timing of batch.timings) {
      if (!customMetricsByName[timing.name]) {
        customMetricsByName[timing.name] = [];
      }
      customMetricsByName[timing.name].push(timing.duration);
      totalMetrics++;
      oldestTimestamp = Math.min(oldestTimestamp, timing.timestamp);
      newestTimestamp = Math.max(newestTimestamp, timing.timestamp);
    }
  }

  // Calculate web vitals summary
  const webVitalsSummary: Record<string, ReturnType<typeof calculateStats> & { ratings: Record<string, number> }> = {};
  for (const [name, values] of Object.entries(allWebVitals)) {
    webVitalsSummary[name] = {
      ...calculateStats(values),
      ratings: webVitalRatings[name],
    };
  }

  // Calculate API performance summary
  const apiByEndpoint: Record<string, ReturnType<typeof calculateStats>> = {};
  for (const [endpoint, timings] of Object.entries(apiTimingsByEndpoint)) {
    apiByEndpoint[endpoint] = calculateStats(timings);
  }

  // Calculate component performance summary
  const componentByName: Record<string, ReturnType<typeof calculateStats>> = {};
  for (const [name, timings] of Object.entries(componentTimingsByName)) {
    componentByName[name] = calculateStats(timings);
  }

  // Calculate database performance summary
  const databaseByQuery: Record<string, ReturnType<typeof calculateStats>> = {};
  for (const [query, timings] of Object.entries(databaseTimingsByQuery)) {
    databaseByQuery[query] = calculateStats(timings);
  }

  // Calculate custom metrics summary
  const customMetricsSummary: Record<string, ReturnType<typeof calculateStats>> = {};
  for (const [name, values] of Object.entries(customMetricsByName)) {
    customMetricsSummary[name] = calculateStats(values);
  }

  return {
    totalBatches: metricsStorage.length,
    totalMetrics,
    webVitals: webVitalsSummary,
    apiPerformance: {
      overall: calculateStats(allApiTimings),
      byEndpoint: apiByEndpoint,
    },
    componentPerformance: {
      overall: calculateStats(allComponentTimings),
      byComponent: componentByName,
    },
    databasePerformance: {
      overall: calculateStats(allDatabaseTimings),
      byQuery: databaseByQuery,
    },
    customMetrics: customMetricsSummary,
    oldestMetricAge: totalMetrics > 0 ? now - oldestTimestamp : 0,
    newestMetricAge: totalMetrics > 0 ? now - newestTimestamp : 0,
  };
}

/**
 * POST /api/performance
 * Receives performance metrics from clients
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as PerformanceSummary;

    // Validate the incoming data
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Store the metrics
    const storedMetric: StoredMetrics = {
      webVitals: Array.isArray(body.webVitals) ? body.webVitals : [],
      customMetrics: Array.isArray(body.customMetrics) ? body.customMetrics : [],
      timings: Array.isArray(body.timings) ? body.timings : [],
      apiMetrics: Array.isArray(body.apiMetrics) ? body.apiMetrics : [],
      componentMetrics: Array.isArray(body.componentMetrics) ? body.componentMetrics : [],
      databaseMetrics: Array.isArray(body.databaseMetrics) ? body.databaseMetrics : [],
      receivedAt: Date.now(),
    };

    metricsStorage.push(storedMetric);

    // Trim storage if it exceeds maximum
    if (metricsStorage.length > MAX_BATCHES) {
      metricsStorage.shift();
    }

    // Clean up old metrics periodically
    if (Math.random() < 0.1) {
      cleanupOldMetrics();
    }

    const totalReceived =
      storedMetric.webVitals.length +
      storedMetric.customMetrics.length +
      storedMetric.timings.length +
      storedMetric.apiMetrics.length +
      storedMetric.componentMetrics.length +
      storedMetric.databaseMetrics.length;

    return NextResponse.json({
      success: true,
      message: 'Metrics received successfully',
      metricsReceived: totalReceived,
      timestamp: Date.now(),
    });
  } catch (error) {
    logger.error('Error processing performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to process metrics' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/performance
 * Returns performance summary
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'summary';

    if (format === 'raw') {
      // Return raw metrics (limited to last 100 batches)
      cleanupOldMetrics();
      const recentMetrics = metricsStorage.slice(-100);
      return NextResponse.json({
        batches: recentMetrics,
        totalBatches: metricsStorage.length,
        timestamp: Date.now(),
      });
    }

    // Return summary statistics
    const summary = generateSummary();
    return NextResponse.json({
      ...summary,
      timestamp: Date.now(),
    });
  } catch (error) {
    logger.error('Error retrieving performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/performance
 * Clears all stored metrics
 */
export async function DELETE(): Promise<NextResponse> {
  try {
    metricsStorage.length = 0;
    return NextResponse.json({
      success: true,
      message: 'All metrics cleared',
      timestamp: Date.now(),
    });
  } catch (error) {
    logger.error('Error clearing performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to clear metrics' },
      { status: 500 }
    );
  }
}
