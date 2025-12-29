/**
 * Follow-up Automation System
 * Automatically schedules and manages follow-ups based on lead category
 */

import { createClient } from '@/lib/supabase/server'
import { whatsappCloudAPI } from '@/lib/whatsapp/cloud-api'

/**
 * Database type definitions
 */
interface FollowUpTaskDB {
  id: string
  lead_id: string
  scheduled_for: string
  attempt_number: number
  category: 'hot' | 'warm' | 'cold' | 'very-cold'
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  sent_at?: string
  error?: string
  metadata?: {
    scheduleType?: string
    leadCategory?: string
    productName?: string
    clientName?: string
    phone?: string
  }
  created_at?: string
  updated_at?: string
}

interface QualifiedLeadDB {
  id: string
  client_name: string | null
  product_name: string
  status: string
  source: string
  phone: string | null
  assigned_to: string | null
  last_interaction_at?: string
  category?: string
}

interface FollowUpTaskUpdate {
  status: string
  updated_at: string
  sent_at?: string
  error?: string
}

/**
 * Follow-up schedule based on lead category
 * - Hot: 2h, 6h, 24h, 3d, 7d
 * - Warm: 24h, 3d, 7d, 14d
 * - Cold: 7d, 14d, 30d
 * - Very Cold: 30d, 60d
 */
export const FOLLOW_UP_SCHEDULE = {
  hot: [
    { delay: 2 * 60 * 60 * 1000, name: '2 hours' }, // 2 hours
    { delay: 6 * 60 * 60 * 1000, name: '6 hours' }, // 6 hours
    { delay: 24 * 60 * 60 * 1000, name: '1 day' }, // 24 hours
    { delay: 3 * 24 * 60 * 60 * 1000, name: '3 days' }, // 3 days
    { delay: 7 * 24 * 60 * 60 * 1000, name: '7 days' }, // 7 days
  ],
  warm: [
    { delay: 24 * 60 * 60 * 1000, name: '1 day' }, // 24 hours
    { delay: 3 * 24 * 60 * 60 * 1000, name: '3 days' }, // 3 days
    { delay: 7 * 24 * 60 * 60 * 1000, name: '7 days' }, // 7 days
    { delay: 14 * 24 * 60 * 60 * 1000, name: '14 days' }, // 14 days
  ],
  cold: [
    { delay: 7 * 24 * 60 * 60 * 1000, name: '7 days' }, // 7 days
    { delay: 14 * 24 * 60 * 60 * 1000, name: '14 days' }, // 14 days
    { delay: 30 * 24 * 60 * 60 * 1000, name: '30 days' }, // 30 days
  ],
  'very-cold': [
    { delay: 30 * 24 * 60 * 60 * 1000, name: '30 days' }, // 30 days
    { delay: 60 * 24 * 60 * 60 * 1000, name: '60 days' }, // 60 days
  ],
} as const

/**
 * Follow-up message templates based on category and attempt number
 */
