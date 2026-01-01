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

interface NurtureEmailProps {
  firstName?: string
  topic: 'direitos' | 'trabalhista' | 'financeiro' | 'previdenciario' | 'consumidor' | 'faq'
  unsubscribeUrl?: string
}

const CONTENT = {
  direitos: {
    preview: 'Você conhece TODOS os seus direitos?',
    title: 'Você conhece TODOS os seus direitos? 🤔',
    intro:
      'A maioria das pessoas não sabe, mas você pode ter direitos a receber valores que nem imaginava!',
    sections: [
      {
        icon: '💼',
        title: 'Direito Trabalhista',
        text: 'Horas extras não pagas, verbas rescisórias incorretas, danos morais por assédio.',
      },
      {
        icon: '💰',
        title: 'Direito Bancário',
        text: 'Juros abusivos, tarifas ilegais (TAC/TEC), empréstimos fraudulentos.',
      },
      {
        icon: '🏥',
        title: 'Direito Previdenciário',
        text: 'Revisão de aposentadoria, auxílio-doença negado, pensão por morte.',
      },
    ],
    cta: 'Fazer Análise Gratuita',
    ctaUrl: 'https://garcezpalha.com/analise-gratuita',
  },
  trabalhista: {
    preview: '5 direitos trabalhistas que você pode estar perdendo',
    title: '5 Direitos Trabalhistas que VOCÊ pode estar perdendo 💼',
    intro:
      'Muitos trabalhadores perdem dinheiro todos os meses sem saber. Veja se você se encaixa:',
    sections: [
      {
        icon: '⏰',
        title: 'Horas Extras',
        text: 'Trabalha mais de 8h/dia ou em finais de semana? Você TEM direito a receber por isso (50-100% a mais).',
      },
      {
        icon: '📱',
        title: 'Equipamentos de Trabalho',
        text: 'Usa seu celular/internet para trabalho? A empresa deve PAGAR por isso.',
      },
      {
        icon: '🏠',
        title: 'Home Office',
        text: 'Trabalha de casa? Empresa deve ressarcir luz, internet, móveis. Muitas não fazem!',
      },
      {
        icon: '💰',
        title: 'Verbas Rescisórias',
        text: 'Foi demitido? Tem direito a aviso prévio, férias proporcionais, 13º, FGTS + multa 40%.',
      },
      {
        icon: '⚠️',
        title: 'Assédio Moral',
        text: 'Sofreu pressão psicológica, humilhação? Pode processar por danos morais (R$ 5k-50k).',
      },
    ],
    cta: 'Calcular Meus Direitos',
    ctaUrl: 'https://garcezpalha.com/trabalhista',
  },
  financeiro: {
    preview: 'Banco cobrando juros abusivos? Você pode receber DE VOLTA',
    title: 'Banco cobrando juros abusivos? Você pode receber DE VOLTA 💰',
    intro:
      'Se você tem empréstimo, financiamento ou cartão de crédito, PROVAVELMENTE está pagando mais do que deveria.',
    sections: [
      {
        icon: '❌',
        title: 'TAC e TEC (PROIBIDAS!)',
        text: 'Tarifas de abertura de crédito proibidas desde 2010. Se pagou, tem direito a DOBRO de volta.',
      },
      {
        icon: '📊',
        title: 'Juros Abusivos',
        text: 'Juros de 3-5% ao mês são ABUSIVOS. Podemos reduzir suas parcelas em 30-50%.',
      },
      {
        icon: '🛡️',
        title: 'Seguro Prestamista',
        text: 'Venderam seguro junto com empréstimo? Venda casada ILEGAL. Restituição em dobro.',
      },
      {
        icon: '💳',
        title: 'Cartão Consignado RMC',
        text: 'Desconto de 5% automático SEM autorização clara? Cancele + receba em dobro.',
      },
    ],
    cta: 'Revisar Meu Contrato Grátis',
    ctaUrl: 'https://garcezpalha.com/revisao-bancaria',
  },
  previdenciario: {
    preview: 'Sua aposentadoria pode estar ERRADA. Veja como revisar',
    title: 'Sua aposentadoria pode estar ERRADA 🏥',
    intro:
      'O INSS erra em MAIS DE 60% das aposentadorias. Você pode estar recebendo MENOS do que deveria.',
    sections: [
      {
        icon: '📈',
        title: 'Revisão da Vida Toda',
        text: 'Incluir salários anteriores a 1994. Aumento médio: R$ 300-800/mês + atrasados.',
      },
      {
        icon: '⏰',
        title: 'Revisão de Tempo Especial',
        text: 'Trabalhou com agentes nocivos (ruído, químicos)? Tempo conta como especial (25 anos).',
      },
      {
        icon: '💼',
        title: 'Auxílio-Acidente Negado',
        text: 'INSS nega 70% dos pedidos. Podemos reverter com perícia médica independente.',
      },
      {
        icon: '👨‍👩‍👧',
        title: 'Pensão por Morte',
        text: 'Perdeu familiar? Pensão pode estar calculada errada. Revisão aumenta valor.',
      },
    ],
    cta: 'Revisar Meu Benefício',
    ctaUrl: 'https://garcezpalha.com/previdenciario',
  },
  consumidor: {
    preview: 'Operadora/Banco te enrolou? Você pode processar!',
    title: 'Operadora/Banco te enrolou? Você pode processar! 🛡️',
    intro:
      'Cobranças indevidas, negativação irregular, produto com defeito... o CDC te protege!',
    sections: [
      {
        icon: '📱',
        title: 'Cobrança Indevida',
        text: 'Operadora cobrou serviço não contratado? Restituição EM DOBRO (Art. 42 CDC).',
      },
      {
        icon: '⚠️',
        title: 'Negativação Irregular',
        text: 'Nome no SPC/Serasa sem avisar? Danos morais R$ 3k-10k + remoção imediata.',
      },
      {
        icon: '🔧',
        title: 'Produto com Vício',
        text: 'Produto quebrou em 90 dias? Loja/fabricante DEVE trocar ou devolver dinheiro.',
      },
      {
        icon: '⚡',
        title: 'Conta de Luz Absurda',
        text: 'Valor absurdo sem justificativa? Suspenda corte + perícia técnica + restituição.',
      },
    ],
    cta: 'Processar Agora',
    ctaUrl: 'https://garcezpalha.com/consumidor',
  },
  faq: {
    preview: 'Dúvidas frequentes sobre processar e receber seus direitos',
    title: 'Perguntas Frequentes sobre Processos ❓',
    intro: 'Respondemos as dúvidas mais comuns sobre como funciona o processo:',
    sections: [
      {
        icon: '💰',
        title: 'Preciso pagar antes?',
        text: 'NÃO! Trabalhamos com honorários de êxito (20-30% do que você receber). Só ganha se você ganhar.',
      },
      {
        icon: '⏱️',
        title: 'Quanto tempo demora?',
        text: 'Depende: JEC (até R$ 40k) = 6-12 meses. Justiça Comum = 1-2 anos. Mas liminares saem em 48h!',
      },
      {
        icon: '📄',
        title: 'Quais documentos preciso?',
        text: 'Depende do caso, mas geralmente: RG, CPF, comprovante de residência + documentos específicos.',
      },
      {
        icon: '🏛️',
        title: 'Preciso ir ao fórum?',
        text: 'Quase nunca! 90% dos processos são online. Só audiências (se houver) são presenciais.',
      },
      {
        icon: '✅',
        title: 'Qual a chance de ganhar?',
        text: 'Depende do caso. Nossa taxa de êxito é 85-95%. Só aceitamos casos com jurisprudência favorável.',
      },
    ],
    cta: 'Tirar Minhas Dúvidas',
    ctaUrl: 'https://garcezpalha.com/contato',
  },
}

