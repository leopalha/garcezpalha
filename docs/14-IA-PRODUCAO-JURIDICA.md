# 14 - IA DE PRODUÇÃO JURÍDICA
## Garcez Palha - Inteligência Jurídica

---

## 1. VISÃO GERAL

### 1.1 Conceito

```
IA DE PRODUÇÃO JURÍDICA:
Sistema de inteligência artificial que automatiza
a geração de documentos jurídicos, petições,
contratos e laudos com base nos dados coletados
durante a qualificação do cliente.

OBJETIVO:
├── Reduzir tempo de produção em 80%
├── Garantir consistência e qualidade
├── Minimizar erros humanos
└── Escalar operação sem aumentar equipe
```

### 1.2 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PIPELINE DE PRODUÇÃO JURÍDICA                    │
└─────────────────────────────────────────────────────────────────────┘

[1] DADOS QUALIFICADOS
    │
    ├── Informações do cliente (nome, CPF, endereço)
    ├── Detalhes do caso (fatos, valores, documentos)
    ├── Tipo de serviço contratado
    └── Documentos anexos (extratos, contratos)
    │
    ▼
[2] IA PROCESSADORA
    │
    ├── Seleção de template adequado
    ├── Preenchimento de variáveis
    ├── Geração de argumentação jurídica
    ├── Citação de jurisprudência relevante
    └── Formatação automática
    │
    ▼
[3] DOCUMENTO GERADO
    │
    ├── Petição inicial
    ├── Contestação
    ├── Laudo pericial
    └── Contrato
    │
    ▼
[4] REVISÃO HUMANA
    │
    ├── Advogado revisa em 5-10 minutos
    ├── Ajustes específicos do caso
    └── Aprovação final
    │
    ▼
[5] DOCUMENTO PRONTO
    └── Protocolo ou envio ao cliente
```

---

## 2. MOTOR DE IA

### 2.1 Modelo Utilizado

```
MODELO PRINCIPAL: Claude 3.5 Sonnet (via API)
├── Raciocínio jurídico avançado
├── Contexto de 200k tokens
├── Excelente em português jurídico
└── Custo-benefício otimizado

MODELO ALTERNATIVO: GPT-4 Turbo
├── Backup se Claude indisponível
├── API OpenRouter para fallback
└── Mesmo prompt base adaptado

MODELO AUXILIAR: Claude Haiku
├── Tarefas simples (formatação)
├── Validação de dados
└── Custo 10x menor
```

### 2.2 Prompt Base para Produção

```typescript
const PRODUCTION_SYSTEM_PROMPT = `
Você é um assistente jurídico especializado do escritório 
Garcez Palha Advogados. Sua função é gerar documentos 
jurídicos profissionais com base nos dados fornecidos.

## PRINCÍPIOS
1. Linguagem técnica e formal adequada ao foro
2. Fundamentação legal sempre citada (artigos, leis)
3. Jurisprudência atualizada quando relevante
4. Estrutura clara e organizada
5. Pedidos específicos e objetivos

## COMPLIANCE OAB
- Nunca garantir resultado de processo
- Sempre manter ética profissional
- Respeitar sigilo do cliente
- Documentos assinados por Leonardo Mendonça Palha da Silva, OAB/RJ 219.390

## FORMATAÇÃO
- Cabeçalho com juízo competente
- Qualificação completa das partes
- Fatos numerados e claros
- Fundamentos jurídicos fundamentados
- Pedidos objetivos e específicos
- Fechamento padrão do escritório

## DOCUMENTOS SUPORTADOS
- Petições iniciais
- Contestações
- Recursos
- Manifestações
- Laudos periciais
- Contratos
- Pareceres
`;
```

### 2.3 Prompts Específicos por Área

```typescript
// PROTEÇÃO FINANCEIRA
const FINANCIAL_PROMPT = `
${PRODUCTION_SYSTEM_PROMPT}

## ÁREA: PROTEÇÃO FINANCEIRA

### Desbloqueio de Conta
- Base: Art. 833, IV e X do CPC
- Súmula 340 STJ (poupança)
- Demonstrar natureza salarial/alimentar
- Urgência fundamentada

### Golpe do PIX
- Base: CDC arts. 14 e 18
- Súmula 479 STJ (responsabilidade banco)
- MED (Mecanismo Especial de Devolução)
- Danos morais in re ipsa

### Negativação Indevida
- Base: CDC art. 43
- Súmula 385 STJ (danos morais)
- Tutela de urgência para exclusão
- Dano moral presumido
`;