export const FOLLOW_UP_MESSAGES = {
  hot: {
    1: (clientName: string, productName: string) =>
      `Olá ${clientName || ''}! 👋\n\nVi que você se interessou por ${productName}. Como está sua situação? Gostaria de conversar com um de nossos especialistas?\n\nEstamos prontos para te ajudar! 🔥`,
    2: (clientName: string, productName: string) =>
      `${clientName || 'Olá'}! 📞\n\nAinda está disponível para conversarmos sobre ${productName}? Identificamos que seu caso tem urgência e queremos te ajudar o quanto antes.\n\nPosso agendar uma conversa rápida?`,
    3: (clientName: string, productName: string) =>
      `${clientName || 'Olá'}, tudo bem? 🤝\n\nNotei que você ainda não agendou uma conversa sobre ${productName}. Tem alguma dúvida que eu possa esclarecer agora?\n\nEstamos à disposição!`,
    4: (clientName: string, productName: string) =>
      `${clientName || 'Olá'}! 💼\n\nVamos conversar sobre ${productName} esta semana? Nossos especialistas estão ansiosos para te ajudar com sua situação.\n\nQue tal agendarmos?`,
    5: (clientName: string, productName: string) =>
      `${clientName || 'Olá'}! 🎯\n\nÚltima tentativa de contato sobre ${productName}. Se ainda tiver interesse, estamos aqui para ajudar!\n\nResponda este mensagem se quiser seguir em frente.`,
  },
  warm: {
    1: (clientName: string, productName: string) =>
      `Olá ${clientName || ''}! ☀️\n\nQue bom ter você por aqui! Vi seu interesse em ${productName}. Como posso te ajudar a dar o próximo passo?\n\nEstou à disposição!`,
    2: (clientName: string, productName: string) =>
      `${clientName || 'Olá'}! 📋\n\nJá teve tempo de pensar sobre ${productName}? Estou aqui para esclarecer qualquer dúvida que você tenha.\n\nPodemos conversar?`,
    3: (clientName: string, productName: string) =>
      `${clientName || 'Olá'}, tudo bem? 🌟\n\nAinda tem interesse em ${productName}? Gostaria de agendar uma consulta sem compromisso?\n\nEstou aqui para ajudar!`,
    4: (clientName: string, productName: string) =>
      `${clientName || 'Olá'}! 📅\n\nVamos marcar uma conversa sobre ${productName}? Tenho horários disponíveis esta semana.\n\nQual dia seria melhor para você?`,
  },
  cold: {
    1: (clientName: string, productName: string) =>
      `Olá ${clientName || ''}! ❄️\n\nVi que você demonstrou interesse em ${productName}. Como está sua situação hoje?\n\nSe precisar de ajuda, estou aqui!`,
    2: (clientName: string, productName: string) =>
      `${clientName || 'Olá'}! 📞\n\nAinda precisa de informações sobre ${productName}? Posso te ajudar a entender melhor o processo.\n\nQuer conversar?`,
    3: (clientName: string, productName: string) =>
      `${clientName || 'Olá'}! 🤝\n\nÚltimo lembrete sobre ${productName}. Se ainda tiver interesse, entre em contato!\n\nEstamos à disposição.`,
  },
  'very-cold': {
    1: (clientName: string, productName: string) =>
      `Olá ${clientName || ''}! 🧊\n\nFaz um tempo que você demonstrou interesse em ${productName}. Sua situação mudou?\n\nSe precisar, estamos aqui!`,
    2: (clientName: string, productName: string) =>
      `${clientName || 'Olá'}! 📧\n\nLembrete final sobre ${productName}. Caso ainda tenha interesse, entre em contato.\n\nTenha um ótimo dia!`,
  },
}

interface FollowUpTask {
  id: string
  leadId: string
  scheduledFor: Date
  attemptNumber: number
  category: 'hot' | 'warm' | 'cold' | 'very-cold'
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  createdAt: Date
  sentAt?: Date
  error?: string
}

/**
 * Schedule follow-ups for a new qualified lead
 */
export async function scheduleFollowUps(leadId: string, category: keyof typeof FOLLOW_UP_SCHEDULE) {
  const supabase = await createClient()

  // Get the schedule for this category
  const schedule = FOLLOW_UP_SCHEDULE[category]
  if (!schedule) {
    console.error(`[Follow-up] Invalid category: ${category}`)
    return
  }

  // Get lead data
  const { data: lead, error: leadError } = await supabase
    .from('qualified_leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (leadError || !lead) {
    console.error(`[Follow-up] Lead not found: ${leadId}`)
    return
  }

  const now = new Date()

  // Create follow-up tasks
  const tasks = schedule.map((item, index) => ({
    lead_id: leadId,
    scheduled_for: new Date(now.getTime() + item.delay).toISOString(),
    attempt_number: index + 1,
    category: category,
    status: 'pending',
    metadata: {
      scheduleType: item.name,
      leadCategory: category,
      productName: lead.product_name,
      clientName: lead.client_name,
      phone: lead.phone,
    },
  }))

  // Insert tasks into database
  const { error } = await supabase.from('follow_up_tasks').insert(tasks)

  if (error) {
    console.error('[Follow-up] Error scheduling tasks:', error)
  } else {
    console.log(`[Follow-up] Scheduled ${tasks.length} follow-ups for lead ${leadId}`)
  }
}

/**
 * Process pending follow-up tasks
 * This should be called by a cron job every hour
 */
export async function processPendingFollowUps() {
  const supabase = await createClient()

  const now = new Date()

  // Get all pending follow-ups that are due
  const { data: tasks, error } = await supabase
    .from('follow_up_tasks')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_for', now.toISOString())
    .order('scheduled_for', { ascending: true })
    .limit(100) // Process max 100 at a time

  if (error) {
    console.error('[Follow-up] Error fetching tasks:', error)
    return
  }

  if (!tasks || tasks.length === 0) {
    console.log('[Follow-up] No pending tasks to process')
    return
  }

  console.log(`[Follow-up] Processing ${tasks.length} follow-up tasks`)

  // Process each task
  for (const task of tasks) {
    await processFollowUpTask(task)
  }
}

/**
 * Process a single follow-up task
 */
