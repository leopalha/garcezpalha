/**
 * Content Generation API
 * Generates AI-powered content using the Content Agent
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ContentAgent, getContentAgent } from '@/lib/ai/agents/marketing/content-agent'
import { createQAAgent } from '@/lib/ai/agents/operations/qa-agent'
import { logger } from '@/lib/logger'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Content types supported
type ContentType =
  | 'instagram-post'
  | 'linkedin-post'
  | 'blog-article'
  | 'newsletter'
  | 'video-script'
  | 'social-post'

interface GenerateRequest {
  contentType: ContentType
  topic: string
  legalArea?: string
  platform?: string
  targetAudience?: string
  tone?: string
  keywords?: string[]
  additionalContext?: string
  autoQA?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateRequest

    const {
      contentType,
      topic,
      legalArea,
      platform,
      targetAudience,
      tone,
      keywords,
      additionalContext,
      autoQA = true,
    } = body

    // Validate required fields
    if (!contentType || !topic) {
      return NextResponse.json(
        { error: 'contentType and topic are required' },
        { status: 400 }
      )
    }

    // Get the Content Agent
    const contentAgent = getContentAgent()
    let generatedContent: unknown
    let contentText: string = ''

    // Generate content based on type
    switch (contentType) {
      case 'instagram-post':
        generatedContent = await contentAgent.generateInstagramPost(topic, legalArea)
        contentText = (generatedContent as { caption: string }).caption
        break

      case 'linkedin-post':
        generatedContent = await contentAgent.generateLinkedInPost(topic, legalArea)
        contentText = (generatedContent as { content: string }).content
        break

      case 'blog-article':
        generatedContent = await contentAgent.generateBlogArticle(topic, {
          legalArea,
          targetKeywords: keywords,
        })
        contentText = (generatedContent as { content: string }).content
        break

      case 'newsletter':
        generatedContent = await contentAgent.generateNewsletter(topic, {
          subscriberName: targetAudience,
        })
        contentText = (generatedContent as { body: string }).body
        break

      case 'video-script':
        generatedContent = await contentAgent.generateVideoScript(topic, {
          legalArea,
        })
        contentText = (generatedContent as { script: string }).script
        break

      case 'social-post':
        generatedContent = await contentAgent.generateSocialPost(
          (platform || 'instagram') as 'instagram' | 'linkedin' | 'facebook' | 'twitter' | 'tiktok',
          topic,
          {
            legalArea,
            tone: tone as 'professional' | 'casual' | 'educational' | 'promotional' | undefined,
            maxLength: undefined,
            includeHashtags: true,
            includeCTA: true,
          }
        )
        contentText = (generatedContent as { content: string }).content
        break

      default:
        return NextResponse.json(
          { error: `Unsupported content type: ${contentType}` },
          { status: 400 }
        )
    }

    // Run QA if enabled
    let qaResult = null
    if (autoQA && contentText) {
      const qaAgent = createQAAgent()
      const quickCheck = await qaAgent.quickOABCheck(contentText)

      if (!quickCheck.passed) {
        return NextResponse.json({
          success: false,
          error: 'Content failed OAB compliance check',
          violation: quickCheck.criticalViolation,
          generatedContent,
        }, { status: 422 })
      }

      qaResult = {
        oabCompliant: true,
        checkedAt: new Date().toISOString(),
      }
    }

    // Save to database
    const { data: savedContent, error: saveError } = await supabase
      .from('scheduled_posts')
      .insert({
        content_type: contentType.replace('-', '_').replace('_post', '-post'),
        platform: platform || getDefaultPlatform(contentType),
        title: (generatedContent as { title?: string }).title || topic,
        content: contentText,
        hashtags: (generatedContent as { hashtags?: string[] }).hashtags || [],
        cta: (generatedContent as { cta?: string }).cta,
        metadata: {
          generatedContent,
          request: body,
          qaResult,
        },
        status: 'draft',
        legal_area: legalArea,
        ai_generated: true,
        ai_agent: 'content',
        generation_prompt: topic,
      })
      .select()
      .single()

    if (saveError) {
      logger.error('Error saving content:', saveError)
      // Return content even if save fails
      return NextResponse.json({
        success: true,
        content: generatedContent,
        qaResult,
        saved: false,
        saveError: saveError.message,
      })
    }

    return NextResponse.json({
      success: true,
      content: generatedContent,
      qaResult,
      saved: true,
      savedId: savedContent.id,
    })

  } catch (error) {
    logger.error('Content generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content', details: (error as Error).message },
      { status: 500 }
    )
  }
}

function getDefaultPlatform(contentType: ContentType): string {
  const platforms: Record<ContentType, string> = {
    'instagram-post': 'instagram',
    'linkedin-post': 'linkedin',
    'blog-article': 'blog',
    'newsletter': 'email',
    'video-script': 'youtube',
    'social-post': 'instagram',
  }
  return platforms[contentType] || 'instagram'
}

// GET - List generated content
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')
    const contentType = searchParams.get('contentType')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('scheduled_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) query = query.eq('status', status)
    if (platform) query = query.eq('platform', platform)
    if (contentType) query = query.eq('content_type', contentType)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch content', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    })

  } catch (error) {
    logger.error('Content list error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content', details: (error as Error).message },
      { status: 500 }
    )
  }
}
