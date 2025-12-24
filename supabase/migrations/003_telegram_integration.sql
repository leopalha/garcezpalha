-- Garcez Palha Telegram Integration Schema
-- Migration: 003_telegram_integration
-- Date: 2025-11-18
-- Purpose: Add tables for Telegram bot conversations and messages

-- ==========================================
-- TELEGRAM CONVERSATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS telegram_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id BIGINT NOT NULL UNIQUE, -- Telegram chat ID
  user_id UUID REFERENCES users(id), -- Link to user if registered
  lead_id UUID REFERENCES leads(id), -- Link to lead if qualified

  -- User info from Telegram
  telegram_user_id BIGINT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  username TEXT,

  -- Conversation metadata
  platform TEXT DEFAULT 'telegram' CHECK (platform IN ('telegram', 'whatsapp', 'web')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'qualified', 'converted', 'closed')),
  language_code TEXT DEFAULT 'pt', -- User's Telegram language

  -- Lead qualification
  is_qualified BOOLEAN DEFAULT FALSE,
  qualification_score INTEGER DEFAULT 0, -- 0-100 score
  qualification_reason TEXT,
  qualified_at TIMESTAMPTZ,

  -- Admin handoff
  assigned_to UUID REFERENCES users(id), -- Admin user taking over
  handoff_at TIMESTAMPTZ,
  handoff_reason TEXT,
  is_bot_active BOOLEAN DEFAULT TRUE, -- false when admin takes over

  -- Timestamps
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_telegram_conversations_chat_id ON telegram_conversations(chat_id);
CREATE INDEX idx_telegram_conversations_user_id ON telegram_conversations(user_id);
CREATE INDEX idx_telegram_conversations_lead_id ON telegram_conversations(lead_id);
CREATE INDEX idx_telegram_conversations_status ON telegram_conversations(status);
CREATE INDEX idx_telegram_conversations_assigned ON telegram_conversations(assigned_to);
CREATE INDEX idx_telegram_conversations_last_message ON telegram_conversations(last_message_at DESC);

-- ==========================================
-- TELEGRAM MESSAGES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS telegram_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES telegram_conversations(id) ON DELETE CASCADE,

  -- Telegram message info
  telegram_message_id BIGINT NOT NULL,
  chat_id BIGINT NOT NULL,

  -- Message content
  direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'photo', 'video', 'document', 'location', 'contact', 'voice', 'sticker')),
  text TEXT,
  media_url TEXT,
  media_type TEXT,

  -- Sender info
  from_user_id BIGINT NOT NULL,
  from_first_name TEXT,
  from_username TEXT,
  is_bot BOOLEAN DEFAULT FALSE,

  -- AI processing
  ai_processed BOOLEAN DEFAULT FALSE,
  ai_response TEXT,
  ai_intent TEXT, -- detected intent (greeting, inquiry, booking, complaint, etc.)
  ai_entities JSONB, -- extracted entities (name, phone, email, service, etc.)
  ai_sentiment TEXT CHECK (ai_sentiment IN ('positive', 'neutral', 'negative')),

  -- Message metadata
  reply_to_message_id BIGINT,
  forwarded_from BIGINT,
  edit_date TIMESTAMPTZ,

  -- Timestamps
  telegram_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_telegram_messages_conversation ON telegram_messages(conversation_id);
CREATE INDEX idx_telegram_messages_chat_id ON telegram_messages(chat_id);
CREATE INDEX idx_telegram_messages_direction ON telegram_messages(direction);
CREATE INDEX idx_telegram_messages_telegram_date ON telegram_messages(telegram_date DESC);
CREATE INDEX idx_telegram_messages_ai_intent ON telegram_messages(ai_intent);

-- ==========================================
-- UPDATE LEADS TABLE
-- ==========================================
-- Add telegram source to leads table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'leads_source_check'
  ) THEN
    ALTER TABLE leads
    DROP CONSTRAINT IF EXISTS leads_source_check;

    ALTER TABLE leads
    ADD CONSTRAINT leads_source_check
    CHECK (source IN ('website', 'whatsapp', 'telegram', 'chatbot', 'referral', 'social', 'other'));
  END IF;
