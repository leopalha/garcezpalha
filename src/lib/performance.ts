/**
 * Performance Monitoring Utility for Garcez Palha Platform
 *
 * Provides comprehensive performance tracking including:
 * - Web Vitals (LCP, FID, CLS, TTFB, FCP)
 * - Custom metrics (API response times, component render times, DB queries)
 * - Performance reporting
 * - React hooks for component-level monitoring
 */

import { useEffect, useRef, useCallback } from 'react';

// Types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface TimingMetric {
  name: string;
  duration: number;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface WebVitalsMetric {
  name: 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'FCP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

export interface PerformanceSummary {
  webVitals: WebVitalsMetric[];
  customMetrics: PerformanceMetric[];
  timings: TimingMetric[];
  apiMetrics: TimingMetric[];
  componentMetrics: TimingMetric[];
  databaseMetrics: TimingMetric[];
}

// Web Vitals thresholds
const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 },
};

// Helper to determine rating
function getRating(
  metric: keyof typeof WEB_VITALS_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[metric];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Performance Reporter Class
 * Central hub for collecting and reporting performance metrics
 */
export class PerformanceReporter {
  private static instance: PerformanceReporter;
  private webVitals: WebVitalsMetric[] = [];
  private customMetrics: PerformanceMetric[] = [];
  private timings: TimingMetric[] = [];
  private apiMetrics: TimingMetric[] = [];
  private componentMetrics: TimingMetric[] = [];
  private databaseMetrics: TimingMetric[] = [];
  private isClient: boolean;

  private constructor() {
    this.isClient = typeof window !== 'undefined';
    if (this.isClient) {
      this.initWebVitals();
    }
  }

  static getInstance(): PerformanceReporter {
    if (!PerformanceReporter.instance) {
      PerformanceReporter.instance = new PerformanceReporter();
    }
    return PerformanceReporter.instance;
  }

  /**
   * Initialize Web Vitals tracking
   */
  private initWebVitals(): void {
    if (!this.isClient) return;

    // Track TTFB
    this.trackTTFB();

    // Track FCP
    this.trackFCP();

    // Track LCP
    this.trackLCP();

    // Track FID
    this.trackFID();

    // Track CLS
    this.trackCLS();
  }

  private trackTTFB(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        this.webVitals.push({
          name: 'TTFB',
          value: ttfb,
          rating: getRating('TTFB', ttfb),
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.warn('Failed to track TTFB:', error);
    }
  }

  private trackFCP(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          const fcp = fcpEntry.startTime;
          this.webVitals.push({
            name: 'FCP',
            value: fcp,
            rating: getRating('FCP', fcp),
            timestamp: Date.now(),
          });
          observer.disconnect();
        }
      });
      observer.observe({ type: 'paint', buffered: true });
    } catch (error) {
      console.warn('Failed to track FCP:', error);
    }
  }

  private trackLCP(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      let lcpValue = 0;
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          lcpValue = lastEntry.startTime;
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });

      // Report LCP on page hide or before unload
      const reportLCP = () => {
        if (lcpValue > 0) {
          this.webVitals.push({
            name: 'LCP',
            value: lcpValue,
            rating: getRating('LCP', lcpValue),
            timestamp: Date.now(),
          });
          observer.disconnect();
        }
      };

      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') {
            reportLCP();
          }
        });
      }

      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', reportLCP);
      }
    } catch (error) {
      console.warn('Failed to track LCP:', error);
    }
  }

  private trackFID(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstEntry = entries[0] as PerformanceEventTiming;
        if (firstEntry) {
          const fid = firstEntry.processingStart - firstEntry.startTime;
          this.webVitals.push({
            name: 'FID',
            value: fid,
            rating: getRating('FID', fid),
            timestamp: Date.now(),
          });
          observer.disconnect();
        }
      });
      observer.observe({ type: 'first-input', buffered: true });
    } catch (error) {
      console.warn('Failed to track FID:', error);
    }
  }

  private trackCLS(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      let clsValue = 0;
      let sessionValue = 0;
      let sessionEntries: PerformanceEntry[] = [];

      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries() as (PerformanceEntry & { hadRecentInput?: boolean; value?: number })[];

        for (const entry of entries) {
          // Only count layout shifts without recent user input
          if (!entry.hadRecentInput && entry.value) {
            const firstSessionEntry = sessionEntries[0] as PerformanceEntry | undefined;
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1] as PerformanceEntry | undefined;

            // If the entry occurred less than 1 second after the previous entry
            // and less than 5 seconds after the first entry in the session,
            // include the entry in the current session. Otherwise, start a new session.
            if (
              sessionValue &&
              firstSessionEntry &&
              lastSessionEntry &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000
            ) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }

            // Update CLS to the max session value
            if (sessionValue > clsValue) {
              clsValue = sessionValue;
            }
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });

      // Report CLS on page hide
      const reportCLS = () => {
        this.webVitals.push({
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          timestamp: Date.now(),
        });
        observer.disconnect();
      };

      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') {
            reportCLS();
          }
        });
      }
    } catch (error) {
      console.warn('Failed to track CLS:', error);
    }
  }

  /**
   * Track a custom metric
   */
  trackMetric(name: string, value: number, unit: string, tags?: Record<string, string>): void {
    this.customMetrics.push({
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags,
    });
  }

  /**
   * Track a timing metric
   */
  trackTiming(name: string, duration: number, tags?: Record<string, string>): void {
    this.timings.push({
      name,
      duration,
      timestamp: Date.now(),
      tags,
    });
  }

  /**
   * Track API response time
   */
  trackAPITiming(endpoint: string, duration: number, method: string = 'GET', statusCode?: number): void {
    this.apiMetrics.push({
      name: endpoint,
      duration,
      timestamp: Date.now(),
      tags: {
        method,
        ...(statusCode && { statusCode: statusCode.toString() }),
      },
    });
  }

  /**
   * Track component render time
   */
  trackComponentTiming(componentName: string, duration: number, phase: 'mount' | 'update' | 'unmount' = 'mount'): void {
    this.componentMetrics.push({
      name: componentName,
      duration,
      timestamp: Date.now(),
      tags: { phase },
    });
  }

  /**
   * Track database query time (mock for now)
   */
  trackDatabaseTiming(query: string, duration: number, table?: string): void {
    this.databaseMetrics.push({
      name: query,
      duration,
      timestamp: Date.now(),
      tags: table ? { table } : undefined,
    });
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): PerformanceSummary {
    return {
      webVitals: [...this.webVitals],
      customMetrics: [...this.customMetrics],
      timings: [...this.timings],
      apiMetrics: [...this.apiMetrics],
      componentMetrics: [...this.componentMetrics],
      databaseMetrics: [...this.databaseMetrics],
    };
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.webVitals = [];
    this.customMetrics = [];
    this.timings = [];
    this.apiMetrics = [];
    this.componentMetrics = [];
    this.databaseMetrics = [];
  }

  /**
   * Report metrics to server
   */
  async reportToServer(): Promise<void> {
    if (!this.isClient) {
      console.warn('reportToServer() should only be called from the client');
      return;
    }

    const metrics = this.getMetrics();

    try {
      const response = await fetch('/api/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
      });

      if (!response.ok) {
        throw new Error(`Failed to report metrics: ${response.statusText}`);
      }

      // Clear metrics after successful report
      this.clearMetrics();
    } catch (error) {
      console.error('Failed to report performance metrics:', error);
    }
  }
}

