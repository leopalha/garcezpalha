-- ============================================================================
-- UX-014: OAuth Integrations - Credentials Storage
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.integration_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'whatsapp', 'stripe')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scope TEXT,
  provider_user_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Indexes
CREATE INDEX idx_integration_credentials_user_id ON public.integration_credentials(user_id);
CREATE INDEX idx_integration_credentials_provider ON public.integration_credentials(provider);
CREATE INDEX idx_integration_credentials_expires_at ON public.integration_credentials(expires_at) WHERE expires_at IS NOT NULL;

-- RLS Policies
ALTER TABLE public.integration_credentials ENABLE ROW LEVEL SECURITY;

-- Users can only see their own credentials
CREATE POLICY "Users can view own credentials"
  ON public.integration_credentials FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own credentials
CREATE POLICY "Users can insert own credentials"
  ON public.integration_credentials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own credentials
CREATE POLICY "Users can update own credentials"
  ON public.integration_credentials FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own credentials
CREATE POLICY "Users can delete own credentials"
  ON public.integration_credentials FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_integration_credentials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER integration_credentials_updated_at
  BEFORE UPDATE ON public.integration_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_integration_credentials_updated_at();

COMMENT ON TABLE public.integration_credentials IS 'OAuth and API credentials for external integrations';
COMMENT ON COLUMN public.integration_credentials.provider IS 'Integration provider: google, whatsapp, stripe';
COMMENT ON COLUMN public.integration_credentials.access_token IS 'OAuth access token (encrypted in production)';
COMMENT ON COLUMN public.integration_credentials.refresh_token IS 'OAuth refresh token for token renewal';
COMMENT ON COLUMN public.integration_credentials.expires_at IS 'Token expiration timestamp';
COMMENT ON COLUMN public.integration_credentials.metadata IS 'Provider-specific metadata (email, name, etc.)';