async function processFollowUpTask(task: FollowUpTaskDB) {
  const supabase = await createClient()

  try {
    // Get lead data
    const { data: lead, error: leadError } = await supabase
      .from('qualified_leads')
      .select('*')
      .eq('id', task.lead_id)
      .single()

    if (leadError || !lead) {
      console.error(`[Follow-up] Lead not found: ${task.lead_id}`)
      await updateTaskStatus(task.id, 'failed', 'Lead not found')
      return
    }

    // Check if lead is still eligible for follow-up
    if (lead.status === 'converted' || lead.status === 'lost') {
      console.log(`[Follow-up] Lead ${lead.id} is ${lead.status}, cancelling follow-up`)
      await updateTaskStatus(task.id, 'cancelled', `Lead status: ${lead.status}`)
      await cancelFutureFollowUps(lead.id)
      return
    }

    // Get message template
    const category = task.category as keyof typeof FOLLOW_UP_MESSAGES
    const attemptNumber = task.attempt_number
    const categoryMessages = FOLLOW_UP_MESSAGES[category]
    const messageTemplate = categoryMessages?.[attemptNumber as keyof typeof categoryMessages]

    if (!messageTemplate || typeof messageTemplate !== 'function') {
      console.error(`[Follow-up] No message template for ${category} attempt ${attemptNumber}`)
      await updateTaskStatus(task.id, 'failed', 'No message template')
      return
    }

    // Generate message
    const message = messageTemplate(lead.client_name || '', lead.product_name)

    // Send message via WhatsApp
    if (lead.source === 'whatsapp' && lead.phone) {
      try {
        await whatsappCloudAPI.sendMessage(lead.phone, message)
        console.log(`[Follow-up] Sent message to ${lead.phone}`)
        await updateTaskStatus(task.id, 'sent')

        // Update lead's last_interaction_at
        await supabase
          .from('qualified_leads')
          .update({ last_interaction_at: new Date().toISOString() })
          .eq('id', lead.id)
      } catch (error) {
        console.error(`[Follow-up] Error sending message:`, error)
        await updateTaskStatus(task.id, 'failed', error instanceof Error ? error.message : String(error))
      }
    } else {
      // For non-WhatsApp leads, create a notification/task for manual follow-up
      console.log(`[Follow-up] Lead ${lead.id} requires manual follow-up (source: ${lead.source})`)
      await updateTaskStatus(task.id, 'sent', 'Manual follow-up required')

      // Create a notification for the assigned user
      if (lead.assigned_to) {
        await createFollowUpNotification(lead.assigned_to, lead, message)
      }
    }
  } catch (error) {
    console.error(`[Follow-up] Error processing task ${task.id}:`, error)
    await updateTaskStatus(task.id, 'failed', error instanceof Error ? error.message : String(error))
  }
}

/**
 * Update follow-up task status
 */
async function updateTaskStatus(taskId: string, status: string, error?: string) {
  const supabase = await createClient()

  const updates: FollowUpTaskUpdate = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === 'sent') {
    updates.sent_at = new Date().toISOString()
  }

  if (error) {
    updates.error = error
  }

  await supabase.from('follow_up_tasks').update(updates).eq('id', taskId)
}

/**
 * Cancel all future follow-ups for a lead
 */
async function cancelFutureFollowUps(leadId: string) {
  const supabase = await createClient()

  await supabase
    .from('follow_up_tasks')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('lead_id', leadId)
    .eq('status', 'pending')
}

/**
 * Create a notification for manual follow-up
 */
async function createFollowUpNotification(userId: string, lead: QualifiedLeadDB, message: string) {
  const supabase = await createClient()

  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'follow_up',
    title: `Follow-up: ${lead.client_name || lead.phone}`,
    message: `Lead ${lead.category} - ${lead.product_name}\n\nMensagem sugerida:\n${message}`,
    link: `/admin/leads/qualificados?id=${lead.id}`,
    metadata: {
      leadId: lead.id,
      category: lead.category,
      source: lead.source,
    },
  })
}

/**
 * Manual follow-up trigger (for admin use)
 */
export async function triggerManualFollowUp(leadId: string, message: string) {
  const supabase = await createClient()

  const { data: lead, error } = await supabase
    .from('qualified_leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (error || !lead) {
    throw new Error('Lead not found')
  }

  if (lead.source === 'whatsapp' && lead.phone) {
    await whatsappCloudAPI.sendMessage(lead.phone, message)

    // Update lead's last_interaction_at
    await supabase
      .from('qualified_leads')
      .update({ last_interaction_at: new Date().toISOString() })
      .eq('id', leadId)

    return { success: true, message: 'Message sent via WhatsApp' }
  }

  return { success: false, message: 'Manual follow-up required (non-WhatsApp lead)' }
}
