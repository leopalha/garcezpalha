# Database Integration - G4 Lead System

## Overview

This document describes the database integration for the G4 Lead Qualification and Conversion System. The integration replaces the previous mock data with real Supabase queries and provides full CRUD operations, real-time capabilities, and robust data persistence.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Dashboard  │  │  Chat Widget │  │  Admin Panel │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Routes (Next.js)                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐ │
│  │ /api/admin/leads │  │ /api/chat/qualify│  │  /api/... │ │
│  └────────┬─────────┘  └────────┬─────────┘  └─────┬─────┘ │
└───────────┼──────────────────────┼──────────────────┼───────┘
            │                      │                  │
            ▼                      ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Helper Functions                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  src/lib/leads/lead-database.ts                     │   │
│  │  - createLead(), getLead(), updateLead()            │   │
│  │  - createQualificationSession()                      │   │
│  │  - createPaymentLinkRecord()                         │   │
│  │  - createProposalRecord()                            │   │
│  │  - createFollowUpMessages()                          │   │
│  │  - getLeadStatistics(), getConversionFunnel()        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  src/lib/ai/chat-qualification-persistence.ts        │   │
│  │  - saveQualificationSession()                        │   │
│  │  - loadQualificationSession()                        │   │
│  │  - persistQualificationComplete()                    │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────┬──────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Database                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    leads     │  │qualification_│  │payment_links │      │
│  │              │  │   sessions   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  proposals   │  │follow_up_    │  │lead_         │      │
│  │              │  │  messages    │  │interactions  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Tables Created

#### 1. `leads`
Main table for qualified leads.

**Columns:**
- `id` (UUID, PK)
- `client_name` (TEXT, NOT NULL)
- `email` (TEXT, nullable)
- `phone` (TEXT, nullable)
- `product_id` (TEXT, NOT NULL)
- `product_name` (TEXT, NOT NULL)
- `agent_role` (TEXT, NOT NULL)
- `score_total` (INTEGER, 0-100)
- `score_urgency` (INTEGER, 0-100)
- `score_probability` (INTEGER, 0-100)
- `score_complexity` (INTEGER, 0-100)
- `category` (ENUM: hot, warm, cold, unqualified)
- `score_reasoning` (TEXT[])
- `status` (ENUM: active, nurturing, converted, lost, paused)
- `estimated_value` (BIGINT, centavos)
- `estimated_fee` (BIGINT, centavos)
- `recommended_action_type` (TEXT)
- `recommended_action_priority` (TEXT)
- `recommended_action_message` (TEXT)
- `source` (TEXT)
- `session_id` (TEXT)
- `user_id` (UUID, FK to auth.users)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- `last_contact_at` (TIMESTAMPTZ)
- `converted_at` (TIMESTAMPTZ)
- `metadata` (JSONB)

**Indexes:**
- `idx_leads_category` - Fast filtering by category
- `idx_leads_status` - Fast filtering by status
- `idx_leads_product_id` - Filter by product
- `idx_leads_created_at` - Chronological ordering
- `idx_leads_score_total` - Sorting by score
- `idx_leads_client_name_trgm` - Full-text search on name
- `idx_leads_email_trgm` - Full-text search on email

#### 2. `qualification_sessions`
Stores qualification session state for resumability.

**Columns:**
- `id` (UUID, PK)
- `session_id` (TEXT, UNIQUE)
- `lead_id` (UUID, FK to leads)
- `product_id` (TEXT)
- `product_name` (TEXT)
- `agent_role` (TEXT)
- `status` (ENUM: in_progress, completed, abandoned)
- `questions` (JSONB)
- `answers` (JSONB)
- `current_question_index` (INTEGER)
- `context` (JSONB)
- `client_info` (JSONB)
- `source` (TEXT)
- `user_id` (UUID, FK)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- `completed_at` (TIMESTAMPTZ)
- `expires_at` (TIMESTAMPTZ)
- `metadata` (JSONB)

**Indexes:**
- `idx_qualification_sessions_session_id`
- `idx_qualification_sessions_lead_id`
- `idx_qualification_sessions_status`
- `idx_qualification_sessions_expires_at`

#### 3. `payment_links`
Payment links generated for leads.

**Columns:**
- `id` (UUID, PK)
- `lead_id` (UUID, FK)
- `provider` (TEXT: mercadopago, stripe)
- `provider_id` (TEXT)
- `url` (TEXT)
- `amount` (BIGINT, centavos)
- `original_amount` (BIGINT)
- `discount_applied` (BIGINT)
- `discount_percentage` (INTEGER)
- `installments` (INTEGER)
- `expires_at` (TIMESTAMPTZ)
- `status` (TEXT: pending, paid, expired, cancelled)
- `paid_at` (TIMESTAMPTZ)
- `metadata` (JSONB)
- `created_at`, `updated_at`

