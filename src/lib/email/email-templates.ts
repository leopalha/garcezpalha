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
   * Commercial Proposal Email
   */
  commercialProposal(data: {
    name: string
    service: string
    description: string
    value: string
    paymentTerms: string
    proposalUrl: string
    expiresIn: string
  }): EmailTemplate {
    return {
      subject: `📋 Proposta Comercial - ${data.service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c2d12 0%, #991b1b 100%); padding: 40px 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">📋</div>
            <h2 style="color: #ffffff; margin: 0;">Proposta Comercial</h2>
            <p style="color: #fef3c7; margin-top: 10px;">Preparamos uma solução personalizada para você</p>
          </div>

          <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #374151;">Olá <strong>${data.name}</strong>,</p>

            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Conforme conversamos, segue nossa proposta comercial para <strong>${data.service}</strong>.
            </p>

            <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border: 2px solid #e5e7eb;">
              <h3 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #991b1b; padding-bottom: 10px;">Detalhes da Proposta</h3>

              <div style="margin: 20px 0;">
                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">SERVIÇO</p>
                <p style="margin: 5px 0 15px 0; color: #1f2937; font-size: 16px; font-weight: bold;">${data.service}</p>

                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">DESCRIÇÃO</p>
                <p style="margin: 5px 0 15px 0; color: #374151; font-size: 15px; line-height: 1.6;">${data.description}</p>

                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">INVESTIMENTO</p>
                <p style="margin: 5px 0 15px 0; color: #991b1b; font-size: 24px; font-weight: bold;">R$ ${data.value}</p>

                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">CONDIÇÕES DE PAGAMENTO</p>
                <p style="margin: 5px 0; color: #374151; font-size: 15px;">${data.paymentTerms}</p>
              </div>
            </div>

            <div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 20px; margin: 25px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>⏰ Validade:</strong> Esta proposta é válida por ${data.expiresIn}.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.proposalUrl}" style="background: #991b1b; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                📄 Ver Proposta Completa
              </a>
            </div>

            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0 0 10px 0; color: #1e40af; font-weight: bold;">📞 Dúvidas?</p>
              <p style="margin: 0; color: #1e3a8a; line-height: 1.6;">
                Estamos à disposição para esclarecer qualquer questão.<br/>
                Telefone: <strong>(21) 99535-4010</strong><br/>
                WhatsApp: <a href="https://wa.me/5521995354010" style="color: #2563eb;">Clique aqui para conversar</a>
              </p>
            </div>

            <p style="font-size: 16px; color: #374151;">
              Aguardamos seu retorno!
            </p>
          </div>

          ${this.OAB_FOOTER}
        </div>
      `,
      text: `Proposta Comercial - ${data.service}\n\nOlá ${data.name},\n\nSegue nossa proposta:\n\nServiço: ${data.service}\nDescrição: ${data.description}\nInvestimento: R$ ${data.value}\nPagamento: ${data.paymentTerms}\nValidade: ${data.expiresIn}\n\nVer proposta completa: ${data.proposalUrl}\n\nDúvidas? (21) 99535-4010\n\nGarcez Palha`,
    }
  }

  /**
   * Payment Reminder Email
   */
  paymentReminder(data: {
    name: string
    invoiceNumber: string
    dueDate: string
    amount: string
    service: string
    paymentLink: string
    daysOverdue?: number
  }): EmailTemplate {
    const isOverdue = data.daysOverdue && data.daysOverdue > 0
    const urgencyColor = isOverdue ? '#dc2626' : '#f59e0b'
    const urgencyBg = isOverdue ? '#fef2f2' : '#fef3c7'
    const title = isOverdue
      ? `⚠️ Pagamento em Atraso - ${data.daysOverdue} dias`
      : `🔔 Lembrete de Pagamento`

    return {
      subject: isOverdue
        ? `⚠️ Pagamento em Atraso - Fatura ${data.invoiceNumber}`
        : `🔔 Lembrete: Vencimento em breve - Fatura ${data.invoiceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: ${urgencyColor}; padding: 30px 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">${isOverdue ? '⚠️' : '🔔'}</div>
            <h2 style="color: #ffffff; margin: 0;">${title}</h2>
          </div>

          <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #374151;">Olá <strong>${data.name}</strong>,</p>

            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              ${isOverdue
                ? `Identificamos que o pagamento da fatura abaixo está em atraso há <strong>${data.daysOverdue} dias</strong>.`
                : 'Este é um lembrete amigável sobre o pagamento da sua fatura que vence em breve.'
              }
            </p>

            <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${urgencyColor};">
              <h3 style="color: #1f2937; margin-top: 0;">Detalhes da Fatura</h3>
              <p style="margin: 10px 0;"><strong>Número:</strong> ${data.invoiceNumber}</p>
              <p style="margin: 10px 0;"><strong>Serviço:</strong> ${data.service}</p>
              <p style="margin: 10px 0;"><strong>Vencimento:</strong> ${data.dueDate}</p>
              <p style="margin: 10px 0;"><strong>Valor:</strong> <span style="color: ${urgencyColor}; font-size: 20px; font-weight: bold;">R$ ${data.amount}</span></p>
            </div>

            ${isOverdue ? `
              <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 25px 0;">
                <p style="margin: 0; color: #991b1b;">
                  <strong>⚠️ Importante:</strong> Para evitar a inclusão em cadastros de inadimplentes e interrupção dos serviços, regularize seu pagamento o quanto antes.
                </p>
              </div>
            ` : `
              <div style="background: ${urgencyBg}; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0;">
                <p style="margin: 0; color: #92400e;">
                  <strong>💡 Dica:</strong> Evite atrasos e mantenha seus serviços ativos realizando o pagamento antes do vencimento.
                </p>
              </div>
            `}

            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.paymentLink}" style="background: ${urgencyColor}; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                💳 Pagar Agora
              </a>
            </div>

            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0 0 10px 0; color: #1e40af; font-weight: bold;">📞 Precisa de Ajuda?</p>
              <p style="margin: 0; color: #1e3a8a;">
                Entre em contato conosco:<br/>
                Telefone: <strong>(21) 99535-4010</strong><br/>
                Email: <a href="mailto:contato@garcezpalha.com" style="color: #2563eb;">contato@garcezpalha.com</a>
              </p>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
              Se você já realizou o pagamento, por favor desconsidere este email.
            </p>
          </div>

          ${this.OAB_FOOTER}
        </div>
      `,
      text: `${title}\n\nOlá ${data.name},\n\n${isOverdue ? `Pagamento em atraso há ${data.daysOverdue} dias.` : 'Lembrete de pagamento:'}\n\nFatura: ${data.invoiceNumber}\nServiço: ${data.service}\nVencimento: ${data.dueDate}\nValor: R$ ${data.amount}\n\nPagar em: ${data.paymentLink}\n\nDúvidas? (21) 99535-4010\n\nSe já pagou, desconsidere.\n\nGarcez Palha`,
    }
  }

  /**
   * NPS / Feedback Request Email
   */
  npsRequest(data: {
    name: string
    service: string
    completionDate: string
    npsUrl: string
  }): EmailTemplate {
    return {
      subject: `📊 Sua opinião é importante para nós!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7c2d12 0%, #991b1b 100%); padding: 40px 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">⭐</div>
            <h2 style="color: #ffffff; margin: 0;">Como foi sua experiência?</h2>
            <p style="color: #fef3c7; margin-top: 10px;">Sua opinião nos ajuda a melhorar sempre</p>
          </div>

          <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #374151;">Olá <strong>${data.name}</strong>,</p>

            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Agradecemos por confiar na Garcez Palha para <strong>${data.service}</strong>, finalizado em ${data.completionDate}.
            </p>

            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Sua opinião é extremamente valiosa para nós! Gostaríamos de saber como foi sua experiência com nossos serviços.
            </p>

            <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; border: 2px dashed #d1d5db;">
              <p style="font-size: 18px; color: #1f2937; margin: 0 0 20px 0; font-weight: bold;">
                Em uma escala de 0 a 10, quanto você recomendaria<br/>a Garcez Palha para um amigo ou familiar?
              </p>

              <div style="margin: 20px 0;">
                <p style="font-size: 14px; color: #6b7280; margin: 0 0 15px 0;">CLIQUE NA SUA NOTA:</p>
                <div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap;">
                  ${[0,1,2,3,4,5,6,7,8,9,10].map(n => `
                    <a href="${data.npsUrl}?score=${n}" style="display: inline-block; width: 45px; height: 45px; line-height: 45px; background: ${n <= 6 ? '#fee2e2' : n <= 8 ? '#fef3c7' : '#d1fae5'}; color: ${n <= 6 ? '#991b1b' : n <= 8 ? '#92400e' : '#065f46'}; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; margin: 3px;">${n}</a>
                  `).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 10px; padding: 0 5px;">
                  <span style="font-size: 12px; color: #6b7280;">Não recomendo</span>
                  <span style="font-size: 12px; color: #6b7280;">Recomendo muito</span>
                </div>
              </div>
            </div>

            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0; color: #1e40af; line-height: 1.6;">
                <strong>⏱️ Leva apenas 1 minuto!</strong><br/>
                Além da nota, você poderá deixar um comentário sobre sua experiência.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.npsUrl}" style="background: #991b1b; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                ⭐ Avaliar Agora
              </a>
            </div>

            <p style="font-size: 16px; color: #374151; text-align: center;">
              Obrigado por nos ajudar a melhorar!
            </p>
          </div>

          ${this.OAB_FOOTER}
        </div>
      `,
      text: `Como foi sua experiência?\n\nOlá ${data.name},\n\nAgradecemos por confiar na Garcez Palha para ${data.service}, finalizado em ${data.completionDate}.\n\nDe 0 a 10, quanto você recomendaria a Garcez Palha?\n\nAvalie em: ${data.npsUrl}\n\nLeva apenas 1 minuto!\n\nObrigado por nos ajudar a melhorar!\n\nGarcez Palha\n(21) 99535-4010`,
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
