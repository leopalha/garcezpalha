import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createTables() {
  console.log('🚀 Criando tabelas de produtos no Supabase...\n')

  try {
    console.log('📋 INSTRUÇÕES MANUAIS:')
    console.log('='.repeat(60))
    console.log('\n1. Acesse o Supabase Dashboard:')
    console.log(`   https://app.supabase.com/project/${process.env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([^.]+)/)[1]}/sql/new`)
    console.log('\n2. Cole o seguinte SQL e clique em RUN:\n')
    console.log('='.repeat(60))
    console.log(`
-- Tabela principal de produtos/serviços
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_problem TEXT,
  base_price INTEGER NOT NULL DEFAULT 0,
  features JSONB DEFAULT '[]',
  benefits JSONB DEFAULT '[]',
  documents_required JSONB DEFAULT '[]',
  faq_items JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de pacotes (múltiplos por produto)
CREATE TABLE IF NOT EXISTS product_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  features JSONB DEFAULT '[]',
  is_recommended BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_packages_product ON product_packages(product_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON product_packages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`)
    console.log('='.repeat(60))
    console.log('\n3. Após executar, volte aqui e pressione ENTER para continuar...')
    console.log('\nOu execute: npm run migrate:products\n')

  } catch (error) {
    console.error('\n💥 Erro:', error.message)
    process.exit(1)
  }
}

createTables()