#### 4. `proposals`
Professional proposals generated for leads.

**Columns:**
- `id` (UUID, PK)
- `lead_id` (UUID, FK)
- `payment_link_id` (UUID, FK)
- `proposal_id` (TEXT, UNIQUE)
- `product_id`, `product_name`, `client_name` (TEXT)
- `sections` (JSONB)
- `base_price`, `adjusted_price`, `discount` (BIGINT)
- `installments` (INTEGER)
- `estimated_case_value` (BIGINT)
- `valid_until` (TIMESTAMPTZ)
- `status` (TEXT: sent, viewed, accepted, rejected, expired)
- `viewed_at`, `accepted_at` (TIMESTAMPTZ)
- `metadata` (JSONB)
- `created_at`, `updated_at`

#### 5. `follow_up_messages`
Scheduled follow-up messages for leads.

**Columns:**
- `id` (UUID, PK)
- `lead_id` (UUID, FK)
- `message_id` (TEXT, UNIQUE)
- `message` (TEXT)
- `channel` (ENUM: whatsapp, email, sms)
- `recipient_name`, `recipient_phone`, `recipient_email` (TEXT)
- `scheduled_for` (TIMESTAMPTZ)
- `sent_at`, `delivered_at`, `read_at`, `replied_at` (TIMESTAMPTZ)
- `status` (ENUM: scheduled, sent, delivered, read, replied, failed, cancelled)
- `error_message` (TEXT)
- `metadata` (JSONB)
- `created_at`, `updated_at`

#### 6. `lead_interactions`
Log of all interactions with leads.

**Columns:**
- `id` (UUID, PK)
- `lead_id` (UUID, FK)
- `session_id` (TEXT)
- `user_id` (UUID, FK)
- `type` (TEXT: question, answer, completion, payment, proposal, follow_up)
- `message` (TEXT)
- `metadata` (JSONB)
- `created_at` (TIMESTAMPTZ)

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Leads, Payment Links, Proposals
- **SELECT**: Admins and lawyers can view all
- **INSERT**: Admins and lawyers can create
- **UPDATE**: Admins and lawyers can modify

### Qualification Sessions
- **SELECT**: Admins and lawyers can view all
- **INSERT**: Anyone can create (for anonymous leads)
- **UPDATE**: Anyone can update their own sessions

### Follow-Up Messages
- **SELECT**: Admins and lawyers
- **INSERT/UPDATE**: Authenticated users (system)

### Lead Interactions
- **SELECT**: Admins and lawyers
- **INSERT**: Anyone (logging is open)

## Helper Functions

### PostgreSQL Functions

#### `get_lead_statistics()`
Returns aggregated lead statistics:
```sql
SELECT * FROM get_lead_statistics();
```

Returns:
- `total_leads`
- `hot_leads`, `warm_leads`, `cold_leads`, `unqualified_leads`
- `active_leads`, `converted_leads`
- `conversion_rate` (percentage)

#### `get_conversion_funnel()`
Returns conversion funnel metrics:
```sql
SELECT * FROM get_conversion_funnel();
```

Returns:
- `started` - Total qualification sessions
- `qualified` - Total leads
- `proposal` - Proposals sent
- `payment` - Payment links paid
- `converted` - Leads converted

### TypeScript Helper Functions

Located in [src/lib/leads/lead-database.ts](./lead-database.ts):

#### Lead Operations
```typescript
// Create new lead from qualification result
await createLead({
  result: qualificationResult,
  clientInfo: { name, email, phone },
  source: 'website',
  userId: 'user-uuid',
  sessionId: 'session-uuid'
})

// Get lead by ID
const lead = await getLead('lead-uuid')

// Update lead
await updateLead('lead-uuid', {
  status: 'converted',
  convertedAt: new Date().toISOString()
})

// List leads with filters
const { leads, total, totalPages } = await listLeads({
  page: 1,
  limit: 10,
  category: 'hot',
  status: 'active',
  search: 'João'
})

// Get statistics
const stats = await getLeadStatistics()
// { totalLeads: 156, hotLeads: 23, conversionRate: 13.5, ... }

// Get conversion funnel
const funnel = await getConversionFunnel()
// { started: 250, qualified: 156, proposal: 98, ... }

// Mark as converted
await convertLead('lead-uuid')
```

