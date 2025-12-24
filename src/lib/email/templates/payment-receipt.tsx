import React from 'react'

export interface PaymentReceiptProps {
  clientName: string
  receiptNumber: string
  paymentDate: string
  amount: number
  currency?: string
  serviceDescription: string
  paymentMethod: string
  transactionId?: string
  items?: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  taxAmount?: number
  subtotal?: number
}

const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f4f4f5',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  header: {
    padding: '30px',
    backgroundColor: '#1E3A8A',
    borderRadius: '8px 8px 0 0',
    textAlign: 'center' as const,
  },
  logo: {
    margin: 0,
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 'bold' as const,
  },
  logoAccent: {
    color: '#D4AF37',
  },
  tagline: {
    margin: '5px 0 0',
    color: '#94a3b8',
    fontSize: '14px',
  },
  content: {
    padding: '40px 30px',
  },
  receiptBadge: {
    display: 'inline-block',
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600' as const,
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 10px',
    color: '#1E3A8A',
    fontSize: '24px',
    fontWeight: 'bold' as const,
  },
  receiptNumber: {
    margin: '0 0 20px',
    color: '#64748b',
    fontSize: '14px',
  },
  paragraph: {
    margin: '0 0 15px',
    color: '#374151',
    lineHeight: '1.6',
    fontSize: '16px',
  },
  receiptBox: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '25px',
    margin: '25px 0',
    border: '2px solid #e2e8f0',
  },
  receiptTitle: {
    margin: '0 0 20px',
    color: '#1E3A8A',
    fontSize: '18px',
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    borderBottom: '2px solid #1E3A8A',
    paddingBottom: '10px',
  },
  itemsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '20px',
  },
  tableHeader: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
    fontSize: '12px',
    fontWeight: '600' as const,
    padding: '10px',
    textAlign: 'left' as const,
    textTransform: 'uppercase' as const,
  },
  tableCell: {
    padding: '12px 10px',
    borderBottom: '1px solid #e2e8f0',
    color: '#374151',
    fontSize: '14px',
  },
  tableCellRight: {
    padding: '12px 10px',
    borderBottom: '1px solid #e2e8f0',
    color: '#374151',
    fontSize: '14px',
    textAlign: 'right' as const,
  },
  totalRow: {
    backgroundColor: '#f0f9ff',
  },
  totalLabel: {
    padding: '15px 10px',
    color: '#1E3A8A',
    fontSize: '16px',
    fontWeight: '700' as const,
  },
  totalValue: {
    padding: '15px 10px',
    color: '#1E3A8A',
    fontSize: '20px',
    fontWeight: '700' as const,
    textAlign: 'right' as const,
  },
  detailRow: {
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  detailLabel: {
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500' as const,
  },
  detailValue: {
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: '600' as const,
    textAlign: 'right' as const,
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    padding: '15px',
    borderRadius: '6px',
    margin: '20px 0',
    textAlign: 'center' as const,
  },
  button: {
    display: 'inline-block',
    padding: '12px 30px',
    backgroundColor: '#1E3A8A',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600' as const,
    fontSize: '16px',
  },
  signature: {
    margin: '30px 0 0',
    color: '#374151',
  },
  footer: {
    padding: '20px 30px',
    backgroundColor: '#f8fafc',
    borderRadius: '0 0 8px 8px',
    textAlign: 'center' as const,
    borderTop: '1px solid #e2e8f0',
  },
  footerText: {
    margin: '0 0 10px',
    color: '#64748b',
    fontSize: '12px',
    lineHeight: '1.5',
  },
  footerLinks: {
    margin: '10px 0',
  },
  footerLink: {
    color: '#1E3A8A',
    textDecoration: 'none',
    fontSize: '12px',
  },
  unsubscribe: {
    margin: '15px 0 0',
    color: '#94a3b8',
    fontSize: '11px',
  },
  unsubscribeLink: {
    color: '#94a3b8',
    textDecoration: 'underline',
  },
  legalText: {
    margin: '10px 0',
    color: '#94a3b8',
    fontSize: '10px',
    lineHeight: '1.4',
  },
}