END $$;

-- ==========================================
-- ROW LEVEL SECURITY POLICIES
-- ==========================================

-- Enable RLS on telegram tables
ALTER TABLE telegram_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_messages ENABLE ROW LEVEL SECURITY;

-- Admins and lawyers can see all conversations
CREATE POLICY telegram_conversations_select_admin
  ON telegram_conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'lawyer')
    )
  );

-- Users can see their own conversations
CREATE POLICY telegram_conversations_select_own
  ON telegram_conversations FOR SELECT
  USING (user_id = auth.uid());

-- Bot service can insert/update conversations (service role)
CREATE POLICY telegram_conversations_insert_service
  ON telegram_conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY telegram_conversations_update_service
  ON telegram_conversations FOR UPDATE
  USING (true);

-- Admins and lawyers can see all messages
CREATE POLICY telegram_messages_select_admin
  ON telegram_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'lawyer')
    )
  );

-- Users can see their own messages
CREATE POLICY telegram_messages_select_own
  ON telegram_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM telegram_conversations
      WHERE telegram_conversations.id = telegram_messages.conversation_id
      AND telegram_conversations.user_id = auth.uid()
    )
  );

-- Bot service can insert messages (service role)
CREATE POLICY telegram_messages_insert_service
  ON telegram_messages FOR INSERT
  WITH CHECK (true);

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Function to update conversation's last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE telegram_conversations
  SET last_message_at = NEW.telegram_date,
      updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_message_at when new message is inserted
CREATE TRIGGER trigger_update_conversation_last_message
  AFTER INSERT ON telegram_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Function to automatically create lead from qualified conversation
CREATE OR REPLACE FUNCTION create_lead_from_telegram()
RETURNS TRIGGER AS $$
DECLARE
  v_email TEXT;
  v_phone TEXT;
  v_service TEXT;
  v_lead_id UUID;
BEGIN
  -- Only proceed if conversation is being qualified
  IF NEW.is_qualified = TRUE AND OLD.is_qualified = FALSE THEN

    -- Extract contact info from messages (simplified - can be enhanced with AI)
    SELECT
      (ai_entities->>'email')::TEXT,
      (ai_entities->>'phone')::TEXT,
      (ai_entities->>'service')::TEXT
    INTO v_email, v_phone, v_service
    FROM telegram_messages
    WHERE conversation_id = NEW.id
      AND ai_entities IS NOT NULL
      AND (ai_entities ? 'email' OR ai_entities ? 'phone')
    ORDER BY created_at DESC
    LIMIT 1;

    -- Create lead if we have minimal info
    IF v_phone IS NOT NULL OR v_email IS NOT NULL THEN
      INSERT INTO leads (
        name,
        email,
        phone,
        message,
        service_type,
        source,
        status,
        priority
      ) VALUES (
        NEW.first_name || COALESCE(' ' || NEW.last_name, ''),
        COALESCE(v_email, 'telegram_' || NEW.telegram_user_id || '@placeholder.com'),
        COALESCE(v_phone, ''),
        'Lead qualificado via Telegram',
        v_service,
        'telegram',
        'qualified',
        'medium'
      )
      RETURNING id INTO v_lead_id;

      -- Link lead back to conversation
      UPDATE telegram_conversations
      SET lead_id = v_lead_id
      WHERE id = NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create lead when conversation is qualified
CREATE TRIGGER trigger_create_lead_from_telegram
  AFTER UPDATE ON telegram_conversations
  FOR EACH ROW
  EXECUTE FUNCTION create_lead_from_telegram();

-- ==========================================
-- COMMENTS
-- ==========================================
COMMENT ON TABLE telegram_conversations IS 'Stores Telegram bot conversation sessions';
COMMENT ON TABLE telegram_messages IS 'Stores individual messages from Telegram conversations';
COMMENT ON COLUMN telegram_conversations.qualification_score IS 'AI-calculated lead quality score (0-100)';
COMMENT ON COLUMN telegram_messages.ai_entities IS 'JSON object with extracted entities like {name, phone, email, service}';
