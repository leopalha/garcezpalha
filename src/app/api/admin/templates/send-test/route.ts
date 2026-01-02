import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Lazy-load Resend client to avoid build-time errors
let resendClient: Resend | null = null
function getResend(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

export async function POST(req: NextRequest) {
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

    const body = await req.json()
    const { templateId, to, variables } = body

    if (!to || !templateId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Replace variables in content
    let html = template.content
    let subject = template.subject || 'Test Email'

    Object.entries(variables || {}).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      html = html.replace(regex, String(value))
      subject = subject.replace(regex, String(value))
    })

    // Wrap in full email template
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="padding: 30px; background-color: #1E3A8A; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Garcez<span style="color: #D4AF37;"> Palha</span>
              </h1>
              <p style="margin: 5px 0 0; color: #94a3b8; font-size: 14px;">267 Anos de Tradição Jurídica</p>
            </div>
            <div style="padding: 40px 30px;">
              ${html}
            </div>
            <div style="padding: 20px 30px; background-color: #f8fafc; border-radius: 0 0 8px 8px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 12px; line-height: 1.5;">
                Garcez Palha - Advocacia e Perícia<br>
                Rua do Ouvidor, 121 - Centro, Rio de Janeiro - RJ<br>
                CEP: 20040-030 | Tel: (21) 3500-0000
              </p>
              <p style="margin: 15px 0 0; color: #94a3b8; font-size: 11px;">
                Este é um email de teste do sistema Garcez Palha
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email via Resend
    const { data, error } = await getResend().emails.send({
      from: 'Garcez Palha <noreply@garcezpalha.com.br>',
      to: [to],
      subject: `[TESTE] ${subject}`,
      html: fullHtml,
    })

    if (error) {
      logger.error('Error sending test email:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, emailId: data?.id })
  } catch (error) {
    logger.error('Error in send-test endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