function formatCurrency(amount: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function PaymentReceipt({
  clientName,
  receiptNumber,
  paymentDate,
  amount,
  currency = 'BRL',
  serviceDescription,
  paymentMethod,
  transactionId,
  items,
  taxAmount = 0,
  subtotal,
}: PaymentReceiptProps): JSX.Element {
  const calculatedSubtotal = subtotal || amount - taxAmount

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Recibo de Pagamento - Garcez Palha</title>
      </head>
      <body style={styles.body}>
        <table role="presentation" width="100%" cellSpacing={0} cellPadding={0}>
          <tr>
            <td align="center" style={{ padding: '40px 20px' }}>
              <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                  <h1 style={styles.logo}>
                    Garcez<span style={styles.logoAccent}> Palha</span>
                  </h1>
                  <p style={styles.tagline}>267 Anos de Tradicao Juridica</p>
                </div>

                {/* Content */}
                <div style={styles.content}>
                  <div style={{ textAlign: 'center' as const }}>
                    <span style={styles.receiptBadge}>PAGAMENTO CONFIRMADO</span>
                  </div>

                  <h2 style={styles.title}>Recibo de Pagamento</h2>
                  <p style={styles.receiptNumber}>Recibo No: {receiptNumber}</p>

                  <p style={styles.paragraph}>Prezado(a) {clientName},</p>

                  <p style={styles.paragraph}>
                    Confirmamos o recebimento do seu pagamento. Abaixo seguem os detalhes da transacao:
                  </p>

                  {/* Receipt Details */}
                  <div style={styles.receiptBox}>
                    <h3 style={styles.receiptTitle}>RECIBO</h3>

                    {items && items.length > 0 ? (
                      <table style={styles.itemsTable}>
                        <thead>
                          <tr>
                            <th style={styles.tableHeader}>Descricao</th>
                            <th style={{ ...styles.tableHeader, textAlign: 'center' as const }}>Qtd</th>
                            <th style={{ ...styles.tableHeader, textAlign: 'right' as const }}>Valor Unit.</th>
                            <th style={{ ...styles.tableHeader, textAlign: 'right' as const }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={index}>
                              <td style={styles.tableCell}>{item.description}</td>
                              <td style={{ ...styles.tableCell, textAlign: 'center' as const }}>{item.quantity}</td>
                              <td style={styles.tableCellRight}>{formatCurrency(item.unitPrice, currency)}</td>
                              <td style={styles.tableCellRight}>{formatCurrency(item.total, currency)}</td>
                            </tr>
                          ))}
                          {taxAmount > 0 && (
                            <>
                              <tr>
                                <td colSpan={3} style={styles.tableCellRight}>
                                  <strong>Subtotal:</strong>
                                </td>
                                <td style={styles.tableCellRight}>{formatCurrency(calculatedSubtotal, currency)}</td>
                              </tr>
                              <tr>
                                <td colSpan={3} style={styles.tableCellRight}>
                                  <strong>Impostos:</strong>
                                </td>
                                <td style={styles.tableCellRight}>{formatCurrency(taxAmount, currency)}</td>
                              </tr>
                            </>
                          )}
                          <tr style={styles.totalRow}>
                            <td colSpan={3} style={styles.totalLabel}>
                              TOTAL PAGO
                            </td>
                            <td style={styles.totalValue}>{formatCurrency(amount, currency)}</td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <table width="100%" cellSpacing={0} cellPadding={0}>
                        <tbody>
                          <tr>
                            <td style={{ ...styles.detailLabel, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                              Servico:
                            </td>
                            <td style={{ ...styles.detailValue, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                              {serviceDescription}
                            </td>
                          </tr>
                          <tr style={styles.totalRow}>
                            <td style={styles.totalLabel}>TOTAL PAGO</td>
                            <td style={styles.totalValue}>{formatCurrency(amount, currency)}</td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                    <table width="100%" cellSpacing={0} cellPadding={0} style={{ marginTop: '15px' }}>
                      <tbody>
                        <tr>
                          <td style={{ ...styles.detailLabel, padding: '8px 0' }}>Data do Pagamento:</td>
                          <td style={{ ...styles.detailValue, padding: '8px 0' }}>{paymentDate}</td>
                        </tr>
                        <tr>
                          <td style={{ ...styles.detailLabel, padding: '8px 0' }}>Forma de Pagamento:</td>
                          <td style={{ ...styles.detailValue, padding: '8px 0' }}>{paymentMethod}</td>
                        </tr>
                        {transactionId && (
                          <tr>
                            <td style={{ ...styles.detailLabel, padding: '8px 0' }}>ID da Transacao:</td>
                            <td style={{ ...styles.detailValue, padding: '8px 0', fontSize: '12px' }}>{transactionId}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div style={styles.infoBox}>
                    <p style={{ margin: 0, color: '#1e40af', fontSize: '14px' }}>
                      Este documento e valido como comprovante de pagamento.
                      <br />
                      Guarde-o para sua referencia.
                    </p>
                  </div>

                  <div style={{ textAlign: 'center' as const, margin: '30px 0' }}>
                    <a href="https://garcezpalha.com.br/meus-pagamentos" style={styles.button}>
                      Ver Historico de Pagamentos
                    </a>
                  </div>

                  <p style={styles.paragraph}>
                    Em caso de duvidas sobre este pagamento, entre em contato com nosso departamento financeiro pelo email{' '}
                    <strong>financeiro@garcezpalha.com.br</strong> ou telefone <strong>(21) 3500-0000</strong>.
                  </p>

                  <div style={styles.signature}>
                    <p style={{ margin: 0 }}>Agradecemos a preferencia!</p>
                    <p style={{ margin: '5px 0 0', fontWeight: 'bold' as const }}>Equipe Garcez Palha</p>
                  </div>
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                  <p style={styles.footerText}>
                    Garcez Palha - Advocacia e Pericia<br />
                    CNPJ: 00.000.000/0001-00<br />
                    Rua do Ouvidor, 121 - Centro, Rio de Janeiro - RJ<br />
                    CEP: 20040-030 | Tel: (21) 3500-0000
                  </p>
                  <p style={styles.legalText}>
                    Este documento possui validade fiscal conforme legislacao vigente.
                    <br />
                    Para segunda via, acesse sua area de cliente.
                  </p>
                  <div style={styles.footerLinks}>
                    <a href="https://garcezpalha.com.br/privacidade" style={styles.footerLink}>
                      Politica de Privacidade
                    </a>
                    {' | '}
                    <a href="https://garcezpalha.com.br/termos" style={styles.footerLink}>
                      Termos de Uso
                    </a>
                  </div>
                  <p style={styles.unsubscribe}>
                    Este email foi enviado automaticamente. Por favor, nao responda diretamente.<br />
                    <a href="https://garcezpalha.com.br/unsubscribe" style={styles.unsubscribeLink}>
                      Cancelar inscricao
                    </a>
                  </p>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}

export function renderPaymentReceipt(props: PaymentReceiptProps): string {
  const ReactDOMServer = require('react-dom/server')
  return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(<PaymentReceipt {...props} />)
}
