/**
 * Email Template: Contract Signed Confirmation
 *
 * Trigger: ClickSign webhook 'document.signed'
 * Purpose: Congratulate client on signed contract + next steps
 */

interface ContractSignedEmailData {
  clientName: string
  contractType: string
  signedAt: string
  caseType: string
  lawyerName: string
  lawyerOAB: string
  nextSteps: string[]
  onboardingLink?: string
}

export function generateContractSignedEmail(data: ContractSignedEmailData): string {
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
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 600;
    }
    .badge {
      display: inline-block;
      background: #d4af37;
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 10px;
    }
    .content {
      padding: 40px 30px;
      background: #ffffff;
    }
    .congrats-box {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      margin: 30px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .congrats-box h2 {
      margin: 0 0 10px 0;
      font-size: 24px;
    }
    .congrats-box p {
      margin: 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .info-card {
      background: #f9fafb;
      border-left: 4px solid #d4af37;
      padding: 20px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .info-card h3 {
      margin: 0 0 15px 0;
      color: #1a1a1a;
      font-size: 18px;
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
    .next-steps {
      background: #fff3cd;
      border-radius: 8px;
      padding: 25px;
      margin: 25px 0;
    }
    .next-steps h3 {
      margin: 0 0 15px 0;
      color: #856404;
      font-size: 18px;
    }
    .step {
      display: flex;
      align-items: start;
      margin: 12px 0;
      padding: 12px;
      background: white;
      border-radius: 6px;
      border-left: 3px solid #d4af37;
    }
    .step-number {
      background: #d4af37;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      flex-shrink: 0;
      margin-right: 12px;
    }
    .step-content {
      flex: 1;
    }
    .step-title {
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 4px 0;
      font-size: 15px;
    }
    .step-desc {
      color: #6b7280;
      margin: 0;
      font-size: 14px;
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
      transition: all 0.3s ease;
    }
    .cta-button:hover {
      background: #b8981f;
      box-shadow: 0 6px 8px rgba(212, 175, 55, 0.4);
    }
    .lawyer-card {
      background: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      border: 1px solid #e5e7eb;
    }
    .lawyer-card h4 {
      margin: 0 0 10px 0;
      color: #1f2937;
      font-size: 16px;
    }
    .lawyer-info {
      color: #6b7280;
      font-size: 14px;
      margin: 5px 0;
    }
    .footer {
      text-align: center;
      padding: 30px 20px;
      font-size: 12px;
      color: #6b7280;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #d4af37;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Contrato Assinado!</h1>
      <div class="badge">Garcez Palha Advocacia</div>
    </div>

    <div class="content">
      <div class="congrats-box">
        <h2>🎉 Parabéns, ${data.clientName}!</h2>
        <p>Seu contrato foi assinado com sucesso. Agora vamos trabalhar juntos no seu caso.</p>
      </div>

      <p style="font-size: 16px; line-height: 1.8; color: #374151;">
        É com grande satisfação que confirmamos a assinatura do seu contrato de prestação de serviços jurídicos.
        A partir de agora, nossa equipe está dedicada a alcançar o melhor resultado para você.
      </p>

      <div class="info-card">
        <h3>📋 Detalhes do Contrato</h3>
        <div class="info-row">
          <span class="info-label">Tipo de Contrato:</span>
          <span class="info-value">${data.contractType}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Área do Direito:</span>
          <span class="info-value">${data.caseType}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Data da Assinatura:</span>
          <span class="info-value">${new Date(data.signedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}</span>
        </div>
      </div>

      <div class="next-steps">
        <h3>🚀 Próximos Passos</h3>
        ${data.nextSteps
          .map(
            (step, index) => `
          <div class="step">
            <div class="step-number">${index + 1}</div>
            <div class="step-content">
              <p class="step-title">${step.split(':')[0]}</p>
              ${step.split(':')[1] ? `<p class="step-desc">${step.split(':')[1].trim()}</p>` : ''}
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      ${
        data.onboardingLink
          ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.onboardingLink}" class="cta-button">
          Acessar Área do Cliente
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
          Complete seu cadastro e acompanhe o andamento do seu processo
        </p>
      </div>
      `
          : ''
      }

      <div class="lawyer-card">
        <h4>👨‍⚖️ Seu Advogado Responsável</h4>
        <p class="lawyer-info"><strong>${data.lawyerName}</strong></p>
        <p class="lawyer-info">OAB/RJ ${data.lawyerOAB}</p>
        <p class="lawyer-info" style="margin-top: 10px;">
          Qualquer dúvida, estamos à disposição por email ou WhatsApp.
        </p>
      </div>

      <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 25px 0;">
        <p style="margin: 0; color: #1e40af; font-size: 14px;">
          <strong>💡 Dica:</strong> Guarde este email! Ele contém informações importantes sobre o início do seu processo.
        </p>
      </div>

      <p style="font-size: 16px; margin-top: 30px;">
        Agradecemos pela confiança depositada em nosso trabalho. Estamos comprometidos em defender seus interesses
        com dedicação, ética e excelência técnica.
      </p>

      <p style="font-size: 16px; margin-top: 20px;">
        Atenciosamente,<br>
        <strong>Equipe Garcez Palha Advocacia</strong>
      </p>
    </div>

    <div class="footer">
      <p><strong>Garcez Palha Advocacia</strong></p>
      <p>OAB/RJ XXXXX | CNPJ XX.XXX.XXX/XXXX-XX</p>
      <p style="margin: 10px 0;">
        <a href="mailto:contato@garcezpalha.com.br">contato@garcezpalha.com.br</a> |
        (11) 9999-9999
      </p>
      <p style="color: #9ca3af; margin-top: 15px;">
        Este é um email automático. Você está recebendo porque assinou um contrato com a Garcez Palha Advocacia.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
