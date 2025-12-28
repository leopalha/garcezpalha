/**
 * Messages Table Migration
 * Creates table for storing conversation message history
 */

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_role ON public.messages(role);

-- Add foreign key constraint (if conversations table exists)
-- Note: This will fail silently if conversations table doesn't exist yet
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversations') THEN
    ALTER TABLE public.messages
    ADD CONSTRAINT fk_messages_conversation
    FOREIGN KEY (conversation_id)
    REFERENCES public.conversations(conversation_id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (only if profiles table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    -- Admin and lawyers can view all messages
    EXECUTE 'CREATE POLICY "Admin and lawyers can view all messages"
      ON public.messages
      FOR SELECT
      USING (
        auth.uid() IN (
          SELECT id FROM public.profiles WHERE role IN (''admin'', ''lawyer'')
        )
      )';

    -- Admin and lawyers can update messages
    EXECUTE 'CREATE POLICY "Admin and lawyers can update messages"
      ON public.messages
      FOR UPDATE
      USING (
        auth.uid() IN (
          SELECT id FROM public.profiles WHERE role IN (''admin'', ''lawyer'')
        )
      )';
  END IF;
END $$;

-- System can insert messages (always allow inserts for service role)
CREATE POLICY "System can insert messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_messages_updated_at_trigger
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_messages_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages TO service_role;

-- Create view for recent messages (optional, for analytics, only if conversations table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conversations') THEN
    EXECUTE 'CREATE OR REPLACE VIEW public.recent_messages AS
      SELECT
        m.*,
        c.channel,
        c.client
      FROM public.messages m
      LEFT JOIN public.conversations c ON m.conversation_id = c.conversation_id
      WHERE m.created_at > NOW() - INTERVAL ''7 days''
      ORDER BY m.created_at DESC';

    EXECUTE 'GRANT SELECT ON public.recent_messages TO authenticated';
  END IF;
END $$;