export const NurtureEmail = ({
  firstName = 'Cliente',
  topic,
  unsubscribeUrl,
}: NurtureEmailProps) => {
  const content = CONTENT[topic]

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
            <Heading style={h1}>{content.title}</Heading>

            <Text style={text}>{content.intro}</Text>

            {content.sections.map((section, index) => (
              <Section key={index} style={sectionBox}>
                <Heading style={h2}>
                  {section.icon} {section.title}
                </Heading>
                <Text style={sectionText}>{section.text}</Text>
              </Section>
            ))}

            <Section style={buttonContainer}>
              <Button style={button} href={content.ctaUrl}>
                {content.cta}
              </Button>
            </Section>

            <Text style={text}>
              <strong>📞 Dúvidas?</strong> Responda este email ou fale conosco pelo WhatsApp:{' '}
              <Link href="https://wa.me/5511999999999" style={link}>
                (11) 99999-9999
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

export default NurtureEmail

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

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '32px',
  marginBottom: '16px',
}

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '12px',
}

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  marginTop: '16px',
  marginBottom: '16px',
}

const sectionBox = {
  padding: '20px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  borderLeft: '4px solid #1e40af',
  marginTop: '16px',
  marginBottom: '16px',
}

const sectionText = {
  color: '#4b5563',
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0',
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
