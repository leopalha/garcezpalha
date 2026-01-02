import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import fs from 'fs/promises'
import path from 'path'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templateId = params.id

    // Try to get from database first
    const { data: dbTemplate, error: dbError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (dbTemplate && !dbError) {
      return NextResponse.json(dbTemplate)
    }

    // Fallback: Read from file system
    const templatePath = path.join(
      process.cwd(),
      'src',
      'lib',
      'email',
      'templates',
      `${templateId}.tsx`
    )

    try {
      const fileContent = await fs.readFile(templatePath, 'utf-8')

      // Extract JSX content from React component
      // This is a simplified extraction - in production, you'd parse properly
      const contentMatch = fileContent.match(
        /<div style={styles\.content}>([\s\S]*?)<\/div>/
      )
      const content = contentMatch ? contentMatch[1] : '<p>Template content</p>'

      return NextResponse.json({
        id: templateId,
        content: content.trim(),
        source: 'file',
      })
    } catch (fileError) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    logger.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templateId = params.id
    const body = await req.json()

    // Save to database
    const { data, error } = await supabase
      .from('email_templates')
      .upsert({
        id: templateId,
        name: body.name,
        type: body.type,
        category: body.category,
        description: body.description,
        subject: body.subject,
        content: body.content,
        variables: body.variables || [],
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .select()
      .single()

    if (error) {
      logger.error('Error saving template:', error)
      return NextResponse.json(
        { error: 'Failed to save template' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templateId = params.id

    // Soft delete: mark as archived
    const { error } = await supabase
      .from('email_templates')
      .update({
        status: 'archived',
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq('id', templateId)

    if (error) {
      logger.error('Error archiving template:', error)
      return NextResponse.json(
        { error: 'Failed to archive template' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
