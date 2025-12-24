/**
 * Email Templates Service
 *
 * Professional email templates for all automated communications
 *
 * Templates include:
 * - Welcome sequence (new leads)
 * - Appointment reminders
 * - Post-consultation follow-up
 * - Payment confirmations
 * - Partner monthly reports
 *
 * Using Resend or SendGrid for delivery
 */

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface EmailData {
  to: string
  from?: string
  replyTo?: string
  [key: string]: any
}

class EmailTemplatesService {
  private readonly FROM_EMAIL = 'contato@garcezpalha.com'
  private readonly FROM_NAME = 'Garcez Palha - Consultoria Jurídica'
  private readonly REPLY_TO = 'contato@garcezpalha.com'

  /**
   * OAB Compliance footer (required in all emails)
   */
  private readonly OAB_FOOTER = `
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
      <p><strong>⚠️ Aviso Legal:</strong> Este email contém informações gerais e não constitui consulta jurídica formal. Para análise detalhada do seu caso, agende uma consulta com nosso advogado habilitado (OAB/RJ 219.390).</p>
      <p style="margin-top: 10px;">
        <strong>Garcez Palha - Consultoria Jurídica & Pericial</strong><br/>
        Tradição desde 1661 | Excelência desde sempre<br/>
        📍 Av. das Américas 13685, Barra da Tijuca, Rio de Janeiro/RJ<br/>
        📞 (21) 99535-4010 | 📧 contato@garcezpalha.com<br/>
        🌐 <a href="https://garcezpalha.com">garcezpalha.com</a>
      </p>
    </div>
  `

  /**
   * Welcome Email - Day 1 (immediately after lead creation)
   */
  welcomeEmail1(data: { name: string; serviceInterest: string }): EmailTemplate {
    return {
      subject: `Bem-vindo(a) à Garcez Palha, ${data.name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7c2d12 0%, #991b1b 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Bem-vindo(a)!</h1>
            <p style="color: #fef3c7; margin-top: 10px; font-size: 16px;">Tradição desde 1661</p>
          </div>

          <div style="padding: 40px 20px;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Olá <strong>${data.name}</strong>,
            </p>

            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Obrigado pelo seu interesse em <strong>${data.serviceInterest}</strong>!
            </p>

            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Somos uma consultoria jurídica com mais de 364 anos de tradição familiar, oferecendo serviços de excelência em diversas áreas do Direito.
            </p>

            <div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 20px; margin: 30px 0;">
              <h3 style="color: #92400e; margin-top: 0;">📋 Próximos Passos:</h3>
              <ol style="color: #78350f; margin: 10px 0; padding-left: 20px;">
                <li>Responda este email com detalhes do seu caso</li>
                <li>Ou agende uma consulta pelo telefone: (21) 99535-4010</li>
                <li>Enviaremos uma proposta personalizada em até 24h</li>
              </ol>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Estamos à disposição para esclarecer qualquer dúvida!
            </p>

            <div style="text-align: center; margin-top: 40px;">
              <a href="https://garcezpalha.com/agendar" style="background: #991b1b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Agendar Consulta
              </a>
            </div>
          </div>

          ${this.OAB_FOOTER}
        </div>
      `,
      text: `Olá ${data.name},\n\nObrigado pelo seu interesse em ${data.serviceInterest}!\n\nSomos uma consultoria jurídica com mais de 364 anos de tradição familiar.\n\nPróximos passos:\n1. Responda este email com detalhes do seu caso\n2. Ou agende uma consulta: (21) 99535-4010\n3. Enviaremos proposta em até 24h\n\nGarcez Palha - Consultoria Jurídica\n(21) 99535-4010\ncontato@garcezpalha.com`,
    }
  }