// PROTEÇÃO PATRIMONIAL
const PROPERTY_PROMPT = `
${PRODUCTION_SYSTEM_PROMPT}

## ÁREA: PROTEÇÃO PATRIMONIAL

### Usucapião
- Base: Arts. 1.238 a 1.244 do CC
- Lei 13.105/2015 (usucapião extrajudicial)
- Requisitos por modalidade
- Documentação necessária

### Inventário
- Base: Arts. 1.784 a 1.856 do CC
- CPC arts. 610 a 673
- Prazo e multa ITCMD
- Partilha de bens

### Regularização de Imóveis
- Base: Lei 6.015/73 (Registros Públicos)
- Retificação de área
- Desmembramento
- Averbação de construção
`;

// PROTEÇÃO SAÚDE
const HEALTH_PROMPT = `
${PRODUCTION_SYSTEM_PROMPT}

## ÁREA: PROTEÇÃO SAÚDE

### Plano de Saúde
- Base: Lei 9.656/98
- Rol ANS exemplificativo
- Súmulas STJ (102, 302, 469)
- Tutela de urgência

### BPC/LOAS
- Base: Lei 8.742/93
- Requisitos: idade ou deficiência
- Critério de renda
- Prova da condição

### Revisão de Benefício INSS
- Base: Lei 8.213/91
- Tipos de revisão
- Prazos decadenciais
- Cálculo de diferenças
`;
```

---

## 3. FLUXO DE PRODUÇÃO

### 3.1 Processo Automatizado

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FLUXO DETALHADO                             │
└─────────────────────────────────────────────────────────────────────┘

ETAPA 1: TRIGGER
├── Pagamento confirmado
├── Contrato assinado
└── Documentos recebidos
    │
    ▼
ETAPA 2: COLETA DE DADOS
├── Buscar lead no Supabase
├── Extrair informações qualificadas
├── Baixar documentos anexos
└── Validar completude dos dados
    │
    ▼
ETAPA 3: PROCESSAMENTO OCR (se necessário)
├── Extrair texto de imagens
├── Processar PDFs escaneados
└── Estruturar dados extraídos
    │
    ▼
ETAPA 4: SELEÇÃO DE TEMPLATE
├── Identificar tipo de caso
├── Carregar template base
└── Definir variáveis necessárias
    │
    ▼
ETAPA 5: GERAÇÃO VIA IA
├── Montar prompt com dados
├── Chamar API do modelo
├── Receber documento gerado
└── Validar estrutura
    │
    ▼
ETAPA 6: PÓS-PROCESSAMENTO
├── Formatar documento (DOCX)
├── Adicionar cabeçalho/rodapé
├── Inserir assinatura digital
└── Salvar no sistema
    │
    ▼
ETAPA 7: FILA DE REVISÃO
├── Notificar advogado
├── Enviar link para revisão
└── Aguardar aprovação
```

### 3.2 Código de Implementação

