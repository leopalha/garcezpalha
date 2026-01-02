export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'admin' | 'lawyer' | 'partner' | 'client'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'lawyer' | 'partner' | 'client'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'admin' | 'lawyer' | 'partner' | 'client'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          company: string | null
          service_interest: string
          message: string | null
          source: 'website' | 'whatsapp' | 'chatbot' | 'referral'
          status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          assigned_to: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone: string
          company?: string | null
          service_interest: string
          message?: string | null
          source?: 'website' | 'whatsapp' | 'chatbot' | 'referral'
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          assigned_to?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string
          company?: string | null
          service_interest?: string
          message?: string | null
          source?: 'website' | 'whatsapp' | 'chatbot' | 'referral'
          status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          assigned_to?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string | null
          lead_id: string | null
          company_name: string | null
          cpf_cnpj: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          status: 'active' | 'inactive' | 'archived'
          assigned_lawyer: string | null
          total_cases: number
          lifetime_value: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          lead_id?: string | null
          company_name?: string | null
          cpf_cnpj?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          status?: 'active' | 'inactive' | 'archived'
          assigned_lawyer?: string | null
          total_cases?: number
          lifetime_value?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          lead_id?: string | null
          company_name?: string | null
          cpf_cnpj?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          status?: 'active' | 'inactive' | 'archived'
          assigned_lawyer?: string | null
          total_cases?: number
          lifetime_value?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          client_id: string
          lawyer_id: string
          title: string
          description: string | null
          appointment_type: 'consultation' | 'meeting' | 'court' | 'other'
          scheduled_at: string
          duration_minutes: number
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          meeting_link: string | null
          location: string | null
          notes: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          lawyer_id: string
          title: string
          description?: string | null
          appointment_type: 'consultation' | 'meeting' | 'court' | 'other'
          scheduled_at: string
          duration_minutes?: number
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          meeting_link?: string | null
          location?: string | null
          notes?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          lawyer_id?: string
          title?: string
          description?: string | null
          appointment_type?: 'consultation' | 'meeting' | 'court' | 'other'
          scheduled_at?: string
          duration_minutes?: number
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          meeting_link?: string | null
          location?: string | null
          notes?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          client_id: string | null
          lead_id: string | null
          channel: 'whatsapp' | 'chatbot' | 'email' | 'phone'
          external_id: string | null
          status: 'active' | 'closed' | 'archived'
          assigned_to: string | null
          metadata: Json
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          lead_id?: string | null
          channel: 'whatsapp' | 'chatbot' | 'email' | 'phone'
          external_id?: string | null
          status?: 'active' | 'closed' | 'archived'
          assigned_to?: string | null
          metadata?: Json
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          lead_id?: string | null
          channel?: 'whatsapp' | 'chatbot' | 'email' | 'phone'
          external_id?: string | null
          status?: 'active' | 'closed' | 'archived'
          assigned_to?: string | null
          metadata?: Json
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_type: 'client' | 'agent' | 'ai' | 'system'
          sender_id: string | null
          content: string
          message_type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'system'
          metadata: Json
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_type: 'client' | 'agent' | 'ai' | 'system'
          sender_id?: string | null
          content: string
          message_type?: 'text' | 'image' | 'document' | 'audio' | 'video' | 'system'
          metadata?: Json
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_type?: 'client' | 'agent' | 'ai' | 'system'
          sender_id?: string | null
          content?: string
          message_type?: 'text' | 'image' | 'document' | 'audio' | 'video' | 'system'
          metadata?: Json
          read_at?: string | null
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          client_id: string
          invoice_number: string
          description: string
          amount: number
          currency: string
          status: 'pending' | 'paid' | 'overdue' | 'cancelled'
          due_date: string
          paid_at: string | null
          payment_method: 'credit_card' | 'pix' | 'bank_transfer' | 'other' | null
          payment_gateway: 'stripe' | 'mercadopago' | 'manual' | null
          external_payment_id: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          invoice_number: string
          description: string
          amount: number
          currency?: string
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
          due_date: string
          paid_at?: string | null
          payment_method?: 'credit_card' | 'pix' | 'bank_transfer' | 'other' | null
          payment_gateway?: 'stripe' | 'mercadopago' | 'manual' | null
          external_payment_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          invoice_number?: string
          description?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string
          paid_at?: string | null
          payment_method?: 'credit_card' | 'pix' | 'bank_transfer' | 'other' | null
          payment_gateway?: 'stripe' | 'mercadopago' | 'manual' | null
          external_payment_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      partners: {
        Row: {
          id: string
          user_id: string | null
          partner_code: string
          company_name: string | null
          contact_name: string
          email: string
          phone: string | null
          commission_rate: number
          status: 'active' | 'inactive' | 'suspended'
          total_referrals: number
          total_earnings: number
          payout_method: 'pix' | 'bank_transfer' | 'other' | null
          payout_details: Json
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          partner_code: string
          company_name?: string | null
          contact_name: string
          email: string
          phone?: string | null
          commission_rate?: number
          status?: 'active' | 'inactive' | 'suspended'
          total_referrals?: number
          total_earnings?: number
          payout_method?: 'pix' | 'bank_transfer' | 'other' | null
          payout_details?: Json
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          partner_code?: string
          company_name?: string | null
          contact_name?: string
          email?: string
          phone?: string | null
          commission_rate?: number
          status?: 'active' | 'inactive' | 'suspended'
          total_referrals?: number
          total_earnings?: number
          payout_method?: 'pix' | 'bank_transfer' | 'other' | null
          payout_details?: Json
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          partner_id: string
          lead_id: string | null
          client_id: string | null
          status: 'pending' | 'qualified' | 'converted' | 'paid'
          commission_amount: number | null
          paid_at: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          partner_id: string
          lead_id?: string | null
          client_id?: string | null
          status?: 'pending' | 'qualified' | 'converted' | 'paid'
          commission_amount?: number | null
          paid_at?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          partner_id?: string
          lead_id?: string | null
          client_id?: string | null
          status?: 'pending' | 'qualified' | 'converted' | 'paid'
          commission_amount?: number | null
          paid_at?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      cases: {
        Row: {
          id: string
          client_id: string
          lawyer_id: string
          service_type: string
          status: 'aguardando_documentos' | 'em_analise' | 'em_andamento' | 'concluido' | 'cancelado'
          description: string | null
          case_number: string | null
          court: string | null
          value: number | null
          current_phase: string | null
          progress: number
          next_step: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          client_id: string
          lawyer_id: string
          service_type: string
          status?: 'aguardando_documentos' | 'em_analise' | 'em_andamento' | 'concluido' | 'cancelado'
          description?: string | null
          case_number?: string | null
          court?: string | null
          value?: number | null
          current_phase?: string | null
          progress?: number
          next_step?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          client_id?: string
          lawyer_id?: string
          service_type?: string
          status?: 'aguardando_documentos' | 'em_analise' | 'em_andamento' | 'concluido' | 'cancelado'
          description?: string | null
          case_number?: string | null
          court?: string | null
          value?: number | null
          current_phase?: string | null
          progress?: number
          next_step?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          metadata?: Json
        }
      }
      case_timeline: {
        Row: {
          id: string
          case_id: string
          type: 'created' | 'document_submitted' | 'status_changed' | 'message' | 'deadline' | 'payment' | 'meeting' | 'court_update' | 'lawyer_assigned'
          title: string
          description: string | null
          created_by: string | null
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          case_id: string
          type: 'created' | 'document_submitted' | 'status_changed' | 'message' | 'deadline' | 'payment' | 'meeting' | 'court_update' | 'lawyer_assigned'
          title: string
          description?: string | null
          created_by?: string | null
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          case_id?: string
          type?: 'created' | 'document_submitted' | 'status_changed' | 'message' | 'deadline' | 'payment' | 'meeting' | 'court_update' | 'lawyer_assigned'
          title?: string
          description?: string | null
          created_by?: string | null
          created_at?: string
          metadata?: Json
        }
      }
      case_documents: {
        Row: {
          id: string
          case_id: string
          name: string
          type: string
          description: string | null
          file_url: string
          file_size: number
          mime_type: string
          status: 'pending' | 'approved' | 'rejected' | 'under_review'
          reviewed_by: string | null
          review_notes: string | null
          reviewed_at: string | null
          uploaded_by: string
          uploaded_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          case_id: string
          name: string
          type: string
          description?: string | null
          file_url: string
          file_size: number
          mime_type: string
          status?: 'pending' | 'approved' | 'rejected' | 'under_review'
          reviewed_by?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          uploaded_by: string
          uploaded_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          case_id?: string
          name?: string
          type?: string
          description?: string | null
          file_url?: string
          file_size?: number
          mime_type?: string
          status?: 'pending' | 'approved' | 'rejected' | 'under_review'
          reviewed_by?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          uploaded_by?: string
          uploaded_at?: string
          metadata?: Json
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'message' | 'document' | 'case_update' | 'deadline' | 'payment'
          title: string
          description: string | null
          link: string | null
          read: boolean
          read_at: string | null
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          type: 'message' | 'document' | 'case_update' | 'deadline' | 'payment'
          title: string
          description?: string | null
          link?: string | null
          read?: boolean
          read_at?: string | null
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'message' | 'document' | 'case_update' | 'deadline' | 'payment'
          title?: string
          description?: string | null
          link?: string | null
          read?: boolean
          read_at?: string | null
          created_at?: string
          metadata?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