/**
 * Create a timer utility for measuring durations
 */
export function createTimer(): { start: () => void; stop: () => number } {
  let startTime = 0;
  return {
    start: () => {
      startTime = performance.now();
    },
    stop: () => {
      return performance.now() - startTime;
    },
  };
}

/**
 * Measure async function execution time
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  reporter?: PerformanceReporter
): Promise<T> {
  const timer = createTimer();
  timer.start();

  try {
    const result = await fn();
    const duration = timer.stop();

    if (reporter) {
      reporter.trackTiming(name, duration);
    }

    return result;
  } catch (error) {
    const duration = timer.stop();
    if (reporter) {
      reporter.trackTiming(`${name}_error`, duration);
    }
    throw error;
  }
}

/**
 * Measure sync function execution time
 */
export function measureSync<T>(
  name: string,
  fn: () => T,
  reporter?: PerformanceReporter
): T {
  const timer = createTimer();
  timer.start();

  try {
    const result = fn();
    const duration = timer.stop();

    if (reporter) {
      reporter.trackTiming(name, duration);
    }

    return result;
  } catch (error) {
    const duration = timer.stop();
    if (reporter) {
      reporter.trackTiming(`${name}_error`, duration);
    }
    throw error;
  }
}

/**
 * React hook for performance monitoring
 */