```typescript
// src/lib/ai/production/document-generator.ts

import { createClient } from '@anthropic-ai/sdk';
import { templates } from './templates';
import { supabase } from '@/lib/supabase';

interface CaseData {
  leadId: string;
  serviceType: string;
  clientData: ClientData;
  caseDetails: CaseDetails;
  attachments: Attachment[];
}

interface GeneratedDocument {
  content: string;
  type: 'petition' | 'contract' | 'report';
  format: 'markdown' | 'docx';
  tokensUsed: number;
}

export class DocumentGenerator {
  private anthropic: Anthropic;
  
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  async generate(caseData: CaseData): Promise<GeneratedDocument> {
    // 1. Selecionar template
    const template = this.selectTemplate(caseData.serviceType);
    
    // 2. Preparar dados para o prompt
    const preparedData = this.prepareData(caseData);
    
    // 3. Montar prompt completo
    const prompt = this.buildPrompt(template, preparedData);
    
    // 4. Chamar IA
    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      system: this.getSystemPrompt(caseData.serviceType),
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // 5. Processar resposta
    const content = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';

    return {
      content,
      type: this.getDocumentType(caseData.serviceType),
      format: 'markdown',
      tokensUsed: response.usage.output_tokens
    };
  }

  private selectTemplate(serviceType: string): string {
    const templateMap: Record<string, string> = {
      'desbloqueio_conta': templates.DESBLOQUEIO,
      'golpe_pix': templates.GOLPE_PIX,
      'negativacao': templates.NEGATIVACAO,
      'usucapiao': templates.USUCAPIAO,
      'plano_saude': templates.PLANO_SAUDE,
      'bpc_loas': templates.BPC_LOAS
    };
    
    return templateMap[serviceType] || templates.GENERICO;
  }

  private prepareData(caseData: CaseData): PreparedData {
    return {
      // Dados do cliente
      nomeCliente: caseData.clientData.name,
      cpfCliente: this.formatCPF(caseData.clientData.cpf),
      rgCliente: caseData.clientData.rg,
      enderecoCliente: caseData.clientData.address,
      telefoneCliente: caseData.clientData.phone,
      emailCliente: caseData.clientData.email,
      
      // Dados do caso
      valorCausa: this.formatCurrency(caseData.caseDetails.amount),
      dataFato: this.formatDate(caseData.caseDetails.eventDate),
      descricaoFatos: caseData.caseDetails.description,
      documentosAnexos: caseData.attachments.map(a => a.name),
      
      // Metadados
      cidade: 'Rio de Janeiro',
      dataAtual: this.formatDate(new Date()),
      numeroOAB: '219.390'
    };
  }

  private buildPrompt(template: string, data: PreparedData): string {
    return `
## TAREFA
Gere uma petição jurídica completa usando o template abaixo e os dados fornecidos.

## TEMPLATE BASE
${template}

## DADOS DO CASO
${JSON.stringify(data, null, 2)}

## INSTRUÇÕES
1. Substitua todas as variáveis {VARIAVEL} pelos dados correspondentes
2. Expanda os fatos com base na descrição fornecida
3. Adicione jurisprudência relevante e atualizada
4. Mantenha linguagem formal e técnica
5. Formate corretamente para protocolo judicial

## OUTPUT
Retorne APENAS o documento completo, sem comentários adicionais.
    `;
  }
}
```

---

## 4. TIPOS DE DOCUMENTOS

### 4.1 Petições

```
PETIÇÕES AUTOMATIZADAS:
├── Iniciais
│   ├── Ação de obrigação de fazer
│   ├── Ação declaratória
│   ├── Ação de indenização
│   ├── Ação de usucapião
│   └── Mandado de segurança
│
├── Incidentais
│   ├── Impugnação ao cumprimento
│   ├── Embargos à execução
│   ├── Tutela de urgência
│   └── Manifestação
│
└── Recursais
    ├── Apelação
    ├── Agravo de instrumento
    ├── Embargos de declaração
    └── Recurso especial
```

### 4.2 Contratos

```
CONTRATOS AUTOMATIZADOS:
├── Prestação de Serviços
│   ├── Contrato padrão (por caso)
│   ├── Contrato recorrente (assessoria)
│   └── Contrato de perícia
│
├── Imobiliários
│   ├── Compra e venda
│   ├── Locação
│   ├── Comodato
│   └── Cessão de direitos
│
└── Empresariais
    ├── Constituição societária
    ├── Alteração contratual
    └── Distrato
```

### 4.3 Laudos Periciais

```
LAUDOS AUTOMATIZADOS:
├── Grafotécnico
│   ├── Autenticidade de assinatura
│   ├── Análise de documento
│   └── Comparação de padrões
│
├── Avaliação Imobiliária
│   ├── NBR 14653
│   ├── Comparativo de mercado
│   └── Valor de liquidação
│
└── Perícia Médica
    ├── Nexo causal (acidentes)
    ├── Incapacidade laboral
    └── Dano corporal
```

