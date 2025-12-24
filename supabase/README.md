# Garcez Palha - Database Migrations

This directory contains database migration scripts for Supabase.

## Setup Instructions

### 1. Install Supabase CLI (if not installed)

```bash
npm install -g supabase
```

### 2. Link to your Supabase project

```bash
supabase link --project-ref your-project-ref
```

### 3. Run migrations

#### Option A: Using Supabase CLI (Recommended)

```bash
# Run all migrations
supabase db push

# Or run specific migration
supabase db reset
```

#### Option B: Manual execution in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file in order:
   - `001_initial_schema.sql` - Creates all tables, indexes, and RLS policies
   - `002_seed_data.sql` - Inserts sample data for testing

### 4. Verify Installation

After running migrations, check:

- [ ] All tables created (users, partners, leads, referrals, etc.)
- [ ] Indexes created for performance
- [ ] Row Level Security (RLS) policies enabled
- [ ] Triggers for updated_at timestamps working
- [ ] Default services and settings inserted

## Migration Files

### 001_initial_schema.sql
- Creates all database tables
- Sets up indexes for performance
- Enables Row Level Security (RLS)
- Creates helper functions and triggers
- Inserts default services and settings

### 002_seed_data.sql
- Creates sample admin user
- Creates sample partner accounts
- Generates test leads and referrals
- Adds sample payments and notifications
- Updates partner statistics

## Database Schema

### Core Tables

- **users** - User accounts (clients, partners, admins)
- **partners** - Partner-specific information
- **leads** - Potential client inquiries
- **referrals** - Partner referral tracking
- **services** - Legal services offered
- **payments** - Payment transactions
- **partner_commissions** - Partner commission tracking

### Supporting Tables

- **chat_threads** - AI assistant conversation threads
- **chat_messages** - Individual chat messages
- **notifications** - User notifications
- **audit_logs** - System audit trail
- **settings** - Application configuration

## Security Features

- **Row Level Security (RLS)** - Users can only access their own data
- **Password Hashing** - Passwords stored with bcrypt
- **UUID Primary Keys** - Secure, non-sequential identifiers
- **Audit Logging** - Track all important changes

## Default Credentials (Development Only)

⚠️ **WARNING**: Change these in production!

- **Admin**: admin@garcezpalha.com / Admin@123
- **Partner 1**: parceiro1@example.com / Admin@123
- **Partner 2**: parceiro2@example.com / Admin@123
- **Partner 3**: parceiro3@example.com / Admin@123

## Environment Variables

Make sure to set these in your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgres://...
```

## Rollback

To rollback migrations:

```sql
-- Drop all tables (DANGEROUS - only for development)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure you're using service_role key for migrations
2. **RLS Blocking Queries**: Check if user has correct role/permissions
3. **Foreign Key Violations**: Ensure parent records exist before inserting children

### Useful Queries

```sql
-- Check table sizes
SELECT
  relname as table_name,
  pg_size_pretty(pg_total_relation_size(relid)) as total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- Check indexes
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check RLS policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public';
```

## Next Steps

1. Run migrations on your Supabase project
2. Update environment variables in your app
3. Test authentication and authorization
4. Verify data appears correctly in the app
5. Remove seed data before production deployment
