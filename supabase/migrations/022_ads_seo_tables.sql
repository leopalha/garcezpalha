-- Migration: 022_ads_seo_tables.sql
-- Description: Create tables for Ads and SEO management
-- Created: 2024-12-24

-- =============================================================================
-- ADS CAMPAIGNS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS ad_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Campaign info
  platform TEXT NOT NULL CHECK (platform IN ('google', 'meta')),
  name TEXT NOT NULL,
  legal_area TEXT,
  objective TEXT CHECK (objective IN ('leads', 'traffic', 'awareness', 'engagement')),

  -- Budget
  budget_daily NUMERIC(10,2),
  budget_monthly NUMERIC(10,2),

  -- Campaign data (full AI-generated structure)
  campaign_data JSONB DEFAULT '{}'::jsonb,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_review', 'approved', 'active', 'paused', 'completed', 'rejected'
  )),

  -- External IDs (when synced with platforms)
  google_campaign_id TEXT,
  meta_campaign_id TEXT,

  -- Audit
  created_by TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_platform ON ad_campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_legal_area ON ad_campaigns(legal_area);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_created ON ad_campaigns(created_at);

-- =============================================================================
-- AD OPTIMIZATIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS ad_optimizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Reference
  campaign_id UUID REFERENCES ad_campaigns(id),

  -- Optimization info
  optimization_type TEXT NOT NULL CHECK (optimization_type IN (
    'campaign', 'keywords', 'budget', 'audience', 'adcopy'
  )),

  -- Results
  score INTEGER,
  health_status TEXT CHECK (health_status IN ('excellent', 'good', 'needs_attention', 'critical')),
  recommendations JSONB DEFAULT '[]'::jsonb,

  -- Status
  applied BOOLEAN DEFAULT false,
  applied_at TIMESTAMPTZ,
  applied_by UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ad_optimizations_campaign ON ad_optimizations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_optimizations_type ON ad_optimizations(optimization_type);

-- =============================================================================
-- AD REPORTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS ad_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Report info
  report_type TEXT NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly', 'lead-quality')),
  period_start DATE,
  period_end DATE,

  -- Summary
  summary TEXT,

  -- Metrics
  metrics JSONB DEFAULT '{}'::jsonb,

  -- Full report data
  report_data JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ad_reports_type ON ad_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_ad_reports_period ON ad_reports(period_start, period_end);

-- =============================================================================
-- SEO KEYWORD RESEARCH TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS seo_keyword_research (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Research context
  legal_area TEXT NOT NULL,

  -- Keywords
  primary_keywords JSONB DEFAULT '[]'::jsonb,
  longtail_keywords JSONB DEFAULT '[]'::jsonb,
  question_keywords JSONB DEFAULT '[]'::jsonb,
  local_keywords JSONB DEFAULT '[]'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_seo_keywords_legal_area ON seo_keyword_research(legal_area);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_created ON seo_keyword_research(created_at);

-- =============================================================================
-- SEO PAGE OPTIMIZATIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS seo_page_optimizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Page info
  url TEXT NOT NULL,
  target_keyword TEXT NOT NULL,

  -- Scores
  current_score INTEGER,
  optimized_score INTEGER,

  -- Suggestions
  title_suggested TEXT,
  meta_suggested TEXT,
  recommendations JSONB DEFAULT '[]'::jsonb,
  technical_issues JSONB DEFAULT '[]'::jsonb,

  -- Status
  applied BOOLEAN DEFAULT false,
  applied_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_seo_optimizations_url ON seo_page_optimizations(url);
CREATE INDEX IF NOT EXISTS idx_seo_optimizations_keyword ON seo_page_optimizations(target_keyword);

-- =============================================================================
-- SEO CONTENT BRIEFS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS seo_content_briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Brief info
  topic TEXT NOT NULL,
  target_keyword TEXT NOT NULL,
  legal_area TEXT,

  -- SEO elements
  title_suggested TEXT,
  meta_suggested TEXT,
  outline JSONB DEFAULT '[]'::jsonb,
  word_count_target JSONB DEFAULT '{}'::jsonb,

  -- Full brief data
  brief_data JSONB DEFAULT '{}'::jsonb,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'published')),

  -- References
  content_id UUID, -- Link to actual content when created

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_seo_briefs_keyword ON seo_content_briefs(target_keyword);
CREATE INDEX IF NOT EXISTS idx_seo_briefs_legal_area ON seo_content_briefs(legal_area);
CREATE INDEX IF NOT EXISTS idx_seo_briefs_status ON seo_content_briefs(status);

