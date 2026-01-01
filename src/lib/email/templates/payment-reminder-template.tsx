/**
 * Email Template: Payment Reminder
 *
 * Trigger: Cron job (daily check for overdue payments)
 * Purpose: Friendly reminder for pending payments
 */

interface PaymentReminderEmailData {
  clientName: string
  invoiceNumber: string
  amount: number
  dueDate: string
  daysOverdue?: number
  paymentLink: string
  pixQrCode?: string
  pixQrCodeBase64?: string
  installmentNumber?: number
  totalInstallments?: number
}

export function generatePaymentReminderEmail(data: PaymentReminderEmailData): string {
  const isOverdue = data.daysOverdue && data.daysOverdue > 0
  const urgencyLevel = data.daysOverdue
    ? data.daysOverdue > 7
      ? 'high'
      : data.daysOverdue > 3
        ? 'medium'
        : 'low'
    : 'none'

  const urgencyColors = {
    none: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
    low: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
    medium: { bg: '#fed7aa', border: '#ea580c', text: '#7c2d12' },
    high: { bg: '#fee2e2', border: '#dc2626', text: '#991b1b' },
  }

  const colors = urgencyColors[urgencyLevel]

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
    .content {
      padding: 40px 30px;
      background: #ffffff;
    }
    .alert-box {
      background: ${colors.bg};
      border-left: 4px solid ${colors.border};
      padding: 20px;
      border-radius: 0 8px 8px 0;
      margin: 25px 0;
    }
    .alert-box h3 {
      margin: 0 0 10px 0;
      color: ${colors.text};
      font-size: 18px;
    }
    .alert-box p {
      margin: 0;
      color: ${colors.text};
      font-size: 14px;
    }
    .invoice-card {
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 25px;
      margin: 25px 0;
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #e5e7eb;
    }
    .invoice-number {
      font-size: 14px;
      color: #6b7280;
    }
    .invoice-status {
      background: ${isOverdue ? '#fecaca' : '#fef3c7'};
      color: ${isOverdue ? '#991b1b' : '#92400e'};
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }
    .amount-box {
      text-align: center;
      padding: 25px;
      background: linear-gradient(135deg, #d4af37 0%, #b8981f 100%);
      color: white;
      border-radius: 8px;
      margin: 20px 0;
    }
    .amount-label {
      font-size: 14px;
      opacity: 0.9;
      margin: 0 0 8px 0;
    }
    .amount-value {
      font-size: 36px;
      font-weight: 700;
      margin: 0;
    }
    .due-date {
      font-size: 14px;
      opacity: 0.9;
      margin: 8px 0 0 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
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
    .payment-methods {
      background: #f0fdf4;
      border-radius: 8px;
      padding: 25px;
      margin: 25px 0;
      border: 1px solid #86efac;
    }
    .payment-methods h3 {
      margin: 0 0 20px 0;
      color: #166534;
      font-size: 18px;
    }
    .pix-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 15px 0;
      border: 1px solid #d1fae5;
    }
    .pix-section h4 {
      margin: 0 0 15px 0;
      color: #166534;
      font-size: 16px;
    }
    .qr-code-img {
      max-width: 200px;
      margin: 15px auto;
      border: 3px solid #d4af37;
      border-radius: 8px;
      padding: 10px;
      background: white;
    }
    .pix-code {
      background: #f9fafb;
      padding: 12px;
      border-radius: 6px;
      word-break: break-all;
      font-size: 12px;
      font-family: monospace;
      color: #374151;
      margin: 10px 0;
      border: 1px dashed #d1d5db;
    }
    .cta-button {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
    }
    .help-box {
      background: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      border: 1px solid #e5e7eb;
    }
    .help-box h4 {
      margin: 0 0 10px 0;
      color: #1f2937;
      font-size: 16px;
    }
    .help-box p {
      margin: 5px 0;
      color: #6b7280;
      font-size: 14px;
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
      <h1>${isOverdue ? '⏰ Lembrete de Pagamento' : '💳 Fatura Disponível'}</h1>
    </div>

    <div class="content">
      <p style="font-size: 16px; margin-bottom: 20px;">
        Olá, <strong>${data.clientName}</strong>!
      </p>

      ${
        isOverdue
          ? `
      <div class="alert-box">
        <h3>⚠️ Pagamento em Atraso</h3>
        <p>
          Seu pagamento está vencido há <strong>${data.daysOverdue} ${data.daysOverdue === 1 ? 'dia' : 'dias'}</strong>.
          Para evitar transtornos e continuar com o andamento do seu processo, por favor, regularize sua situação o quanto antes.
        </p>
      </div>
      `
          : `
      <p style="font-size: 16px; line-height: 1.8; color: #374151;">
        Este é um lembrete amigável sobre sua fatura pendente. Você pode efetuar o pagamento de forma rápida e segura
        através dos métodos abaixo.
      </p>
      `
      }

      <div class="invoice-card">
        <div class="invoice-header">
          <div>
            <div class="invoice-number">Fatura #${data.invoiceNumber}</div>
            ${
              data.installmentNumber && data.totalInstallments
                ? `<div style="color: #6b7280; font-size: 13px; margin-top: 4px;">
                Parcela ${data.installmentNumber} de ${data.totalInstallments}
              </div>`
                : ''
            }
          </div>
          <div class="invoice-status">
            ${isOverdue ? `VENCIDA (${data.daysOverdue}d)` : 'PENDENTE'}
          </div>
        </div>

        <div class="amount-box">
          <p class="amount-label">Valor Total</p>
          <p class="amount-value">${data.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          <p class="due-date">
            Vencimento: ${new Date(data.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div class="info-row">
          <span class="info-label">Status:</span>
          <span class="info-value" style="color: ${isOverdue ? '#dc2626' : '#f59e0b'};">
            ${isOverdue ? 'Vencida' : 'Aguardando Pagamento'}
          </span>
        </div>
      </div>

      <div class="payment-methods">
        <h3>💚 Formas de Pagamento</h3>

        ${
          data.pixQrCode && data.pixQrCodeBase64
            ? `
        <div class="pix-section">
          <h4>Pagar com PIX (Instantâneo)</h4>
          <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
            Escaneie o QR Code ou copie o código abaixo:
          </p>
          <img src="data:image/png;base64,${data.pixQrCodeBase64}" alt="QR Code PIX" class="qr-code-img" />
          <div class="pix-code">${data.pixQrCode}</div>
          <p style="color: #059669; font-size: 13px; margin-top: 10px;">
            ✅ Confirmação automática após pagamento
          </p>
        </div>
        `
            : ''
        }

        <div style="text-align: center; margin: 20px 0;">
          <a href="${data.paymentLink}" class="cta-button">
            Pagar Agora
          </a>
          <p style="color: #6b7280; font-size: 13px; margin-top: 10px;">
            Aceitamos PIX, Cartão de Crédito e Boleto
          </p>
        </div>
      </div>

      ${
        isOverdue
          ? `
      <div style="background: #fee2e2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 25px 0;">
        <p style="margin: 0; color: #991b1b; font-size: 14px;">
          <strong>⚠️ Importante:</strong> Pagamentos em atraso podem resultar em juros e multa, além de suspender o andamento do seu processo.
          Regularize sua situação para evitar transtornos.
        </p>
      </div>
      `
          : ''
      }

      <div class="help-box">
        <h4>❓ Precisa de Ajuda?</h4>
        <p>
          <strong>WhatsApp:</strong> (11) 9999-9999<br>
          <strong>Email:</strong> financeiro@garcezpalha.com.br<br>
          <strong>Horário:</strong> Segunda a Sexta, 9h às 18h
        </p>
        <p style="margin-top: 15px; font-size: 13px;">
          Se já efetuou o pagamento, por favor desconsidere este email. A confirmação pode levar até 24h úteis.
        </p>
      </div>

      <p style="font-size: 16px; margin-top: 30px;">
        Agradecemos pela confiança!<br>
        <strong>Equipe Garcez Palha Advocacia</strong>
      </p>
    </div>

    <div class="footer">
      <p><strong>Garcez Palha Advocacia</strong></p>
      <p>OAB/RJ XXXXX | CNPJ XX.XXX.XXX/XXXX-XX</p>
      <p style="margin: 10px 0;">
        <a href="mailto:financeiro@garcezpalha.com.br" style="color: #d4af37; text-decoration: none;">
          financeiro@garcezpalha.com.br
        </a> | (11) 9999-9999
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