#### Qualification Session Operations
```typescript
// Create session
await createQualificationSession({
  sessionId: 'sess-123',
  productId: 'desbloqueio-conta',
  productName: 'Desbloqueio de Conta',
  agentRole: 'financial-protection',
  questions: [...],
  clientInfo: { name, email, phone },
  source: 'website',
  userId: 'user-uuid',
  expiresInHours: 24
})

// Get session
const session = await getQualificationSession('sess-123')

// Update session
await updateQualificationSession('sess-123', {
  answers: [...],
  currentQuestionIndex: 5,
  status: 'completed',
  leadId: 'lead-uuid'
})

// Clean up expired sessions
const deleted = await deleteExpiredSessions()
```

#### Payment & Proposal Operations
```typescript
// Save payment link
await createPaymentLinkRecord({
  leadId: 'lead-uuid',
  paymentLink: generatedPaymentLink
})

// Update payment status
await updatePaymentLinkStatus('provider-id', 'paid')

// Save proposal
await createProposalRecord({
  leadId: 'lead-uuid',
  proposal: generatedProposal,
  paymentLinkId: 'payment-uuid'
})
```

#### Follow-Up Operations
```typescript
// Create follow-up messages
await createFollowUpMessages('lead-uuid', [
  {
    id: 'msg-1',
    message: 'Follow-up message',
    channel: 'whatsapp',
    scheduledFor: new Date(),
    ...
  }
])

// Get pending messages
const pending = await getPendingFollowUpMessages()

// Update message status
await updateFollowUpMessageStatus('msg-1', 'sent')

// Cancel all lead follow-ups
await cancelLeadFollowUps('lead-uuid')
```

#### Interaction Logging
```typescript
// Log interaction
await logLeadInteraction({
  leadId: 'lead-uuid',
  sessionId: 'sess-123',
  userId: 'user-uuid',
  type: 'qualified',
  message: 'Lead qualificado: João Silva - Score: 85',
  metadata: { score: 85, category: 'hot' }
})

// Get interactions
const interactions = await getLeadInteractions('lead-uuid', 50)
```

## Chat Qualification Persistence

Located in [src/lib/ai/chat-qualification-persistence.ts](../ai/chat-qualification-persistence.ts):

```typescript
// Save new qualification session
await saveQualificationSession({
  sessionId, productId, productName, agentRole,
  questions, clientInfo, source, userId
})

// Load session from database
const session = await loadQualificationSession('sess-123')

// Update session progress
await updateSessionProgress('sess-123', {
  answers: [...],
  currentQuestionIndex: 5,
  context: {...}
})

// Persist complete qualification
const { success, leadId } = await persistQualificationComplete({
  sessionId, result, clientInfo,
  paymentLink, proposal, followUpMessages,
  source, userId
})
```

## API Routes Updated

### GET /api/admin/leads/stats
Returns lead statistics for dashboard.

**Before (Mock):**
```typescript
const stats = { total: 156, hot: 23, ... }
```

**After (Real Data):**
```typescript
const stats = await getLeadStatistics()
const { data: leadsData } = await supabase.from('leads').select(...)
const avgScore = calculateAverage(leadsData)
```

### GET /api/admin/leads/dashboard
Returns dashboard data (charts + activity).

**Before (Mock):**
```typescript
const dashboardData = {
  categoryDistribution: { hot: 23, warm: 45, ... },
  recentActivity: [...]
}
```

**After (Real Data):**
```typescript
const stats = await getLeadStatistics()
const funnel = await getConversionFunnel()
const { data: interactions } = await supabase
  .from('lead_interactions')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10)
```

### GET /api/admin/leads
Returns paginated list of leads.

**Before (Mock):**
```typescript
const mockLeads = [...]
const paginatedLeads = mockLeads.slice(start, end)
```

**After (Real Data):**
```typescript
const { leads, total, totalPages } = await listLeads({
  page, limit, category, status, search
})
```

### POST /api/chat/qualify
Handles chat qualification flow.

**Updated:**
- Saves new qualification sessions to database
- Updates session progress after each answer
- Persists complete qualification with lead, payment, proposal, follow-ups
- Logs all interactions

## Migration File

**File:** `supabase/migrations/016_leads_qualification_system.sql`

**Size:** ~600 lines

**Includes:**
- 6 main tables
- 6 ENUM types
- 15+ indexes
- 6 RLS policies per table
- 2 helper functions (statistics, funnel)
- 6 update triggers
- Full documentation

## Running the Migration

### Option 1: Via Supabase CLI
```bash
supabase db push
```

