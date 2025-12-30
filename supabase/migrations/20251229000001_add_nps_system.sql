-- Migration: Add NPS System
-- Description: Adds NPS tracking columns to conversations table and creates nps_responses table
-- Date: 2025-12-29
-- Related: P1-004 Email Templates (NPS Survey Implementation)

-- =====================================================
-- 1. Add NPS columns to conversations table
-- =====================================================

-- Add nps_sent flag to track if NPS email was sent
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS nps_sent BOOLEAN DEFAULT false;

-- Add timestamp for when NPS email was sent
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS nps_sent_at TIMESTAMPTZ;

-- Add NPS score (0-10)
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 10);

-- Add NPS feedback text
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS nps_feedback TEXT;

-- Add NPS category (detractor, passive, promoter)
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS nps_category VARCHAR(20) CHECK (nps_category IN ('detractor', 'passive', 'promoter'));

-- Add timestamp for when NPS was submitted by client
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS nps_submitted_at TIMESTAMPTZ;

-- =====================================================
-- 2. Create nps_responses table for analytics
-- =====================================================

CREATE TABLE IF NOT EXISTS nps_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),
  feedback TEXT,
  category VARCHAR(20) NOT NULL CHECK (category IN ('detractor', 'passive', 'promoter')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Foreign key to conversations (optional, depends on your FK strategy)
  CONSTRAINT fk_conversation
    FOREIGN KEY (conversation_id)
    REFERENCES conversations(conversation_id)
    ON DELETE CASCADE
);

-- =====================================================
-- 3. Create indexes for performance
-- =====================================================

-- Index for finding conversations that need NPS survey
CREATE INDEX IF NOT EXISTS idx_conversations_nps_pending
ON conversations(nps_sent, updated_at)
WHERE nps_sent IS NULL OR nps_sent = false;

-- Index for NPS analytics by category
CREATE INDEX IF NOT EXISTS idx_conversations_nps_category
ON conversations(nps_category)
WHERE nps_category IS NOT NULL;

-- Index for NPS analytics by score
CREATE INDEX IF NOT EXISTS idx_conversations_nps_score
ON conversations(nps_score)
WHERE nps_score IS NOT NULL;

-- Index for nps_responses lookups
CREATE INDEX IF NOT EXISTS idx_nps_responses_conversation
ON nps_responses(conversation_id);

CREATE INDEX IF NOT EXISTS idx_nps_responses_category
ON nps_responses(category);

CREATE INDEX IF NOT EXISTS idx_nps_responses_submitted_at
ON nps_responses(submitted_at DESC);

-- =====================================================
-- 4. Add comments for documentation
-- =====================================================

COMMENT ON COLUMN conversations.nps_sent IS 'Flag indicating if NPS survey email was sent to client';
COMMENT ON COLUMN conversations.nps_sent_at IS 'Timestamp when NPS survey email was sent';
COMMENT ON COLUMN conversations.nps_score IS 'NPS score from 0 (not likely to recommend) to 10 (very likely to recommend)';
COMMENT ON COLUMN conversations.nps_feedback IS 'Optional feedback text provided by client with NPS score';
COMMENT ON COLUMN conversations.nps_category IS 'NPS category: detractor (0-6), passive (7-8), promoter (9-10)';
COMMENT ON COLUMN conversations.nps_submitted_at IS 'Timestamp when client submitted NPS response';

COMMENT ON TABLE nps_responses IS 'NPS survey responses for analytics and reporting';
COMMENT ON COLUMN nps_responses.score IS 'NPS score from 0-10';
COMMENT ON COLUMN nps_responses.category IS 'Calculated category: detractor (0-6), passive (7-8), promoter (9-10)';

-- =====================================================
-- 5. Create view for NPS analytics
-- =====================================================

CREATE OR REPLACE VIEW nps_analytics AS
SELECT
  COUNT(*) as total_responses,
  AVG(nps_score) as average_score,
  COUNT(*) FILTER (WHERE nps_category = 'promoter') as promoters,
  COUNT(*) FILTER (WHERE nps_category = 'passive') as passives,
  COUNT(*) FILTER (WHERE nps_category = 'detractor') as detractors,
  -- NPS Score = % Promoters - % Detractors
  ROUND(
    (COUNT(*) FILTER (WHERE nps_category = 'promoter')::DECIMAL / NULLIF(COUNT(*), 0) * 100) -
    (COUNT(*) FILTER (WHERE nps_category = 'detractor')::DECIMAL / NULLIF(COUNT(*), 0) * 100),
    2
  ) as nps_score_percentage,
  DATE_TRUNC('month', nps_submitted_at) as month
FROM conversations
WHERE nps_score IS NOT NULL
GROUP BY DATE_TRUNC('month', nps_submitted_at)
ORDER BY month DESC;

COMMENT ON VIEW nps_analytics IS 'Monthly NPS analytics including NPS score calculation (% promoters - % detractors)';

-- =====================================================
-- Migration Complete
-- =====================================================

-- Example queries:
--
-- Find conversations needing NPS survey (7+ days after completion):
-- SELECT * FROM conversations
-- WHERE status->>'state' = 'completed'
-- AND (nps_sent IS NULL OR nps_sent = false)
-- AND updated_at < NOW() - INTERVAL '7 days'
-- LIMIT 50;
--
-- Calculate current NPS score:
-- SELECT * FROM nps_analytics WHERE month = DATE_TRUNC('month', NOW());
--
-- Get recent NPS responses:
-- SELECT * FROM nps_responses ORDER BY submitted_at DESC LIMIT 10;