---

## 5. INTEGRAÇÃO COM TEMPLATES

### 5.1 Sistema de Variáveis

```typescript
// Variáveis padrão (todas as petições)
const STANDARD_VARS = {
  '{NOME_CLIENTE}': 'clientData.name',
  '{CPF_CLIENTE}': 'clientData.cpf',
  '{RG_CLIENTE}': 'clientData.rg',
  '{ENDERECO_CLIENTE}': 'clientData.address',
  '{TELEFONE_CLIENTE}': 'clientData.phone',
  '{EMAIL_CLIENTE}': 'clientData.email',
  '{CIDADE}': 'metadata.city',
  '{DATA_ATUAL}': 'metadata.currentDate',
  '{VALOR_CAUSA}': 'caseDetails.amount'
};

// Variáveis específicas por tipo
const DESBLOQUEIO_VARS = {
  '{NUMERO_PROCESSO}': 'caseDetails.processNumber',
  '{VALOR_BLOQUEADO}': 'caseDetails.blockedAmount',
  '{BANCO}': 'caseDetails.bankName',
  '{ORIGEM_VALORES}': 'caseDetails.incomeSource'
};

const USUCAPIAO_VARS = {
  '{ENDERECO_IMOVEL}': 'caseDetails.propertyAddress',
  '{AREA}': 'caseDetails.propertyArea',
  '{TEMPO_POSSE}': 'caseDetails.possessionYears',
  '{DATA_INICIO_POSSE}': 'caseDetails.possessionStart'
};
```

### 5.2 Engine de Substituição

```typescript
// src/lib/ai/production/template-engine.ts

export class TemplateEngine {
  private vars: Record<string, string>;
  
  constructor(varMapping: Record<string, string>) {
    this.vars = varMapping;
  }

  process(template: string, data: any): string {
    let result = template;
    
    for (const [placeholder, path] of Object.entries(this.vars)) {
      const value = this.getNestedValue(data, path);
      result = result.replaceAll(placeholder, value || '[NÃO INFORMADO]');
    }
    
    return result;
  }

  private getNestedValue(obj: any, path: string): string {
    return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '';
  }

  // Processar condicionais
  processConditionals(template: string, data: any): string {
    // {SE_SALARIO}...{/SE_SALARIO}
    const regex = /\{SE_(\w+)\}([\s\S]*?)\{\/SE_\1\}/g;
    
    return template.replace(regex, (match, condition, content) => {
      const shouldInclude = this.evaluateCondition(condition, data);
      return shouldInclude ? content : '';
    });
  }

  private evaluateCondition(condition: string, data: any): boolean {
    const conditionMap: Record<string, (d: any) => boolean> = {
      'SALARIO': (d) => d.caseDetails.incomeSource === 'salario',
      'APOSENTADORIA': (d) => d.caseDetails.incomeSource === 'aposentadoria',
      'POUPANCA': (d) => d.caseDetails.incomeSource === 'poupanca',
      'URGENTE': (d) => d.caseDetails.isUrgent === true,
      '10_ANOS': (d) => d.caseDetails.possessionYears >= 10
    };
    
    return conditionMap[condition]?.(data) ?? false;
  }
}
```

---

## 6. GERAÇÃO DE ARGUMENTAÇÃO

### 6.1 Base de Jurisprudência

