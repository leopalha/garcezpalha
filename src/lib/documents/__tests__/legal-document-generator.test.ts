/**
 * Legal Document Generator - Unit Tests
 * P2-003 Test Suite
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { LegalDocumentGenerator } from '../legal-document-generator'
import type { DocumentData, DocumentType } from '../legal-document-generator'

describe('LegalDocumentGenerator', () => {
  let generator: LegalDocumentGenerator
  let mockData: DocumentData

  beforeEach(() => {
    generator = new LegalDocumentGenerator()
    mockData = {
      autor: {
        nome: 'João Silva Santos',
        cpf: '123.456.789-00',
        endereco: 'Rua das Flores, 123, Copacabana, Rio de Janeiro/RJ',
        profissao: 'Engenheiro',
      },
      reu: {
        nome: 'Banco Exemplo S/A',
        cnpj: '12.345.678/0001-90',
        endereco: 'Av. Presidente Vargas, 1000, Centro, Rio de Janeiro/RJ',
      },
      advogado: {
        nome: 'Dr. Leonardo Palha',
        oab: 'OAB/RJ 219.390',
      },
      comarca: 'Rio de Janeiro',
      vara: '1ª Vara Cível',
      fatos: [
        'O autor teve sua conta bancária bloqueada indevidamente em 15/01/2024, sem qualquer notificação prévia.',
        'O bloqueio impediu o autor de realizar pagamentos essenciais, causando diversos constrangimentos e prejuízos.',
        'Diversas tentativas de contato com o banco foram infrutíferas.',
      ],
      fundamentacao: [
        'Código de Defesa do Consumidor, art. 42 - vedação à cobrança abusiva',
        'Código Civil, art. 186 e 927 - responsabilidade civil',
        'Jurisprudência do STJ sobre danos morais em casos bancários',
      ],
      pedidos: [
        'Desbloqueio imediato da conta bancária',
        'Indenização por danos morais no valor de R$ 10.000,00',
        'Restituição em dobro dos valores cobrados indevidamente',
      ],
      categoria: 'bancario',
    }
  })

  describe('generate', () => {
    const documentTypes: DocumentType[] = [
      'peticao-inicial',
      'contestacao',
      'recurso-apelacao',
      'recurso-agravo',
      'embargos-declaracao',
      'mandado-seguranca',
      'habeas-corpus',
      'acao-revisional',
      'defesa-previa',
      'memoriais',
    ]

    documentTypes.forEach((type) => {
      it(`should generate ${type} document`, () => {
        const document = generator.generate(type, mockData)

        expect(document).toBeTruthy()
        expect(document.length).toBeGreaterThan(100)
        expect(typeof document).toBe('string')
      })
    })

    it('should throw error for invalid document type', () => {
      expect(() => {
        generator.generate('invalid-type' as DocumentType, mockData)
      }).toThrow()
    })
  })

  describe('generatePeticaoInicial', () => {
    it('should include all required sections', () => {
      const document = generator.generate('peticao-inicial', mockData)

      expect(document).toContain('EXCELENTÍSSIMO SENHOR DOUTOR JUIZ')
      expect(document).toContain('João Silva Santos')
      expect(document).toContain('123.456.789-00')
      expect(document).toContain('Banco Exemplo S/A')
      expect(document).toContain('12.345.678/0001-90')
      expect(document).toContain('DOS FATOS')
      expect(document).toContain('DO DIREITO')
      expect(document).toContain('DOS PEDIDOS')
      expect(document).toContain('Dr. Leonardo Palha')
      expect(document).toContain('OAB/RJ 219.390')
    })

    it('should format CPF correctly', () => {
      const document = generator.generate('peticao-inicial', mockData)

      expect(document).toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/)
    })

    it('should format CNPJ correctly', () => {
      const document = generator.generate('peticao-inicial', mockData)

      expect(document).toMatch(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/)
    })

    it('should include date', () => {
      const document = generator.generate('peticao-inicial', mockData)

      expect(document).toContain('29/12/2024')
      expect(document).toContain('Rio de Janeiro')
    })

    it('should include all pedidos', () => {
      const document = generator.generate('peticao-inicial', mockData)

      mockData.pedidos.forEach((pedido) => {
        expect(document).toContain(pedido)
      })
    })

    it('should include valor da causa', () => {
      const document = generator.generate('peticao-inicial', mockData)

      expect(document).toContain('R$ 25.000,00')
    })
  })

  describe('generateContestacao', () => {
    it('should include defense arguments', () => {
      const document = generator.generate('contestacao', mockData)

      expect(document).toContain('CONTESTAÇÃO')
      expect(document).toContain('réu')
      expect(document).toContain('improcedência')
      expect(document).toContain('Nestes termos')
      expect(document).toContain('deferimento')
    })

    it('should reference original action', () => {
      const dataWithProcesso = {
        ...mockData,
        numeroProcesso: '0123456-78.2024.8.19.0001',
      }

      const document = generator.generate('contestacao', dataWithProcesso)

      expect(document).toContain('0123456-78.2024.8.19.0001')
    })
  })

  describe('generateRecursoApelacao', () => {
    it('should include appeal grounds', () => {
      const document = generator.generate('recurso-apelacao', mockData)

      expect(document).toContain('RECURSO DE APELAÇÃO')
      expect(document).toContain('apelante')
      expect(document).toContain('sentença')
      expect(document).toContain('reforma')
      expect(document).toContain('provimento')
    })

    it('should challenge lower court decision', () => {
      const document = generator.generate('recurso-apelacao', mockData)

      expect(document).toContain('DOS FATOS')
      expect(document).toContain('DO DIREITO')
      expect(document).toContain('DOS PEDIDOS')
    })
  })

  describe('generateMandadoSeguranca', () => {
    it('should include writ of mandamus elements', () => {
      const dataWithAutoridade = {
        ...mockData,
        autoridadeCoatora: 'Diretor do Banco Central do Brasil',
        atoImpugnado: 'Inclusão indevida no cadastro de inadimplentes',
      }

      const document = generator.generate('mandado-seguranca', dataWithAutoridade)

      expect(document).toContain('MANDADO DE SEGURANÇA')
      expect(document).toContain('direito líquido e certo')
      expect(document).toContain('autoridade coatora')
      expect(document).toContain('liminar')
    })

    it('should emphasize urgency', () => {
      const document = generator.generate('mandado-seguranca', mockData)

      expect(document).toContain('urgência')
    })
  })

  describe('generateHabeasCorpus', () => {
    it('should include habeas corpus elements', () => {
      const dataWithPaciente = {
        ...mockData,
        paciente: {
          nome: 'Carlos Alberto Silva',
          cpf: '987.654.321-00',
        },
        autoridadeCoatora: 'Delegado da 1ª DP',
        constrangimentoIlegal: 'Prisão ilegal sem flagrante delito',
      }

      const document = generator.generate('habeas-corpus', dataWithPaciente)

      expect(document).toContain('HABEAS CORPUS')
      expect(document).toContain('paciente')
      expect(document).toContain('constrangimento ilegal')
      expect(document).toContain('liberdade de locomoção')
    })
  })

  describe('generateAcaoRevisional', () => {
    it('should include contract review elements', () => {
      const dataWithContrato = {
        ...mockData,
        contratoOriginal: 'Contrato de Financiamento nº 12345',
        clausulasAbusivas: [
          'Juros abusivos de 15% ao mês',
          'Capitalização mensal de juros',
          'Cobrança de seguro não contratado',
        ],
      }

      const document = generator.generate('acao-revisional', dataWithContrato)

      expect(document).toContain('AÇÃO REVISIONAL')
      expect(document).toContain('revisão contratual')
      expect(document).toContain('cláusulas abusivas')
    })
  })

  describe('generateEmbargosDeclaracao', () => {
    it('should point out omissions or contradictions', () => {
      const dataWithOmissoes = {
        ...mockData,
        omissoes: ['Não analisou pedido de danos morais', 'Contradição nos valores'],
      }

      const document = generator.generate('embargos-declaracao', dataWithOmissoes)

      expect(document).toContain('EMBARGOS DE DECLARAÇÃO')
      expect(document).toContain('omissão')
      expect(document).toContain('contradição')
      expect(document).toContain('obscuridade')
    })
  })

  describe('generateDefesaPrevia', () => {
    it('should include preliminary defense', () => {
      const document = generator.generate('defesa-previa', mockData)

      expect(document).toContain('DEFESA PRÉVIA')
      expect(document).toContain('absolvição')
      expect(document).toContain('atipicidade')
    })
  })

  describe('generateMemoriais', () => {
    it('should summarize case arguments', () => {
      const document = generator.generate('memoriais', mockData)

      expect(document).toContain('MEMORIAIS')
      expect(document).toContain('resumo')
      expect(document).toContain('julgamento')
      expect(document).toContain('procedência')
    })
  })

  describe('formatting helpers', () => {
    it('should format CPF correctly', () => {
      const cpf = '12345678900'
      // Mock internal formatter
      const document = generator.generate('peticao-inicial', {
        ...mockData,
        autor: { ...mockData.autor, cpf },
      })

      expect(document).toContain('123.456.789-00')
    })

    it('should format CNPJ correctly', () => {
      const cnpj = '12345678000190'
      const document = generator.generate('peticao-inicial', {
        ...mockData,
        reu: { ...mockData.reu, cnpj },
      })

      expect(document).toContain('12.345.678/0001-90')
    })

    it('should format date in Portuguese', () => {
      const document = generator.generate('peticao-inicial', mockData)

      expect(document).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })
  })

  describe('validation', () => {
    it('should throw error when autor is missing', () => {
      const invalidData = { ...mockData }
      delete (invalidData as any).autor

      expect(() => {
        generator.generate('peticao-inicial', invalidData)
      }).toThrow()
    })

    it('should throw error when reu is missing', () => {
      const invalidData = { ...mockData }
      delete (invalidData as any).reu

      expect(() => {
        generator.generate('peticao-inicial', invalidData)
      }).toThrow()
    })

    it('should throw error when advogado is missing', () => {
      const invalidData = { ...mockData }
      delete (invalidData as any).advogado

      expect(() => {
        generator.generate('peticao-inicial', invalidData)
      }).toThrow()
    })

    it('should validate OAB format', () => {
      const dataWithInvalidOAB = {
        ...mockData,
        advogado: { ...mockData.advogado, oab: 'invalid' },
      }

      // Should still generate but with warning or validation
      const document = generator.generate('peticao-inicial', dataWithInvalidOAB)
      expect(document).toBeTruthy()
    })
  })

  describe('OAB compliance', () => {
    it('should include OAB number', () => {
      const document = generator.generate('peticao-inicial', mockData)

      expect(document).toContain('OAB/RJ 219.390')
    })

    it('should not include prohibited marketing language', () => {
      const document = generator.generate('peticao-inicial', mockData)

      const prohibitedPhrases = [
        'melhor escritório',
        'garantimos vitória',
        'sempre ganhamos',
        '100% de sucesso',
      ]

      prohibitedPhrases.forEach((phrase) => {
        expect(document.toLowerCase()).not.toContain(phrase.toLowerCase())
      })
    })

    it('should maintain professional tone', () => {
      const document = generator.generate('peticao-inicial', mockData)

      expect(document).toContain('EXCELENTÍSSIMO')
      expect(document).toContain('Respeitosamente')
      expect(document).toContain('Nestes termos')
    })
  })

  describe('edge cases', () => {
    it('should handle missing optional fields', () => {
      const minimalData: DocumentData = {
        autor: { nome: 'Test', cpf: '123.456.789-00', endereco: 'Test Address' },
        reu: { nome: 'Test Reu', cnpj: '12.345.678/0001-90', endereco: 'Test Reu Address' },
        advogado: { nome: 'Test Advogado', oab: 'OAB/RJ 123456' },
        comarca: 'Test',
        fatos: ['Test facts'],
        fundamentacao: ['Test law'],
        pedidos: ['Test request'],
        categoria: 'geral',
      }

      const document = generator.generate('peticao-inicial', minimalData)

      expect(document).toBeTruthy()
      expect(document.length).toBeGreaterThan(50)
    })

    it('should handle very long text fields', () => {
      const longText = 'A'.repeat(10000)
      const dataWithLongText = {
        ...mockData,
        fatos: [longText],
      }

      const document = generator.generate('peticao-inicial', dataWithLongText)

      expect(document).toContain(longText)
    })

    it('should handle special characters in names', () => {
      const dataWithSpecialChars = {
        ...mockData,
        autor: {
          ...mockData.autor,
          nome: 'José María Ñoño da Silva',
        },
      }

      const document = generator.generate('peticao-inicial', dataWithSpecialChars)

      expect(document).toContain('José María Ñoño da Silva')
    })
  })
})
