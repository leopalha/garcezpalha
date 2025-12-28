# MCP-02: Google Analytics 4 Server

**Status**: ✅ Implemented
**Priority**: P0 - Critical
**Estimated Time**: 6h

## Overview

MCP Server for automated Google Analytics 4 data analysis and optimization suggestions. Enables data-driven decision making by providing Claude Code with direct access to GA4 metrics.

## Features

### 1. Page Metrics Analysis
- Get detailed metrics for any page: pageviews, sessions, engagement rate, bounce rate, conversions
- Compare performance across date ranges
- Identify underperforming content

### 2. Conversion Tracking
- Query conversion rates by goal
- Track funnel performance
- Analyze conversion attribution

### 3. Top Pages Ranking
- Identify best-performing pages by metric
- Sort by pageviews, sessions, conversions, or engagement
- Discover content opportunities

### 4. Bounce Rate Analysis
- Page-level or site-wide bounce rates
- Correlate with engagement metrics
- Identify pages needing optimization

### 5. User Journey Analysis
- Track user behavior patterns
- Segment analysis (high-value, churned, etc.)
- Event-level granularity

## Setup

### 1. Install Dependencies

```bash
cd mcp-servers/ga4
npm install
npm run build
```

### 2. Configure Google Cloud Credentials

1. Create a Google Cloud project
2. Enable the Google Analytics Data API (v1)
3. Create a service account with Analytics Viewer role
4. Download the JSON key file
5. Set environment variables:

```bash
export GA4_PROPERTY_ID="123456789"
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

### 3. Add to Claude Code MCP Config

Add to your `claude_desktop_config.json` or MCP configuration:

```json
{
  "mcpServers": {
    "garcezpalha-ga4": {
      "command": "node",
      "args": ["d:\\garcezpalha\\mcp-servers\\ga4\\dist\\index.js"],
      "env": {
        "GA4_PROPERTY_ID": "YOUR_PROPERTY_ID",
        "GOOGLE_APPLICATION_CREDENTIALS": "C:\\path\\to\\credentials.json"
      }
    }
  }
}
```

## Available Tools

### `ga4_get_page_metrics`

Get comprehensive metrics for a specific page.

**Parameters**:
- `page` (string, required): Page path (e.g., `/solutions/aposentadoria-indevida`)
- `dateRange` (object, optional): `{ startDate: "YYYY-MM-DD", endDate: "YYYY-MM-DD" }`

**Example**:
```typescript
{
  "page": "/solutions/aposentadoria-indevida",
  "dateRange": {
    "startDate": "2025-11-01",
    "endDate": "2025-11-30"
  }
}
```

### `ga4_get_conversion_rate`

Get conversion rate for a specific goal.

**Parameters**:
- `goal` (string, required): Conversion goal name (e.g., `contact_form`, `whatsapp_click`)
- `dateRange` (object, optional)

### `ga4_get_top_pages`

Get top performing pages sorted by metric.

**Parameters**:
- `limit` (number, optional, default: 10): Number of pages (1-100)
- `metric` (enum, optional, default: "pageviews"): `pageviews | sessions | conversions | engagementRate`
- `dateRange` (object, optional)

### `ga4_get_bounce_rate`

Get bounce rate for page or site-wide.

**Parameters**:
- `page` (string, optional): Specific page path (omit for site-wide)
- `dateRange` (object, optional)

### `ga4_get_user_journey`

Analyze user behavior patterns.

**Parameters**:
- `userId` (string, optional): Specific user ID
- `segment` (string, optional): User segment (e.g., `high-value`, `churned`)
- `limit` (number, optional, default: 50): Number of events (1-100)

## Use Cases

### 1. Automated Performance Monitoring

```
Claude: "Check performance of all solutions pages in the last 7 days"
```

Claude will use `ga4_get_page_metrics` for each page and identify underperformers.

### 2. Conversion Optimization

```
Claude: "What's our contact form conversion rate this month?"
```

Uses `ga4_get_conversion_rate` to analyze funnel performance.

### 3. Content Strategy

```
Claude: "Show me the top 20 pages by engagement rate"
```

Uses `ga4_get_top_pages` to inform content decisions.

### 4. UX Improvements

```
Claude: "Which pages have bounce rate > 70%?"
```

Identifies pages needing UX improvements.

## Business Impact

### Metrics-Driven Decisions
- **Before**: Manual GA4 analysis (30-60 min/day)
- **After**: Automated insights in seconds

### Continuous Optimization
- Real-time performance monitoring
- Proactive issue detection
- Data-backed A/B test planning

### Expected Results
- 20% reduction in bounce rate (optimizing identified pages)
- 15% increase in conversions (data-driven improvements)
- 10+ hours/week saved on manual analytics

## Integration with Garcez Palha

### Auto-Optimization Workflow

1. **Daily Scan**: Claude checks all solution pages
2. **Issue Detection**: Identifies pages with bounce rate > 70% or engagement < 30%
3. **Root Cause**: Analyzes user journey to find drop-off points
4. **Suggestions**: Proposes content/UX improvements
5. **Tracking**: Monitors impact after changes

### Google Ads Integration

Combine with GA4 data to optimize ad campaigns:
- Track landing page performance
- Identify high-converting keywords
- Optimize budget allocation

## Troubleshooting

### Error: "GA4_PROPERTY_ID is required"
Set the environment variable with your GA4 property ID.

### Error: "Unauthorized"
Ensure the service account has Analytics Viewer role on the GA4 property.

### Error: "No data found"
Check that:
1. Date range has data
2. Page path is correct (case-sensitive)
3. GA4 property is collecting data

## Next Steps

1. ✅ MCP-02 Complete
2. → MCP-03: Sentry Auto-Debug
3. → MCP-04: WhatsApp Business

---

**Developed**: 28/12/2025
**Status**: Production-Ready
**Maintenance**: Auto-updates via `npm run build`
