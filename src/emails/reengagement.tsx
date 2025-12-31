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

interface ReengagementEmailProps {
  firstName?: string
  variant: 'miss-you' | 'last-chance' | 'special-offer' | 'feedback'
  unsubscribeUrl?: string
}

const CONTENT = {
  'miss-you': {
    preview: 'Sentimos sua falta! 🥺',
    emoji: '🥺',
    title: 'Sentimos sua falta!',
    subtitle: 'Faz tempo que não conversamos...',
    body: [
      'Notamos que você não interage com nossos emails há um tempo.',
      'Queremos saber se ainda podemos ajudá-lo com seus direitos!',
      'Temos novos serviços e uma equipe ainda mais preparada para te atender.',
    ],
    cta: 'Quero Voltar',
    ctaUrl: 'https://garcezpalha.com/retornar',
    highlight: {
      title: '🎁 Presente Especial',
      text: 'Como você é especial para nós, estamos oferecendo uma ANÁLISE GRATUITA COMPLETA do seu caso!',
    },
  },
  'last-chance': {
    preview: 'Última chance antes de removermos você da lista',
    emoji: '⚠️',
    title: 'Esta é nossa última mensagem',
    subtitle: 'Última chance de continuar recebendo nossos conteúdos',
    body: [
      'Respeitamos muito sua caixa de entrada. Como você não interage há mais de 60 dias, vamos REMOVER você da nossa lista em 7 dias.',
      'Se ainda quiser receber conteúdos sobre seus direitos, casos de sucesso e oportunidades, clique no botão abaixo.',
      'Caso não clique, você será removido automaticamente e não receberá mais emails nossos.',
    ],
    cta: 'Quero Continuar Recebendo',
    ctaUrl: 'https://garcezpalha.com/reativar',
    highlight: {
      title: '⏰ Você tem 7 dias',
      text: 'Após este prazo, você será REMOVIDO da lista e não receberá mais atualizações sobre seus direitos.',
    },
  },
  'special-offer': {
    preview: 'Oferta EXCLUSIVA para você que voltou! 🎉',
    emoji: '🎉',
    title: 'Oferta EXCLUSIVA para você!',
    subtitle: 'Queremos te ajudar com condições especiais',
    body: [
      'Que bom ter você de volta! 🎉',
      'Como você é um lead especial, preparamos uma oferta ÚNICA para te ajudar com seus direitos.',
    ],
    cta: 'Ver Oferta Exclusiva',
    ctaUrl: 'https://garcezpalha.com/oferta-exclusiva',
    highlight: {
      title: '💎 Oferta VIP',
      text: 'Análise gratuita + 10% de desconto nos honorários + Atendimento prioritário',
    },
    benefits: [
      '✅ Análise completa gratuita do seu caso',
      '✅ 10% de desconto nos honorários de êxito',
      '✅ Atendimento prioritário (resposta em 24h)',
      '✅ Consulta com advogado especialista',
      '✅ Cálculo de valores a receber',
    ],
  },
  feedback: {
    preview: 'Pode nos ajudar? O que poderíamos fazer melhor?',
    emoji: '💬',
    title: 'Sua opinião é muito importante!',
    subtitle: 'Queremos melhorar e precisamos da sua ajuda',
    body: [
      'Notamos que você parou de interagir com nossos emails. Isso nos deixou preocupados! 😟',
      'Queremos muito melhorar, mas para isso precisamos saber: **o que aconteceu?**',
    ],
    cta: 'Dar Meu Feedback',
    ctaUrl: 'https://garcezpalha.com/feedback',
    highlight: {
      title: '🎁 Agradecimento',
      text: 'Como agradecimento pelo seu tempo, vamos te dar uma análise GRATUITA do seu caso!',
    },
    questions: [
      '❓ Nossos emails não são interessantes?',
      '❓ Enviamos emails demais?',
      '❓ Você já resolveu seu problema?',
      '❓ Não encontrou o que procurava?',
      '❓ Outro motivo?',
    ],
  },
}

export const ReengagementEmail = ({
  firstName = 'Cliente',
  variant,
  unsubscribeUrl,
}: ReengagementEmailProps) => {
  const content = CONTENT[variant]

  return (
    <Html>
      <Head />
      <Preview>{content.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://garcezpalha.com/logo.png"
              width="150"
              height="50"
              alt="Garcez Palha"
              style={logo}
            />
          </Section>

          {/* Content */}
          <Section style={contentSection}>
            <div style={emojiHeader}>{content.emoji}</div>

            <Heading style={h1}>{content.title}</Heading>
            <Text style={subtitle}>{content.subtitle}</Text>

            {content.body.map((paragraph, index) => (
              <Text key={index} style={text}>
                {paragraph}
              </Text>
            ))}

            {/* Highlight Box */}
            <Section style={highlightBox}>
              <Heading style={highlightTitle}>{content.highlight.title}</Heading>
              <Text style={highlightText}>{content.highlight.text}</Text>
            </Section>

            {/* Benefits (apenas para special-offer) */}
            {content.benefits && (
              <Section style={benefitsBox}>
                {content.benefits.map((benefit, index) => (
                  <Text key={index} style={benefitItem}>
                    {benefit}
                  </Text>
                ))}
              </Section>
            )}

            {/* Questions (apenas para feedback) */}
            {content.questions && (
              <Section style={questionsBox}>
                {content.questions.map((question, index) => (
                  <Text key={index} style={questionItem}>
                    {question}
                  </Text>
                ))}
              </Section>
            )}

            <Section style={buttonContainer}>
              <Button style={button} href={content.ctaUrl}>
                {content.cta}
              </Button>
            </Section>

            <Text style={text}>
              Qualquer dúvida, responda este email ou fale conosco:{' '}
              <Link href="https://wa.me/5511999999999" style={link}>
                WhatsApp (11) 99999-9999
              </Link>
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Garcez Palha Advogados | OAB/SP 123.456
              <br />
              contato@garcezpalha.com | garcezpalha.com
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
}

export default ReengagementEmail

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

const contentSection = {
  padding: '0 40px',
}

const emojiHeader = {
  fontSize: '64px',
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '16px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '16px',
  marginBottom: '8px',
  textAlign: 'center' as const,
}

const subtitle = {
  color: '#6b7280',
  fontSize: '18px',
  marginTop: '0',
  marginBottom: '32px',
  textAlign: 'center' as const,
}

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  marginTop: '16px',
  marginBottom: '16px',
}

const highlightBox = {
  padding: '24px',
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  borderLeft: '4px solid #f59e0b',
  marginTop: '24px',
  marginBottom: '24px',
}

const highlightTitle = {
  color: '#92400e',
  fontSize: '20px',
  fontWeight: 'bold',
  marginTop: '0',
  marginBottom: '12px',
}

const highlightText = {
  color: '#78350f',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
}

const benefitsBox = {
  padding: '20px',
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  marginTop: '24px',
  marginBottom: '24px',
}

const benefitItem = {
  color: '#166534',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '8px 0',
}

const questionsBox = {
  padding: '20px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  marginTop: '24px',
  marginBottom: '24px',
}

const questionItem = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '8px 0',
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
