/**
 * Unified Chat Types
 * Tipos compartilhados por todos os componentes de chat
 */

// ==================== BASE TYPES ====================

export type ChatMode = 'chat' | 'agent-flow' | 'realtime-voice'

export type MessageRole = 'user' | 'assistant' | 'system'

export type Channel = 'website' | 'whatsapp' | 'telegram' | 'email'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  state?: string // Para agent-flow
  audioUrl?: string // Para TTS
  isTyping?: boolean // Para typing indicator
}

// ==================== AGENT FLOW TYPES ====================

export type AgentState =
  | 'greeting'
  | 'qualifying'
  | 'qualified'
  | 'collecting_documents'
  | 'documents_collected'
  | 'analyzing'
  | 'generating_proposal'
  | 'proposal_ready'
  | 'negotiating'
  | 'closed_won'
  | 'closed_lost'
  | 'escalated'
  | 'human_takeover'
  | 'awaiting_payment'
  | 'payment_confirmed'
  | 'onboarding'
  | 'active'

export interface QualificationData {
  score: number // 0-100
  questionsAnswered: number
  totalQuestions: number
  flags: string[]
  isQualified: boolean
  nextSteps?: string[]
}

export interface Classification {
  serviceType: string
  urgency: 'low' | 'medium' | 'high' | 'urgent'
  confidence: number
  keywords: string[]
}

export interface Proposal {
  serviceDescription: string
  estimatedValue: number
  estimatedDuration: string
  nextSteps: string[]
  terms?: string[]
}

export interface AgentFlowResponse {
  state: AgentState
  message: string
  classification?: Classification
  qualification?: QualificationData
  proposal?: Proposal
  metadata?: Record<string, any>
}

// ==================== REALTIME VOICE TYPES ====================

export interface RealtimeMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  audioData?: ArrayBuffer
}

export interface RealtimeStatus {
  isConnected: boolean
  isConnecting: boolean
  isSpeaking: boolean
  error?: string
}

// ==================== CHAT FEATURES ====================

export interface ChatFeatures {
  fileUpload?: boolean
  audioRecording?: boolean
  textToSpeech?: boolean
  videoMode?: boolean
  qualificationTracking?: boolean
  historyClearing?: boolean
  settingsPanel?: boolean
}

export const DEFAULT_FEATURES: ChatFeatures = {
  fileUpload: true,
  audioRecording: true,
  textToSpeech: false,
  videoMode: true,
  qualificationTracking: false,
  historyClearing: true,
  settingsPanel: false,
}

// ==================== CHAT SETTINGS ====================

export interface ChatSettings {
  ttsEnabled: boolean
  ttsVoice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  ttsSpeed: 1 | 1.5 | 2
  ttsAutoPlay: boolean
  microphoneEnabled: boolean
  notificationsEnabled: boolean
  soundEffectsEnabled: boolean
}

export const DEFAULT_SETTINGS: ChatSettings = {
  ttsEnabled: false,
  ttsVoice: 'alloy',
  ttsSpeed: 1,
  ttsAutoPlay: false,
  microphoneEnabled: true,
  notificationsEnabled: true,
  soundEffectsEnabled: true,
}

// ==================== COMPONENT PROPS ====================

export interface UnifiedChatAssistantProps {
  // Identificação
  productId: string
  productName: string

  // Comportamento
  autoOpen?: boolean
  openDelay?: number
  onClose?: () => void

  // Modo de operação
  mode?: ChatMode
  channel?: Channel

  // Features opcionais
  features?: ChatFeatures

  // Callbacks (agent-flow)
  onConversationStart?: (conversationId: string) => void
  onQualificationComplete?: (data: QualificationData) => void

  // Advanced
  customSystemPrompt?: string
  maxFiles?: number
}

export interface ChatAssistantProps {
  productId: string
  productName: string
  autoOpen?: boolean
  openDelay?: number
  onClose?: () => void
}

export interface EnhancedChatAssistantProps extends ChatAssistantProps {
  useStateMachine?: boolean
}

export interface AgentFlowChatWidgetProps {
  productId?: string
  productName?: string
  autoOpen?: boolean
  openDelay?: number
  channel?: Channel
  onConversationStart?: (conversationId: string) => void
  onQualificationComplete?: (data: AgentFlowResponse) => void
}

export interface RealtimeVoiceAssistantProps {
  productId: string
  productName: string
  onClose?: () => void
}

// ==================== API PAYLOADS ====================

export interface ChatAPIPayload {
  productId: string
  message: string
  history: Message[]
  files?: File[]
}

export interface AgentFlowAPIPayload {
  conversationId: string
  message: string
  channel: Channel
  productId?: string
}

export interface TranscribeAPIPayload {
  audio: Blob
  productId?: string
}

export interface TTSAPIPayload {
  text: string
  voice?: ChatSettings['ttsVoice']
  speed?: ChatSettings['ttsSpeed']
}

// ==================== API RESPONSES ====================

export interface ChatAPIResponse {
  message: string
  metadata?: Record<string, any>
}

export interface TranscribeAPIResponse {
  text: string
  duration?: number
}

export interface TTSAPIResponse {
  audioUrl: string
}
