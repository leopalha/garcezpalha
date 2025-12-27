-- Migration: Add State Machine columns to conversations table
-- Date: 2025-12-27
-- Purpose: Extend existing conversations table to support Agent State Machine

-- Add new columns for State Machine (non-breaking migration)
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS conversation_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS client JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS classification JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS qualification JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS proposal JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS state_status JSONB DEFAULT '{"state": "greeting", "updated_at": null}'::jsonb;

-- Create index on conversation_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_conversations_conversation_id ON public.conversations(conversation_id);

-- Create index on state for filtering
CREATE INDEX IF NOT EXISTS idx_conversations_state ON public.conversations((state_status->>'state'));

-- Create index on channel (already exists, but ensuring it's there)
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON public.conversations(channel);

-- Update RLS policies to allow state machine operations
-- Allow service role to read/write all conversations (for state machine)
CREATE POLICY "Service role can manage all conversations"
  ON public.conversations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to generate conversation_id if not provided
CREATE OR REPLACE FUNCTION generate_conversation_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.conversation_id IS NULL THEN
    -- Generate conversation_id based on channel and external_id
    NEW.conversation_id := CASE
      WHEN NEW.channel = 'whatsapp' THEN 'whatsapp:' || COALESCE(NEW.external_id, NEW.id::text)
      WHEN NEW.channel = 'chatbot' THEN 'website:' || NEW.id::text
      WHEN NEW.channel = 'email' THEN 'email:' || COALESCE(NEW.email, NEW.id::text)
      WHEN NEW.channel = 'phone' THEN 'phone:' || COALESCE(NEW.phone_number, NEW.id::text)
      ELSE NEW.channel || ':' || NEW.id::text
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate conversation_id
DROP TRIGGER IF EXISTS generate_conversation_id_trigger ON public.conversations;
CREATE TRIGGER generate_conversation_id_trigger
  BEFORE INSERT ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION generate_conversation_id();

-- Update existing rows to have conversation_id
UPDATE public.conversations
SET conversation_id = CASE
  WHEN channel = 'whatsapp' THEN 'whatsapp:' || COALESCE(external_id, id::text)
  WHEN channel = 'chatbot' THEN 'website:' || id::text
  WHEN channel = 'email' THEN 'email:' || COALESCE(email, id::text)
  WHEN channel = 'phone' THEN 'phone:' || COALESCE(phone_number, id::text)
  ELSE channel || ':' || id::text
END
WHERE conversation_id IS NULL;

-- Add comment
COMMENT ON COLUMN public.conversations.conversation_id IS 'Unique identifier for state machine (format: channel:external_id)';
COMMENT ON COLUMN public.conversations.client IS 'Client information extracted from conversation (name, cpf, email, phone, city, state)';
COMMENT ON COLUMN public.conversations.classification IS 'Agent classification (area, product, agent_assigned, confidence)';
COMMENT ON COLUMN public.conversations.qualification IS 'Qualification data (status, questions_answered, total_questions, score, flags)';
COMMENT ON COLUMN public.conversations.proposal IS 'Proposal data (package, value, discount, payment_link, proposal_text, sent_at)';
COMMENT ON COLUMN public.conversations.state_status IS 'State machine status (state, updated_at, escalation_reason, abandoned_reason, rejection_reason)';

-- Create view for easier state machine queries
CREATE OR REPLACE VIEW conversation_state_machine AS
SELECT
  id,
  conversation_id,
  channel,
  phone_number,
  email,
  client,
  classification,
  qualification,
  proposal,
  state_status,
  state_status->>'state' AS current_state,
  (state_status->>'updated_at')::timestamptz AS state_updated_at,
  last_message_at,
  created_at,
  updated_at
FROM public.conversations
WHERE conversation_id IS NOT NULL;

COMMENT ON VIEW conversation_state_machine IS 'Simplified view of conversations for state machine operations';
