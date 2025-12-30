/**
 * WhatsApp Automation - Types
 * Sistema de automação WhatsApp Business API
 */

export type WhatsAppMessageType = 'text' | 'template' | 'interactive' | 'document' | 'image'

export type WhatsAppTemplateCategory = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'

export interface WhatsAppTemplate {
  id: string
  name: string
  language: 'pt_BR'
  category: WhatsAppTemplateCategory
  components: WhatsAppTemplateComponent[]
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
}

export interface WhatsAppTemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS'
  format?: 'TEXT' | 'IMAGE' | 'DOCUMENT'
  text?: string
  example?: { header_text?: string[]; body_text?: string[][] }
  buttons?: WhatsAppButton[]
}

export interface WhatsAppButton {
  type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER'
  text: string
  url?: string
  phone_number?: string
}

export interface WhatsAppMessage {
  to: string // Phone number with country code (5521999999999)
  type: WhatsAppMessageType
  text?: { body: string }
  template?: {
    name: string
    language: { code: 'pt_BR' }
    components: WhatsAppTemplateComponent[]
  }
  interactive?: WhatsAppInteractive
}

export interface WhatsAppInteractive {
  type: 'button' | 'list'
  header?: { type: 'text'; text: string }
  body: { text: string }
  footer?: { text: string }
  action: WhatsAppInteractiveAction
}

export interface WhatsAppInteractiveAction {
  buttons?: WhatsAppButton[]
  button?: string // Text for list button
  sections?: WhatsAppListSection[]
}

export interface WhatsAppListSection {
  title: string
  rows: WhatsAppListRow[]
}

export interface WhatsAppListRow {
  id: string
  title: string
  description?: string
}

export interface WhatsAppAutomationFlow {
  id: string
  name: string
  trigger: WhatsAppFlowTrigger
  steps: WhatsAppFlowStep[]
  active: boolean
}

export interface WhatsAppFlowTrigger {
  type: 'keyword' | 'button_click' | 'time_delay' | 'state_change' | 'webhook'
  value: string | number
  conditions?: Record<string, any>
}

export interface WhatsAppFlowStep {
  id: string
  order: number
  delaySeconds?: number
  message: WhatsAppMessage
  nextStep?: string
  conditions?: WhatsAppStepCondition[]
}

export interface WhatsAppStepCondition {
  type: 'response_contains' | 'response_equals' | 'button_clicked'
  value: string
  nextStepId: string
}
