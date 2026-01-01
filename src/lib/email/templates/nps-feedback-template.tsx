/**
 * Email Template: NPS & Feedback Request
 *
 * Trigger: Case completion or milestone reached
 * Purpose: Collect customer satisfaction score and testimonial
 */

interface NPSFeedbackEmailData {
  clientName: string
  caseType: string
  lawyerName: string
  completedAt: string
  npsLink: string
  testimonialLink?: string
}

export function generateNPSFeedbackEmail(data: NPSFeedbackEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header p {
      margin: 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .content {
      padding: 40px 30px;
      background: #ffffff;
    }
    .success-box {
      background: #f0fdf4;
      border-left: 4px solid #10b981;
      padding: 25px;
      border-radius: 0 8px 8px 0;
      margin: 25px 0;
    }
    .success-box h3 {
      margin: 0 0 10px 0;
      color: #166534;
      font-size: 18px;
    }
    .success-box p {
      margin: 0;
      color: #166534;
      font-size: 14px;
    }
    .nps-section {
      background: #f9fafb;
      border-radius: 12px;
      padding: 30px;
      margin: 30px 0;
      text-align: center;
      border: 2px solid #e5e7eb;
    }
    .nps-section h3 {
      margin: 0 0 15px 0;
      color: #1f2937;
      font-size: 20px;
    }
    .nps-question {
      font-size: 16px;
      color: #374151;
      margin: 15px 0 25px 0;
      line-height: 1.6;
    }
    .nps-scale {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin: 25px 0;
      flex-wrap: wrap;
    }
    .nps-button {
      display: inline-block;
      width: 44px;
      height: 44px;
      line-height: 44px;
      text-align: center;
      background: white;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      color: #374151;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.2s ease;
    }
    .nps-button:hover {
      background: #d4af37;
      border-color: #d4af37;
      color: white;
      transform: scale(1.05);
    }
    .nps-labels {
      display: flex;
      justify-content: space-between;
      margin: 15px 0;
      font-size: 13px;
      color: #6b7280;
    }
    .cta-button {
      display: inline-block;
      background: #d4af37;
      color: white;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
      box-shadow: 0 4px 6px rgba(212, 175, 55, 0.3);
      font-size: 16px;
    }
    .testimonial-box {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-radius: 12px;
      padding: 25px;
      margin: 25px 0;
      border: 1px solid #93c5fd;
    }
    .testimonial-box h4 {
      margin: 0 0 15px 0;
      color: #1e40af;
      font-size: 18px;
    }
    .testimonial-box p {
      color: #1e3a8a;
      font-size: 14px;
      margin: 10px 0;
      line-height: 1.6;
    }
    .testimonial-box ul {
      margin: 15px 0;
      padding-left: 20px;
      color: #1e3a8a;
    }
    .testimonial-box li {
      margin: 8px 0;
      font-size: 14px;
    }
    .info-card {
      background: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      border: 1px solid #e5e7eb;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #6b7280;
      font-size: 14px;
    }
    .info-value {
      font-weight: 600;
      color: #1f2937;
      font-size: 14px;
    }
    .thank-you-box {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      text-align: center;
      border: 1px solid #fbbf24;
    }
    .thank-you-box p {
      margin: 10px 0;
      color: #78350f;
      font-size: 15px;
    }
    .footer {
      text-align: center;
      padding: 30px 20px;
      font-size: 12px;
      color: #6b7280;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ Sua Opinião é Importante!</h1>
      <p>Ajude-nos a melhorar nossos serviços</p>
    </div>

    <div class="content">
      <p style="font-size: 16px; margin-bottom: 20px;">
        Olá, <strong>${data.clientName}</strong>!
      </p>

      <div class="success-box">
        <h3>🎉 Parabéns!</h3>
        <p>
          Finalizamos com sucesso o seu caso de <strong>${data.caseType}</strong>.
          Foi um prazer trabalhar com você e defender seus interesses.
        </p>
      </div>

      <p style="font-size: 16px; line-height: 1.8; color: #374151;">
        Como parte do nosso compromisso com a excelência, gostaríamos muito de saber sobre sua experiência
        com a Garcez Palha Advocacia. Sua opinião nos ajuda a melhorar continuamente nossos serviços.
      </p>

      <div class="info-card">
        <div class="info-row">
          <span class="info-label">Tipo de Caso:</span>
          <span class="info-value">${data.caseType}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Advogado Responsável:</span>
          <span class="info-value">${data.lawyerName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Data de Conclusão:</span>
          <span class="info-value">${new Date(data.completedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}</span>
        </div>
      </div>

      <div class="nps-section">
        <h3>📊 Pesquisa de Satisfação</h3>
        <p class="nps-question">
          <strong>Em uma escala de 0 a 10, quanto você recomendaria<br>
          a Garcez Palha Advocacia para um amigo ou familiar?</strong>
        </p>

        <div class="nps-scale">
          ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            .map(
              (score) => `
            <a href="${data.npsLink}?score=${score}" class="nps-button">${score}</a>
          `
            )
            .join('')}
        </div>

        <div class="nps-labels">
          <span>😞 Muito Improvável</span>
          <span>😊 Muito Provável</span>
        </div>

        <div style="margin-top: 30px;">
          <a href="${data.npsLink}" class="cta-button">
            Responder Pesquisa (2 minutos)
          </a>
        </div>
      </div>

      ${
        data.testimonialLink
          ? `
      <div class="testimonial-box">
        <h4>⭐ Deixe seu Depoimento</h4>
        <p>
          Se você ficou satisfeito com nosso trabalho, adoraríamos que compartilhasse sua experiência!
          Seu depoimento ajuda outras pessoas a conhecerem nosso trabalho.
        </p>

        <ul>
          <li>✓ Compartilhe como foi sua experiência conosco</li>
          <li>✓ Conte o que mais gostou no atendimento</li>
          <li>✓ Ajude outros clientes a nos conhecer</li>
        </ul>

        <div style="text-align: center; margin-top: 20px;">
          <a href="${data.testimonialLink}" class="cta-button">
            Deixar Depoimento
          </a>
        </div>
      </div>
      `
          : ''
      }

      <div class="thank-you-box">
        <p style="font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">
          🙏 Muito Obrigado!
        </p>
        <p style="margin: 0;">
          Sua opinião é essencial para continuarmos oferecendo<br>
          um serviço de excelência a todos os nossos clientes.
        </p>
      </div>

      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 25px 0;">
        <p style="margin: 0; color: #166534; font-size: 14px;">
          <strong>💚 Ficou com alguma dúvida?</strong><br>
          Estamos sempre à disposição para ajudá-lo. Entre em contato conosco a qualquer momento!
        </p>
      </div>

      <p style="font-size: 16px; margin-top: 30px;">
        Foi um prazer atendê-lo!<br>
        <strong>Equipe Garcez Palha Advocacia</strong>
      </p>
    </div>

    <div class="footer">
      <p><strong>Garcez Palha Advocacia</strong></p>
      <p>OAB/RJ XXXXX | CNPJ XX.XXX.XXX/XXXX-XX</p>
      <p style="margin: 10px 0;">
        <a href="mailto:contato@garcezpalha.com.br" style="color: #d4af37; text-decoration: none;">
          contato@garcezpalha.com.br
        </a> | (11) 9999-9999
      </p>
      <p style="color: #9ca3af; margin-top: 15px;">
        Este email foi enviado porque você é nosso cliente. Sua privacidade é importante para nós.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
