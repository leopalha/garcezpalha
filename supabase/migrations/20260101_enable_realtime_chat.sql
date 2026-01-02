-- ============================================================================
-- ENABLE REALTIME FOR CHAT
-- Habilita Supabase Realtime para chat em tempo real
-- ============================================================================

-- Habilitar realtime publication para conversations
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- Habilitar realtime publication para messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Adicionar policies para clientes visualizarem suas próprias conversas
CREATE POLICY "Clients can view their own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (
    client_id::text = auth.uid()::text
    OR
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id::text = conversations.lead_id::text
      AND leads.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Clientes podem enviar mensagens nas suas conversas
CREATE POLICY "Clients can send messages in their conversations"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id::text = messages.conversation_id::text
      AND (
        conversations.client_id::text = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM leads
          WHERE leads.id::text = conversations.lead_id::text
          AND leads.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
      )
    )
  );

-- Clientes podem visualizar mensagens das suas conversas
CREATE POLICY "Clients can view messages in their conversations"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id::text = messages.conversation_id::text
      AND (
        conversations.client_id::text = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM leads
          WHERE leads.id::text = conversations.lead_id::text
          AND leads.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
      )
    )
  );

-- Function para atualizar last_message_at automaticamente
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET
    last_message_at = NEW.created_at,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar last_message_at
DROP TRIGGER IF EXISTS update_conversation_last_message_trigger ON messages;
CREATE TRIGGER update_conversation_last_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Comentários
COMMENT ON POLICY "Clients can view their own conversations" ON conversations IS 'Permite clientes visualizarem suas próprias conversas';
COMMENT ON POLICY "Clients can send messages in their conversations" ON messages IS 'Permite clientes enviarem mensagens nas suas conversas';
COMMENT ON POLICY "Clients can view messages in their conversations" ON messages IS 'Permite clientes visualizarem mensagens das suas conversas';
