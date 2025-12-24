import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Golpe do PIX - Recupere seu Dinheiro | Garcez Palha',
  description:
    'Foi vitima de golpe do PIX? Recupere seu dinheiro em ate 30 dias com acao judicial especializada. Atendimento 24/7.',
  keywords: [
    'golpe pix',
    'recuperar dinheiro pix',
    'acao judicial golpe',
    'pix golpe advogado',
    'fraude pix',
    'devolucao pix',
    'bloqueio conta golpista',
    'advogado golpe pix',
  ],
}

export default function GolpePixPage() {
  const solution = getSolutionById('golpe-pix')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'financeiro' && s.id !== 'golpe-pix'
  ).slice(0, 3)

  // Pacotes customizados para diferentes niveis de servico
  const packages = [
    {
      name: 'Analise + Orientacao',
      description: 'Ideal para valores ate R$ 1.000',
      price: 29700, // R$ 297
      solutionId: 'golpe-pix',
      features: [
        'Analise completa do caso',
        'Orientacao sobre proximos passos',
        'Modelo de notificacao ao banco',
        'Suporte por WhatsApp 7 dias',
        'Verificacao de viabilidade',
        'Documento de instrucoes detalhado',
      ],
    },
    {
      name: 'Notificacao Extrajudicial',
      description: 'Ideal para valores ate R$ 5.000',
      price: 69700, // R$ 697
      recommended: true,
      solutionId: 'golpe-pix',
      features: [
        'Tudo do plano Basico',
        'Notificacao extrajudicial ao banco',
        'Acompanhamento da resposta',
        'Relatorio de rastreamento do PIX',
        'Suporte prioritario 15 dias',
        'Protocolo formal junto ao banco',
        'Tentativa de acordo extrajudicial',
      ],
    },
    {
      name: 'Acao Judicial Completa',
      description: 'Para qualquer valor',
      price: 199700, // R$ 1.997
      solutionId: 'golpe-pix',
      features: [
        'Tudo do plano Intermediario',
        'Acao judicial completa',
        'Bloqueio da conta do golpista',
        'Pedido de indenizacao por danos morais',
        'Acompanhamento ate sentenca final',
        'Success Fee (sem custas se nao recuperar)',
        'Recursos em todas as instancias',
        'Atualizacao semanal do processo',
      ],
    },
  ]

  return (
    <ProductPageTemplate
      heroTitle="Foi vitima de golpe do PIX? Recupere seu dinheiro em ate 30 dias"
      heroSubtitle="Acao judicial especializada contra bancos e golpistas. Mais de 500 casos resolvidos com 85% de taxa de sucesso."
      heroProblem="Voce transferiu PIX para um golpista e o banco se recusa a devolver? Cada dia que passa, suas chances de recuperacao diminuem. Aja agora!"
      solution={solution}
      solutionBenefits={[
        'Acao judicial contra banco por responsabilidade solidaria',
        'Rastreamento completo do dinheiro transferido',
        'Bloqueio judicial imediato da conta do golpista',
        'Recuperacao dos valores com correcao monetaria',
        'Indenizacao por danos morais quando aplicavel',
        'Atendimento 24/7 para casos urgentes',
      ]}
      packages={packages}
      documentsRequired={[
        'Comprovante da transferencia PIX',
        'Print das conversas com golpista (WhatsApp, redes sociais, etc.)',
        'Documento de identidade (RG ou CNH)',
        'Comprovante de residencia atualizado',
        'Boletim de Ocorrencia (se ja registrou)',
        'Extrato bancario da data do golpe',
      ]}
      faqItems={[
        {
          question: 'Quanto tempo leva para recuperar o dinheiro do golpe do PIX?',
          answer:
            'O prazo medio de recuperacao e de 30 dias em casos extrajudiciais. Quando necessaria acao judicial, o prazo pode variar de 60 a 180 dias, dependendo da complexidade do caso e da resposta do banco. Em casos urgentes, podemos solicitar liminar para bloqueio imediato da conta do golpista.',
        },
        {
          question: 'Qual a taxa de sucesso de recuperacao em casos de golpe do PIX?',
          answer:
            'Nossa taxa de sucesso e de 85% nos casos em que atuamos nas primeiras 48 horas apos o golpe. Quanto mais rapido voce agir, maiores as chances de recuperacao, pois o dinheiro ainda pode estar na conta do golpista. Mesmo apos esse periodo, temos estrategias juridicas eficazes para responsabilizar o banco.',
        },
        {
          question: 'O banco e obrigado a devolver o dinheiro do PIX fraudado?',
          answer:
            'Sim, em muitos casos. Os bancos tem responsabilidade solidaria por golpes que poderiam ser evitados com sistemas de seguranca adequados. Jurisprudencia recente tem condenado bancos a devolver valores de PIX fraudados quando comprovada negligencia nos mecanismos de protecao ao consumidor. Analisamos cada caso para identificar as brechas de seguranca.',
        },
        {
          question: 'Posso processar o golpista diretamente alem do banco?',
          answer:
            'Sim, e altamente recomendavel. Atuamos em duas frentes: acao civil contra o banco (responsabilidade solidaria) e representacao criminal contra o golpista. O processo criminal serve tanto para punir o criminoso quanto para fortalecer a acao civil de recuperacao do dinheiro e indenizacao.',
        },
        {
          question: 'Quanto custa a acao judicial para recuperar dinheiro de golpe do PIX?',
          answer:
            'Oferecemos tres planos: Basico (R$ 297) para orientacao, Intermediario (R$ 697) para notificacao extrajudicial, e Completo (R$ 1.997) para acao judicial completa. No plano Completo, trabalhamos com success fee - se nao recuperar nada, voce nao paga custas processuais adicionais. O investimento normalmente se paga com a indenizacao por danos morais.',
        },
        {
          question: 'Preciso ir ao forum ou tribunal pessoalmente?',
          answer:
            'Nao. Todo o processo e 100% online. Atuamos em seu nome com procuracao digital, voce acompanha tudo pelo WhatsApp, e fazemos todas as audiencias virtualmente. Voce so precisara comparecer pessoalmente se houver audiencia de conciliacao e desejar participar.',
        },
        {
          question: 'E se o golpista ja gastou o dinheiro ou sumiu com ele?',
          answer:
            'Mesmo que o golpista tenha movimentado o dinheiro, ainda temos alternativas juridicas. Podemos rastrear as transferencias subsequentes, penhorar bens do golpista, ou acionar o banco por falha na seguranca. Muitos dos nossos casos bem-sucedidos envolvem recuperacao mesmo apos o dinheiro ter saido da conta inicial.',
        },
        {
          question: 'Ha garantia de que vou recuperar meu dinheiro?',
          answer:
            'Nao podemos garantir 100% de recuperacao, pois depende de varios fatores (tempo decorrido, movimentacao do dinheiro, identificacao do golpista, etc.). No entanto, nossa taxa de sucesso de 85% e experiencia com mais de 500 casos nos permite avaliar realisticamente suas chances logo na primeira consulta. Somos transparentes sobre a viabilidade antes de voce contratar.',
        },
        {
          question: 'Posso fazer tudo online sem ir ao escritorio?',
          answer:
            'Sim! Todo nosso atendimento e 100% digital. Voce envia documentos por WhatsApp, assinamos contratos e procuracoes digitalmente, e acompanha o processo pelo celular. Temos clientes em todo Brasil que nunca precisaram vir ao escritorio. Reunioes de alinhamento podem ser feitas por video-chamada.',
        },
        {
          question: 'Qual o valor minimo de golpe que vale a pena processar?',
          answer:
            'Para valores acima de R$ 500, ja pode valer a pena iniciar com notificacao extrajudicial (R$ 697). Para valores acima de R$ 2.000, a acao judicial completa e recomendada, pois alem da recuperacao do valor, voce pode receber indenizacao por danos morais que geralmente varia de R$ 3.000 a R$ 15.000, dependendo do caso. Fazemos analise gratuita para avaliar viabilidade.',
        },
      ]}
      categoryName="Protecao Financeira"
      relatedProducts={relatedProducts}
    />
  )
}