```typescript
// src/lib/ai/production/jurisprudence.ts

interface Jurisprudence {
  id: string;
  court: 'STF' | 'STJ' | 'TJ' | 'TRF';
  type: 'sumula' | 'acordao' | 'decisao';
  number: string;
  summary: string;
  fullText: string;
  keywords: string[];
  area: string;
}

const JURISPRUDENCE_DB: Jurisprudence[] = [
  {
    id: 'stj-sumula-479',
    court: 'STJ',
    type: 'sumula',
    number: '479',
    summary: 'Responsabilidade objetiva dos bancos por fraudes',
    fullText: 'As instituições financeiras respondem objetivamente pelos danos gerados por fortuito interno relativo a fraudes e delitos praticados por terceiros no âmbito de operações bancárias.',
    keywords: ['banco', 'fraude', 'pix', 'golpe', 'responsabilidade'],
    area: 'financeiro'
  },
  {
    id: 'stj-sumula-385',
    court: 'STJ',
    type: 'sumula',
    number: '385',
    summary: 'Dano moral por negativação indevida',
    fullText: 'Da anotação irregular em cadastro de proteção ao crédito, não cabe indenização por dano moral, quando preexistente legítima inscrição, ressalvado o direito ao cancelamento.',
    keywords: ['serasa', 'spc', 'negativacao', 'nome', 'dano moral'],
    area: 'financeiro'
  },
  {
    id: 'stj-sumula-340',
    court: 'STJ',
    type: 'sumula',
    number: '340',
    summary: 'Impenhorabilidade de poupança até 40 SM',
    fullText: 'A lei aplicável à impenhorabilidade do bem de família é a vigente ao tempo da penhora.',
    keywords: ['poupanca', 'impenhorabilidade', 'bloqueio', '40 salarios'],
    area: 'financeiro'
  }
];

export function findRelevantJurisprudence(
  keywords: string[], 
  area: string
): Jurisprudence[] {
  return JURISPRUDENCE_DB.filter(j => {
    const areaMatch = j.area === area;
    const keywordMatch = keywords.some(k => 
      j.keywords.some(jk => jk.includes(k.toLowerCase()))
    );
    return areaMatch && keywordMatch;
  });
}
```

### 6.2 Gerador de Argumentos

```typescript
// src/lib/ai/production/argument-generator.ts

export async function generateArguments(
  caseType: string,
  facts: string,
  relevantLaws: string[]
): Promise<string> {
  const prompt = `
## CONTEXTO
Tipo de caso: ${caseType}
Fatos: ${facts}
Legislação aplicável: ${relevantLaws.join(', ')}

## TAREFA
Gere argumentação jurídica sólida para este caso, incluindo:

1. FUNDAMENTAÇÃO FÁTICA
- Análise dos fatos narrados
- Nexo de causalidade
- Danos sofridos

2. FUNDAMENTAÇÃO JURÍDICA
- Dispositivos legais aplicáveis (com citação do artigo)
- Princípios constitucionais
- Doutrina (autores reconhecidos)

3. JURISPRUDÊNCIA
- Súmulas aplicáveis
- Decisões recentes do STJ/STF
- Precedentes favoráveis

4. CONCLUSÃO
- Síntese dos argumentos
- Direito do autor demonstrado
- Pedido fundamentado

## FORMATO
Linguagem técnica e formal
Parágrafos numerados
Citações entre aspas com referência
  `;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.content[0].type === 'text' 
    ? response.content[0].text 
    : '';
}
```

---

## 7. EXPORTAÇÃO DE DOCUMENTOS

### 7.1 Markdown para DOCX

```typescript
// src/lib/ai/production/export-docx.ts

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

interface DocumentSection {
  type: 'heading' | 'paragraph' | 'list';
  content: string;
  level?: number;
}

export async function markdownToDocx(
  markdown: string,
  metadata: DocumentMetadata
): Promise<Buffer> {
  const sections = parseMarkdown(markdown);
  
  const doc = new Document({
    creator: 'Garcez Palha Advogados',
    title: metadata.title,
    styles: getDefaultStyles(),
    sections: [{
      properties: {},
      headers: getHeader(metadata),
      footers: getFooter(metadata),
      children: sections.map(s => convertSection(s))
    }]
  });

  return await Packer.toBuffer(doc);
}

function getDefaultStyles() {
  return {
    paragraphStyles: [
      {
        id: 'Normal',
        name: 'Normal',
        basedOn: 'Normal',
        run: {
          font: 'Times New Roman',
          size: 24 // 12pt
        },
        paragraph: {
          spacing: { after: 200, line: 360 } // 1.5 espaçamento
        }
      }
    ]
  };
}

function convertSection(section: DocumentSection): Paragraph {
  switch (section.type) {
    case 'heading':
      return new Paragraph({
        text: section.content,
        heading: HeadingLevel[`HEADING_${section.level}`],
        spacing: { before: 400, after: 200 }
      });
    
    case 'paragraph':
      return new Paragraph({
        children: [
          new TextRun({
            text: section.content,
            font: 'Times New Roman',
            size: 24
          })
        ],
        alignment: 'both' // justificado
      });
    
    default:
      return new Paragraph({ text: section.content });
  }
}
```

