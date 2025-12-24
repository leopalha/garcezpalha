import React from 'react'

export interface AppointmentConfirmationProps {
  clientName: string
  appointmentDate: string
  appointmentTime: string
  serviceType: string
  lawyerName: string
  location: string
  appointmentId?: string
  notes?: string
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
  successBadge: {
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
    margin: '0 0 20px',
    color: '#1E3A8A',
    fontSize: '24px',
    fontWeight: 'bold' as const,
  },
  paragraph: {
    margin: '0 0 15px',
    color: '#374151',
    lineHeight: '1.6',
    fontSize: '16px',
  },
  detailsBox: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '25px',
    margin: '25px 0',
    border: '1px solid #e2e8f0',
  },
  detailsTitle: {
    margin: '0 0 15px',
    color: '#1E3A8A',
    fontSize: '18px',
    fontWeight: '600' as const,
  },
  detailRow: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    padding: '10px 0',
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
  warningBox: {
    backgroundColor: '#fef3c7',
    borderLeft: '4px solid #d97706',
    padding: '15px',
    margin: '20px 0',
    borderRadius: '0 4px 4px 0',
  },
  warningTitle: {
    margin: '0 0 10px',
    color: '#92400e',
    fontWeight: '600' as const,
  },
  list: {
    margin: '10px 0 0',
    paddingLeft: '20px',
    color: '#78350f',
  },
  listItem: {
    marginBottom: '8px',
    lineHeight: '1.5',
  },
  buttonContainer: {
    textAlign: 'center' as const,
    margin: '30px 0',
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
    marginRight: '10px',
  },
  secondaryButton: {
    display: 'inline-block',
    padding: '12px 30px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600' as const,
    fontSize: '16px',
    border: '1px solid #cbd5e1',
  },
  calendarInfo: {
    backgroundColor: '#eff6ff',
    padding: '15px',
    borderRadius: '6px',
    margin: '20px 0',
    textAlign: 'center' as const,
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
}

export function AppointmentConfirmation({
  clientName,
  appointmentDate,
  appointmentTime,
  serviceType,
  lawyerName,
  location,
  appointmentId,
  notes,
}: AppointmentConfirmationProps): JSX.Element {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Confirmacao de Agendamento - Garcez Palha</title>
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
                    <span style={styles.successBadge}>CONSULTA CONFIRMADA</span>
                  </div>

                  <h2 style={styles.title}>Ola, {clientName}!</h2>

                  <p style={styles.paragraph}>
                    Sua consulta foi agendada com sucesso. Estamos ansiosos para atende-lo(a) e auxiliar em suas
                    necessidades juridicas.
                  </p>

                  {/* Appointment Details */}
                  <div style={styles.detailsBox}>
                    <h3 style={styles.detailsTitle}>Detalhes do Agendamento</h3>

                    <table width="100%" cellSpacing={0} cellPadding={0}>
                      <tbody>
                        {appointmentId && (
                          <tr>
                            <td style={{ ...styles.detailLabel, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                              Codigo:
                            </td>
                            <td style={{ ...styles.detailValue, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                              #{appointmentId}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ ...styles.detailLabel, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                            Data:
                          </td>
                          <td style={{ ...styles.detailValue, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                            {appointmentDate}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ ...styles.detailLabel, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                            Horario:
                          </td>
                          <td style={{ ...styles.detailValue, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                            {appointmentTime}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ ...styles.detailLabel, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                            Servico:
                          </td>
                          <td style={{ ...styles.detailValue, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                            {serviceType}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ ...styles.detailLabel, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                            Advogado:
                          </td>
                          <td style={{ ...styles.detailValue, padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                            Dr(a). {lawyerName}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ ...styles.detailLabel, padding: '10px 0' }}>Local:</td>
                          <td style={{ ...styles.detailValue, padding: '10px 0' }}>{location}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {notes && (
                    <div style={styles.calendarInfo}>
                      <p style={{ margin: 0, color: '#1e40af', fontSize: '14px' }}>
                        <strong>Observacoes:</strong> {notes}
                      </p>
                    </div>
                  )}

                  {/* Important Notice */}
                  <div style={styles.warningBox}>
                    <p style={styles.warningTitle}>Informacoes Importantes:</p>
                    <ul style={styles.list}>
                      <li style={styles.listItem}>Chegue com 10-15 minutos de antecedencia</li>
                      <li style={styles.listItem}>Traga todos os documentos relevantes ao seu caso</li>
                      <li style={styles.listItem}>Em caso de cancelamento, avise com pelo menos 24 horas de antecedencia</li>
                      <li style={styles.listItem}>Apresente um documento de identificacao com foto</li>
                    </ul>
                  </div>

                  <div style={styles.buttonContainer}>
                    <a href="https://garcezpalha.com.br/meus-agendamentos" style={styles.button}>
                      Ver Meus Agendamentos
                    </a>
                  </div>

                  <p style={styles.paragraph}>
                    Precisa reagendar ou cancelar? Entre em contato pelo telefone{' '}
                    <strong>(21) 3500-0000</strong> ou pelo WhatsApp.
                  </p>

                  <div style={styles.signature}>
                    <p style={{ margin: 0 }}>Aguardamos voce!</p>
                    <p style={{ margin: '5px 0 0', fontWeight: 'bold' as const }}>Equipe Garcez Palha</p>
                  </div>
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                  <p style={styles.footerText}>
                    Garcez Palha - Advocacia e Pericia<br />
                    Rua do Ouvidor, 121 - Centro, Rio de Janeiro - RJ<br />
                    CEP: 20040-030 | Tel: (21) 3500-0000
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

export function renderAppointmentConfirmation(props: AppointmentConfirmationProps): string {
  const ReactDOMServer = require('react-dom/server')
  return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(<AppointmentConfirmation {...props} />)
}
