import { Metadata } from 'next'
import { ProductPageTemplate } from '@/components/marketing/templates'
import { getSolutionById, SOLUTIONS } from '@/types/checkout'

export const metadata: Metadata = {
  title: 'Desbloqueio de Conta Bancaria | Garcez Palha Advogados',
  description:
    'Acao judicial para desbloqueio de conta bancaria ou poupanca bloqueada indevidamente. Resolucao em ate 5 dias uteis.',
  keywords: [
    'desbloqueio conta bancaria',
    'conta bloqueada',
    'poupanca bloqueada',
    'bloqueio judicial',
    'advogado desbloqueio',
  ],
}

export default function DesbloqueioContaPage() {
  const solution = getSolutionById('desbloqueio-conta')!

  const relatedProducts = SOLUTIONS.filter(
    (s) => s.category === 'financeiro' && s.id !== 'desbloqueio-conta'
  ).slice(0, 3)

  return (
    <ProductPageTemplate
      heroTitle="Conta Bloqueada? Desbloqueie Agora"
      heroSubtitle="Acao judicial especializada para recuperar o acesso a sua conta bancaria ou poupanca em ate 5 dias uteis."
      heroProblem="Sua conta foi bloqueada e voce nao consegue pagar contas, receber salario ou movimentar seu dinheiro? Isso pode ser resolvido rapidamente."
      solution={solution}
      solutionBenefits={[
        'Analise completa do motivo do bloqueio judicial',
        'Peticao de desbloqueio com pedido de urgencia',
        'Acompanhamento diario do processo',
        'Recursos imediatos se necessario',
        'Comunicacao direta com o banco',
        'Resolucao media em 5 dias uteis',
      ]}
      documentsRequired={[
        'RG e CPF',
        'Comprovante de residencia atualizado',
        'Extrato bancario mostrando o bloqueio',
        'Notificacao do banco sobre o bloqueio (se houver)',
        'Comprovante de renda ou holerite',
        'Documentos do processo que originou o bloqueio (se souber)',
      ]}
      faqItems={[
        {
          question: 'Em quanto tempo minha conta sera desbloqueada?',
          answer:
            'O prazo medio e de 5 dias uteis apos a peticao de desbloqueio. Em casos urgentes, podemos solicitar uma liminar que pode ser concedida em 24 a 48 horas.',
        },
        {
          question: 'Posso desbloquear minha conta se devo dinheiro?',
          answer:
            'Sim, em muitos casos. A lei protege verbas impenhoraveis como salario, aposentadoria e valores de ate 40 salarios minimos em poupanca. Analisamos seu caso para encontrar a melhor estrategia.',
        },
        {
          question: 'Quanto custa o servico de desbloqueio?',
          answer:
            'O valor e de R$ 1.500,00 com pagamento facilitado. Este valor inclui toda a analise, peticoes e acompanhamento ate a resolucao do caso.',
        },
        {
          question: 'Preciso ir ao escritorio pessoalmente?',
          answer:
            'Nao. Todo o atendimento pode ser feito online via WhatsApp e video-chamada. Voce envia os documentos digitalizados e acompanha o processo pelo celular.',
        },
        {
          question: 'E se minha conta for bloqueada novamente?',
          answer:
            'Se o bloqueio recorrer pelo mesmo motivo, fazemos nova peticao sem custo adicional dentro de 90 dias. Alem disso, orientamos sobre como evitar novos bloqueios.',
        },
        {
          question: 'Voces trabalham com todos os bancos?',
          answer:
            'Sim, atuamos com todos os bancos: Caixa, Banco do Brasil, Itau, Bradesco, Santander, Nubank, Inter e todos os demais.',
        },
      ]}
      categoryName="Protecao Financeira"
      relatedProducts={relatedProducts}
    />
  )
}
