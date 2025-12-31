/**
 * Script de Teste do Sistema de Auto-Segmentação
 *
 * Demonstra:
 * - Segmentação automática de leads
 * - Critérios de classificação
 * - Auto-subscription em sequências
 * - Busca de leads por segmento
 */

import { autoSegmenter, DEFAULT_SEGMENTS } from '../src/lib/leads/segmentation/auto-segmenter'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Carregar .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function createMockLeads() {
  console.log('📝 Criando leads de teste...\n')

  const mockLeads = [
    {
      id: 'lead-hot-1',
      email: 'hot@example.com',
      name: 'Hot Lead',
      score: 85,
      last_contact_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 dia atrás
      has_converted: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
    {
      id: 'lead-warm-1',
      email: 'warm@example.com',
      name: 'Warm Lead',
      score: 65,
      last_contact_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 dias atrás
      has_converted: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    },
    {
      id: 'lead-cold-1',
      email: 'cold@example.com',
      name: 'Cold Lead',
      score: 30,
      last_contact_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 dias atrás
      has_converted: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    },
    {
      id: 'lead-dormant-1',
      email: 'dormant@example.com',
      name: 'Dormant Lead',
      score: 40,
      last_contact_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 dias atrás
      has_converted: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    },
    {
      id: 'lead-new-1',
      email: 'new@example.com',
      name: 'New Signup',
      score: 50,
      last_contact_at: new Date().toISOString(),
      has_converted: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 dias atrás
    },
    {
      id: 'lead-converted-1',
      email: 'customer@example.com',
      name: 'Converted Customer',
      score: 90,
      last_contact_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      has_converted: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
    },
  ]

  for (const lead of mockLeads) {
    const { error } = await supabase
      .from('leads')
      .upsert(lead, { onConflict: 'id' })

    if (error) {
      console.error(`❌ Erro ao criar lead ${lead.id}:`, error.message)
    } else {
      console.log(`✅ Lead criado: ${lead.name} (score: ${lead.score})`)
    }
  }

  console.log()
  return mockLeads
}

async function testSegmentation() {
  console.log('🧪 Iniciando testes do sistema de Auto-Segmentação...\n')

  try {
    // 1. Mostrar segmentos disponíveis
    console.log('1️⃣ Segmentos Pré-Definidos:\n')

    DEFAULT_SEGMENTS.forEach(segment => {
      console.log(`${segment.color === '#ef4444' ? '🔴' : segment.color === '#f59e0b' ? '🟡' : segment.color === '#3b82f6' ? '🔵' : segment.color === '#10b981' ? '🟢' : '⚪'} ${segment.name}`)
      console.log(`   ${segment.description}`)
      console.log(`   Prioridade: ${segment.priority}`)
      if (segment.emailSequence) {
        console.log(`   Auto-subscribe: ${segment.emailSequence}`)
      }
      console.log(`   Critérios:`, JSON.stringify(segment.criteria, null, 2))
      console.log()
    })

    // 2. Criar leads de teste
    const mockLeads = await createMockLeads()

    // 3. Segmentar cada lead
    console.log('2️⃣ Segmentando leads...\n')

    for (const lead of mockLeads) {
      console.log(`Segmentando: ${lead.name}`)
      console.log(`  Score: ${lead.score}`)
      console.log(`  Último contato: ${new Date(lead.last_contact_at).toLocaleDateString('pt-BR')}`)

      const segments = await autoSegmenter.segmentLead(lead.id)

      console.log(`  ✅ Matched ${segments.length} segmento(s):`, segments.join(', '))

      // Mostrar sequências inscritas
      const matchedSegments = DEFAULT_SEGMENTS.filter(s => segments.includes(s.id))
      const sequences = matchedSegments
        .filter(s => s.emailSequence)
        .map(s => s.emailSequence)

      if (sequences.length > 0) {
        console.log(`  📧 Auto-subscribed em: ${sequences.join(', ')}`)
      }

      console.log()
    }

    // 4. Buscar leads por segmento
    console.log('3️⃣ Buscando leads por segmento...\n')

    for (const segment of DEFAULT_SEGMENTS.slice(0, 5)) {
      // Apenas primeiros 5
      const leads = await autoSegmenter.getSegmentLeads(segment.id)

      console.log(`${segment.name}: ${leads.length} lead(s)`)
      if (leads.length > 0) {
        console.log(`  IDs: ${leads.join(', ')}`)
      }
      console.log()
    }

    // 5. Segmentar todos os leads (simulação de cron job)
    console.log('4️⃣ Simulando cron job (segmentar todos os leads)...\n')

    const result = await autoSegmenter.segmentAllLeads()

    console.log('✅ Segmentação em massa concluída:')
    console.log(`   Total de leads: ${result.total}`)
    console.log(`   Segmentados com sucesso: ${result.segmented}`)
    console.log(`   Taxa de sucesso: ${((result.segmented / result.total) * 100).toFixed(1)}%`)

    console.log('\n✅ Teste de Auto-Segmentação concluído com sucesso!')
  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
    throw error
  }
}

// Executar
testSegmentation()
  .then(() => {
    console.log('\n🎉 Todos os testes passaram!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Erro fatal:', error)
    process.exit(1)
  })
