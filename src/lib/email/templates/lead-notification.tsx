import React from 'react'

export interface LeadNotificationProps {
  leadName: string
  leadEmail: string
  leadPhone?: string
  leadService: string
  leadMessage?: string
  leadSource?: string
  createdAt: string
  leadId?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
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
    padding: '25px 30px',
    backgroundColor: '#1E3A8A',
    borderRadius: '8px 8px 0 0',
  },
  headerContent: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  logo: {
    margin: 0,
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold' as const,
  },
  logoAccent: {
    color: '#D4AF37',
  },
  internalBadge: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '700' as const,
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  },
  content: {
    padding: '30px',
  },
  alertBanner: {
    backgroundColor: '#fef2f2',
    border: '2px solid #fca5a5',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '25px',
    textAlign: 'center' as const,
  },
  alertText: {
    margin: 0,
    color: '#991b1b',
    fontSize: '18px',
    fontWeight: '700' as const,
  },
  title: {
    margin: '0 0 20px',
    color: '#1E3A8A',
    fontSize: '22px',
    fontWeight: 'bold' as const,
  },
  paragraph: {
    margin: '0 0 15px',
    color: '#374151',
    lineHeight: '1.6',
    fontSize: '15px',
  },
  priorityBadge: {
    low: {
      display: 'inline-block',
      backgroundColor: '#dcfce7',
      color: '#166534',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600' as const,
    },
    medium: {
      display: 'inline-block',
      backgroundColor: '#fef3c7',
      color: '#92400e',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600' as const,
    },
    high: {
      display: 'inline-block',
      backgroundColor: '#fed7aa',
      color: '#c2410c',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600' as const,
    },
    urgent: {
      display: 'inline-block',
      backgroundColor: '#fecaca',
      color: '#991b1b',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600' as const,
    },
  },
  leadInfoBox: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px 0',
    border: '1px solid #e2e8f0',
  },
  leadInfoTitle: {
    margin: '0 0 15px',
    color: '#1E3A8A',
    fontSize: '16px',
    fontWeight: '600' as const,
  },
  infoRow: {
    padding: '10px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  infoLabel: {
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '500' as const,
    marginBottom: '4px',
  },
  infoValue: {
    color: '#1e293b',
    fontSize: '15px',
    fontWeight: '600' as const,
    wordBreak: 'break-all' as const,
  },
  messageBox: {
    backgroundColor: '#fffbeb',
    borderLeft: '4px solid #f59e0b',
    padding: '15px',
    margin: '20px 0',
    borderRadius: '0 4px 4px 0',
  },
  messageTitle: {
    margin: '0 0 10px',
    color: '#92400e',
    fontSize: '14px',
    fontWeight: '600' as const,
  },
  messageText: {
    margin: 0,
    color: '#78350f',
    fontSize: '14px',
    lineHeight: '1.6',
    fontStyle: 'italic' as const,
  },
  metaInfo: {
    backgroundColor: '#f1f5f9',
    padding: '12px 15px',
    borderRadius: '6px',
    margin: '20px 0',
  },
  metaText: {
    margin: '0 0 5px',
    color: '#64748b',
    fontSize: '12px',
  },
  buttonContainer: {
    textAlign: 'center' as const,
    margin: '25px 0',
  },
  primaryButton: {
    display: 'inline-block',
    padding: '12px 30px',
    backgroundColor: '#1E3A8A',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600' as const,
    fontSize: '15px',
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
    fontSize: '15px',
    border: '1px solid #cbd5e1',
  },
  actionRequired: {
    backgroundColor: '#fff7ed',
    border: '1px solid #fed7aa',
    borderRadius: '6px',
    padding: '15px',
    margin: '20px 0',
    textAlign: 'center' as const,
  },
  actionText: {
    margin: 0,
    color: '#c2410c',
    fontSize: '14px',
    fontWeight: '600' as const,
  },
  footer: {
    padding: '15px 30px',
    backgroundColor: '#f8fafc',
    borderRadius: '0 0 8px 8px',
    textAlign: 'center' as const,
    borderTop: '1px solid #e2e8f0',
  },
  footerText: {
    margin: '0',
    color: '#94a3b8',
    fontSize: '11px',
    lineHeight: '1.5',
  },
}

const priorityLabels = {
  low: 'Baixa',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
}

