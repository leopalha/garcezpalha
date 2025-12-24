import React from 'react'

export interface PartnerWelcomeProps {
  partnerName: string
  partnerEmail: string
  partnerCode: string
  commissionRate: number
  dashboardUrl?: string
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
  partnerBadge: {
    display: 'inline-block',
    backgroundColor: '#D4AF37',
    color: '#1E3A8A',
    padding: '10px 20px',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '700' as const,
    marginTop: '15px',
    letterSpacing: '1px',
  },
  content: {
    padding: '40px 30px',
  },
  welcomeBadge: {
    display: 'inline-block',
    backgroundColor: '#fef3c7',
    color: '#92400e',
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
  highlightBox: {
    backgroundColor: '#fefbeb',
    borderLeft: '4px solid #D4AF37',
    padding: '20px',
    margin: '25px 0',
    borderRadius: '0 8px 8px 0',
  },
  highlightTitle: {
    margin: '0 0 15px',
    color: '#92400e',
    fontWeight: '700' as const,
    fontSize: '16px',
  },
  codeBox: {
    backgroundColor: '#1E3A8A',
    color: '#ffffff',
    padding: '15px 20px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    margin: '10px 0',
  },
  codeLabel: {
    margin: '0 0 5px',
    fontSize: '12px',
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  codeValue: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700' as const,
    letterSpacing: '2px',
  },
  statsBox: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '25px',
    margin: '25px 0',
    border: '1px solid #e2e8f0',
  },
  statsTitle: {
    margin: '0 0 15px',
    color: '#1E3A8A',
    fontSize: '18px',
    fontWeight: '600' as const,
  },
  statItem: {
    padding: '12px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  statLabel: {
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500' as const,
  },
  statValue: {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: '700' as const,
    textAlign: 'right' as const,
  },
  benefitsList: {
    backgroundColor: '#f0f9ff',
    padding: '20px',
    borderRadius: '8px',
    margin: '20px 0',
  },
  benefitsTitle: {
    margin: '0 0 15px',
    color: '#1e40af',
    fontWeight: '600' as const,
  },
  list: {
    margin: '0',
    paddingLeft: '20px',
    color: '#374151',
  },
  listItem: {
    marginBottom: '10px',
    lineHeight: '1.5',
  },
  stepsBox: {
    backgroundColor: '#fff7ed',
    padding: '20px',
    borderRadius: '8px',
    margin: '20px 0',
    border: '1px solid #fed7aa',
  },
  stepsTitle: {
    margin: '0 0 15px',
    color: '#c2410c',
    fontWeight: '600' as const,
  },
  stepItem: {
    display: 'flex' as const,
    marginBottom: '12px',
    alignItems: 'flex-start' as const,
  },
  stepNumber: {
    backgroundColor: '#c2410c',
    color: '#ffffff',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '12px',
    fontWeight: '700' as const,
    marginRight: '12px',
    flexShrink: 0,
  },
  buttonContainer: {
    textAlign: 'center' as const,
    margin: '30px 0',
  },
  button: {
    display: 'inline-block',
    padding: '14px 35px',
    backgroundColor: '#D4AF37',
    color: '#1E3A8A',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '700' as const,
    fontSize: '16px',
  },
  secondaryButton: {
    display: 'inline-block',
    padding: '12px 30px',
    backgroundColor: '#1E3A8A',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600' as const,
    fontSize: '14px',
    marginTop: '10px',
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

export function PartnerWelcome({
  partnerName,
  partnerEmail,
  partnerCode,
  commissionRate,
  dashboardUrl = 'https://garcezpalha.com.br/parceiro',
}: PartnerWelcomeProps): JSX.Element {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bem-vindo ao Programa de Parceiros - Garcez Palha</title>
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
                  <div>
                    <span style={styles.partnerBadge}>PROGRAMA DE PARCEIROS</span>
                  </div>
                </div>

                {/* Content */}
                <div style={styles.content}>
                  <div style={{ textAlign: 'center' as const }}>
                    <span style={styles.welcomeBadge}>BEM-VINDO(A) AO TIME!</span>
                  </div>

                  <h2 style={styles.title}>Parabens, {partnerName}!</h2>

                  <p style={styles.paragraph}>
                    E com grande satisfacao que lhe damos as boas-vindas ao <strong>Programa de Parceiros Garcez Palha</strong>.
                    Voce agora faz parte de uma rede exclusiva de profissionais que colaboram com uma das mais tradicionais
                    firmas juridicas do Brasil.
                  </p>

                  {/* Partner Code Box */}
                  <div style={styles.highlightBox}>
                    <p style={styles.highlightTitle}>Seu Codigo de Parceiro Exclusivo:</p>
                    <div style={styles.codeBox}>
                      <p style={styles.codeLabel}>Codigo de Referencia</p>
                      <p style={styles.codeValue}>{partnerCode}</p>
                    </div>
                    <p style={{ margin: '10px 0 0', color: '#78350f', fontSize: '13px' }}>
                      Use este codigo para compartilhar com seus contatos e acompanhar suas indicacoes.
                    </p>
                  </div>

                  {/* Commission Info */}
                  <div style={styles.statsBox}>
                    <h3 style={styles.statsTitle}>Informacoes da Sua Conta</h3>
                    <table width="100%" cellSpacing={0} cellPadding={0}>
                      <tbody>
                        <tr>
                          <td style={{ ...styles.statLabel, padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                            Email cadastrado:
                          </td>
                          <td style={{ ...styles.statValue, padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                            {partnerEmail}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ ...styles.statLabel, padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                            Taxa de Comissao:
                          </td>
                          <td style={{ ...styles.statValue, padding: '12px 0', borderBottom: '1px solid #e2e8f0', color: '#16a34a' }}>
                            {commissionRate}%
                          </td>
                        </tr>
                        <tr>
                          <td style={{ ...styles.statLabel, padding: '12px 0' }}>Status:</td>
                          <td style={{ ...styles.statValue, padding: '12px 0', color: '#16a34a' }}>Ativo</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Benefits */}
                  <div style={styles.benefitsList}>
                    <p style={styles.benefitsTitle}>Beneficios do Programa:</p>
                    <ul style={styles.list}>
                      <li style={styles.listItem}>
                        Comissao de <strong>{commissionRate}%</strong> sobre cada contrato fechado
                      </li>
                      <li style={styles.listItem}>Painel exclusivo para acompanhamento de indicacoes</li>
                      <li style={styles.listItem}>Materiais de marketing personalizados</li>
                      <li style={styles.listItem}>Suporte dedicado para parceiros</li>
                      <li style={styles.listItem}>Pagamentos mensais via PIX ou transferencia</li>
                      <li style={styles.listItem}>Relatorios detalhados de performance</li>
                    </ul>
                  </div>

                  {/* Next Steps */}
                  <div style={styles.stepsBox}>
                    <p style={styles.stepsTitle}>Proximos Passos:</p>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={styles.stepNumber}>1</span>
                      <span style={{ color: '#78350f', lineHeight: '1.5' }}>
                        Acesse seu painel de parceiro e complete seu perfil
                      </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={styles.stepNumber}>2</span>
                      <span style={{ color: '#78350f', lineHeight: '1.5' }}>
                        Configure seus dados bancarios para receber comissoes
                      </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={styles.stepNumber}>3</span>
                      <span style={{ color: '#78350f', lineHeight: '1.5' }}>Compartilhe seu link de indicacao exclusivo</span>
                    </div>
                    <div>
                      <span style={styles.stepNumber}>4</span>
                      <span style={{ color: '#78350f', lineHeight: '1.5' }}>Acompanhe suas indicacoes em tempo real</span>
                    </div>
                  </div>

                  <div style={styles.buttonContainer}>
                    <a href={dashboardUrl} style={styles.button}>
                      Acessar Painel do Parceiro
                    </a>
                    <br />
                    <a href={`${dashboardUrl}/link`} style={styles.secondaryButton}>
                      Gerar Link de Indicacao
                    </a>
                  </div>

                  <p style={styles.paragraph}>
                    Estamos animados para trabalhar com voce! Se tiver qualquer duvida, nossa equipe de suporte aos parceiros
                    esta disponivel pelo email <strong>parceiros@garcezpalha.com.br</strong>.
                  </p>

                  <div style={styles.signature}>
                    <p style={{ margin: 0 }}>Bem-vindo(a) ao time!</p>
                    <p style={{ margin: '5px 0 0', fontWeight: 'bold' as const }}>Equipe Garcez Palha</p>
                  </div>
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                  <p style={styles.footerText}>
                    Garcez Palha - Advocacia e Pericia<br />
                    Programa de Parceiros<br />
                    Rua do Ouvidor, 121 - Centro, Rio de Janeiro - RJ<br />
                    Tel: (21) 3500-0000 | parceiros@garcezpalha.com.br
                  </p>
                  <div style={styles.footerLinks}>
                    <a href="https://garcezpalha.com.br/privacidade" style={styles.footerLink}>
                      Politica de Privacidade
                    </a>
                    {' | '}
                    <a href="https://garcezpalha.com.br/termos" style={styles.footerLink}>
                      Termos de Uso
                    </a>
                    {' | '}
                    <a href="https://garcezpalha.com.br/termos-parceiros" style={styles.footerLink}>
                      Termos do Programa
                    </a>
                  </div>
                  <p style={styles.unsubscribe}>
                    Voce esta recebendo este email porque se cadastrou como parceiro.<br />
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

export function renderPartnerWelcome(props: PartnerWelcomeProps): string {
  const ReactDOMServer = require('react-dom/server')
  return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(<PartnerWelcome {...props} />)
}
