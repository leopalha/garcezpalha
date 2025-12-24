import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Plano de Saude Negou | Garcez Palha Advogados',
  description:
    'Plano de saude negou cirurgia, exame ou tratamento? Revertemos negativas de forma rapida. Tutela de urgencia para garantir seu direito a saude.',
  keywords: [
    'plano de saude negou',
    'negativa plano de saude',
    'acao contra plano de saude',
    'cirurgia negada',
    'tratamento negado',
    'ANS',
  ],
}

export default function PlanoSaudePage() {
  const solution = getSolutionById('plano-saude')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'saude' && s.id !== 'plano-saude'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Plano de Saude Negou? Reverta Ja"
      heroSubtitle="Acao judicial especializada para reverter negativas de planos de saude. Conseguimos liminares em 24-48h para casos urgentes."
      heroProblem="Seu plano negou cirurgia, exame, internacao ou tratamento? Alegou que nao esta coberto ou que e experimental? Nao aceite - isso pode ser ilegal e podemos reverter."
      solution={solution}
      solutionBenefits={[
        'Analise da negativa e do contrato do plano',
        'Identificacao de ilegalidades e ma-fe',
        'Pedido de tutela de urgencia (liminar rapida)',
        'Acao judicial completa com todos os fundamentos',
        'Acompanhamento ate autorizacao do procedimento',
        'Possibilidade de indenizacao por danos morais',
      ]}
      documentsRequired={[
        'RG e CPF',
        'Carteirinha do plano de saude',
        'Contrato do plano (ou podemos solicitar)',
        'Carta de negativa ou protocolo da negativa',
        'Pedido medico ou relatorio justificando o procedimento',
        'Exames ja realizados',
        'Comprovante de pagamento das mensalidades',
      ]}
      faqItems={[
        {
          question: 'Em quanto tempo consigo a autorizacao?',
          answer:
            'Em casos urgentes (cirurgias, internacoes, tratamentos inadiaveis), conseguimos liminares em 24 a 48 horas na maioria dos casos. Para procedimentos eletivos, o prazo medio e de 5 a 15 dias. Tudo depende da urgencia medica e disponibilidade do juiz plantonista.',
        },
        {
          question: 'Quais sao os motivos mais comuns de negativa ilegal?',
          answer:
            'Alegar que procedimento e experimental quando ja ha estudos comprovando eficacia; negar materiais e proteses relacionados a cirurgia coberta; exigir carencia ja cumprida; negar atendimento de urgencia/emergencia; recusar coberturas obrigatorias pela ANS. Analisamos seu caso especificamente.',
        },
        {
          question: 'Quanto custa a acao contra plano de saude?',
          answer:
            'Nosso pacote completo custa R$ 2.500,00 e inclui toda a acao ate a autorizacao do procedimento. Em muitos casos, o plano e condenado a pagar os honorarios advocaticios, entao voce pode ser reembolsado. Nao cobramos % do valor da causa.',
        },
        {
          question: 'Posso pedir indenizacao por danos morais?',
          answer:
            'Sim, e comum incluir pedido de danos morais, especialmente quando a negativa causa sofrimento, agrava doenca, ou demonstra ma-fe do plano. Valores variam de R$ 5.000 a R$ 30.000 conforme a gravidade. Avaliamos a viabilidade em cada caso.',
        },
        {
          question: 'E se eu fizer o procedimento particular e processar depois?',
          answer:
            'Voce pode fazer isso e pedir reembolso na justica, mas atencao: o plano so e obrigado a reembolsar conforme a tabela contratada (geralmente muito menor que o custo particular). O ideal e conseguir a autorizacao antes, exceto em emergencias onde nao ha tempo de esperar.',
        },
        {
          question: 'O plano pode me punir por processar?',
          answer:
            'Nao. E ilegal qualquer retaliacao como cancelamento ou aumento abusivo de mensalidade por exercer seu direito de acao. Se isso ocorrer, configura ma-fe e gera novas indenizacoes. Seu contrato esta protegido por lei.',
        },
      ]}
      categoryName="Protecao de Saude"
      relatedProducts={relatedProducts}
    />
  )
}
