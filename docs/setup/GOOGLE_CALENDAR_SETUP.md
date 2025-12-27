# Google Calendar Integration Setup

**Status:** ✅ Código implementado, aguardando credenciais
**Data:** 24 de Dezembro de 2024

---

## Funcionalidades Implementadas

✅ **Serviço Google Calendar** ([google-calendar-service.ts](src/lib/calendar/google-calendar-service.ts))
- Create calendar events for deadlines
- Set reminders (7 days, 3 days, 1 day before)
- Update events when deadline changes
- Delete events when deadline is cancelled
- Full sync with Supabase deadlines table

✅ **API Endpoint** ([/api/calendar/sync](src/app/api/calendar/sync/route.ts))
- Manual sync trigger
- Automatic sync on deadline creation/update
- Error handling and logging

✅ **Cron Job** ([/api/cron/sync-calendar](src/app/api/cron/sync-calendar/route.ts))
- Scheduled daily sync
- Keeps calendar updated with database

---

## Setup Instructions

### 1. Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create new project: "Garcez Palha Calendar"
3. Enable **Google Calendar API**

### 2. Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Authorized redirect URIs:
   ```
   https://developers.google.com/oauthplayground
   ```
5. Save **Client ID** and **Client Secret**

### 3. Get Refresh Token

1. Go to https://developers.google.com/oauthplayground
2. Click ⚙️ (settings) → Check "Use your own OAuth credentials"
3. Enter your **Client ID** and **Client Secret**
4. In Step 1, select:
   ```
   Google Calendar API v3
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/calendar.events
   ```
5. Click **Authorize APIs**
6. Sign in with your Google account (leonardo.palha@gmail.com)
7. Click **Exchange authorization code for tokens**
8. Copy the **Refresh token**

### 4. Add Environment Variables

Add to `.env.local`:

```bash
# Google Calendar API
GOOGLE_CALENDAR_CLIENT_ID=your_client_id_here
GOOGLE_CALENDAR_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALENDAR_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_CALENDAR_ID=primary  # or specific calendar ID
```

Add to Vercel (production):

```bash
vercel env add GOOGLE_CALENDAR_CLIENT_ID
vercel env add GOOGLE_CALENDAR_CLIENT_SECRET
vercel env add GOOGLE_CALENDAR_REFRESH_TOKEN
vercel env add GOOGLE_CALENDAR_ID
```

---

## Usage

### Manual Sync

Trigger manual sync via API:

```bash
curl -X POST https://garcezpalha.com/api/calendar/sync \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Automatic Sync

The calendar syncs automatically:
- ✅ When a new deadline is created
- ✅ When a deadline is updated
- ✅ When a deadline is deleted
- ✅ Daily cron job (via Vercel Cron)

### Code Example

```typescript
import { GoogleCalendarService } from '@/lib/calendar/google-calendar-service'

const calendar = new GoogleCalendarService()

// Create event
await calendar.createEvent({
  deadlineId: 'deadline-123',
  summary: 'Prazo: Recurso Cliente X',
  description: 'Prazo para apresentar recurso no processo ABC',
  startDate: new Date('2025-01-15'),
  endDate: new Date('2025-01-15'),
  reminders: [7, 3, 1] // 7, 3, 1 days before
})

// Update event
await calendar.updateEvent('event-id', {
  summary: 'Updated deadline',
  startDate: new Date('2025-01-20')
})

// Delete event
await calendar.deleteEvent('event-id')
```

---

## Features

### Event Creation
- Creates all-day events for deadlines
- Adds process details in description
- Sets color coding by urgency
- Links back to platform

### Reminders
- **7 days before:** Email reminder
- **3 days before:** Email + popup
- **1 day before:** Email + popup + SMS (if configured)

### Sync Logic
- One-way sync: Database → Google Calendar
- Idempotent: Safe to run multiple times
- Error recovery: Retries failed syncs

### Calendar Categories
- 🔴 **Red:** Urgent (< 3 days)
- 🟡 **Yellow:** Important (3-7 days)
- 🟢 **Green:** Normal (> 7 days)

---

## Testing

### Local Test

```bash
# Set env vars
export GOOGLE_CALENDAR_CLIENT_ID=your_id
export GOOGLE_CALENDAR_CLIENT_SECRET=your_secret
export GOOGLE_CALENDAR_REFRESH_TOKEN=your_token

# Run dev server
npm run dev

# Trigger sync
curl -X POST http://localhost:3000/api/calendar/sync
```

### Production Test

```bash
# Trigger sync in production
curl -X POST https://garcezpalha.com/api/calendar/sync \
  -H "Authorization: Bearer YOUR_VERCEL_TOKEN"

# Check logs
vercel logs --filter=calendar
```

---

## Troubleshooting

### "Invalid Credentials"
- Verify Client ID and Secret are correct
- Regenerate refresh token
- Check token hasn't expired

### "Insufficient Permission"
- Ensure Calendar API is enabled
- Check OAuth scopes include `calendar.events`
- Re-authorize with correct scopes

### "Quota Exceeded"
- Check Google Cloud Console quotas
- Reduce sync frequency
- Request quota increase

### Events Not Appearing
- Check calendar ID is correct (`primary` or specific ID)
- Verify timezone settings
- Check event date/time format

---

## API Quotas

Google Calendar API quotas (free tier):
- **Queries per day:** 1,000,000
- **Queries per 100 seconds:** 5,000
- **Queries per user per 100 seconds:** 250

Current usage:
- **Sync frequency:** Once daily
- **Expected events:** ~50-100 per day
- **Well within limits** ✅

---

## Security

### Credentials Storage
- ✅ Stored in environment variables
- ✅ Never committed to git
- ✅ Encrypted in Vercel
- ✅ Separate for dev/prod

### Access Control
- ✅ OAuth 2.0 authentication
- ✅ Scoped to calendar events only
- ✅ Refresh token rotation
- ✅ Audit logging

---

## Roadmap

### Implemented ✅
- [x] Create/update/delete events
- [x] Automatic sync on deadline changes
- [x] Daily cron job
- [x] Multiple reminders
- [x] Color coding by urgency

### Future Enhancements
- [ ] Two-way sync (Calendar → Database)
- [ ] Multiple calendar support
- [ ] Shared team calendars
- [ ] SMS reminders via Twilio
- [ ] WhatsApp reminders
- [ ] iCal export

---

## Resources

- **Google Calendar API Docs:** https://developers.google.com/calendar/api
- **OAuth Playground:** https://developers.google.com/oauthplayground
- **Google Cloud Console:** https://console.cloud.google.com
- **Quotas & Limits:** https://developers.google.com/calendar/api/guides/quota

---

**Status:** Ready to use once credentials are configured ✅
**Next Step:** Follow setup instructions to get OAuth credentials
