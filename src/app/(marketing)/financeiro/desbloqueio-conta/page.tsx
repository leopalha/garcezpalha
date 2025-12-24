import { Metadata } from 'next'
import DesbloqueioContaClient from './client'

export const metadata: Metadata = {
  title: 'Desbloqueio de Conta Bancaria em 3-7 Dias | Garcez Palha Advogados',
  description:
    'Acao judicial especializada para desbloquear conta bancaria ou poupanca bloqueada indevidamente. Resolucao rapida em ate 7 dias uteis. 95% de taxa de sucesso. Mais de 500 contas desbloqueadas. Garantia de satisfacao.',
  keywords: [
    'desbloqueio conta bancaria',
    'conta bloqueada',
    'poupanca bloqueada',
    'bloqueio judicial',
    'advogado desbloqueio',
    'desbloquear conta banco',
    'acao judicial conta bloqueada',
    'liminar desbloqueio',
    'conta bloqueada indevidamente',
    'salario bloqueado',
    'verba impenhora',
    'indenizacao conta bloqueada',
  ],
  openGraph: {
    title: 'Desbloqueio de Conta Bancaria em 3-7 Dias | 95% de Sucesso',
    description:
      'Recupere o acesso a sua conta bancaria rapidamente. Mais de 500 casos resolvidos com sucesso. Atendimento 100% online e garantia de satisfacao.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Desbloqueio de Conta Bancaria em 3-7 Dias',
    description: 'Acao judicial especializada. 95% de taxa de sucesso. Garantia de satisfacao.',
  },
  alternates: {
    canonical: '/financeiro/desbloqueio-conta',
  },
}

export default function DesbloqueioContaPage() {
  return <DesbloqueioContaClient />
}
