import React from 'react'

export interface WelcomeEmailProps {
  name: string
  email: string
  service?: string
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
    backgroundColor: '#f0f9ff',
    borderLeft: '4px solid #1E3A8A',
    padding: '15px',
    margin: '20px 0',
    borderRadius: '0 4px 4px 0',
  },
  highlightTitle: {
    margin: '0 0 10px',
    color: '#1e40af',
    fontWeight: '600' as const,
  },
  list: {
    margin: '10px 0 0',
    paddingLeft: '20px',
    color: '#374151',
  },
  listItem: {
    marginBottom: '8px',
    lineHeight: '1.5',
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

export function WelcomeEmail({ name, email, service }: WelcomeEmailProps): JSX.Element {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bem-vindo ao Garcez Palha</title>
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
                  <h2 style={styles.title}>Bem-vindo(a), {name}!</h2>

                  <p style={styles.paragraph}>
                    Obrigado por se cadastrar na plataforma Garcez Palha. Estamos honrados em ter voce conosco.
                  </p>

                  <p style={styles.paragraph}>
                    Somos uma das mais antigas e respeitadas firmas juridicas do Brasil, com mais de 364 anos de tradicao
                    em servicos juridicos de excelencia.
                  </p>

                  {service && (
                    <p style={styles.paragraph}>
                      Notamos que voce tem interesse em <strong>{service}</strong>. Nossa equipe especializada
                      esta pronta para atende-lo.
                    </p>
                  )}

                  <div style={styles.highlightBox}>
                    <p style={styles.highlightTitle}>O que voce pode fazer agora:</p>
                    <ul style={styles.list}>
                      <li style={styles.listItem}>Agendar uma consulta gratuita com nossos especialistas</li>
                      <li style={styles.listItem}>Explorar nossos servicos juridicos completos</li>
                      <li style={styles.listItem}>Acompanhar o andamento de seus processos</li>
                      <li style={styles.listItem}>Entrar em contato direto via WhatsApp</li>
                    </ul>
                  </div>

                  <p style={styles.paragraph}>
                    Sua conta foi criada com o email: <strong>{email}</strong>
                  </p>

                  <div style={{ textAlign: 'center' as const, margin: '30px 0' }}>
                    <a href="https://garcezpalha.com.br/contato" style={styles.button}>
                      Agendar Consulta
                    </a>
                  </div>

                  <p style={styles.paragraph}>
                    Se tiver qualquer duvida, nossa equipe de atendimento esta disponivel de segunda a sexta,
                    das 9h as 18h. Responderemos em ate 24 horas uteis.
                  </p>

                  <div style={styles.signature}>
                    <p style={{ margin: 0 }}>Atenciosamente,</p>
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
                    Voce esta recebendo este email porque se cadastrou em nossa plataforma.<br />
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

export function renderWelcomeEmail(props: WelcomeEmailProps): string {
  const ReactDOMServer = require('react-dom/server')
  return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(<WelcomeEmail {...props} />)
}
