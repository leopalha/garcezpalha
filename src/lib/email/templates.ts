/**
 * Email templates for Garcez Palha
 * All templates return HTML strings
 */

export interface LeadWelcomeData {
  name: string
  service: string
}

export interface AppointmentConfirmationData {
  name: string
  date: string
  time: string
  type: string
  location: string
  lawyerName: string
}

export interface AppointmentReminderData {
  name: string
  date: string
  time: string
  type: string
  location: string
}

// Base template wrapper
const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Garcez Palha</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; background-color: #1E3A8A; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                <span style="color: #ffffff;">Garcez</span>
                <span style="color: #D4AF37;"> Palha</span>
              </h1>
              <p style="margin: 5px 0 0; color: #94a3b8; font-size: 14px;">267 Anos de Tradição Jurídica</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f8fafc; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 12px;">
                Garcez Palha - Advocacia e Perícia<br>
                Rio de Janeiro, RJ - Brasil
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                Este email foi enviado automaticamente. Por favor, não responda diretamente.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

// Lead Welcome Email
export const leadWelcomeTemplate = (data: LeadWelcomeData): string => {
  const content = `
    <h2 style="margin: 0 0 20px; color: #1E3A8A; font-size: 20px;">
      Olá, ${data.name}!
    </h2>
    <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
      Obrigado por entrar em contato conosco! Recebemos sua solicitação referente a <strong>${data.service}</strong> e nossa equipe já está analisando seu caso.
    </p>
    <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
      Um de nossos advogados entrará em contato em até <strong>24 horas úteis</strong> para agendar uma consulta inicial gratuita.
    </p>
    <div style="background-color: #f0f9ff; border-left: 4px solid #1E3A8A; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #1e40af; font-weight: 600;">Próximos Passos:</p>
      <ul style="margin: 10px 0 0; padding-left: 20px; color: #374151;">
        <li>Aguarde nosso contato por telefone ou WhatsApp</li>
        <li>Prepare documentos relevantes ao seu caso</li>
        <li>Anote suas principais dúvidas</li>
      </ul>
    </div>
    <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
      Se precisar de atendimento imediato, entre em contato pelo WhatsApp: <strong>(21) 3500-0000</strong>
    </p>
    <p style="margin: 20px 0 0; color: #374151;">
      Atenciosamente,<br>
      <strong>Equipe Garcez Palha</strong>
    </p>
  `
  return baseTemplate(content)
}

// Appointment Confirmation Email
export const appointmentConfirmationTemplate = (data: AppointmentConfirmationData): string => {
  const content = `
    <h2 style="margin: 0 0 20px; color: #1E3A8A; font-size: 20px;">
      Consulta Confirmada!
    </h2>
    <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
      Olá, ${data.name}!
    </p>
    <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
      Sua consulta foi agendada com sucesso. Confira os detalhes:
    </p>
    <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Data:</td>
          <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${data.date}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Horário:</td>
          <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${data.time}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Tipo:</td>
          <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${data.type}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Local:</td>
          <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${data.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Advogado:</td>
          <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${data.lawyerName}</td>
        </tr>
      </table>
    </div>
    <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #92400e; font-weight: 600;">Importante:</p>
      <ul style="margin: 10px 0 0; padding-left: 20px; color: #78350f;">
        <li>Chegue com 10 minutos de antecedência</li>
        <li>Traga documentos relevantes ao caso</li>
        <li>Em caso de cancelamento, avise com 24h de antecedência</li>
      </ul>
    </div>
    <p style="margin: 20px 0 0; color: #374151;">
      Aguardamos você!<br>
      <strong>Equipe Garcez Palha</strong>
    </p>
  `
  return baseTemplate(content)
}

// Appointment Reminder Email (24h before)
export const appointmentReminderTemplate = (data: AppointmentReminderData): string => {
  const content = `
    <h2 style="margin: 0 0 20px; color: #D97706; font-size: 20px;">
      ⏰ Lembrete: Consulta Amanhã
    </h2>
    <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
      Olá, ${data.name}!
    </p>
    <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
      Este é um lembrete de que você tem uma consulta agendada para <strong>amanhã</strong>.
    </p>
    <div style="background-color: #fff7ed; border-radius: 8px; padding: 20px; margin: 20px 0; border: 2px solid #fdba74;">
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0; color: #9a3412; font-size: 14px;">Data:</td>
          <td style="padding: 8px 0; color: #7c2d12; font-weight: 600;">${data.date}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9a3412; font-size: 14px;">Horário:</td>
          <td style="padding: 8px 0; color: #7c2d12; font-weight: 600;">${data.time}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9a3412; font-size: 14px;">Tipo:</td>
          <td style="padding: 8px 0; color: #7c2d12; font-weight: 600;">${data.type}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9a3412; font-size: 14px;">Local:</td>
          <td style="padding: 8px 0; color: #7c2d12; font-weight: 600;">${data.location}</td>
        </tr>
      </table>
    </div>
    <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
      Caso precise cancelar ou remarcar, entre em contato conosco com antecedência.
    </p>
    <p style="margin: 20px 0 0; color: #374151;">
      Até amanhã!<br>
      <strong>Equipe Garcez Palha</strong>
    </p>
  `
  return baseTemplate(content)
}

// Generic Notification Email
export const notificationTemplate = (subject: string, message: string): string => {
  const content = `
    <h2 style="margin: 0 0 20px; color: #1E3A8A; font-size: 20px;">
      ${subject}
    </h2>
    <div style="color: #374151; line-height: 1.6;">
      ${message}
    </div>
    <p style="margin: 20px 0 0; color: #374151;">
      Atenciosamente,<br>
      <strong>Equipe Garcez Palha</strong>
    </p>
  `
  return baseTemplate(content)
}
