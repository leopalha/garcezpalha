-- Migration: 020_scheduled_posts.sql
-- Description: Create tables for automated content publishing
-- Created: 2024-12-23

-- =============================================================================
-- SCHEDULED POSTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Content information
  content_type TEXT NOT NULL CHECK (content_type IN (
    'social-post', 'blog-article', 'newsletter', 'video-script', 'ad-copy', 'email'
  )),
  platform TEXT CHECK (platform IN (
    'instagram', 'linkedin', 'facebook', 'twitter', 'tiktok', 'youtube', 'blog', 'email'
  )),

  -- Content data
  title TEXT,
  content TEXT NOT NULL,
  caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  cta TEXT,
  media_urls TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Scheduling
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  timezone TEXT DEFAULT 'America/Sao_Paulo',

  -- Status tracking
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_review', 'approved', 'scheduled', 'publishing', 'published', 'failed', 'cancelled'
  )),
  error_message TEXT,

  -- Legal area and campaign
  legal_area TEXT,
  campaign_id UUID,

  -- Approval workflow
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,

  -- AI generation info
  ai_generated BOOLEAN DEFAULT true,
  ai_agent TEXT DEFAULT 'content',
  generation_prompt TEXT,
  tokens_used INTEGER,

  -- Performance metrics (populated after publishing)
  metrics JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_platform ON scheduled_posts(platform);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_for ON scheduled_posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_content_type ON scheduled_posts(content_type);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_legal_area ON scheduled_posts(legal_area);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_created_by ON scheduled_posts(created_by);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_pending_publish
  ON scheduled_posts(status, scheduled_for)
  WHERE status = 'scheduled' AND scheduled_for IS NOT NULL;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_scheduled_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS scheduled_posts_updated_at ON scheduled_posts;
CREATE TRIGGER scheduled_posts_updated_at
  BEFORE UPDATE ON scheduled_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_scheduled_posts_updated_at();

-- =============================================================================
-- CONTENT CAMPAIGNS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS content_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Campaign info
  name TEXT NOT NULL,
  description TEXT,
  goal TEXT,

  -- Targeting
  platforms TEXT[] DEFAULT '{}',
  legal_areas TEXT[] DEFAULT '{}',
  target_audience TEXT,

  -- Timeline
  start_date DATE,
  end_date DATE,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'active', 'paused', 'completed', 'cancelled'
  )),

  -- Budget
  budget_cents INTEGER,
  spend_cents INTEGER DEFAULT 0,

  -- Performance
  metrics JSONB DEFAULT '{}'::jsonb,

  -- Management
  created_by UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_campaigns_status ON content_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_content_campaigns_dates ON content_campaigns(start_date, end_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_content_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS content_campaigns_updated_at ON content_campaigns;
CREATE TRIGGER content_campaigns_updated_at
  BEFORE UPDATE ON content_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_content_campaigns_updated_at();

-- Add foreign key for campaign_id
ALTER TABLE scheduled_posts
  ADD CONSTRAINT fk_scheduled_posts_campaign
  FOREIGN KEY (campaign_id)
  REFERENCES content_campaigns(id)
  ON DELETE SET NULL;

-- =============================================================================
-- CONTENT CALENDAR VIEW
-- =============================================================================

CREATE OR REPLACE VIEW content_calendar AS
SELECT
  sp.id,
  sp.content_type,
  sp.platform,
  sp.title,
  sp.status,
  sp.scheduled_for,
  sp.published_at,
  sp.legal_area,
  sp.ai_generated,
  cc.name as campaign_name,
  DATE(sp.scheduled_for) as scheduled_date,
  EXTRACT(DOW FROM sp.scheduled_for) as day_of_week,
  EXTRACT(HOUR FROM sp.scheduled_for) as hour_of_day
FROM scheduled_posts sp
LEFT JOIN content_campaigns cc ON sp.campaign_id = cc.id
ORDER BY sp.scheduled_for ASC;

-- =============================================================================
-- CONTENT ANALYTICS VIEW
-- =============================================================================

CREATE OR REPLACE VIEW content_analytics AS
SELECT
  DATE(published_at) as date,
  platform,
  content_type,
  legal_area,
  COUNT(*) as total_posts,
  COUNT(*) FILTER (WHERE status = 'published') as published_count,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
  AVG(tokens_used) as avg_tokens_used,
  SUM((metrics->>'impressions')::int) as total_impressions,
  SUM((metrics->>'engagements')::int) as total_engagements,
  SUM((metrics->>'clicks')::int) as total_clicks,
  AVG(((metrics->>'engagements')::float / NULLIF((metrics->>'impressions')::float, 0)) * 100) as avg_engagement_rate
FROM scheduled_posts
WHERE published_at IS NOT NULL
GROUP BY DATE(published_at), platform, content_type, legal_area;

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_campaigns ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage all posts
CREATE POLICY "Admins can manage all scheduled posts"
  ON scheduled_posts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy: Users can view their own posts
CREATE POLICY "Users can view own scheduled posts"
  ON scheduled_posts
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Policy: Users can create posts
CREATE POLICY "Users can create scheduled posts"
  ON scheduled_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Admins can manage all campaigns
CREATE POLICY "Admins can manage all campaigns"
  ON content_campaigns
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

GRANT SELECT, INSERT, UPDATE ON scheduled_posts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON content_campaigns TO authenticated;
GRANT SELECT ON content_calendar TO authenticated;
GRANT SELECT ON content_analytics TO authenticated;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE scheduled_posts IS 'Stores AI-generated and manually created content for scheduling and publishing';
COMMENT ON TABLE content_campaigns IS 'Organizes content into marketing campaigns';
COMMENT ON VIEW content_calendar IS 'Calendar view of all scheduled and published content';
COMMENT ON VIEW content_analytics IS 'Analytics aggregation for content performance';
COMMENT ON COLUMN scheduled_posts.status IS 'Content lifecycle: draft -> pending_review -> approved -> scheduled -> publishing -> published';
COMMENT ON COLUMN scheduled_posts.metrics IS 'Post-publish metrics: impressions, engagements, clicks, shares, etc.';