### 7.2 Upload para Storage

```typescript
// src/lib/ai/production/storage.ts

import { supabase } from '@/lib/supabase';

export async function saveDocument(
  docBuffer: Buffer,
  metadata: DocumentMetadata
): Promise<string> {
  const fileName = generateFileName(metadata);
  const filePath = `documents/${metadata.leadId}/${fileName}`;

  // Upload para Supabase Storage
  const { data, error } = await supabase.storage
    .from('legal-documents')
    .upload(filePath, docBuffer, {
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      upsert: false
    });

  if (error) throw new Error(`Erro ao salvar documento: ${error.message}`);

  // Registrar no banco
  await supabase.from('generated_documents').insert({
    lead_id: metadata.leadId,
    document_type: metadata.type,
    file_path: filePath,
    status: 'pending_review',
    created_at: new Date().toISOString()
  });

  // Retornar URL assinada
  const { data: urlData } = await supabase.storage
    .from('legal-documents')
    .createSignedUrl(filePath, 60 * 60 * 24); // 24h

  return urlData?.signedUrl || '';
}

function generateFileName(metadata: DocumentMetadata): string {
  const date = new Date().toISOString().split('T')[0];
  const sanitized = metadata.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .substring(0, 50);
  
  return `${date}_${sanitized}.docx`;
}
```

---

## 8. FILA DE REVISÃO

### 8.1 Sistema de Filas

```typescript
// src/lib/ai/production/review-queue.ts

interface ReviewItem {
  id: string;
  documentId: string;
  leadId: string;
  documentType: string;
  priority: 'high' | 'normal' | 'low';
  createdAt: Date;
  assignedTo?: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
}

export class ReviewQueue {
  async addToQueue(documentId: string, priority: string): Promise<void> {
    await supabase.from('review_queue').insert({
      document_id: documentId,
      priority: this.calculatePriority(priority),
      status: 'pending',
      created_at: new Date().toISOString()
    });

    // Notificar advogado
    await this.notifyReviewer(documentId);
  }

  async getNextItem(reviewerId: string): Promise<ReviewItem | null> {
    const { data } = await supabase
      .from('review_queue')
      .select('*')
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (data) {
      // Marcar como em revisão
      await supabase
        .from('review_queue')
        .update({ 
          status: 'in_review', 
          assigned_to: reviewerId,
          started_at: new Date().toISOString()
        })
        .eq('id', data.id);
    }

    return data;
  }

  async approveDocument(
    itemId: string, 
    reviewerId: string,
    comments?: string
  ): Promise<void> {
    await supabase
      .from('review_queue')
      .update({
        status: 'approved',
        completed_at: new Date().toISOString(),
        reviewer_comments: comments
      })
      .eq('id', itemId);

    // Mover documento para próxima etapa (protocolo)
    const item = await this.getItem(itemId);
    await this.moveToProtocol(item.documentId);
  }

  private async notifyReviewer(documentId: string): Promise<void> {
    // Enviar notificação push/email/telegram
    await sendNotification({
      type: 'new_document_review',
      documentId,
      message: 'Novo documento aguardando revisão'
    });
  }
}
```

### 8.2 Interface de Revisão

