import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Secretaria Juridica Remota | Garcez Palha Advogados',
  description:
    'Terceirize a operacao do seu escritorio de advocacia. Secretaria remota especializada em gestao de prazos, peticoes, audiencias e atendimento.',
  keywords: [
    'secretaria juridica remota',
    'terceirizacao juridica',
    'gestao de prazos',
    'secretaria para advogados',
    'backoffice juridico',
  ],
}

export default function SecretariaRemotaPage() {
  const solution = getSolutionById('secretaria-remota')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'automacao' && s.id !== 'secretaria-remota'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Secretaria Juridica Remota"
      heroSubtitle="Terceirize a operacao do seu escritorio e foque no que realmente importa: seus clientes e casos complexos. Equipe especializada, tecnologia e processos."
      heroProblem="Gasta mais tempo com burocracia do que advogando? Perdeu prazo por desorganizacao? Nao consegue escalar atendimento? Secretaria remota resolve isso com custo fixo e previsivel."
      solution={solution}
      solutionBenefits={[
        'Gestao completa de prazos processuais com alertas',
        'Elaboracao de peticoes padrao e minutas',
        'Agendamento e confirmacao de audiencias',
        'Atendimento telefonico e WhatsApp aos clientes',
        'Organizacao de documentos e processos',
        'Publicacao no Diario Oficial monitorada',
        'Relatorios gerenciais mensais',
      ]}
      documentsRequired={[
        'Acesso ao sistema de gestao do escritorio (ou implementamos um)',
        'Procuracao para acesso aos processos',
        'Briefing sobre areas de atuacao e procedimentos',
        'Lista de clientes ativos e contatos',
      ]}
      faqItems={[
        {
          question: 'Como funciona a secretaria remota na pratica?',
          answer:
            'Nossa equipe trabalha 100% online usando seu sistema de gestao (Projuris, Astrea, etc) ou implementamos um gratuito. Monitoramos diariamente processos, prazos, publicacoes. Elaboramos peticoes simples, agendamos compromissos, atendemos clientes por telefone/WhatsApp, e mantemos tudo organizado. Voce so recebe alertas do que e realmente importante.',
        },
        {
          question: 'Quantos processos/clientes voces conseguem gerenciar?',
          answer:
            'Nosso plano basico (R$ 3.500/mes) atende escritorios com ate 50 processos ativos. Para volumes maiores, temos planos escaláveis: 100 processos (R$ 6.000/mes), 200 processos (R$ 10.000/mes), customizado acima disso. Cada escritorio tem equipe dedicada proporcional ao volume.',
        },
        {
          question: 'Posso testar antes de fechar contrato longo?',
          answer:
            'Sim. Oferecemos periodo de teste de 30 dias com contrato mensal (sem fidelidade). Se nao gostar, cancela sem custo. Depois do teste, contratos anuais tem 15% de desconto. Maioria dos clientes renova pois percebe economia de tempo e reducao de stress imediatos.',
        },
        {
          question: 'Quem sao os profissionais que vao trabalhar no meu escritorio?',
          answer:
            'Equipe formada por bachareis em Direito, secretarias juridicas com experiencia, e coordenada por advogados seniors. Todos com treinamento em sistemas juridicos, prazos processuais e atendimento ao cliente. Voce tem interlocutor fixo que conhece seu escritorio a fundo.',
        },
        {
          question: 'E seguro dar acesso aos sistemas e dados dos clientes?',
          answer:
            'Totalmente. Firmamos NDA (acordo de confidencialidade), termo de responsabilidade pela LGPD, e seguimos protocolos rigorosos de seguranca da informacao. Acessos sao rastreados e auditados. 364 anos de tradicao da Garcez Palha sao garantia de idoneidade e sigilo absoluto.',
        },
        {
          question: 'Posso cancelar quando quiser?',
          answer:
            'Contratos mensais: sim, cancela com 30 dias de aviso. Contratos anuais (com desconto): ha multa proporcional aos meses restantes. Mas praticamente nenhum cliente cancela - a produtividade e economia superam em muito o investimento.',
        },
      ]}
      categoryName="Automacao Juridica"
      relatedProducts={relatedProducts}
    />
  )
}
