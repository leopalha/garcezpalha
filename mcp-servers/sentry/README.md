# MCP-03: Sentry Auto-Debug Server

**Status**: ✅ Implemented
**Priority**: P0 - Critical
**Estimated Time**: 6h

## Overview

MCP Server for automated Sentry error monitoring, debugging, and fix suggestions. Enables Claude Code to proactively detect, debug, and fix production errors.

## Features

### 1. Real-Time Error Monitoring
- Query unresolved, resolved, or ignored issues
- Filter by error level (fatal, error, warning, info, debug)
- Search by error type or location
- Get error frequency and affected user counts

### 2. Detailed Stack Traces
- Full stack trace with source locations
- Runtime, browser, OS, and device context
- Release and environment information
- Tags for categorization

### 3. Breadcrumb Analysis
- User actions leading to error
- Navigation history
- API calls and responses
- Console logs and network requests

### 4. Impact Assessment
- Number of affected users
- User demographics and patterns
- Error frequency trends
- Production vs staging breakdown

### 5. Automated Resolution
- Mark issues as resolved
- Ignore non-critical errors
- Set "resolved in next release" status
- Add resolution comments for team

### 6. Project Statistics
- Error rate trends
- Rejected vs accepted events
- Performance over time
- Custom date range analysis

## Setup

### 1. Install Dependencies

```bash
cd mcp-servers/sentry
npm install
npm run build
```

### 2. Configure Sentry

