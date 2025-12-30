// API Route para testar envio de email via Resend
// Acesse: http://localhost:3000/api/test-email

import { sendEmail } from '@/lib/email/resend-client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await sendEmail({
      from: 'Leonardo Palha <leonardo@garcezpalha.com>',
      to: 'leonardo.palha@gmail.com', // Seu email para teste
      subject: '🎉 Teste Resend - Garcez Palha Advogados',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Email Funcionando!</h1>
            </div>
            <div class="content">
              <h2>Parabéns! 🎉</h2>
              <p>Seu email profissional <strong>@garcezpalha.com</strong> está configurado e funcionando perfeitamente!</p>

              <h3>Configuração Atual:</h3>
              <ul>
                <li><strong>ENVIAR:</strong> Resend (3,000 emails/mês grátis)</li>
                <li><strong>RECEBER:</strong> ImprovMX → Gmail</li>
                <li><strong>Domínio:</strong> garcezpalha.com ✅ Verificado</li>
                <li><strong>DKIM/SPF/DMARC:</strong> ✅ Configurados</li>
              </ul>

              <h3>Próximos Passos:</h3>
              <ol>
                <li>Integrar com formulário de contato</li>
                <li>Criar templates para diferentes tipos de email</li>
                <li>Configurar notificações de lead</li>
              </ol>

              <p><strong>Este email foi enviado via Resend API às ${new Date().toLocaleString('pt-BR')}</strong></p>
            </div>
            <div class="footer">
              <p>Leonardo Palha - Garcez Palha Advogados</p>
              <p>OAB/RJ 219.390 | CONPEJ/RJ | CRECI/RJ</p>
              <p>leonardo@garcezpalha.com | garcezpalha.com</p>
            </div>
          </div>
        </body>
        </html>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'Email enviado com sucesso!',
      result
    })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