  /**
   * Welcome Email - Day 3 (if no response)
   */
  welcomeEmail2(data: { name: string }): EmailTemplate {
    return {
      subject: `${data.name}, como podemos ajudá-lo?`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p style="font-size: 16px; color: #374151;">Olá ${data.name},</p>

          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            Notamos que você demonstrou interesse em nossos serviços há alguns dias. Ainda precisa de ajuda?
          </p>

          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">🎯 Nossos Serviços Principais:</h3>
            <ul style="color: #1e3a8a; line-height: 1.8;">
              <li><strong>Direito Imobiliário</strong> - Compra, venda, regularização</li>
              <li><strong>Direito Criminal</strong> - Defesa, habeas corpus, recursos</li>
              <li><strong>Perícia Documental</strong> - Análise de autenticidade</li>
              <li><strong>Avaliação de Imóveis</strong> - Laudos técnicos</li>
            </ul>
          </div>

          <p style="font-size: 16px; color: #374151;">
            Responda este email ou ligue: <strong>(21) 99535-4010</strong>
          </p>

          ${this.OAB_FOOTER}
        </div>
      `,
      text: `Olá ${data.name},\n\nNotamos que você demonstrou interesse em nossos serviços. Ainda precisa de ajuda?\n\nNossos serviços:\n- Direito Imobiliário\n- Direito Criminal\n- Perícia Documental\n- Avaliação de Imóveis\n\nResponda ou ligue: (21) 99535-4010`,
    }
  }

  /**
   * Appointment Confirmation
   */
  appointmentConfirmation(data: {
    name: string
    date: string
    time: string
    service: string
    location: string
  }): EmailTemplate {
    return {
      subject: `✅ Consulta Confirmada - ${data.date} às ${data.time}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">✅ Consulta Confirmada!</h2>
          </div>

          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #374151;">Olá <strong>${data.name}</strong>,</p>

            <p>Sua consulta foi confirmada! Veja os detalhes:</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>📅 Data:</strong> ${data.date}</p>
              <p style="margin: 10px 0;"><strong>🕐 Horário:</strong> ${data.time}</p>
              <p style="margin: 10px 0;"><strong>📋 Serviço:</strong> ${data.service}</p>
              <p style="margin: 10px 0;"><strong>📍 Local:</strong> ${data.location}</p>
            </div>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>💡 Dica:</strong> Traga todos os documentos relacionados ao caso para uma análise mais completa.</p>
            </div>

            <p style="text-align: center; margin-top: 30px;">
              <a href="https://garcezpalha.com/cancelar?ref=xyz" style="color: #6b7280; text-decoration: underline; font-size: 14px;">
                Precisa reagendar? Clique aqui
              </a>
            </p>
          </div>

          ${this.OAB_FOOTER}
        </div>
      `,
      text: `Consulta Confirmada!\n\nOlá ${data.name},\n\n📅 Data: ${data.date}\n🕐 Horário: ${data.time}\n📋 Serviço: ${data.service}\n📍 Local: ${data.location}\n\nTraga todos os documentos relacionados ao caso.\n\nGarcez Palha\n(21) 99535-4010`,
    }
  }

  /**
   * Payment Confirmation
   */
  paymentConfirmation(data: {
    name: string
    amount: string
    service: string
    paymentMethod: string
    transactionId: string
  }): EmailTemplate {
    return {
      subject: `✅ Pagamento Confirmado - ${data.service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #10b981; color: white; padding: 30px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
            <h2 style="margin: 0;">Pagamento Confirmado!</h2>
          </div>

          <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #374151;">Olá <strong>${data.name}</strong>,</p>

            <p>Recebemos seu pagamento com sucesso!</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Detalhes do Pagamento:</h3>
              <p style="margin: 10px 0;"><strong>Serviço:</strong> ${data.service}</p>
              <p style="margin: 10px 0;"><strong>Valor:</strong> R$ ${data.amount}</p>
              <p style="margin: 10px 0;"><strong>Forma de Pagamento:</strong> ${data.paymentMethod}</p>
              <p style="margin: 10px 0; font-size: 12px; color: #6b7280;"><strong>ID Transação:</strong> ${data.transactionId}</p>
            </div>

            <p style="font-size: 16px; color: #374151;">
              Em breve você receberá mais informações sobre os próximos passos.
            </p>

            <p style="font-size: 16px; color: #374151;">
              Obrigado pela confiança!
            </p>
          </div>

          ${this.OAB_FOOTER}
        </div>
      `,
      text: `Pagamento Confirmado!\n\nOlá ${data.name},\n\nRecebemos seu pagamento:\n\nServiço: ${data.service}\nValor: R$ ${data.amount}\nForma: ${data.paymentMethod}\nID: ${data.transactionId}\n\nObrigado pela confiança!\n\nGarcez Palha`,
    }
  }

  /**
   * Contract Signed Confirmation
   */
  contractSigned(data: {
    name: string
    contractType: string
    signedDate: string
    pdfUrl: string
  }): EmailTemplate {
    return {
      subject: `📝 Contrato Assinado - ${data.contractType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #7c2d12; color: white; padding: 30px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">📝</div>
            <h2 style="margin: 0;">Contrato Assinado Digitalmente</h2>
          </div>

          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #374151;">Olá <strong>${data.name}</strong>,</p>

            <p>Seu contrato de <strong>${data.contractType}</strong> foi assinado digitalmente com sucesso em <strong>${data.signedDate}</strong>.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.pdfUrl}" style="background: #991b1b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                📄 Baixar Contrato Assinado
              </a>
            </div>

            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;"><strong>ℹ️ Validade Jurídica:</strong> Este contrato possui validade jurídica conforme Lei 14.063/2020 (Assinaturas Eletrônicas) e MP 2.200-2/2001 (ICP-Brasil).</p>
            </div>

            <p>Guarde este documento em local seguro. Em caso de dúvidas, entre em contato conosco.</p>
          </div>

          ${this.OAB_FOOTER}
        </div>
      `,
      text: `Contrato Assinado!\n\nOlá ${data.name},\n\nSeu contrato de ${data.contractType} foi assinado em ${data.signedDate}.\n\nBaixe em: ${data.pdfUrl}\n\nValidade jurídica conforme Lei 14.063/2020.\n\nGarcez Palha`,
    }
  }

  /**
   * Email Verification
   */
  emailVerification(data: { name: string; verificationUrl: string }): EmailTemplate {
    return {
      subject: `Confirme seu email - Garcez Palha`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Confirme seu Email</h1>
          </div>

          <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #374151;">Olá <strong>${data.name}</strong>,</p>

            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Obrigado por se cadastrar na Garcez Palha! Para ativar sua conta e ter acesso a todos os recursos, confirme seu email clicando no botão abaixo:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.verificationUrl}" style="background: #1a365d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Confirmar Email
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center;">
              Ou copie e cole este link no seu navegador:<br/>
              <a href="${data.verificationUrl}" style="color: #2563eb; word-break: break-all;">${data.verificationUrl}</a>
            </p>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>⚠️ Atenção:</strong> Este link expira em 24 horas. Se você não solicitou este cadastro, ignore este email.
              </p>
            </div>
          </div>

          ${this.OAB_FOOTER}
        </div>
      `,
      text: `Olá ${data.name},\n\nObrigado por se cadastrar na Garcez Palha!\n\nPara confirmar seu email, acesse:\n${data.verificationUrl}\n\nEste link expira em 24 horas.\n\nSe você não solicitou este cadastro, ignore este email.\n\nGarcez Palha\n(21) 99535-4010`,
    }
  }

  /**
   * Password Reset
   */
  passwordReset(data: { name: string; resetUrl: string }): EmailTemplate {
    return {
      subject: `Redefinir sua senha - Garcez Palha`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c2d12 0%, #991b1b 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Redefinir Senha</h1>
          </div>

          <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #374151;">Olá <strong>${data.name}</strong>,</p>

            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.resetUrl}" style="background: #991b1b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Redefinir Senha
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center;">
              Ou copie e cole este link no seu navegador:<br/>
              <a href="${data.resetUrl}" style="color: #2563eb; word-break: break-all;">${data.resetUrl}</a>
            </p>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>⚠️ Atenção:</strong> Este link expira em 1 hora. Se você não solicitou a redefinição de senha, ignore este email - sua conta permanecerá segura.
              </p>
            </div>

            <p style="font-size: 14px; color: #6b7280;">
              Por segurança, nunca compartilhe este link com outras pessoas.
            </p>
          </div>

          ${this.OAB_FOOTER}
        </div>
      `,
      text: `Olá ${data.name},\n\nRecebemos uma solicitação para redefinir sua senha.\n\nAcesse o link para criar uma nova senha:\n${data.resetUrl}\n\nEste link expira em 1 hora.\n\nSe você não solicitou, ignore este email.\n\nGarcez Palha\n(21) 99535-4010`,
    }
  }

  /**
   * Get default from address
   */
  getFromAddress(): { email: string; name: string } {
    return {
      email: this.FROM_EMAIL,
      name: this.FROM_NAME,
    }
  }

  /**
   * Get default reply-to address
   */
  getReplyTo(): string {
    return this.REPLY_TO
  }
}

// Export singleton
export const emailTemplates = new EmailTemplatesService()