1. Go to [Sentry Settings](https://sentry.io/settings/account/api/auth-tokens/)
2. Create a new auth token with `project:read` and `project:write` scopes
3. Get your organization slug from Sentry URL: `https://sentry.io/organizations/{ORG_SLUG}/`
4. Get your project slug: `https://sentry.io/organizations/{ORG}/projects/{PROJECT}/`

Set environment variables:

```bash
export SENTRY_AUTH_TOKEN="sntrys_..."
export SENTRY_ORG_SLUG="garcez-palha"
export SENTRY_PROJECT_SLUG="garcezpalha-platform"
```

### 3. Add to Claude Code MCP Config

```json
{
  "mcpServers": {
    "garcezpalha-sentry": {
      "command": "node",
      "args": ["d:\\garcezpalha\\mcp-servers\\sentry\\dist\\index.js"],
      "env": {
        "SENTRY_AUTH_TOKEN": "sntrys_YOUR_TOKEN",
        "SENTRY_ORG_SLUG": "garcez-palha",
        "SENTRY_PROJECT_SLUG": "garcezpalha-platform"
      }
    }
  }
}
```

## Available Tools

### `sentry_get_issues`

Get filtered list of Sentry issues.

**Parameters**:
- `project` (string, optional): Project slug
- `status` (enum, default: "unresolved"): `unresolved | resolved | ignored`
- `level` (enum, optional): `fatal | error | warning | info | debug`
- `limit` (number, default: 25): Number of issues (1-100)
- `query` (string, optional): Search query

**Example**:
```json
{
  "status": "unresolved",
  "level": "error",
  "limit": 10,
  "query": "TypeError"
}
```

### `sentry_get_stack_trace`

Get detailed stack trace for debugging.

**Parameters**:
- `issueId` (string, required): Sentry issue ID
- `project` (string, optional): Project slug

**Example**:
```json
{
  "issueId": "123456789"
}
```

### `sentry_get_breadcrumbs`

Get breadcrumb trail for error context.

**Parameters**:
- `eventId` (string, required): Sentry event ID
- `project` (string, optional): Project slug

### `sentry_get_affected_users`

Get users impacted by an issue.

**Parameters**:
- `issueId` (string, required): Sentry issue ID
- `project` (string, optional): Project slug

### `sentry_resolve_issue`

Mark an issue as resolved.

**Parameters**:
- `issueId` (string, required): Sentry issue ID
- `resolution` (enum, required): `resolved | ignored | resolvedInNextRelease`
- `comment` (string, optional): Resolution comment
- `project` (string, optional): Project slug

**Example**:
```json
{
  "issueId": "123456789",
  "resolution": "resolved",
  "comment": "Fixed in commit abc123 - Added null check for user object"
}
```

### `sentry_get_project_stats`

Get error statistics and trends.

**Parameters**:
- `project` (string, optional): Project slug
- `stat` (enum, default: "received"): `received | rejected | blacklisted | generated`
- `since` (string, optional): Start time (Unix timestamp or ISO date)
- `until` (string, optional): End time

## Use Cases

### 1. Automated Error Response

```
Claude: "Check for new fatal errors in the last hour"
```

Claude uses `sentry_get_issues` with `level: "fatal"` and analyzes them immediately.

### 2. Root Cause Analysis

```
Claude: "Debug issue #123456789"
```

Claude:
1. Gets stack trace with `sentry_get_stack_trace`
2. Gets breadcrumbs with `sentry_get_breadcrumbs`
3. Analyzes code at error location
4. Suggests fix

### 3. Impact Assessment

```
Claude: "How many users are affected by the TypeError in checkout?"
```

Claude uses `sentry_get_affected_users` and provides actionable insights.

### 4. Automated Fixes

```
Claude: "Fix all TypeErrors related to null checks"
```

Claude:
1. Gets issues matching criteria
2. Analyzes each stack trace
3. Generates fixes
4. Creates PR with fixes
5. Marks issues as "resolvedInNextRelease"

### 5. Health Monitoring

```
Claude: "Show me error rate trends for the last 24 hours"
```

Uses `sentry_get_project_stats` to visualize project health.

## Auto-Debug Workflow

### 1. Morning Health Check (Automated)

```typescript
// Claude automatically runs daily
const issues = await sentry_get_issues({
  status: 'unresolved',
  level: 'error',
  limit: 50
});

// Prioritize critical issues
const critical = issues.filter(i => i.userCount > 10 || i.level === 'fatal');

// Debug each critical issue
for (const issue of critical) {
  const stackTrace = await sentry_get_stack_trace({ issueId: issue.id });
  const breadcrumbs = await sentry_get_breadcrumbs({ eventId: stackTrace.eventId });

  // Analyze and suggest fix
  analyzeBug(stackTrace, breadcrumbs);
}
```

### 2. Fix Suggestion Format

```markdown
## Sentry Issue #123456789: TypeError in Checkout

**Affected Users**: 47
**Frequency**: 125 occurrences (last 24h)
**Level**: error

### Root Cause
Null reference in `src/app/checkout/page.tsx:142`
User object is undefined when session expires during checkout.

### Suggested Fix
```typescript
// Before (line 142):
const userName = user.name

// After:
const userName = user?.name || 'Guest'
```

### Files to Update
1. `src/app/checkout/page.tsx` - Add null check
2. `src/middleware.ts` - Refresh session before checkout

### Testing
- Test expired session scenario
- Test checkout with valid session
- Verify error count drops after deploy
```

### 3. Auto-Resolution After Deploy

```typescript
// After deploying fix
await sentry_resolve_issue({
  issueId: '123456789',
  resolution: 'resolved',
  comment: 'Fixed in v1.2.3 - Added null check for user object in checkout flow'
});
```

## Integration with Garcez Palha

### Critical Error Alert

When a fatal error is detected:
1. Claude sends WhatsApp alert to dev team
2. Creates GitHub issue with debug info
3. Suggests immediate hotfix
4. Monitors error count after fix

### Pre-Deploy Health Check

Before each deployment:
1. Check for unresolved critical issues
2. Verify no regressions from previous fixes
3. Review error rate trends
4. Block deploy if critical issues exist

## Business Impact

### Before Sentry MCP
- **Error Detection**: Manual Sentry dashboard checks (2-3x/day)
- **Debug Time**: 30-60 min per error
- **Response Time**: Hours to days
- **User Impact**: Prolonged downtime

### After Sentry MCP
- **Error Detection**: Real-time, automated
- **Debug Time**: 5-10 min (Claude auto-debugs)
- **Response Time**: Minutes
- **User Impact**: Minimized

### Expected Results
- **90% faster** error response time
- **70% reduction** in debugging time
- **100% coverage** of production errors
- **Proactive** fix suggestions before user reports

## Troubleshooting

### Error: "SENTRY_AUTH_TOKEN is required"
Create an auth token at https://sentry.io/settings/account/api/auth-tokens/

### Error: "Unauthorized"
Ensure your auth token has `project:read` and `project:write` scopes.

### Error: "Project not found"
Verify `SENTRY_PROJECT_SLUG` matches your Sentry project URL.

## Next Steps

1. ✅ MCP-03 Complete
2. → MCP-04: WhatsApp Business
3. → Remaining 7 MCP servers

---

**Developed**: 28/12/2025
**Status**: Production-Ready
**Maintenance**: Auto-updates via `npm run build`