```typescript
// Componente React para revisão
// src/components/admin/DocumentReview.tsx

interface DocumentReviewProps {
  documentId: string;
}

export function DocumentReview({ documentId }: DocumentReviewProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [editing, setEditing] = useState(false);
  
  // Estados da revisão
  const handleApprove = async () => {
    await reviewQueue.approveDocument(documentId, currentUserId);
    toast.success('Documento aprovado!');
    router.push('/admin/queue');
  };

  const handleReject = async (reason: string) => {
    await reviewQueue.rejectDocument(documentId, currentUserId, reason);
    toast.info('Documento devolvido para ajustes');
  };

  const handleEdit = async (newContent: string) => {
    await updateDocument(documentId, newContent);
    setEditing(false);
  };

  return (
    <div className="review-container">
      <DocumentViewer 
        content={document?.content}
        onEdit={editing ? handleEdit : undefined}
      />
      
      <ReviewActions
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={() => setEditing(true)}
      />
      
      <ReviewChecklist
        items={[
          'Qualificação das partes correta',
          'Fatos condizentes com documentos',
          'Fundamentação jurídica adequada',
          'Pedidos específicos e claros',
          'Formatação correta'
        ]}
      />
    </div>
  );
}
```

---

## 9. MÉTRICAS DE PRODUÇÃO

### 9.1 KPIs do Sistema

```
MÉTRICAS DE PRODUÇÃO:
├── Tempo médio de geração: < 30 segundos
├── Tempo médio de revisão: < 10 minutos
├── Taxa de aprovação primeira revisão: > 85%
├── Tokens médios por documento: ~2.000
└── Custo médio por documento: ~R$ 0,50

MÉTRICAS DE QUALIDADE:
├── Petições sem erro de formatação: > 98%
├── Citações jurídicas corretas: > 95%
├── Satisfação do advogado revisor: > 4.5/5
└── Retrabalho necessário: < 15%

MÉTRICAS DE VOLUME:
├── Documentos gerados/dia: meta 20+
├── Documentos revisados/dia: meta 20+
├── Backlog máximo: < 24h
└── SLA de entrega: 72h
```

### 9.2 Dashboard de Produção

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DASHBOARD DE PRODUÇÃO JURÍDICA                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  HOJE                              FILA ATUAL                       │
│  ├── Gerados: 12                   ├── Aguardando revisão: 5       │
│  ├── Revisados: 10                 ├── Em revisão: 2               │
│  ├── Protocolados: 8               └── Aprovados hoje: 10          │
│  └── Pendentes: 7                                                  │
│                                                                     │
│  TEMPO MÉDIO                       CUSTOS                          │
│  ├── Geração: 28s                  ├── IA hoje: R$ 6,50            │
│  ├── Revisão: 8min                 ├── IA mês: R$ 195,00           │
│  └── Total (gerar→protocolar): 4h  └── Custo/doc: R$ 0,54          │
│                                                                     │
│  POR TIPO (MÊS)                                                    │
│  ├── Desbloqueio: 45 (38%)                                         │
│  ├── Golpe PIX: 28 (24%)                                           │
│  ├── Plano Saúde: 22 (19%)                                         │
│  ├── Usucapião: 12 (10%)                                           │
│  └── Outros: 11 (9%)                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 10. CHECKLIST DE IMPLEMENTAÇÃO

```
FASE 1: INFRAESTRUTURA
[ ] Configurar API Anthropic
[ ] Criar tabelas no Supabase (generated_documents, review_queue)
[ ] Configurar Storage para documentos
[ ] Implementar sistema de templates

FASE 2: MOTOR DE GERAÇÃO
[ ] Implementar DocumentGenerator
[ ] Criar prompts por área
[ ] Implementar TemplateEngine
[ ] Testar geração básica

FASE 3: EXPORTAÇÃO
[ ] Implementar conversão MD → DOCX
[ ] Configurar estilos padrão
[ ] Adicionar cabeçalho/rodapé
[ ] Testar formatação

FASE 4: REVISÃO
[ ] Implementar ReviewQueue
[ ] Criar interface de revisão
[ ] Sistema de aprovação/rejeição
[ ] Notificações

FASE 5: INTEGRAÇÃO
[ ] Conectar com fluxo de pagamento
[ ] Trigger automático pós-assinatura
[ ] Integração com protocolo
[ ] Dashboard de métricas
```

---

*Documento: 14-IA-PRODUCAO-JURIDICA.md*
*Versão: 1.0*
