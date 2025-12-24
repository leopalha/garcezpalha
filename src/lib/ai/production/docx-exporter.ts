/**
 * DOCX Exporter
 * Exports legal documents to Microsoft Word format
 *
 * Uses the docx library to generate professional DOCX files
 */

import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  TableOfContents,
  Packer,
  convertInchesToTwip,
  BorderStyle
} from 'docx'

export interface DocumentExportOptions {
  title: string
  content: string
  author?: string
  clientName?: string
  lawyerName?: string
  lawyerOab?: string
  includeHeader?: boolean
  includeFooter?: boolean
  includePageNumbers?: boolean
  watermark?: string
}

export interface ExportResult {
  success: boolean
  buffer?: Buffer
  filename?: string
  error?: string
}

/**
 * DOCX Exporter Class
 */
export class DocxExporter {
  private readonly OFFICE_INFO = {
    name: 'Garcez Palha - Inteligencia Juridica',
    address: 'Rua Buenos Aires, 68 - Sala 2301, Centro, Rio de Janeiro - RJ',
    phone: '(21) 2220-0685',
    email: 'contato@garcezpalha.com',
    website: 'www.garcezpalha.com'
  }

  /**
   * Export document to DOCX format
   */
  async exportToDocx(options: DocumentExportOptions): Promise<ExportResult> {
    try {
      const doc = this.createDocument(options)
      const buffer = await Packer.toBuffer(doc)

      const filename = this.generateFilename(options.title)

      return {
        success: true,
        buffer: Buffer.from(buffer),
        filename
      }
    } catch (error) {
      console.error('[DocxExporter] Error exporting document:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      }
    }
  }

  /**
   * Create DOCX document
   */
  private createDocument(options: DocumentExportOptions): Document {
    const paragraphs = this.parseContentToParagraphs(options.content)

    const doc = new Document({
      creator: options.author || this.OFFICE_INFO.name,
      title: options.title,
      description: `Documento juridico gerado por ${this.OFFICE_INFO.name}`,
      styles: {
        default: {
          document: {
            run: {
              font: 'Times New Roman',
              size: 24 // 12pt
            },
            paragraph: {
              spacing: {
                line: 360 // 1.5 line spacing
              }
            }
          }
        },
        paragraphStyles: [
          {
            id: 'Title',
            name: 'Title',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              bold: true,
              size: 28,
              font: 'Times New Roman'
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: { after: 240 }
            }
          },
          {
            id: 'Heading1',
            name: 'Heading 1',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              bold: true,
              size: 24,
              font: 'Times New Roman'
            },
            paragraph: {
              spacing: { before: 240, after: 120 }
            }
          },
          {
            id: 'Heading2',
            name: 'Heading 2',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              bold: true,
              size: 24,
              font: 'Times New Roman'
            },
            paragraph: {
              spacing: { before: 200, after: 100 }
            }
          },
          {
            id: 'Normal',
            name: 'Normal',
            run: {
              size: 24,
              font: 'Times New Roman'
            },
            paragraph: {
              spacing: { line: 360 },
              indent: { firstLine: convertInchesToTwip(0.5) }
            }
          }
        ]
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1.5)
              }
            }
          },
          headers: options.includeHeader ? {
            default: this.createHeader(options)
          } : undefined,
          footers: options.includeFooter || options.includePageNumbers ? {
            default: this.createFooter(options)
          } : undefined,
          children: paragraphs
        }
      ]
    })

    return doc
  }

  /**
   * Parse text content into DOCX paragraphs
   */
  private parseContentToParagraphs(content: string): Paragraph[] {
    const paragraphs: Paragraph[] = []
    const lines = content.split('\n')

    let currentParagraph: TextRun[] = []

    for (const line of lines) {
      const trimmedLine = line.trim()

      // Empty line - create paragraph break
      if (!trimmedLine) {
        if (currentParagraph.length > 0) {
          paragraphs.push(new Paragraph({
            children: currentParagraph,
            spacing: { after: 200 }
          }))
          currentParagraph = []
        }
        continue
      }

      // Check for headings (Roman numerals like "I - ", "II - ", etc.)
      const romanHeadingMatch = trimmedLine.match(/^([IVXLCDM]+)\s*[-–]\s*(.+)$/i)
      if (romanHeadingMatch) {
        // Flush current paragraph
        if (currentParagraph.length > 0) {
          paragraphs.push(new Paragraph({
            children: currentParagraph,
            spacing: { after: 200 }
          }))
          currentParagraph = []
        }

        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine,
              bold: true,
              size: 24
            })
          ],
          spacing: { before: 400, after: 200 }
        }))
        continue
      }

      // Check for "EXCELENTISSIMO" header
      if (trimmedLine.toUpperCase().startsWith('EXCELENTISSIMO') ||
          trimmedLine.toUpperCase().startsWith('EXCELENTÍSSIMO')) {
        // Flush current paragraph
        if (currentParagraph.length > 0) {
          paragraphs.push(new Paragraph({
            children: currentParagraph,
            spacing: { after: 200 }
          }))
          currentParagraph = []
        }

        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine,
              bold: true,
              size: 24
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 400 }
        }))
        continue
      }

      // Check for action titles (all caps, centered)
      if (trimmedLine.match(/^(AÇÃO|PETIÇÃO|NOTIFICAÇÃO|PROCURAÇÃO|CONTRATO)/i) &&
          trimmedLine === trimmedLine.toUpperCase()) {
        // Flush current paragraph
        if (currentParagraph.length > 0) {
          paragraphs.push(new Paragraph({
            children: currentParagraph,
            spacing: { after: 200 }
          }))
          currentParagraph = []
        }

        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine,
              bold: true,
              size: 28
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 400 }
        }))
        continue
      }

      // Check for signature lines
      if (trimmedLine.startsWith('_')) {
        // Flush current paragraph
        if (currentParagraph.length > 0) {
          paragraphs.push(new Paragraph({
            children: currentParagraph,
            spacing: { after: 200 }
          }))
          currentParagraph = []
        }

        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: '________________________________________',
              size: 24
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 600, after: 100 }
        }))
        continue
      }

      // Check for list items (bullets or letters)
      const bulletMatch = trimmedLine.match(/^([a-z]\)|[-•])\s*(.+)$/i)
      if (bulletMatch) {
        // Flush current paragraph
        if (currentParagraph.length > 0) {
          paragraphs.push(new Paragraph({
            children: currentParagraph,
            spacing: { after: 200 }
          }))
          currentParagraph = []
        }

        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine,
              size: 24
            })
          ],
          indent: { left: convertInchesToTwip(0.5) },
          spacing: { after: 100 }
        }))
        continue
      }

      // Parse inline formatting (bold with * or **)
      const formattedRuns = this.parseInlineFormatting(trimmedLine)
      currentParagraph.push(...formattedRuns)
      currentParagraph.push(new TextRun({ text: ' ', size: 24 }))
    }

    // Flush remaining paragraph
    if (currentParagraph.length > 0) {
      paragraphs.push(new Paragraph({
        children: currentParagraph,
        spacing: { after: 200 }
      }))
    }

    return paragraphs
  }

  /**
   * Parse inline formatting (bold text marked with * or **)
   */
  private parseInlineFormatting(text: string): TextRun[] {
    const runs: TextRun[] = []

    // Simple regex to find **bold** or *italic* text
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)

    for (const part of parts) {
      if (!part) continue

      if (part.startsWith('**') && part.endsWith('**')) {
        // Bold text
        runs.push(new TextRun({
          text: part.slice(2, -2),
          bold: true,
          size: 24
        }))
      } else if (part.startsWith('*') && part.endsWith('*')) {
        // Italic text
        runs.push(new TextRun({
          text: part.slice(1, -1),
          italics: true,
          size: 24
        }))
      } else {
        // Normal text
        runs.push(new TextRun({
          text: part,
          size: 24
        }))
      }
    }

    return runs
  }

  /**
   * Create document header
   */
  private createHeader(options: DocumentExportOptions): Header {
    return new Header({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: this.OFFICE_INFO.name,
              bold: true,
              size: 20
            })
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: this.OFFICE_INFO.address,
              size: 16,
              color: '666666'
            })
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Tel: ${this.OFFICE_INFO.phone} | ${this.OFFICE_INFO.email}`,
              size: 16,
              color: '666666'
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          border: {
            bottom: {
              style: BorderStyle.SINGLE,
              size: 6,
              color: '8B7355'
            }
          }
        })
      ]
    })
  }

  /**
   * Create document footer
   */
  private createFooter(options: DocumentExportOptions): Footer {
    const children: Paragraph[] = []

    if (options.includePageNumbers) {
      children.push(new Paragraph({
        children: [
          new TextRun({
            text: 'Pagina ',
            size: 18
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 18
          }),
          new TextRun({
            text: ' de ',
            size: 18
          }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            size: 18
          })
        ],
        alignment: AlignmentType.CENTER
      }))
    }

    if (options.lawyerOab) {
      children.push(new Paragraph({
        children: [
          new TextRun({
            text: `${options.lawyerName || 'Advogado'} - ${options.lawyerOab}`,
            size: 16,
            color: '666666'
          })
        ],
        alignment: AlignmentType.RIGHT
      }))
    }

    return new Footer({ children })
  }

  /**
   * Generate filename for export
   */
  private generateFilename(title: string): string {
    const sanitized = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '_') // Replace spaces with underscore
      .toLowerCase()
      .substring(0, 50) // Limit length

    const date = new Date().toISOString().split('T')[0]
    return `${sanitized}_${date}.docx`
  }

  /**
   * Export as base64 string (useful for API responses)
   */
  async exportToBase64(options: DocumentExportOptions): Promise<{ success: boolean; data?: string; error?: string }> {
    const result = await this.exportToDocx(options)

    if (!result.success || !result.buffer) {
      return { success: false, error: result.error }
    }

    return {
      success: true,
      data: result.buffer.toString('base64')
    }
  }
}

// Export singleton
export const docxExporter = new DocxExporter()
