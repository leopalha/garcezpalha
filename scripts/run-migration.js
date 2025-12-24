/**
 * Script to run a migration directly on Supabase
 * Usage: node scripts/run-migration.js <migration_file>
 */

const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'cpcnzkttcwodvfqyhkou';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_ACCESS_TOKEN) {
  console.error('Error: SUPABASE_ACCESS_TOKEN environment variable is required');
  process.exit(1);
}

const migrationFile = process.argv[2] || 'supabase/migrations/020_scheduled_posts.sql';

async function runMigration() {
  const sqlPath = path.resolve(migrationFile);

  if (!fs.existsSync(sqlPath)) {
    console.error(`Error: Migration file not found: ${sqlPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log(`Running migration: ${migrationFile}`);
  console.log(`SQL length: ${sql.length} characters`);

  // Use Supabase Management API to run SQL
  const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Migration failed:', result);
      process.exit(1);
    }

    console.log('Migration completed successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error running migration:', error.message);
    process.exit(1);
  }
}

runMigration();