-- =============================================================================
-- SEO AUDITS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS seo_audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Audit info
  audit_type TEXT NOT NULL CHECK (audit_type IN ('technical', 'local', 'backlinks', 'architecture')),

  -- Results
  overall_score INTEGER,
  critical_issues INTEGER DEFAULT 0,
  warnings INTEGER DEFAULT 0,

  -- Full audit data
  audit_data JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_seo_audits_type ON seo_audits(audit_type);
CREATE INDEX IF NOT EXISTS idx_seo_audits_created ON seo_audits(created_at);

-- =============================================================================
-- SEO REPORTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS seo_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Report info
  report_type TEXT NOT NULL CHECK (report_type IN ('monthly', 'quarterly', 'yearly')),
  period_month TEXT,
  period_year INTEGER,

  -- Summary
  summary TEXT,

  -- Key metrics
  organic_sessions INTEGER,
  session_change NUMERIC(5,2),
  keywords_top3 INTEGER,
  keywords_top10 INTEGER,
  organic_leads INTEGER,
  domain_authority INTEGER,

  -- Full report data
  report_data JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_seo_reports_type ON seo_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_seo_reports_period ON seo_reports(period_year, period_month);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Update timestamp trigger for ad_campaigns
CREATE OR REPLACE FUNCTION update_ad_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ad_campaigns_updated_at ON ad_campaigns;
CREATE TRIGGER ad_campaigns_updated_at
  BEFORE UPDATE ON ad_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_ad_campaigns_updated_at();

-- Update timestamp trigger for seo_content_briefs
CREATE OR REPLACE FUNCTION update_seo_briefs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS seo_briefs_updated_at ON seo_content_briefs;
CREATE TRIGGER seo_briefs_updated_at
  BEFORE UPDATE ON seo_content_briefs
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_briefs_updated_at();

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keyword_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_page_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_content_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_reports ENABLE ROW LEVEL SECURITY;

-- Admin policies for all tables
CREATE POLICY "Admins can manage ad_campaigns"
  ON ad_campaigns FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage ad_optimizations"
  ON ad_optimizations FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage ad_reports"
  ON ad_reports FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage seo_keyword_research"
  ON seo_keyword_research FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage seo_page_optimizations"
  ON seo_page_optimizations FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage seo_content_briefs"
  ON seo_content_briefs FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage seo_audits"
  ON seo_audits FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage seo_reports"
  ON seo_reports FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Service insert policies
CREATE POLICY "Service can insert ad_campaigns"
  ON ad_campaigns FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service can insert ad_optimizations"
  ON ad_optimizations FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service can insert ad_reports"
  ON ad_reports FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service can insert seo_keyword_research"
  ON seo_keyword_research FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service can insert seo_page_optimizations"
  ON seo_page_optimizations FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service can insert seo_content_briefs"
  ON seo_content_briefs FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service can insert seo_audits"
  ON seo_audits FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service can insert seo_reports"
  ON seo_reports FOR INSERT TO authenticated
  WITH CHECK (true);

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

GRANT SELECT, INSERT, UPDATE ON ad_campaigns TO authenticated;
GRANT SELECT, INSERT ON ad_optimizations TO authenticated;
GRANT SELECT, INSERT ON ad_reports TO authenticated;
GRANT SELECT, INSERT ON seo_keyword_research TO authenticated;
GRANT SELECT, INSERT, UPDATE ON seo_page_optimizations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON seo_content_briefs TO authenticated;
GRANT SELECT, INSERT ON seo_audits TO authenticated;
GRANT SELECT, INSERT ON seo_reports TO authenticated;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE ad_campaigns IS 'Stores AI-generated ad campaigns for Google and Meta';
COMMENT ON TABLE ad_optimizations IS 'Stores AI optimization recommendations for campaigns';
COMMENT ON TABLE ad_reports IS 'Stores periodic ads performance reports';
COMMENT ON TABLE seo_keyword_research IS 'Stores keyword research results by legal area';
COMMENT ON TABLE seo_page_optimizations IS 'Stores on-page SEO optimization recommendations';
COMMENT ON TABLE seo_content_briefs IS 'Stores AI-generated content briefs for SEO';
COMMENT ON TABLE seo_audits IS 'Stores technical, local, and backlink SEO audits';
COMMENT ON TABLE seo_reports IS 'Stores monthly SEO performance reports';
