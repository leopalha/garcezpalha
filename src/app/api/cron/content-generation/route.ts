/**
 * Cron Job: Automated Content Generation
 * Generates content based on content calendar and campaigns
 *
 * Run daily at 6 AM: 0 6 * * *
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getContentAgent } from '@/lib/ai/agents/marketing/content-agent'
import { createQAAgent } from '@/lib/ai/agents/operations/qa-agent'
import { createSocialAgent } from '@/lib/ai/agents/marketing/social-agent'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Verify cron secret
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.warn('CRON_SECRET not configured')
    return false
  }

  return authHeader === `Bearer ${cronSecret}`
}

// Legal areas for content generation
const LEGAL_AREAS = [
  'direito-imobiliario',
  'usucapiao',
  'regularizacao-imoveis',
  'contratos-imobiliarios',
  'inventario-partilha',
]

// Platforms to generate content for
const PLATFORMS = ['instagram', 'linkedin'] as const

export async function GET(request: NextRequest) {
  // Verify authorization
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const today = new Date()
    const results = {
      generated: 0,
      scheduled: 0,
      failed: 0,
      details: [] as Array<{ platform: string; topic: string; status: string; error?: string }>,
    }

    // Check for active campaigns
    const { data: activeCampaigns } = await supabase
      .from('content_campaigns')
      .select('*')
      .eq('status', 'active')
      .lte('start_date', today.toISOString().split('T')[0])
      .gte('end_date', today.toISOString().split('T')[0])

    // Get content agent and social agent
    const contentAgent = getContentAgent()
    const socialAgent = createSocialAgent()
    const qaAgent = createQAAgent()

    // Generate content for each platform
    for (const platform of PLATFORMS) {
      // Check how many posts are already scheduled for the next 7 days
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      const { count: scheduledCount } = await supabase
        .from('scheduled_posts')
        .select('*', { count: 'exact', head: true })
        .eq('platform', platform)
        .in('status', ['scheduled', 'approved'])
        .gte('scheduled_for', today.toISOString())
        .lte('scheduled_for', nextWeek.toISOString())

      // Target: 2 posts per day = 14 per week
      const targetPosts = 14
      const postsNeeded = Math.max(0, targetPosts - (scheduledCount || 0))

      if (postsNeeded === 0) {
        results.details.push({
          platform,
          topic: 'N/A',
          status: 'skipped',
          error: 'Enough posts already scheduled',
        })
        continue
      }

      // Generate posts
      const postsToGenerate = Math.min(postsNeeded, 3) // Max 3 per run to avoid timeout

      for (let i = 0; i < postsToGenerate; i++) {
        try {
          // Get trending topics
          const trends = await socialAgent.analyzeTrendingTopics(platform, LEGAL_AREAS)
          const topic = trends.recommendedContent[i % trends.recommendedContent.length] ||
            `Dica jurídica sobre ${LEGAL_AREAS[i % LEGAL_AREAS.length]}`

          // Generate content based on platform
          let generatedContent: { content?: string; caption?: string }
          let contentText: string

          if (platform === 'instagram') {
            generatedContent = await contentAgent.generateInstagramPost(
              topic,
              LEGAL_AREAS[i % LEGAL_AREAS.length]
            )
            contentText = generatedContent.caption || ''
          } else {
            generatedContent = await contentAgent.generateLinkedInPost(
              topic,
              LEGAL_AREAS[i % LEGAL_AREAS.length]
            )
            contentText = generatedContent.content || ''
          }

          // QA Check
          const oabCheck = await qaAgent.quickOABCheck(contentText)
          if (!oabCheck.passed) {
            results.failed++
            results.details.push({
              platform,
              topic,
              status: 'failed',
              error: `OAB violation: ${oabCheck.criticalViolation}`,
            })
            continue
          }

          results.generated++

          // Calculate optimal posting time
          const optimalTimes = socialAgent.getOptimalPostingTimes(platform)
          const scheduledDate = new Date(today)
          scheduledDate.setDate(scheduledDate.getDate() + Math.floor(i / 2) + 1) // Distribute over days
          const [hour, minute] = optimalTimes[i % optimalTimes.length].split(':').map(Number)
          scheduledDate.setHours(hour, minute, 0, 0)

          // Get hashtag strategy
          const hashtagStrategy = await socialAgent.generateHashtagStrategy(
            contentText,
            platform,
            LEGAL_AREAS[i % LEGAL_AREAS.length]
          )

          const hashtags = platform === 'instagram'
            ? [
                ...hashtagStrategy.instagram.popular.slice(0, 5),
                ...hashtagStrategy.instagram.medium.slice(0, 10),
                ...hashtagStrategy.instagram.niche.slice(0, 10),
                ...hashtagStrategy.instagram.location.slice(0, 3),
              ]
            : hashtagStrategy.linkedin

          // Save to database
          const campaignId = activeCampaigns?.[0]?.id || null

          const { error: insertError } = await supabase
            .from('scheduled_posts')
            .insert({
              content_type: 'social-post',
              platform,
              title: topic,
              content: contentText,
              hashtags,
              scheduled_for: scheduledDate.toISOString(),
              status: 'pending_review', // Requires human approval
              legal_area: LEGAL_AREAS[i % LEGAL_AREAS.length],
              campaign_id: campaignId,
              ai_generated: true,
              ai_agent: 'content',
              generation_prompt: topic,
              metadata: {
                generatedContent,
                trends: trends.trends.slice(0, 3),
                autoGenerated: true,
                generatedAt: new Date().toISOString(),
              },
            })

          if (insertError) {
            throw new Error(insertError.message)
          }

          results.scheduled++
          results.details.push({
            platform,
            topic,
            status: 'scheduled',
          })
        } catch (error) {
          console.error(`Error generating content for ${platform}:`, error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error))
          results.failed++
          results.details.push({
            platform,
            topic: 'Error',
            status: 'failed',
            error: (error as Error).message,
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${results.generated} posts, scheduled ${results.scheduled}`,
      results,
    })
  } catch (error) {
    console.error('Content generation cron error:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error))
    return NextResponse.json(
      { error: 'Cron job failed', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// Support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request)
}