export function LeadNotification({
  leadName,
  leadEmail,
  leadPhone,
  leadService,
  leadMessage,
  leadSource = 'Website',
  createdAt,
  leadId,
  priority = 'medium',
}: LeadNotificationProps): JSX.Element {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Novo Lead - Notificacao Interna</title>
      </head>
      <body style={styles.body}>
        <table role="presentation" width="100%" cellSpacing={0} cellPadding={0}>
          <tr>
            <td align="center" style={{ padding: '40px 20px' }}>
              <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                  <table width="100%" cellSpacing={0} cellPadding={0}>
                    <tr>
                      <td>
                        <h1 style={styles.logo}>
                          Garcez<span style={styles.logoAccent}> Palha</span>
                        </h1>
                      </td>
                      <td style={{ textAlign: 'right' as const }}>
                        <span style={styles.internalBadge}>USO INTERNO</span>
                      </td>
                    </tr>
                  </table>
                </div>

                {/* Content */}
                <div style={styles.content}>
                  {/* Alert Banner */}
                  <div style={styles.alertBanner}>
                    <p style={styles.alertText}>NOVO LEAD RECEBIDO</p>
                  </div>

                  <h2 style={styles.title}>Notificacao de Novo Lead</h2>

                  <p style={styles.paragraph}>
                    Um novo lead foi registrado no sistema e requer atencao da equipe comercial.
                  </p>

                  {/* Priority Badge */}
                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px', marginRight: '8px' }}>Prioridade:</span>
                    <span style={styles.priorityBadge[priority]}>{priorityLabels[priority]}</span>
                  </div>

                  {/* Lead Information */}
                  <div style={styles.leadInfoBox}>
                    <h3 style={styles.leadInfoTitle}>Informacoes do Lead</h3>

                    <div style={styles.infoRow}>
                      <div style={styles.infoLabel}>Nome Completo:</div>
                      <div style={styles.infoValue}>{leadName}</div>
                    </div>

                    <div style={styles.infoRow}>
                      <div style={styles.infoLabel}>Email:</div>
                      <div style={styles.infoValue}>
                        <a href={`mailto:${leadEmail}`} style={{ color: '#1E3A8A', textDecoration: 'none' }}>
                          {leadEmail}
                        </a>
                      </div>
                    </div>

                    {leadPhone && (
                      <div style={styles.infoRow}>
                        <div style={styles.infoLabel}>Telefone:</div>
                        <div style={styles.infoValue}>
                          <a href={`tel:${leadPhone}`} style={{ color: '#1E3A8A', textDecoration: 'none' }}>
                            {leadPhone}
                          </a>
                        </div>
                      </div>
                    )}

                    <div style={styles.infoRow}>
                      <div style={styles.infoLabel}>Servico de Interesse:</div>
                      <div style={styles.infoValue}>{leadService}</div>
                    </div>

                    <div style={{ padding: '10px 0' }}>
                      <div style={styles.infoLabel}>Origem:</div>
                      <div style={styles.infoValue}>{leadSource}</div>
                    </div>
                  </div>

                  {/* Lead Message */}
                  {leadMessage && (
                    <div style={styles.messageBox}>
                      <p style={styles.messageTitle}>Mensagem do Lead:</p>
                      <p style={styles.messageText}>"{leadMessage}"</p>
                    </div>
                  )}

                  {/* Meta Information */}
                  <div style={styles.metaInfo}>
                    <p style={styles.metaText}>
                      <strong>Data/Hora do Registro:</strong> {createdAt}
                    </p>
                    {leadId && (
                      <p style={{ ...styles.metaText, margin: 0 }}>
                        <strong>ID do Lead:</strong> #{leadId}
                      </p>
                    )}
                  </div>

                  {/* Action Required */}
                  <div style={styles.actionRequired}>
                    <p style={styles.actionText}>
                      Acao Requerida: Entre em contato em ate 24 horas uteis
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div style={styles.buttonContainer}>
                    <a href="https://garcezpalha.com.br/admin/leads" style={styles.primaryButton}>
                      Ver no Painel Admin
                    </a>
                    <br />
                    <br />
                    {leadPhone && (
                      <a
                        href={`https://wa.me/55${leadPhone.replace(/\D/g, '')}`}
                        style={styles.secondaryButton}
                      >
                        Contatar via WhatsApp
                      </a>
                    )}
                  </div>

                  <p style={styles.paragraph}>
                    <strong>Lembrete:</strong> Leads que sao contatados nas primeiras 2 horas tem 7x mais chances de
                    conversao. Priorize este contato!
                  </p>
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                  <p style={styles.footerText}>
                    Este e um email interno automatico do sistema Garcez Palha.
                    <br />
                    Nao responda diretamente a este email.
                    <br />
                    Para suporte tecnico: ti@garcezpalha.com.br
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

export function renderLeadNotification(props: LeadNotificationProps): string {
  const ReactDOMServer = require('react-dom/server')
  return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(<LeadNotification {...props} />)
}
