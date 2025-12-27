-- ============================================================================
-- CONVERSATIONS TABLE
-- Multi-channel conversations (WhatsApp, Email, Web Chat, Phone)
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'chatbot', 'email', 'phone', 'web_chat')),
  external_id TEXT, -- WhatsApp phone number, email address, etc.
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'bot', 'waiting_human', 'human', 'resolved', 'closed', 'archived')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  taken_over_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  agent_used TEXT,
  qualification_score INTEGER CHECK (qualification_score >= 0 AND qualification_score <= 100),
  needs_attention BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  last_message_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- MESSAGES TABLE
-- Individual messages within conversations
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('lead', 'client', 'agent', 'bot', 'ai', 'system')),
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document', 'audio', 'video', 'system')),
  channel TEXT CHECK (channel IN ('whatsapp', 'email', 'web_chat', 'phone')),
  external_message_id TEXT, -- ID from external system (WhatsApp message ID, etc.)
  metadata JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON conversations(channel);
CREATE INDEX IF NOT EXISTS idx_conversations_assigned_to ON conversations(assigned_to);
CREATE INDEX IF NOT EXISTS idx_conversations_needs_attention ON conversations(needs_attention) WHERE needs_attention = TRUE;
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_type ON messages(sender_type);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_external_id ON messages(external_message_id) WHERE external_message_id IS NOT NULL;

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_conversations_updated_at();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Conversations: Admins can view all
CREATE POLICY "Admins can view all conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Conversations: Admins can update all
CREATE POLICY "Admins can update all conversations"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Conversations: System can insert (for bots)
CREATE POLICY "System can insert conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- Messages: Admins can view all
CREATE POLICY "Admins can view all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Messages: System can insert (for bots and APIs)
CREATE POLICY "System can insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE conversations IS 'Multi-channel conversations with leads and clients';
COMMENT ON COLUMN conversations.status IS 'Conversation status: bot (handled by bot), waiting_human (needs human), human (taken over), resolved, closed';
COMMENT ON COLUMN conversations.channel IS 'Communication channel: whatsapp, email, web_chat, phone';
COMMENT ON COLUMN conversations.qualification_score IS 'Lead qualification score (0-100)';
COMMENT ON COLUMN conversations.needs_attention IS 'Flagged for urgent human attention';

COMMENT ON TABLE messages IS 'Individual messages within conversations';
COMMENT ON COLUMN messages.sender_type IS 'Who sent the message: lead, client, agent, bot, system';
COMMENT ON COLUMN messages.external_message_id IS 'ID from external system (WhatsApp, etc.) to prevent duplicates';
