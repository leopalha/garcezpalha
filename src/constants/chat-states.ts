/**
 * Chat States Constants
 * Mapeamento de estados, ícones e labels para o Agent Flow
 */

import {
  MessageSquare,
  ClipboardCheck,
  CheckCircle2,
  FileText,
  FolderOpen,
  SearchCheck,
  FileSignature,
  Handshake,
  Trophy,
  XCircle,
  AlertTriangle,
  Users,
  CreditCard,
  BadgeCheck,
  UserPlus,
  Activity,
  type LucideIcon,
} from 'lucide-react'
import type { AgentState } from '@/types/chat'

// ==================== STATE LABELS ====================

export const STATE_LABELS: Record<AgentState, string> = {
  greeting: 'Saudação',
  qualifying: 'Qualificando',
  qualified: 'Qualificado',
  collecting_documents: 'Coletando Documentos',
  documents_collected: 'Documentos Coletados',
  analyzing: 'Analisando',
  generating_proposal: 'Gerando Proposta',
  proposal_ready: 'Proposta Pronta',
  negotiating: 'Negociando',
  closed_won: 'Fechado - Ganho',
  closed_lost: 'Fechado - Perdido',
  escalated: 'Escalado',
  human_takeover: 'Atendimento Humano',
  awaiting_payment: 'Aguardando Pagamento',
  payment_confirmed: 'Pagamento Confirmado',
  onboarding: 'Onboarding',
  active: 'Ativo',
}

// ==================== STATE ICONS ====================

export const STATE_ICONS: Record<AgentState, LucideIcon> = {
  greeting: MessageSquare,
  qualifying: ClipboardCheck,
  qualified: CheckCircle2,
  collecting_documents: FileText,
  documents_collected: FolderOpen,
  analyzing: SearchCheck,
  generating_proposal: FileSignature,
  proposal_ready: Handshake,
  negotiating: Handshake,
  closed_won: Trophy,
  closed_lost: XCircle,
  escalated: AlertTriangle,
  human_takeover: Users,
  awaiting_payment: CreditCard,
  payment_confirmed: BadgeCheck,
  onboarding: UserPlus,
  active: Activity,
}

// ==================== STATE COLORS ====================

export const STATE_COLORS: Record<AgentState, string> = {
  greeting: 'text-blue-500',
  qualifying: 'text-yellow-500',
  qualified: 'text-green-500',
  collecting_documents: 'text-purple-500',
  documents_collected: 'text-purple-600',
  analyzing: 'text-cyan-500',
  generating_proposal: 'text-indigo-500',
  proposal_ready: 'text-green-600',
  negotiating: 'text-orange-500',
  closed_won: 'text-green-700',
  closed_lost: 'text-red-500',
  escalated: 'text-red-600',
  human_takeover: 'text-amber-600',
  awaiting_payment: 'text-yellow-600',
  payment_confirmed: 'text-green-600',
  onboarding: 'text-blue-600',
  active: 'text-emerald-500',
}

// ==================== STATE BADGE VARIANTS ====================

export const STATE_BADGE_VARIANTS: Record<
  AgentState,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  greeting: 'default',
  qualifying: 'secondary',
  qualified: 'default',
  collecting_documents: 'secondary',
  documents_collected: 'secondary',
  analyzing: 'secondary',
  generating_proposal: 'secondary',
  proposal_ready: 'default',
  negotiating: 'outline',
  closed_won: 'default',
  closed_lost: 'destructive',
  escalated: 'destructive',
  human_takeover: 'outline',
  awaiting_payment: 'secondary',
  payment_confirmed: 'default',
  onboarding: 'outline',
  active: 'default',
}

// ==================== STATE GROUPS ====================

export const STATE_GROUPS = {
  initial: ['greeting', 'qualifying'] as AgentState[],
  qualification: ['qualified', 'collecting_documents', 'documents_collected'] as AgentState[],
  proposal: ['analyzing', 'generating_proposal', 'proposal_ready'] as AgentState[],
  negotiation: ['negotiating', 'awaiting_payment', 'payment_confirmed'] as AgentState[],
  closed: ['closed_won', 'closed_lost'] as AgentState[],
  special: ['escalated', 'human_takeover'] as AgentState[],
  active: ['onboarding', 'active'] as AgentState[],
}

// ==================== HELPER FUNCTIONS ====================

export function getStateLabel(state: AgentState): string {
  return STATE_LABELS[state] || state
}

export function getStateIcon(state: AgentState): LucideIcon {
  return STATE_ICONS[state] || MessageSquare
}

export function getStateColor(state: AgentState): string {
  return STATE_COLORS[state] || 'text-gray-500'
}

export function getStateBadgeVariant(
  state: AgentState
): 'default' | 'secondary' | 'destructive' | 'outline' {
  return STATE_BADGE_VARIANTS[state] || 'default'
}

export function getStateGroup(state: AgentState): string {
  for (const [group, states] of Object.entries(STATE_GROUPS)) {
    if (states.includes(state)) {
      return group
    }
  }
  return 'unknown'
}

export function isTerminalState(state: AgentState): boolean {
  return STATE_GROUPS.closed.includes(state)
}

export function isActiveState(state: AgentState): boolean {
  return STATE_GROUPS.active.includes(state)
}

export function requiresHumanIntervention(state: AgentState): boolean {
  return STATE_GROUPS.special.includes(state)
}
