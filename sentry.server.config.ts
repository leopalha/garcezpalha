// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Ignore specific errors
  ignoreErrors: [
    // Expected errors that don't need tracking
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    // Supabase expected errors
    'JWT expired',
    'Invalid token',
  ],

  beforeSend(event, hint) {
    // Filter out non-error events in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Server] Sentry event:', event);
      return null; // Don't send events in dev
    }

    // Add custom context
    if (event.request) {
      event.request.headers = {
        ...event.request.headers,
        // Remove sensitive headers
        authorization: '[Filtered]',
        cookie: '[Filtered]',
      };
    }

    return event;
  },
});
