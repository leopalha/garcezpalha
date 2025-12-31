import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface WelcomeEmailProps {
  firstName?: string
  unsubscribeUrl?: string
}

export const WelcomeEmail = ({ firstName = 'Cliente', unsubscribeUrl }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bem-vindo à Garcez Palha - Seus direitos começam aqui</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Logo */}
        <Section style={header}>
          <Img
            src="https://garcezpalha.com/logo.png"
            width="150"
            height="50"
            alt="Garcez Palha"
            style={logo}
          />
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={h1}>Olá {firstName}! 👋</Heading>

          <Text style={text}>
            Seja muito bem-vindo à <strong>Garcez Palha Advogados</strong>. Estamos muito felizes
            em tê-lo conosco!
          </Text>

          <Text style={text}>
            Somos especialistas em ajudar pessoas como você a{' '}
            <strong>garantir seus direitos</strong> nas áreas de:
          </Text>

          <ul style={list}>
            <li style={listItem}>💼 Direito Trabalhista</li>
            <li style={listItem}>💰 Direito Financeiro e Bancário</li>
            <li style={listItem}>🏥 Direito Previdenciário</li>
            <li style={listItem}>🏠 Direito Imobiliário</li>
            <li style={listItem}>🛡️ Direito do Consumidor</li>
          </ul>

          <Section style={buttonContainer}>
            <Button style={button} href="https://garcezpalha.com/agendar">
              Agendar Consulta Gratuita
            </Button>
          </Section>

          <Text style={text}>
            Nos próximos dias, vamos te enviar conteúdos exclusivos sobre direitos que você pode
            nem imaginar que tem. Fique de olho na sua caixa de entrada!
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            📍 Garcez Palha Advogados
            <br />
            📧 Email:{' '}
            <Link href="mailto:contato@garcezpalha.com" style={link}>
              contato@garcezpalha.com
            </Link>
            <br />
            📱 WhatsApp:{' '}
            <Link href="https://wa.me/5511999999999" style={link}>
              (11) 99999-9999
            </Link>
            <br />
            🌐 Site:{' '}
            <Link href="https://garcezpalha.com" style={link}>
              garcezpalha.com
            </Link>
          </Text>

          {unsubscribeUrl && (
            <Text style={unsubscribe}>
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                Cancelar inscrição
              </Link>
            </Text>
          )}
        </Section>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 20px',
  backgroundColor: '#1e40af',
  textAlign: 'center' as const,
}

const logo = {
  margin: '0 auto',
}

const content = {
  padding: '0 40px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '32px',
  marginBottom: '16px',
}

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  marginTop: '16px',
  marginBottom: '16px',
}

const list = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '28px',
  paddingLeft: '20px',
}

const listItem = {
  marginBottom: '8px',
}

const buttonContainer = {
  padding: '27px 0 27px',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#1e40af',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '16px 32px',
}

const hr = {
  borderColor: '#e5e7eb',
  marginTop: '32px',
  marginBottom: '32px',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  marginTop: '24px',
  textAlign: 'center' as const,
}

const link = {
  color: '#1e40af',
  textDecoration: 'underline',
}

const unsubscribe = {
  color: '#9ca3af',
  fontSize: '12px',
  marginTop: '32px',
  textAlign: 'center' as const,
}

const unsubscribeLink = {
  color: '#9ca3af',
  textDecoration: 'underline',
}