### Option 2: Via Supabase Dashboard
1. Go to SQL Editor
2. Copy contents of `016_leads_qualification_system.sql`
3. Execute

### Option 3: Via psql
```bash
psql -h db.xxx.supabase.co -U postgres -d postgres -f supabase/migrations/016_leads_qualification_system.sql
```

## Testing the Integration

### 1. Test Lead Creation
```typescript
import { createLead } from '@/lib/leads/lead-database'

const lead = await createLead({
  result: qualificationResult,
  clientInfo: {
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '+5511999999999'
  },
  source: 'website'
})

console.log('Lead created:', lead.id)
```

### 2. Test Statistics
```typescript
import { getLeadStatistics } from '@/lib/leads/lead-database'

const stats = await getLeadStatistics()
console.log('Total leads:', stats.totalLeads)
console.log('Conversion rate:', stats.conversionRate + '%')
```

### 3. Test Lead List
```typescript
import { listLeads } from '@/lib/leads/lead-database'

const { leads, total } = await listLeads({
  page: 1,
  limit: 10,
  category: 'hot'
})

console.log(`Found ${total} hot leads`)
leads.forEach(lead => {
  console.log(`- ${lead.clientName} (Score: ${lead.scoreTotal})`)
})
```

### 4. Test Chat Qualification
```http
POST /api/chat/qualify
Content-Type: application/json

{
  "sessionId": "test-session-123",
  "message": "Minha conta foi bloqueada",
  "source": "website",
  "clientInfo": {
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

## Performance Considerations

### Indexes
All critical columns are indexed for fast queries:
- Category, status filtering
- Date range queries
- Full-text search on names/emails
- Foreign key relationships

### Query Optimization
- Use `select('specific, columns')` instead of `select('*')`
- Add pagination to all list queries
- Use `.limit()` for large result sets
- Leverage RLS for automatic filtering

### Caching Strategy (Future)
- Cache statistics for 5 minutes
- Cache lead lists per filter combination
- Real-time subscriptions for dashboard updates

## Security

### Row Level Security
- All tables have RLS enabled
- Policies check user roles (admin, lawyer)
- Anonymous users can create qualification sessions
- Interactions are logged but don't expose sensitive data

### Data Validation
- All inputs validated at TypeScript layer
- Supabase constraints enforce data integrity
- Foreign keys prevent orphaned records

### Sensitive Data
- Email/phone stored as nullable TEXT
- No credit card data stored (handled by providers)
- Payment provider IDs are opaque strings

## Monitoring

### Database Metrics
Monitor in Supabase Dashboard:
- Table sizes
- Query performance
- Index usage
- Connection pool

### Application Metrics
Log in API routes:
- API response times
- Error rates
- Qualification completion rates
- Conversion funnel drop-offs

## Future Enhancements

### Real-Time Features
```typescript
// Subscribe to new leads
const channel = supabase
  .channel('leads')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'leads'
  }, (payload) => {
    console.log('New lead:', payload.new)
  })
  .subscribe()
```

### Advanced Queries
```sql
-- Top performing products
SELECT product_id, COUNT(*) as leads, AVG(score_total) as avg_score
FROM leads
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY product_id
ORDER BY leads DESC;

-- Conversion by source
SELECT source, COUNT(*) as total,
       COUNT(*) FILTER (WHERE status = 'converted') as converted,
       ROUND(COUNT(*) FILTER (WHERE status = 'converted')::NUMERIC / COUNT(*) * 100, 2) as rate
FROM leads
GROUP BY source;
```

### Automated Tasks
- Daily cleanup of expired sessions
- Weekly email summaries to admins
- Auto-escalation of high-value leads
- Payment expiration reminders

## Troubleshooting

### Common Issues

**Issue:** "Permission denied for table leads"
**Solution:** Check user role in `auth.users.user_metadata.role`

**Issue:** "Null value in column violates not-null constraint"
**Solution:** Ensure all required fields (client_name, product_id, etc.) are provided

**Issue:** "Function get_lead_statistics() does not exist"
**Solution:** Run migration 016 or create functions manually

**Issue:** "Cannot read property of undefined"
**Solution:** Check if session/lead exists before accessing properties

## Summary

The database integration provides:
✅ 6 tables with full relationships
✅ 15+ optimized indexes
✅ Row-level security for all tables
✅ 2 PostgreSQL helper functions
✅ 30+ TypeScript helper functions
✅ Real-time capable architecture
✅ Complete audit trail via interactions
✅ Production-ready data persistence

All mock data has been replaced with real Supabase queries, providing a robust foundation for the G4 system in production.