export function usePerformance(componentName: string) {
  const reporter = PerformanceReporter.getInstance();
  const mountTimeRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);
  const renderStartRef = useRef<number>(0);

  // Track mount time
  useEffect(() => {
    const mountTime = performance.now() - mountTimeRef.current;
    reporter.trackComponentTiming(componentName, mountTime, 'mount');

    return () => {
      const unmountTime = performance.now();
      reporter.trackComponentTiming(componentName, unmountTime - mountTimeRef.current, 'unmount');
    };
  }, [componentName, reporter]);

  // Initialize mount time on first render
  if (mountTimeRef.current === 0) {
    mountTimeRef.current = performance.now();
  }

  // Track render count
  renderCountRef.current += 1;

  // Utility to start timing
  const startTiming = useCallback((name: string) => {
    const timer = createTimer();
    timer.start();
    return () => {
      const duration = timer.stop();
      reporter.trackTiming(`${componentName}:${name}`, duration);
      return duration;
    };
  }, [componentName, reporter]);

  // Utility to track custom metric
  const trackMetric = useCallback(
    (name: string, value: number, unit: string = 'ms') => {
      reporter.trackMetric(`${componentName}:${name}`, value, unit);
    },
    [componentName, reporter]
  );

  // Utility to measure async operation
  const measureOperation = useCallback(
    async <T>(name: string, operation: () => Promise<T>): Promise<T> => {
      return measureAsync(`${componentName}:${name}`, operation, reporter);
    },
    [componentName, reporter]
  );

  // Mark render start for measuring render time
  const markRenderStart = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  // Mark render end and track the duration
  const markRenderEnd = useCallback(() => {
    if (renderStartRef.current > 0) {
      const renderTime = performance.now() - renderStartRef.current;
      reporter.trackComponentTiming(componentName, renderTime, 'update');
      renderStartRef.current = 0;
      return renderTime;
    }
    return 0;
  }, [componentName, reporter]);

  return {
    startTiming,
    trackMetric,
    measureOperation,
    markRenderStart,
    markRenderEnd,
    renderCount: renderCountRef.current,
    reporter,
  };
}

/**
 * Performance middleware for API routes
 * Use this to wrap API handlers for automatic timing
 */
export interface PerformanceMiddlewareOptions {
  trackResponse?: boolean;
  includeQueryParams?: boolean;
}

export function createPerformanceMiddleware(options: PerformanceMiddlewareOptions = {}) {
  const { trackResponse = true, includeQueryParams = false } = options;

  return function performanceMiddleware<T>(
    handler: (request: Request, ...args: unknown[]) => Promise<T>
  ): (request: Request, ...args: unknown[]) => Promise<T> {
    return async (request: Request, ...args: unknown[]): Promise<T> => {
      const startTime = performance.now();
      const url = new URL(request.url);
      const endpoint = includeQueryParams ? url.pathname + url.search : url.pathname;
      const method = request.method;

      try {
        const result = await handler(request, ...args);
        const duration = performance.now() - startTime;

        // Store timing in global storage for server-side
        if (typeof global !== 'undefined') {
          if (!global._performanceMetrics) {
            global._performanceMetrics = [];
          }
          global._performanceMetrics.push({
            type: 'api',
            endpoint,
            method,
            duration,
            timestamp: Date.now(),
            statusCode: result instanceof Response ? result.status : 200,
          });
        }

        if (trackResponse && result instanceof Response) {
          const newHeaders = new Headers(result.headers);
          newHeaders.set('X-Response-Time', `${duration.toFixed(2)}ms`);
          return new Response(result.body, {
            status: result.status,
            statusText: result.statusText,
            headers: newHeaders,
          }) as unknown as T;
        }

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;

        if (typeof global !== 'undefined') {
          if (!global._performanceMetrics) {
            global._performanceMetrics = [];
          }
          global._performanceMetrics.push({
            type: 'api',
            endpoint,
            method,
            duration,
            timestamp: Date.now(),
            error: true,
          });
        }

        throw error;
      }
    };
  };
}

/**
 * Server-side performance tracking utilities
 */
export const serverPerformance = {
  /**
   * Track database query timing
   */
  async trackQuery<T>(queryName: string, queryFn: () => Promise<T>, table?: string): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await queryFn();
      const duration = performance.now() - startTime;

      if (typeof global !== 'undefined') {
        if (!global._performanceMetrics) {
          global._performanceMetrics = [];
        }
        global._performanceMetrics.push({
          type: 'database',
          query: queryName,
          duration,
          timestamp: Date.now(),
          table,
        });
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      if (typeof global !== 'undefined') {
        if (!global._performanceMetrics) {
          global._performanceMetrics = [];
        }
        global._performanceMetrics.push({
          type: 'database',
          query: queryName,
          duration,
          timestamp: Date.now(),
          table,
          error: true,
        });
      }

      throw error;
    }
  },

  /**
   * Get server-side metrics
   */
  getMetrics(): unknown[] {
    if (typeof global !== 'undefined' && global._performanceMetrics) {
      return global._performanceMetrics;
    }
    return [];
  },

  /**
   * Clear server-side metrics
   */
  clearMetrics(): void {
    if (typeof global !== 'undefined') {
      global._performanceMetrics = [];
    }
  },
};

// Augment global type for server-side metrics storage
declare global {
  // eslint-disable-next-line no-var
  var _performanceMetrics: unknown[] | undefined;
}

// Export singleton instance for convenience
export const performanceReporter = typeof window !== 'undefined'
  ? PerformanceReporter.getInstance()
  : null;
