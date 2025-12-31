# API Security Audit Report
Generated: 2025-12-31T18:50:43.733Z

## Summary
- **Total API Routes**: 158
- **With Validation**: 3 (1.9%)
- **With Rate Limiting**: 14 (8.9%)
- **With Sanitization**: 0 (0.0%)
- **With Auth Check**: 40 (25.3%)

## Priority Distribution
- **Critical**: 21 routes (payments, auth)
- **High**: 21 routes (admin, chat, AI)
- **Medium**: 7 routes (leads, analytics)
- **Low**: 109 routes (read-only, public)

## Routes Needing Work
158 routes need security improvements:

### CRITICAL Priority (21 routes)

- **admin\proposals\send-payment\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **auth\2fa\disable\route.ts**
  - Methods: POST
  - Missing: validation, sanitization
  - Has Auth: Yes

- **auth\2fa\enable\route.ts**
  - Methods: POST
  - Missing: sanitization
  - Has Auth: Yes

- **auth\2fa\status\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: Yes

- **auth\2fa\verify\route.ts**
  - Methods: POST
  - Missing: sanitization
  - Has Auth: Yes

- **auth\forgot-password\route.ts**
  - Methods: POST
  - Missing: validation, sanitization
  - Has Auth: No

- **auth\reset-password\route.ts**
  - Methods: POST
  - Missing: validation, sanitization
  - Has Auth: No

- **auth\signup\route.ts**
  - Methods: POST
  - Missing: validation, sanitization
  - Has Auth: No

- **auth\verify-email\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **auth\[...nextauth]\route.ts**
  - Methods: 
  - Missing: validation, rate limiting
  - Has Auth: No

- **clicksign\webhook\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\payment-reminders\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **mercadopago\create-payment\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **mercadopago\webhook\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **stripe\checkout\route.ts**
  - Methods: POST
  - Missing: sanitization
  - Has Auth: Yes

- **stripe\create-session\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **stripe\portal\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **stripe\webhook\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **webhooks\clicksign\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **webhooks\mercadopago\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **webhooks\stripe\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

### HIGH Priority (21 routes)

- **ads\campaigns\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **ai\chat\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **calendar\available-slots\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **chat\agent-flow\route.ts**
  - Methods: GET, POST, PUT
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **chat\assistant\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **chat\qualify\route.ts**
  - Methods: GET, POST, DELETE
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **chat\route.ts**
  - Methods: POST
  - Missing: validation, sanitization
  - Has Auth: No

- **chat\text-to-speech\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **chat\transcribe\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\daily-report\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\email-monitor\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **cron\email-sequences\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\gmail-monitor\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\monitor-emails\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **diagnostic\openai\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **email\sequences\cron\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **email\sequences\subscribe\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **gmail\monitor\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **marketing\campaigns\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **marketing\campaigns\[id]\route.ts**
  - Methods: GET, PATCH, DELETE
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **whatsapp\baileys\webhook\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

### MEDIUM Priority (7 routes)

- **admin\analytics\leads\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: Yes

- **admin\analytics\leads-stats\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **admin\leads\dashboard\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: Yes

- **admin\leads\qualified\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **admin\leads\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: Yes

- **admin\leads\stats\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: Yes

- **cron\escalate-hot-leads\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

### LOW Priority (109 routes)

- **admin\agents\[id]\route.ts**
  - Methods: GET, PATCH
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **admin\agents\[id]\test\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **admin\analytics\conversion-rate\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **admin\analytics\errors\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **admin\analytics\health\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **admin\analytics\overview\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **admin\analytics\revenue\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **admin\analytics\source-performance\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **admin\analytics\top-products\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **admin\certificate\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **admin\conversations\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: Yes

- **admin\conversations\[id]\messages\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **admin\conversations\[id]\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: Yes

- **admin\conversations\[id]\takeover\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **admin\follow-ups\manual\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **admin\follow-ups\process\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **admin\proposals\generate\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **admin\security\audit-logs\route.ts**
  - Methods: GET
  - Missing: validation
  - Has Auth: Yes

