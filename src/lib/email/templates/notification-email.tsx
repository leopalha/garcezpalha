import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface NotificationEmailProps {
  recipientName: string
  notificationType: 'message' | 'document' | 'case_update' | 'deadline' | 'payment'
  title: string
  description: string
  actionUrl: string
  actionText: string
}

const notificationConfig = {
  message: {
    emoji: '💬',
    color: '#3b82f6',
    label: 'Nova Mensagem'
  },
  document: {
    emoji: '📄',
    color: '#10b981',
    label: 'Atualização de Documento'
  },
  case_update: {
    emoji: '⚖️',
    color: '#8b5cf6',
    label: 'Atualização do Caso'
  },
  deadline: {
    emoji: '⏰',
    color: '#f97316',
    label: 'Prazo Importante'
  },
  payment: {
    emoji: '💳',
    color: '#ec4899',
    label: 'Notificação de Pagamento'
  }
}

export function NotificationEmail({
  recipientName = 'Cliente',
  notificationType = 'message',
  title = 'Você tem uma nova notificação',
  description = 'Houve uma atualização no seu caso.',
  actionUrl = 'https://garcezpalha.com/cliente/dashboard',
  actionText = 'Ver Detalhes'
}: NotificationEmailProps) {
  const config = notificationConfig[notificationType]

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src="https://garcezpalha.com/images/logo.png"
              width="120"
              height="40"
              alt="Garcez Palha"
              style={logo}
            />
          </Section>

          {/* Notification Badge */}
          <Section style={badgeSection}>
            <div style={{
              ...badge,
              backgroundColor: config.color
            }}>
              <Text style={badgeText}>
                {config.emoji} {config.label}
              </Text>
            </div>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Olá, {recipientName}!</Heading>

            <Text style={text}>
              {title}
            </Text>

            <div style={notificationBox}>
              <Text style={notificationText}>
                {description}
              </Text>
            </div>

            <Section style={buttonSection}>
              <Button style={{
                ...button,
                backgroundColor: config.color
              }} href={actionUrl}>
                {actionText}
              </Button>
            </Section>

            <Text style={smallText}>
              Ou copie e cole este link no seu navegador:
            </Text>
            <Link href={actionUrl} style={link}>
              {actionUrl}
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Garcez Palha - Inteligência Jurídica
            </Text>
            <Text style={footerText}>
              Tradição desde 1661 | Excelência desde sempre
            </Text>
            <Text style={footerText}>
              (21) 99535-4010 | contato@garcezpalha.com
            </Text>
            <Text style={footerSmall}>
              Este é um email automático. Por favor, não responda.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 48px',
  borderBottom: '1px solid #e5e7eb',
}

const logo = {
  margin: '0 auto',
}

const badgeSection = {
  padding: '24px 48px 0',
}

const badge = {
  display: 'inline-block',
  padding: '8px 16px',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
}

const badgeText = {
  margin: 0,
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
}

const content = {
  padding: '0 48px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '700',
  margin: '24px 0',
  padding: '0',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const notificationBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const notificationText = {
  color: '#1f2937',
  fontSize: '15px',
  lineHeight: '22px',
  margin: 0,
}

const buttonSection = {
  padding: '32px 0',
  textAlign: 'center' as const,
}

const button = {
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
}

const smallText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0 8px',
}

const link = {
  color: '#3b82f6',
  fontSize: '14px',
  textDecoration: 'underline',
}

const footer = {
  borderTop: '1px solid #e5e7eb',
  padding: '32px 48px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
}

const footerSmall = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '16px 0 0',
}

export default NotificationEmail
