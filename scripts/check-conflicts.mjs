import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findConflicts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name')
    .or('slug.eq.plano-saude-negou,slug.eq.tea,slug.eq.grafotecnia,slug.eq.aposentadoria,slug.eq.cirurgia-bariatrica,slug.eq.tratamento-tea')
    .order('slug');

  if (error) {
    console.error('Erro:', error);
    return;
  }

  console.log('=== PRODUTOS NO BANCO COM SLUGS CONFLITANTES ===\n');
  data.forEach(p => {
    console.log(`ID: ${p.id.padEnd(30)} | SLUG: ${p.slug.padEnd(30)} | ${p.name}`);
  });

  console.log(`\nTotal: ${data.length} produtos`);
}

findConflicts().then(() => process.exit(0));
