/**
 * Document Forensics Agent - Specialized Tools
 * Export all forensics and document analysis tools
 */

export { SignatureAnalyzer, type SignatureAnalysis } from './signature-analyzer'
export { DocumentAuthenticator, type DocumentAuthentication } from './document-authenticator'

// Usage example:
/*
import { SignatureAnalyzer, DocumentAuthenticator } from '@/lib/ai/agents/legal/forensics'

const signatureAnalyzer = new SignatureAnalyzer()
const documentAuthenticator = new DocumentAuthenticator()

// 1. Analyze signature authenticity
const signatureAnalysis = await signatureAnalyzer.analyzeSignature({
  assinaturaQuestionada: {
    descricao: 'Assinatura com tremor e execução lenta',
    contexto: 'Contrato de compra e venda',
    data: '2024-01-15',
  },
  assinaturasAutenticas: [
    { descricao: 'Assinatura fluida e natural', data: '2023-06-10' },
    { descricao: 'Assinatura consistente', data: '2023-12-05' },
  ],
  documento: {
    tipo: 'Contrato',
    valor: 500000,
    partes: ['João Silva', 'Maria Santos'],
  },
})

console.log('Autenticidade:', signatureAnalysis.autenticidade.conclusao)
console.log('Divergências:', signatureAnalysis.divergencias)
console.log('Perícia recomendada:', signatureAnalysis.periciaRecomendada)

// 2. Authenticate document
const docAnalysis = await documentAuthenticator.authenticateDocument({
  tipo: 'RG',
  dataEmissao: '2015-03-20',
  orgaoEmissor: 'SSP-SP',
  numeroDocumento: '12.345.678-9',
  descricaoFisica: 'Papel comum, impressão laser, sem marca d\'água, selo holográfico suspeito',
  suspeitas: ['Data alterada', 'Selo falso'],
})

console.log('Conclusão:', docAnalysis.autenticidade.conclusao)
console.log('Adulterações:', docAnalysis.adulteracoes)
console.log('Valor probatório:', docAnalysis.valorProbatorio.nivel)
*/