- **admin\security\metrics\route.ts**
  - Methods: GET
  - Missing: validation
  - Has Auth: Yes

- **admin\settings\route.ts**
  - Methods: GET, PUT
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **admin\templates\send-test\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **admin\templates\[id]\route.ts**
  - Methods: GET, PATCH, DELETE
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **ads\optimize\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **ads\report\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **analytics\advanced\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **analytics\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **app\clients\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: Yes

- **app\dashboard\stats\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: Yes

- **app\products\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **app\products\[id]\route.ts**
  - Methods: GET, PATCH, DELETE
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **app\settings\route.ts**
  - Methods: GET, PATCH
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **beta\feature-request\route.ts**
  - Methods: POST
  - Missing: validation, sanitization
  - Has Auth: Yes

- **beta\report-bug\route.ts**
  - Methods: POST
  - Missing: validation, sanitization
  - Has Auth: Yes

- **beta\signup\route.ts**
  - Methods: POST
  - Missing: validation, sanitization
  - Has Auth: No

- **cache\test\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **calendar\book-appointment\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **calendar\sync\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **checkout\order\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **contact\route.ts**
  - Methods: POST
  - Missing: validation, sanitization
  - Has Auth: No

- **content\analytics\route.ts**
  - Methods: GET, POST, PUT
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **content\generate\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **content\review\route.ts**
  - Methods: GET, POST, PUT, PATCH
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **content\schedule\route.ts**
  - Methods: GET, POST, PUT, DELETE
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **conversations\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: Yes

- **conversations\[id]\messages\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **conversations\[id]\route.ts**
  - Methods: GET, PATCH
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **conversations\[id]\takeover\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\appointment-automation\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\cleanup-sessions\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\content-generation\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\deadline-reminders\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\nps-requests\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\partner-reports\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\publish-content\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\send-follow-ups\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **cron\sync-calendar\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **csrf-token\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **docs\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **documents\analyze\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **documents\export\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **documents\generate\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **documents\legal\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **documents\review\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **documents\route.ts**
  - Methods: GET, DELETE
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **documents\sign\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **documents\upload\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **errors\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **health\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **inngest\route.ts**
  - Methods: 
  - Missing: validation, rate limiting
  - Has Auth: No

- **judit\webhook\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **marketing\ab-tests\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **marketing\ab-tests\[id]\route.ts**
  - Methods: GET, PATCH, DELETE
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **marketing\evaluate-lead\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **marketing\score\[leadId]\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **marketing\track\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **notifications\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **notifications\[id]\read\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **nps\check\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **nps\submit\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **performance\route.ts**
  - Methods: GET, POST, DELETE
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **process-monitor\cron\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **process-monitor\route.ts**
  - Methods: GET, POST, DELETE
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **realtime\session\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **reports\generate\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **resend\webhook\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **seo\audit\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **seo\keywords\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **seo\optimize\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **seo\report\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **subscriptions\cancel\route.ts**
  - Methods: POST, DELETE
  - Missing: validation, rate limiting, sanitization
  - Has Auth: Yes

- **subscriptions\current\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: Yes

- **subscriptions\invoices\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: Yes

- **telegram\send\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **telegram\webhook\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **test\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **test-env\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **test-vercel-build\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **trpc\[trpc]\route.ts**
  - Methods: 
  - Missing: validation, rate limiting
  - Has Auth: No

- **webhooks\resend\route.ts**
  - Methods: POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **webhooks\whatsapp\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **whatsapp\connect\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **whatsapp\qr\route.ts**
  - Methods: GET
  - Missing: validation, rate limiting
  - Has Auth: No

- **whatsapp\qrcode\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **whatsapp\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **whatsapp\twilio\webhook\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **whatsapp\webhook\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **whatsapp-cloud\send\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

- **whatsapp-cloud\webhook\route.ts**
  - Methods: GET, POST
  - Missing: validation, rate limiting, sanitization
  - Has Auth: No

## Fully Protected Routes (0)

