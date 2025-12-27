export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          created_at: string | null
          description: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          description: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          description?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          agent_role: string
          alert_type: string
          created_at: string | null
          details: Json | null
          expires_at: string | null
          id: string
          message: string
          related_entity_id: string | null
          related_entity_type: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string | null
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          agent_role: string
          alert_type: string
          created_at?: string | null
          details?: Json | null
          expires_at?: string | null
          id?: string
          message: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          status?: string | null
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          agent_role?: string
          alert_type?: string
          created_at?: string | null
          details?: Json | null
          expires_at?: string | null
          id?: string
          message?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      agent_decisions: {
        Row: {
          agent_role: string
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          decision_type: string
          description: string | null
          estimated_impact: string | null
          executed: boolean | null
          executed_at: string | null
          execution_result: Json | null
          id: string
          options: Json | null
          priority: string | null
          rationale: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          requires_approval: boolean | null
          selected_option: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          agent_role: string
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          decision_type: string
          description?: string | null
          estimated_impact?: string | null
          executed?: boolean | null
          executed_at?: string | null
          execution_result?: Json | null
          id?: string
          options?: Json | null
          priority?: string | null
          rationale?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          requires_approval?: boolean | null
          selected_option?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          agent_role?: string
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          decision_type?: string
          description?: string | null
          estimated_impact?: string | null
          executed?: boolean | null
          executed_at?: string | null
          execution_result?: Json | null
          id?: string
          options?: Json | null
          priority?: string | null
          rationale?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          requires_approval?: boolean | null
          selected_option?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_metrics: {
        Row: {
          agent_category: string
          agent_role: string
          confidence_score: number | null
          conversation_id: string | null
          created_at: string | null
          error_message: string | null
          error_type: string | null
          estimated_cost_cents: number | null
          id: string
          input_length: number | null
          output_length: number | null
          relevance_score: number | null
          request_id: string | null
          response_time_ms: number | null
          success: boolean | null
          tokens_completion: number | null
          tokens_prompt: number | null
          tokens_total: number | null
          user_id: string | null
        }
        Insert: {
          agent_category: string
          agent_role: string
          confidence_score?: number | null
          conversation_id?: string | null
          created_at?: string | null
          error_message?: string | null
          error_type?: string | null
          estimated_cost_cents?: number | null
          id?: string
          input_length?: number | null
          output_length?: number | null
          relevance_score?: number | null
          request_id?: string | null
          response_time_ms?: number | null
          success?: boolean | null
          tokens_completion?: number | null
          tokens_prompt?: number | null
          tokens_total?: number | null
          user_id?: string | null
        }
        Update: {
          agent_category?: string
          agent_role?: string
          confidence_score?: number | null
          conversation_id?: string | null
          created_at?: string | null
          error_message?: string | null
          error_type?: string | null
          estimated_cost_cents?: number | null
          id?: string
          input_length?: number | null
          output_length?: number | null
          relevance_score?: number | null
          request_id?: string | null
          response_time_ms?: number | null
          success?: boolean | null
          tokens_completion?: number | null
          tokens_prompt?: number | null
          tokens_total?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_analysis_logs: {
        Row: {
          agent_type: string
          case_id: string | null
          confidence_score: number | null
          created_at: string | null
          document_id: string | null
          id: string
          input_text: string | null
          output_text: string | null
          processing_time_ms: number | null
          tokens_used: number | null
        }
        Insert: {
          agent_type: string
          case_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          document_id?: string | null
          id?: string
          input_text?: string | null
          output_text?: string | null
          processing_time_ms?: number | null
          tokens_used?: number | null
        }
        Update: {
          agent_type?: string
          case_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          document_id?: string | null
          id?: string
          input_text?: string | null
          output_text?: string | null
          processing_time_ms?: number | null
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_logs_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "legal_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analysis_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          client_id: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          location: string | null
          notes: string | null
          scheduled_at: string
          service_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_at: string
          service_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_at?: string
          service_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      case_deadlines: {
        Row: {
          case_id: string | null
          completed_at: string | null
          created_at: string | null
          deadline_date: string
          deadline_type: string
          id: string
          notes: string | null
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          case_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          deadline_date: string
          deadline_type: string
          id?: string
          notes?: string | null
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          case_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          deadline_date?: string
          deadline_type?: string
          id?: string
          notes?: string | null
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_deadlines_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "legal_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          agent_used: string | null
          confidence: number | null
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          sender_type: string
          user_id: string | null
        }
        Insert: {
          agent_used?: string | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          sender_type: string
          user_id?: string | null
        }
        Update: {
          agent_used?: string | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          sender_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          openai_thread_id: string | null
          session_id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          openai_thread_id?: string | null
          session_id: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          openai_thread_id?: string | null
          session_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      checkout_orders: {
        Row: {
          amount: number
          created_at: string | null
          customer_cpf_cnpj: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          description: string | null
          id: string
          mercadopago_payment_id: string | null
          metadata: Json | null
          paid_at: string | null
          payment_method: string
          payment_status: string | null
          service_id: string
          service_name: string
          stripe_session_id: string | null
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_cpf_cnpj?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          description?: string | null
          id?: string
          mercadopago_payment_id?: string | null
          metadata?: Json | null
          paid_at?: string | null
          payment_method: string
          payment_status?: string | null
          service_id: string
          service_name: string
          stripe_session_id?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_cpf_cnpj?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          description?: string | null
          id?: string
          mercadopago_payment_id?: string | null
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string
          payment_status?: string | null
          service_id?: string
          service_name?: string
          stripe_session_id?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          cpf_cnpj: string | null
          created_at: string | null
          id: string
          lead_id: string | null
          notes: string | null
          profile_id: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          profile_id?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          profile_id?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_campaigns: {
        Row: {
          budget_cents: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          goal: string | null
          id: string
          legal_areas: string[] | null
          metrics: Json | null
          name: string
          platforms: string[] | null
          spend_cents: number | null
          start_date: string | null
          status: string | null
          target_audience: string | null
          updated_at: string | null
        }
        Insert: {
          budget_cents?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          goal?: string | null
          id?: string
          legal_areas?: string[] | null
          metrics?: Json | null
          name: string
          platforms?: string[] | null
          spend_cents?: number | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          updated_at?: string | null
        }
        Update: {
          budget_cents?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          goal?: string | null
          id?: string
          legal_areas?: string[] | null
          metrics?: Json | null
          name?: string
          platforms?: string[] | null
          spend_cents?: number | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          clicksign_document_key: string | null
          client_id: string | null
          created_at: string | null
          document_url: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          signed_at: string | null
          status: string | null
          template_name: string
          updated_at: string | null
        }
        Insert: {
          clicksign_document_key?: string | null
          client_id?: string | null
          created_at?: string | null
          document_url?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          signed_at?: string | null
          status?: string | null
          template_name: string
          updated_at?: string | null
        }
        Update: {
          clicksign_document_key?: string | null
          client_id?: string | null
          created_at?: string | null
          document_url?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          signed_at?: string | null
          status?: string | null
          template_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          agent_used: string | null
          assigned_admin_id: string | null
          assigned_to: string | null
          channel: string
          classification: Json | null
          client: Json | null
          client_id: string | null
          conversation_id: string | null
          created_at: string
          email: string | null
          external_id: string | null
          id: string
          last_message_at: string | null
          lead_id: string | null
          metadata: Json | null
          needs_attention: boolean | null
          phone_number: string | null
          proposal: Json | null
          qualification: Json | null
          qualification_score: number | null
          resolved_at: string | null
          started_at: string | null
          state_status: Json | null
          status: string
          taken_over_at: string | null
          updated_at: string
        }
        Insert: {
          agent_used?: string | null
          assigned_admin_id?: string | null
          assigned_to?: string | null
          channel: string
          classification?: Json | null
          client?: Json | null
          client_id?: string | null
          conversation_id?: string | null
          created_at?: string
          email?: string | null
          external_id?: string | null
          id?: string
          last_message_at?: string | null
          lead_id?: string | null
          metadata?: Json | null
          needs_attention?: boolean | null
          phone_number?: string | null
          proposal?: Json | null
          qualification?: Json | null
          qualification_score?: number | null
          resolved_at?: string | null
          started_at?: string | null
          state_status?: Json | null
          status?: string
          taken_over_at?: string | null
          updated_at?: string
        }
        Update: {
          agent_used?: string | null
          assigned_admin_id?: string | null
          assigned_to?: string | null
          channel?: string
          classification?: Json | null
          client?: Json | null
          client_id?: string | null
          conversation_id?: string | null
          created_at?: string
          email?: string | null
          external_id?: string | null
          id?: string
          last_message_at?: string | null
          lead_id?: string | null
          metadata?: Json | null
          needs_attention?: boolean | null
          phone_number?: string | null
          proposal?: Json | null
          qualification?: Json | null
          qualification_score?: number | null
          resolved_at?: string | null
          started_at?: string | null
          state_status?: Json | null
          status?: string
          taken_over_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_assigned_admin_id_fkey"
            columns: ["assigned_admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      deadlines: {
        Row: {
          completed_at: string | null
          created_at: string | null
          deadline_date: string
          deadline_time: string | null
          description: string | null
          id: string
          priority: string | null
          process_id: string | null
          reminded_at: string | null
          reminder_days: number | null
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          deadline_date: string
          deadline_time?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          process_id?: string | null
          reminded_at?: string | null
          reminder_days?: number | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          deadline_date?: string
          deadline_time?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          process_id?: string | null
          reminded_at?: string | null
          reminder_days?: number | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deadlines_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      document_revisions: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          document_id: string
          id: string
          revision_notes: string | null
          revision_number: number
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          document_id: string
          id?: string
          revision_notes?: string | null
          revision_number?: number
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          document_id?: string
          id?: string
          revision_notes?: string | null
          revision_number?: number
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_revisions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "generated_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          category: string
          content: string
          created_at: string | null
          description: string | null
          estimated_pages: number | null
          id: string
          is_active: boolean | null
          optional_variables: string[] | null
          required_variables: string[] | null
          requires_ai: boolean | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          description?: string | null
          estimated_pages?: number | null
          id?: string
          is_active?: boolean | null
          optional_variables?: string[] | null
          required_variables?: string[] | null
          requires_ai?: boolean | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          description?: string | null
          estimated_pages?: number | null
          id?: string
          is_active?: boolean | null
          optional_variables?: string[] | null
          required_variables?: string[] | null
          requires_ai?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          case_id: string | null
          client_id: string | null
          created_at: string | null
          document_type: string
          file_size: number | null
          file_url: string | null
          id: string
          title: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          case_id?: string | null
          client_id?: string | null
          created_at?: string | null
          document_type: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          case_id?: string | null
          client_id?: string | null
          created_at?: string | null
          document_type?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "legal_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequence_subscribers: {
        Row: {
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          current_step: number | null
          id: string
          last_sent_at: string | null
          sequence_id: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          last_sent_at?: string | null
          sequence_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          last_sent_at?: string | null
          sequence_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sequence_subscribers_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequences: {
        Row: {
          active: boolean | null
          created_at: string | null
          emails: Json
          id: string
          name: string
          trigger_event: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          emails: Json
          id?: string
          name: string
          trigger_event: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          emails?: Json
          id?: string
          name?: string
          trigger_event?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      follow_up_messages: {
        Row: {
          channel: Database["public"]["Enums"]["follow_up_channel"]
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          lead_id: string
          message: string
          message_id: string
          metadata: Json | null
          read_at: string | null
          recipient_email: string | null
          recipient_name: string | null
          recipient_phone: string | null
          replied_at: string | null
          scheduled_for: string
          sent_at: string | null
          status: Database["public"]["Enums"]["follow_up_status"]
          updated_at: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["follow_up_channel"]
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          lead_id: string
          message: string
          message_id: string
          metadata?: Json | null
          read_at?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          replied_at?: string | null
          scheduled_for: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["follow_up_status"]
          updated_at?: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["follow_up_channel"]
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          lead_id?: string
          message?: string
          message_id?: string
          metadata?: Json | null
          read_at?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          replied_at?: string | null
          scheduled_for?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["follow_up_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_messages_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_tasks: {
        Row: {
          attempt_number: number
          category: string
          created_at: string | null
          error: string | null
          id: string
          lead_id: string
          metadata: Json | null
          scheduled_for: string
          sent_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          attempt_number: number
          category: string
          created_at?: string | null
          error?: string | null
          id?: string
          lead_id: string
          metadata?: Json | null
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          attempt_number?: number
          category?: string
          created_at?: string | null
          error?: string | null
          id?: string
          lead_id?: string
          metadata?: Json | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "qualified_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_documents: {
        Row: {
          content: string
          created_at: string | null
          document_type: string
          id: string
          lead_id: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          sent_at: string | null
          sent_via: string | null
          status: string
          title: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          document_type: string
          id?: string
          lead_id?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sent_at?: string | null
          sent_via?: string | null
          status?: string
          title: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          document_type?: string
          id?: string
          lead_id?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sent_at?: string | null
          sent_via?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_documents_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_interactions: {
        Row: {
          created_at: string
          id: string
          lead_id: string | null
          message: string | null
          metadata: Json | null
          session_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id?: string | null
          message?: string | null
          metadata?: Json | null
          session_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string | null
          message?: string | null
          metadata?: Json | null
          session_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          agent_role: string
          category: Database["public"]["Enums"]["lead_category"]
          client_name: string
          converted_at: string | null
          created_at: string
          email: string | null
          estimated_fee: number | null
          estimated_value: number | null
          id: string
          last_contact_at: string | null
          metadata: Json | null
          phone: string | null
          product_id: string
          product_name: string
          recommended_action_message: string | null
          recommended_action_priority: string | null
          recommended_action_type: string | null
          score_complexity: number
          score_probability: number
          score_reasoning: string[] | null
          score_total: number
          score_urgency: number
          session_id: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agent_role: string
          category: Database["public"]["Enums"]["lead_category"]
          client_name: string
          converted_at?: string | null
          created_at?: string
          email?: string | null
          estimated_fee?: number | null
          estimated_value?: number | null
          id?: string
          last_contact_at?: string | null
          metadata?: Json | null
          phone?: string | null
          product_id: string
          product_name: string
          recommended_action_message?: string | null
          recommended_action_priority?: string | null
          recommended_action_type?: string | null
          score_complexity: number
          score_probability: number
          score_reasoning?: string[] | null
          score_total: number
          score_urgency: number
          session_id?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agent_role?: string
          category?: Database["public"]["Enums"]["lead_category"]
          client_name?: string
          converted_at?: string | null
          created_at?: string
          email?: string | null
          estimated_fee?: number | null
          estimated_value?: number | null
          id?: string
          last_contact_at?: string | null
          metadata?: Json | null
          phone?: string | null
          product_id?: string
          product_name?: string
          recommended_action_message?: string | null
          recommended_action_priority?: string | null
          recommended_action_type?: string | null
          score_complexity?: number
          score_probability?: number
          score_reasoning?: string[] | null
          score_total?: number
          score_urgency?: number
          session_id?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      legal_cases: {
        Row: {
          case_number: string
          case_type: string
          client_id: string | null
          court: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          case_number: string
          case_type: string
          client_id?: string | null
          court?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          case_number?: string
          case_type?: string
          client_id?: string | null
          court?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legal_cases_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          channel: string | null
          content: string
          conversation_id: string
          created_at: string
          external_message_id: string | null
          id: string
          message_type: string
          metadata: Json | null
          read_at: string | null
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          channel?: string | null
          content: string
          conversation_id: string
          created_at?: string
          external_message_id?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          read_at?: string | null
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          channel?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          external_message_id?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          read_at?: string | null
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          channel: string
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          id: string
          message: string
          metadata: Json | null
          recipient_email: string | null
          recipient_id: string | null
          recipient_phone: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          type: string
        }
        Insert: {
          channel: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message: string
          metadata?: Json | null
          recipient_email?: string | null
          recipient_id?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type: string
        }
        Update: {
          channel?: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          recipient_email?: string | null
          recipient_id?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_commissions: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          paid_at: string | null
          partner_id: string
          payment_id: string | null
          pix_transaction_id: string | null
          referral_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          partner_id: string
          payment_id?: string | null
          pix_transaction_id?: string | null
          referral_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          paid_at?: string | null
          partner_id?: string
          payment_id?: string | null
          pix_transaction_id?: string | null
          referral_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_commissions_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          account_type: string | null
          address: string | null
          bank_name: string | null
          bio: string | null
          city: string | null
          cnpj: string | null
          commission_rate: number | null
          company_name: string | null
          contract_signed_at: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          pending_earnings: number | null
          pix_key: string | null
          pix_key_type: string | null
          state: string | null
          total_converted: number | null
          total_earnings: number | null
          total_referrals: number | null
          trading_name: string | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          account_type?: string | null
          address?: string | null
          bank_name?: string | null
          bio?: string | null
          city?: string | null
          cnpj?: string | null
          commission_rate?: number | null
          company_name?: string | null
          contract_signed_at?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          pending_earnings?: number | null
          pix_key?: string | null
          pix_key_type?: string | null
          state?: string | null
          total_converted?: number | null
          total_earnings?: number | null
          total_referrals?: number | null
          trading_name?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          account_type?: string | null
          address?: string | null
          bank_name?: string | null
          bio?: string | null
          city?: string | null
          cnpj?: string | null
          commission_rate?: number | null
          company_name?: string | null
          contract_signed_at?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          pending_earnings?: number | null
          pix_key?: string | null
          pix_key_type?: string | null
          state?: string | null
          total_converted?: number | null
          total_earnings?: number | null
          total_referrals?: number | null
          trading_name?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      payment_links: {
        Row: {
          amount: number
          created_at: string
          discount_applied: number | null
          discount_percentage: number | null
          expires_at: string
          id: string
          installments: number | null
          lead_id: string
          metadata: Json | null
          original_amount: number
          paid_at: string | null
          provider: string
          provider_id: string
          status: string | null
          updated_at: string
          url: string
        }
        Insert: {
          amount: number
          created_at?: string
          discount_applied?: number | null
          discount_percentage?: number | null
          expires_at: string
          id?: string
          installments?: number | null
          lead_id: string
          metadata?: Json | null
          original_amount: number
          paid_at?: string | null
          provider: string
          provider_id: string
          status?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          amount?: number
          created_at?: string
          discount_applied?: number | null
          discount_percentage?: number | null
          expires_at?: string
          id?: string
          installments?: number | null
          lead_id?: string
          metadata?: Json | null
          original_amount?: number
          paid_at?: string | null
          provider?: string
          provider_id?: string
          status?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_links_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          case_id: string | null
          client_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          payment_date: string | null
          payment_method: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          case_id?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          case_id?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "legal_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      process_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          deadline_extracted: string | null
          extracted_text: string | null
          id: string
          pdf_filename: string | null
          pdf_url: string | null
          process_id: string | null
          processed: boolean | null
          processed_at: string | null
          received_at: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          deadline_extracted?: string | null
          extracted_text?: string | null
          id?: string
          pdf_filename?: string | null
          pdf_url?: string | null
          process_id?: string | null
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          deadline_extracted?: string | null
          extracted_text?: string | null
          id?: string
          pdf_filename?: string | null
          pdf_url?: string | null
          process_id?: string | null
          processed?: boolean | null
          processed_at?: string | null
          received_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "process_alerts_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      process_documents: {
        Row: {
          created_at: string | null
          description: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          filename: string
          id: string
          process_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          filename: string
          id?: string
          process_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          filename?: string
          id?: string
          process_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "process_documents_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          attorney_name: string | null
          case_type: string
          client_id: string | null
          closed_at: string | null
          court: string | null
          created_at: string | null
          description: string | null
          id: string
          notes: string | null
          oab_number: string | null
          process_number: string
          started_at: string | null
          status: string | null
          updated_at: string | null
          value: number | null
        }
        Insert: {
          attorney_name?: string | null
          case_type: string
          client_id?: string | null
          closed_at?: string | null
          court?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          oab_number?: string | null
          process_number: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          attorney_name?: string | null
          case_type?: string
          client_id?: string | null
          closed_at?: string | null
          court?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          oab_number?: string | null
          process_number?: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Relationships: []
      }
      product_packages: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_recommended: boolean | null
          name: string
          order_index: number | null
          price: number
          product_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_recommended?: boolean | null
          name: string
          order_index?: number | null
          price: number
          product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_recommended?: boolean | null
          name?: string
          order_index?: number | null
          price?: number
          product_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_packages_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number
          benefits: Json | null
          category: string
          created_at: string | null
          description: string | null
          documents_required: Json | null
          faq_items: Json | null
          features: Json | null
          hero_problem: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          base_price?: number
          benefits?: Json | null
          category: string
          created_at?: string | null
          description?: string | null
          documents_required?: Json | null
          faq_items?: Json | null
          features?: Json | null
          hero_problem?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          benefits?: Json | null
          category?: string
          created_at?: string | null
          description?: string | null
          documents_required?: Json | null
          faq_items?: Json | null
          features?: Json | null
          hero_problem?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          accepted_at: string | null
          adjusted_price: number
          base_price: number
          client_name: string
          created_at: string
          discount: number | null
          estimated_case_value: number | null
          id: string
          installments: number | null
          lead_id: string
          metadata: Json | null
          payment_link_id: string | null
          product_id: string
          product_name: string
          proposal_id: string
          sections: Json
          status: string | null
          updated_at: string
          valid_until: string
          viewed_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          adjusted_price: number
          base_price: number
          client_name: string
          created_at?: string
          discount?: number | null
          estimated_case_value?: number | null
          id?: string
          installments?: number | null
          lead_id: string
          metadata?: Json | null
          payment_link_id?: string | null
          product_id: string
          product_name: string
          proposal_id: string
          sections?: Json
          status?: string | null
          updated_at?: string
          valid_until: string
          viewed_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          adjusted_price?: number
          base_price?: number
          client_name?: string
          created_at?: string
          discount?: number | null
          estimated_case_value?: number | null
          id?: string
          installments?: number | null
          lead_id?: string
          metadata?: Json | null
          payment_link_id?: string | null
          product_id?: string
          product_name?: string
          proposal_id?: string
          sections?: Json
          status?: string | null
          updated_at?: string
          valid_until?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_payment_link_id_fkey"
            columns: ["payment_link_id"]
            isOneToOne: false
            referencedRelation: "payment_links"
            referencedColumns: ["id"]
          },
        ]
      }
      qualification_sessions: {
        Row: {
          agent_role: string
          answers: Json
          client_info: Json | null
          completed_at: string | null
          context: Json | null
          created_at: string
          current_question_index: number | null
          expires_at: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          product_id: string
          product_name: string
          questions: Json
          session_id: string
          source: string | null
          status: Database["public"]["Enums"]["qualification_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agent_role: string
          answers?: Json
          client_info?: Json | null
          completed_at?: string | null
          context?: Json | null
          created_at?: string
          current_question_index?: number | null
          expires_at?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          product_id: string
          product_name: string
          questions?: Json
          session_id: string
          source?: string | null
          status?: Database["public"]["Enums"]["qualification_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agent_role?: string
          answers?: Json
          client_info?: Json | null
          completed_at?: string | null
          context?: Json | null
          created_at?: string
          current_question_index?: number | null
          expires_at?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          product_id?: string
          product_name?: string
          questions?: Json
          session_id?: string
          source?: string | null
          status?: Database["public"]["Enums"]["qualification_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qualification_sessions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      qualified_leads: {
        Row: {
          answers: Json
          assigned_to: string | null
          category: string
          client_name: string | null
          contacted_at: string | null
          created_at: string | null
          email: string | null
          id: string
          last_interaction_at: string | null
          metadata: Json | null
          next_follow_up_at: string | null
          phone: string
          product_id: string
          product_name: string
          reasoning: Json | null
          score_complexity: number
          score_probability: number
          score_total: number
          score_urgency: number
          session_id: string
          source: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          answers?: Json
          assigned_to?: string | null
          category: string
          client_name?: string | null
          contacted_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_interaction_at?: string | null
          metadata?: Json | null
          next_follow_up_at?: string | null
          phone: string
          product_id: string
          product_name: string
          reasoning?: Json | null
          score_complexity: number
          score_probability: number
          score_total: number
          score_urgency: number
          session_id: string
          source: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          answers?: Json
          assigned_to?: string | null
          category?: string
          client_name?: string | null
          contacted_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_interaction_at?: string | null
          metadata?: Json | null
          next_follow_up_at?: string | null
          phone?: string
          product_id?: string
          product_name?: string
          reasoning?: Json | null
          score_complexity?: number
          score_probability?: number
          score_total?: number
          score_urgency?: number
          session_id?: string
          source?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      realtime_conversations: {
        Row: {
          assistant_messages: number | null
          converted_to_checkout: boolean | null
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          metadata: Json | null
          mode: string
          product_id: string
          session_id: string
          started_at: string
          status: string
          total_messages: number | null
          updated_at: string
          user_id: string | null
          user_messages: number | null
        }
        Insert: {
          assistant_messages?: number | null
          converted_to_checkout?: boolean | null
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          mode: string
          product_id: string
          session_id: string
          started_at?: string
          status?: string
          total_messages?: number | null
          updated_at?: string
          user_id?: string | null
          user_messages?: number | null
        }
        Update: {
          assistant_messages?: number | null
          converted_to_checkout?: boolean | null
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          mode?: string
          product_id?: string
          session_id?: string
          started_at?: string
          status?: string
          total_messages?: number | null
          updated_at?: string
          user_id?: string | null
          user_messages?: number | null
        }
        Relationships: []
      }
      realtime_messages: {
        Row: {
          audio_duration_ms: number | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          timestamp: string
          transcript_confidence: number | null
        }
        Insert: {
          audio_duration_ms?: number | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          timestamp?: string
          transcript_confidence?: number | null
        }
        Update: {
          audio_duration_ms?: number | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          timestamp?: string
          transcript_confidence?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "realtime_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "realtime_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          client_email: string
          client_name: string
          client_phone: string
          commission_amount: number | null
          commission_rate: number | null
          created_at: string | null
          id: string
          lead_id: string | null
          notes: string | null
          paid_at: string | null
          partner_id: string
          payment_reference: string | null
          potential_value: number | null
          service_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_email: string
          client_name: string
          client_phone: string
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          paid_at?: string | null
          partner_id: string
          payment_reference?: string | null
          potential_value?: number | null
          service_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_email?: string
          client_name?: string
          client_phone?: string
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          paid_at?: string | null
          partner_id?: string
          payment_reference?: string | null
          potential_value?: number | null
          service_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      review_queue: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          document_id: string
          document_type: string
          id: string
          lead_id: string | null
          priority: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          document_id: string
          document_type: string
          id?: string
          lead_id?: string | null
          priority?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          document_id?: string
          document_type?: string
          id?: string
          lead_id?: string | null
          priority?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_queue_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "generated_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_queue_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_posts: {
        Row: {
          ai_agent: string | null
          ai_generated: boolean | null
          approved_at: string | null
          approved_by: string | null
          campaign_id: string | null
          caption: string | null
          content: string
          content_type: string
          created_at: string | null
          created_by: string | null
          cta: string | null
          error_message: string | null
          generation_prompt: string | null
          hashtags: string[] | null
          id: string
          legal_area: string | null
          media_urls: string[] | null
          metadata: Json | null
          metrics: Json | null
          platform: string | null
          published_at: string | null
          scheduled_for: string | null
          status: string | null
          timezone: string | null
          title: string | null
          tokens_used: number | null
          updated_at: string | null
        }
        Insert: {
          ai_agent?: string | null
          ai_generated?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          campaign_id?: string | null
          caption?: string | null
          content: string
          content_type: string
          created_at?: string | null
          created_by?: string | null
          cta?: string | null
          error_message?: string | null
          generation_prompt?: string | null
          hashtags?: string[] | null
          id?: string
          legal_area?: string | null
          media_urls?: string[] | null
          metadata?: Json | null
          metrics?: Json | null
          platform?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          timezone?: string | null
          title?: string | null
          tokens_used?: number | null
          updated_at?: string | null
        }
        Update: {
          ai_agent?: string | null
          ai_generated?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          campaign_id?: string | null
          caption?: string | null
          content?: string
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          cta?: string | null
          error_message?: string | null
          generation_prompt?: string | null
          hashtags?: string[] | null
          id?: string
          legal_area?: string | null
          media_urls?: string[] | null
          metadata?: Json | null
          metrics?: Json | null
          platform?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          timezone?: string | null
          title?: string | null
          tokens_used?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_scheduled_posts_campaign"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "content_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price: number | null
          category: string
          created_at: string | null
          description: string | null
          features: Json | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          price_type: string | null
          short_description: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          base_price?: number | null
          category: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_type?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_type?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          document: string | null
          email: string
          email_verified: boolean | null
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          password_hash: string | null
          phone: string | null
          reset_token: string | null
          reset_token_expiry: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          document?: string | null
          email: string
          email_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name: string
          password_hash?: string | null
          phone?: string | null
          reset_token?: string | null
          reset_token_expiry?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          document?: string | null
          email?: string
          email_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          password_hash?: string | null
          phone?: string | null
          reset_token?: string | null
          reset_token_expiry?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      agent_health: {
        Row: {
          agent_category: string | null
          agent_role: string | null
          avg_response_time_1h: number | null
          errors_last_hour: number | null
          requests_last_24h: number | null
          requests_last_hour: number | null
          status: string | null
        }
        Relationships: []
      }
      agent_performance_daily: {
        Row: {
          agent_category: string | null
          agent_role: string | null
          avg_confidence: number | null
          avg_response_time_ms: number | null
          date: string | null
          failed_requests: number | null
          p95_response_time_ms: number | null
          successful_requests: number | null
          total_cost_cents: number | null
          total_requests: number | null
          total_tokens: number | null
        }
        Relationships: []
      }
      content_analytics: {
        Row: {
          avg_engagement_rate: number | null
          avg_tokens_used: number | null
          content_type: string | null
          date: string | null
          failed_count: number | null
          legal_area: string | null
          platform: string | null
          published_count: number | null
          total_clicks: number | null
          total_engagements: number | null
          total_impressions: number | null
          total_posts: number | null
        }
        Relationships: []
      }
      content_calendar: {
        Row: {
          ai_generated: boolean | null
          campaign_name: string | null
          content_type: string | null
          day_of_week: number | null
          hour_of_day: number | null
          id: string | null
          legal_area: string | null
          platform: string | null
          published_at: string | null
          scheduled_date: string | null
          scheduled_for: string | null
          status: string | null
          title: string | null
        }
        Relationships: []
      }
      follow_up_analytics: {
        Row: {
          avg_delay_seconds: number | null
          cancelled_count: number | null
          category: string | null
          count: number | null
          date: string | null
          failed_count: number | null
          sent_count: number | null
          status: string | null
        }
        Relationships: []
      }
      qualified_leads_analytics: {
        Row: {
          avg_complexity: number | null
          avg_probability: number | null
          avg_score: number | null
          avg_urgency: number | null
          category: string | null
          count: number | null
          date: string | null
          product_id: string | null
          source: string | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      follow_up_channel: "whatsapp" | "email" | "sms"
      follow_up_status:
        | "scheduled"
        | "sent"
        | "delivered"
        | "read"
        | "replied"
        | "failed"
        | "cancelled"
      lead_category: "hot" | "warm" | "cold" | "unqualified"
      lead_status: "active" | "nurturing" | "converted" | "lost" | "paused"
      qualification_status: "in_progress" | "completed" | "abandoned"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      follow_up_channel: ["whatsapp", "email", "sms"],
      follow_up_status: [
        "scheduled",
        "sent",
        "delivered",
        "read",
        "replied",
        "failed",
        "cancelled",
      ],
      lead_category: ["hot", "warm", "cold", "unqualified"],
      lead_status: ["active", "nurturing", "converted", "lost", "paused"],
      qualification_status: ["in_progress", "completed", "abandoned"],
    },
  },
} as const
