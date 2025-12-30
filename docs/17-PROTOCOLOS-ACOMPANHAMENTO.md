# 15 - PROTOCOLOS E ACOMPANHAMENTO
## Garcez Palha - Inteligência Jurídica

---

## 1. VISÃO GERAL

### 1.1 Conceito

```
PROTOCOLOS E ACOMPANHAMENTO:
Sistema automatizado para protocolar petições nos
tribunais e monitorar o andamento processual,
notificando clientes sobre cada movimentação.

OBJETIVOS:
├── Protocolar petições em até 24h após aprovação
├── Monitorar 100% dos processos automaticamente
├── Notificar cliente em cada movimentação
├── Cumprir prazos sem falhas
└── Gerar relatórios de status automáticos
```

### 1.2 Fluxo Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FLUXO DE PROTOCOLO E ACOMPANHAMENTO             │
└─────────────────────────────────────────────────────────────────────┘

[1] DOCUMENTO APROVADO
    │
    ▼
[2] PREPARAÇÃO PARA PROTOCOLO
    ├── Verificar documentos anexos
    ├── Gerar GRU/custas (se necessário)
    ├── Formatar para sistema do tribunal
    └── Validar certificado digital
    │
    ▼
[3] PROTOCOLO NO TRIBUNAL
    ├── PJe (Justiça Estadual/Federal)
    ├── e-SAJ (SP)
    ├── PROJUDI (diversos estados)
    └── Sistemas específicos
    │
    ▼
[4] CONFIRMAÇÃO
    ├── Capturar número do processo
    ├── Salvar comprovante de protocolo
    ├── Notificar cliente
    └── Adicionar ao monitoramento
    │
    ▼
[5] ACOMPANHAMENTO CONTÍNUO
    ├── Monitorar via Judit.io API
    ├── Capturar movimentações
    ├── Classificar urgência
    └── Notificar automaticamente
    │
    ▼
[6] AÇÕES NECESSÁRIAS
    ├── Identificar prazos
    ├── Alertar sobre intimações
    ├── Sugerir próximos passos
    └── Gerar documentos de resposta
```

---

## 2. SISTEMAS DE PROTOCOLO

### 2.1 Tribunais e Sistemas

```
JUSTIÇA ESTADUAL RJ:
├── Sistema: e-Proc / PJe
├── URL: https://tjrj.pje.jus.br
├── Certificado: A3 ou A1 (e-CPF/e-CNPJ)
└── Formatos aceitos: PDF/A

JUIZADOS ESPECIAIS RJ:
├── Sistema: PROJUDI
├── URL: https://projudi.tjrj.jus.br
├── Certificado: A3 ou Token
└── Limite de tamanho: 10MB por arquivo

JUSTIÇA FEDERAL:
├── Sistema: PJe
├── URL: https://pje.trf2.jus.br
├── Certificado: A3 obrigatório
└── Assinatura: cada peça individualmente

JUSTIÇA DO TRABALHO:
├── Sistema: PJe-JT
├── URL: https://pje.trt1.jus.br
├── Certificado: A3
└── Classes específicas
```

### 2.2 Integração com Judit.io

```
JUDIT.IO - API DE MONITORAMENTO
├── Cobertura: 100+ tribunais brasileiros
├── Atualização: diária
├── Notificações: webhook em tempo real
└── Preço: ~R$ 2-5 por processo/mês

VANTAGENS:
├── Não precisar desenvolver scrapers próprios
├── Manutenção por terceiros
├── API estável e documentada
└── Suporte a todos os principais tribunais
```

---

## 3. PROTOCOLO AUTOMATIZADO

### 3.1 Preparação de Documentos

```typescript
// src/lib/protocol/document-prep.ts

interface ProtocolDocument {
  mainPetition: Buffer;
  attachments: Attachment[];
  metadata: DocumentMetadata;
}

interface Attachment {
  name: string;
  type: 'procuracao' | 'documento' | 'comprovante';
  file: Buffer;
  size: number;
}

export class DocumentPreparation {
  
  // Verificar requisitos do tribunal
  async validateForProtocol(
    doc: ProtocolDocument, 
    tribunal: string
  ): Promise<ValidationResult> {
    const rules = this.getTribunalRules(tribunal);
    const errors: string[] = [];
    
    // Verificar formato PDF/A
    if (!this.isPDFA(doc.mainPetition)) {
      errors.push('Petição deve estar em formato PDF/A');
    }
    
    // Verificar tamanho
    const totalSize = doc.mainPetition.length + 
      doc.attachments.reduce((acc, a) => acc + a.size, 0);
    
    if (totalSize > rules.maxSize) {
      errors.push(`Tamanho total (${this.formatSize(totalSize)}) excede limite (${this.formatSize(rules.maxSize)})`);
    }
    
    // Verificar anexos obrigatórios
    const hasProc = doc.attachments.some(a => a.type === 'procuracao');
    if (rules.requiresProcuracao && !hasProc) {
      errors.push('Procuração obrigatória não encontrada');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Converter para PDF/A se necessário
  async convertToPDFA(buffer: Buffer): Promise<Buffer> {
    // Usando Ghostscript
    const inputPath = `/tmp/input_${Date.now()}.pdf`;
    const outputPath = `/tmp/output_${Date.now()}.pdf`;
    
    await fs.writeFile(inputPath, buffer);
    
    await execAsync(`gs -dPDFA=2 -dBATCH -dNOPAUSE -sColorConversionStrategy=UseDeviceIndependentColor -sDEVICE=pdfwrite -dPDFACompatibilityPolicy=1 -sOutputFile=${outputPath} ${inputPath}`);
    
    const converted = await fs.readFile(outputPath);
    
    // Limpar temporários
    await fs.unlink(inputPath);
    await fs.unlink(outputPath);
    
    return converted;
  }

  // Unificar documentos em um único PDF
  async mergePDFs(documents: Buffer[]): Promise<Buffer> {
    const merger = new PDFMerger();
    
    for (const doc of documents) {
      await merger.add(doc);
    }
    
    return await merger.saveAsBuffer();
  }

  private getTribunalRules(tribunal: string): TribunalRules {
    const rules: Record<string, TribunalRules> = {
      'tjrj': {
        maxSize: 100 * 1024 * 1024, // 100MB
        maxFileSize: 15 * 1024 * 1024, // 15MB por arquivo
        requiresProcuracao: true,
        formats: ['pdf']
      },
      'jef': {
        maxSize: 50 * 1024 * 1024, // 50MB
        maxFileSize: 10 * 1024 * 1024, // 10MB por arquivo
        requiresProcuracao: true,
        formats: ['pdf']
      }
    };
    
    return rules[tribunal] || rules['tjrj'];
  }
}
```

### 3.2 Geração de Custas

```typescript
// src/lib/protocol/court-fees.ts

interface FeeCalculation {
  tribunal: string;
  tipoAcao: string;
  valorCausa: number;
  isGratuidade: boolean;
}

export async function calculateFees(calc: FeeCalculation): Promise<CourtFees> {
  if (calc.isGratuidade) {
    return { total: 0, items: [], gruCode: null };
  }

  const feeTable = await getFeeTable(calc.tribunal);
  const items: FeeItem[] = [];

  // Custas judiciais
  const custas = calculateCustas(feeTable, calc.valorCausa);
  items.push({
    description: 'Custas judiciais',
    value: custas
  });

  // Taxa judiciária
  const taxa = calculateTaxa(feeTable, calc.tipoAcao);
  items.push({
    description: 'Taxa judiciária',
    value: taxa
  });

  // FUNPERJ (RJ)
  if (calc.tribunal === 'tjrj') {
    const funperj = calc.valorCausa * 0.01; // 1%
    items.push({
      description: 'FUNPERJ',
      value: Math.min(funperj, feeTable.funperjMax)
    });
  }

  const total = items.reduce((acc, item) => acc + item.value, 0);

  // Gerar código da GRU
  const gruCode = await generateGRU({
    tribunal: calc.tribunal,
    valor: total,
    cpf: calc.cpfAdvogado
  });

  return { total, items, gruCode };
}

// Tabela de custas TJRJ 2024
function calculateCustas(table: FeeTable, valorCausa: number): number {
  // Faixas de valor
  if (valorCausa <= 5000) return 85.35;
  if (valorCausa <= 10000) return 170.70;
  if (valorCausa <= 20000) return 341.40;
  if (valorCausa <= 40000) return 682.80;
  if (valorCausa <= 100000) return 1365.60;
  return 2731.20; // acima de 100k
}
```

### 3.3 Protocolo Semi-Automatizado

```typescript
// src/lib/protocol/protocol-service.ts

// NOTA: Protocolo 100% automatizado requer integração
// específica com cada tribunal via certificado digital.
// Inicialmente, usaremos protocolo semi-automatizado.

export class ProtocolService {
  
  // Preparar pacote para protocolo manual
  async prepareForProtocol(documentId: string): Promise<ProtocolPackage> {
    const document = await this.getDocument(documentId);
    const lead = await this.getLead(document.leadId);
    
    // Identificar tribunal
    const tribunal = this.identifyTribunal(document.type, lead.data);
    
    // Preparar documentos
    const preparedDocs = await this.prepareDocuments(document, tribunal);
    
    // Calcular custas
    const fees = await calculateFees({
      tribunal,
      tipoAcao: document.type,
      valorCausa: lead.data.valorCausa,
      isGratuidade: lead.data.gratuidade
    });
    
    // Gerar checklist
    const checklist = this.generateChecklist(document.type, tribunal);
    
    // Salvar pacote
    const package_ = await this.savePackage({
      documentId,
      tribunal,
      documents: preparedDocs,
      fees,
      checklist,
      status: 'ready_for_protocol'
    });

    // Notificar advogado
    await this.notifyReadyForProtocol(package_);
    
    return package_;
  }

  // Confirmar protocolo (feito manualmente)
  async confirmProtocol(
    packageId: string,
    protocolData: ProtocolConfirmation
  ): Promise<void> {
    // Salvar dados do processo
    await supabase.from('processes').insert({
      package_id: packageId,
      process_number: protocolData.processNumber,
      tribunal: protocolData.tribunal,
      vara: protocolData.vara,
      protocol_date: protocolData.date,
      protocol_receipt: protocolData.receiptUrl
    });

    // Atualizar status do pacote
    await supabase
      .from('protocol_packages')
      .update({ status: 'protocoled' })
      .eq('id', packageId);

    // Adicionar ao monitoramento Judit
    await this.addToMonitoring(protocolData.processNumber);

    // Notificar cliente
    await this.notifyClientProtocoled(packageId, protocolData);
  }

  private generateChecklist(docType: string, tribunal: string): ChecklistItem[] {
    return [
      { item: 'Verificar assinatura digital', done: false },
      { item: 'Conferir anexos obrigatórios', done: false },
      { item: 'Validar formato PDF/A', done: false },
      { item: 'Pagar custas (se aplicável)', done: false },
      { item: 'Acessar sistema do tribunal', done: false },
      { item: 'Protocolar petição', done: false },
      { item: 'Salvar comprovante', done: false },
      { item: 'Registrar número do processo', done: false }
    ];
  }
}
```

---

## 4. MONITORAMENTO DE PROCESSOS

### 4.1 Integração Judit.io

```typescript
// src/lib/monitoring/judit-client.ts

interface JuditConfig {
  apiKey: string;
  baseUrl: string;
  webhookUrl: string;
}

export class JuditClient {
  private config: JuditConfig;
  private http: AxiosInstance;

  constructor(config: JuditConfig) {
    this.config = config;
    this.http = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Adicionar processo para monitoramento
  async addProcess(processNumber: string): Promise<JuditProcess> {
    const response = await this.http.post('/processes', {
      number: processNumber,
      webhook_url: this.config.webhookUrl
    });
    
    return response.data;
  }

  // Buscar movimentações
  async getMovements(processId: string): Promise<Movement[]> {
    const response = await this.http.get(`/processes/${processId}/movements`);
    return response.data.movements;
  }

  // Buscar detalhes do processo
  async getProcessDetails(processId: string): Promise<ProcessDetails> {
    const response = await this.http.get(`/processes/${processId}`);
    return response.data;
  }

  // Listar todos os processos monitorados
  async listProcesses(): Promise<JuditProcess[]> {
    const response = await this.http.get('/processes');
    return response.data.processes;
  }

  // Remover processo do monitoramento
  async removeProcess(processId: string): Promise<void> {
    await this.http.delete(`/processes/${processId}`);
  }
}

// Configuração
export const juditClient = new JuditClient({
  apiKey: process.env.JUDIT_API_KEY!,
  baseUrl: 'https://api.judit.io/v1',
  webhookUrl: 'https://api.garcezpalha.com/webhooks/judit'
});
```

### 4.2 Webhook de Movimentações

```typescript
// src/app/api/webhooks/judit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { classifyMovement } from '@/lib/monitoring/classifier';
import { notifyClient } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  // Validar assinatura do webhook
  const signature = req.headers.get('x-judit-signature');
  if (!validateSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const { process_number, movement } = body;

  // Buscar processo no banco
  const { data: process } = await supabase
    .from('processes')
    .select('*, leads(*)')
    .eq('process_number', process_number)
    .single();

  if (!process) {
    console.error(`Processo não encontrado: ${process_number}`);
    return NextResponse.json({ error: 'Process not found' }, { status: 404 });
  }

  // Classificar movimentação
  const classification = classifyMovement(movement);

  // Salvar movimentação
  await supabase.from('process_movements').insert({
    process_id: process.id,
    movement_date: movement.date,
    description: movement.description,
    classification: classification.type,
    urgency: classification.urgency,
    requires_action: classification.requiresAction,
    deadline: classification.deadline,
    raw_data: movement
  });

  // Notificar conforme urgência
  if (classification.urgency === 'high' || classification.requiresAction) {
    // Notificação imediata
    await notifyClient({
      leadId: process.lead_id,
      type: 'urgent_movement',
      data: {
        processNumber: process_number,
        movement: movement.description,
        deadline: classification.deadline
      }
    });

    // Notificar advogado também
    await notifyLawyer({
      processId: process.id,
      movement,
      classification
    });
  } else {
    // Agrupar para resumo diário
    await queueForDailyDigest(process.lead_id, movement);
  }

  return NextResponse.json({ success: true });
}
```

### 4.3 Classificador de Movimentações

```typescript
// src/lib/monitoring/classifier.ts

interface MovementClassification {
  type: 'sentenca' | 'despacho' | 'intimacao' | 'prazo' | 'audiencia' | 'recurso' | 'outros';
  urgency: 'high' | 'medium' | 'low';
  requiresAction: boolean;
  deadline?: Date;
  suggestedAction?: string;
}

const PATTERNS = {
  sentenca: [
    /sentença/i,
    /julgado procedente/i,
    /julgado improcedente/i,
    /julgo extinto/i,
    /homo?logo/i
  ],
  intimacao: [
    /intimação/i,
    /intim[ae]/i,
    /manifestar/i,
    /prazo de \d+ dias/i
  ],
  audiencia: [
    /audiência/i,
    /designad[ao]/i,
    /pauta/i
  ],
  despacho: [
    /despacho/i,
    /vista/i,
    /certidão/i,
    /juntada/i
  ],
  recurso: [
    /apelação/i,
    /agravo/i,
    /embargos/i,
    /recurso/i
  ]
};

export function classifyMovement(movement: any): MovementClassification {
  const text = movement.description.toLowerCase();
  
  // Identificar tipo
  let type: MovementClassification['type'] = 'outros';
  for (const [key, patterns] of Object.entries(PATTERNS)) {
    if (patterns.some(p => p.test(text))) {
      type = key as MovementClassification['type'];
      break;
    }
  }

  // Determinar urgência e ação necessária
  let urgency: MovementClassification['urgency'] = 'low';
  let requiresAction = false;
  let deadline: Date | undefined;
  let suggestedAction: string | undefined;

  switch (type) {
    case 'sentenca':
      urgency = 'high';
      requiresAction = true;
      deadline = addDays(new Date(), 15); // Prazo recursal
      suggestedAction = 'Analisar sentença e verificar cabimento de recurso';
      break;

    case 'intimacao':
      urgency = 'high';
      requiresAction = true;
      const prazoMatch = text.match(/prazo de (\d+) dias/i);
      if (prazoMatch) {
        deadline = addDays(new Date(), parseInt(prazoMatch[1]));
      } else {
        deadline = addDays(new Date(), 5); // Prazo padrão
      }
      suggestedAction = 'Apresentar manifestação dentro do prazo';
      break;

    case 'audiencia':
      urgency = 'medium';
      requiresAction = true;
      // Extrair data da audiência se possível
      suggestedAction = 'Confirmar presença e preparar cliente';
      break;

    case 'recurso':
      urgency = 'medium';
      requiresAction = false;
      suggestedAction = 'Acompanhar julgamento';
      break;

    case 'despacho':
      urgency = 'low';
      // Verificar se há intimação implícita
      if (text.includes('manifeste') || text.includes('vista')) {
        urgency = 'medium';
        requiresAction = true;
        deadline = addDays(new Date(), 5);
      }
      break;
  }

  return {
    type,
    urgency,
    requiresAction,
    deadline,
    suggestedAction
  };
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
```

---

## 5. SISTEMA DE NOTIFICAÇÕES

### 5.1 Canais de Notificação

```
CANAIS DISPONÍVEIS:
├── WhatsApp (principal)
│   ├── Movimentações urgentes: imediato
│   ├── Resumo diário: 18h
│   └── Resultado final: imediato
│
├── Email (backup)
│   ├── Todos os eventos
│   ├── Cópia de documentos
│   └── Relatórios periódicos
│
└── SMS (emergência)
    ├── Prazos críticos
    ├── Audiências
    └── Sentenças
```

### 5.2 Templates de Mensagem

```typescript
// src/lib/notifications/templates.ts

export const NOTIFICATION_TEMPLATES = {
  
  // Protocolo realizado
  process_filed: `
✅ *PROCESSO PROTOCOLADO*

Olá {nome}!

Sua petição foi protocolada com sucesso!

📋 *Número do Processo:* {numero_processo}
⚖️ *Tribunal:* {tribunal}
📍 *Vara:* {vara}

A partir de agora, vou acompanhar todas as movimentações e te avisar de qualquer novidade.

Previsão de primeira movimentação: 15-30 dias

Qualquer dúvida, estou aqui! 🙂
  `,

  // Movimentação urgente
  urgent_movement: `
🚨 *ATENÇÃO - MOVIMENTAÇÃO URGENTE*

Olá {nome}!

Houve uma movimentação importante no seu processo:

📋 *Processo:* {numero_processo}
📅 *Data:* {data}
📝 *Movimentação:* {descricao}

⚠️ *PRAZO:* {prazo}
✅ *Ação necessária:* {acao_sugerida}

Já estamos cuidando disso! Em breve você receberá mais informações.

Fique tranquilo(a)! 💪
  `,

  // Sentença
  sentence_notification: `
⚖️ *DECISÃO NO SEU PROCESSO*

Olá {nome}!

O juiz proferiu uma decisão no seu processo:

📋 *Processo:* {numero_processo}
📅 *Data:* {data}
📝 *Decisão:* {tipo_decisao}

{resultado_resumo}

📞 *Próximos passos:* Vamos analisar a decisão e entrar em contato em até 24h para explicar os detalhes e discutir os próximos passos.

{se_favoravel}
🎉 Parabéns! O resultado foi favorável!
{/se_favoravel}

{se_desfavoravel}
😔 Infelizmente o resultado não foi favorável, mas ainda podemos recorrer. Não desanime!
{/se_desfavoravel}
  `,

  // Resumo diário
  daily_digest: `
📊 *RESUMO DO DIA - {data}*

Olá {nome}!

Aqui está o resumo do seu(s) processo(s):

{lista_processos}

📌 *Processos ativos:* {total_ativos}
📅 *Prazos próximos:* {prazos}

Qualquer dúvida, é só chamar! 👋
  `,

  // Audiência agendada
  hearing_scheduled: `
📅 *AUDIÊNCIA AGENDADA*

Olá {nome}!

Foi marcada uma audiência no seu processo:

📋 *Processo:* {numero_processo}
📅 *Data:* {data_audiencia}
⏰ *Horário:* {horario}
📍 *Local:* {local}

*Importante:*
- Chegar com 30 minutos de antecedência
- Levar documento com foto
- Vestir-se adequadamente

Vamos agendar uma ligação antes da audiência para te preparar!

📞 Posso ligar {data_sugerida}?
  `
};
```

### 5.3 Serviço de Notificação

```typescript
// src/lib/notifications/notification-service.ts

interface NotificationData {
  leadId: string;
  type: keyof typeof NOTIFICATION_TEMPLATES;
  data: Record<string, any>;
  channels?: ('whatsapp' | 'email' | 'sms')[];
  priority?: 'high' | 'normal' | 'low';
}

export class NotificationService {
  
  async notify(notification: NotificationData): Promise<void> {
    const lead = await this.getLead(notification.leadId);
    const template = NOTIFICATION_TEMPLATES[notification.type];
    const message = this.processTemplate(template, notification.data);
    
    const channels = notification.channels || this.getDefaultChannels(notification.priority);
    
    for (const channel of channels) {
      try {
        switch (channel) {
          case 'whatsapp':
            await this.sendWhatsApp(lead.phone, message);
            break;
          case 'email':
            await this.sendEmail(lead.email, notification.type, message);
            break;
          case 'sms':
            await this.sendSMS(lead.phone, this.truncateForSMS(message));
            break;
        }

        // Log sucesso
        await this.logNotification(notification, channel, 'sent');
        
      } catch (error) {
        // Log erro e tentar próximo canal
        await this.logNotification(notification, channel, 'failed', error);
      }
    }
  }

  private getDefaultChannels(priority?: string): string[] {
    switch (priority) {
      case 'high':
        return ['whatsapp', 'sms', 'email'];
      case 'normal':
        return ['whatsapp', 'email'];
      case 'low':
        return ['email'];
      default:
        return ['whatsapp'];
    }
  }

  private processTemplate(template: string, data: Record<string, any>): string {
    let result = template;
    
    // Substituir variáveis simples
    for (const [key, value] of Object.entries(data)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    
    // Processar condicionais
    result = this.processConditionals(result, data);
    
    return result.trim();
  }

  private processConditionals(template: string, data: Record<string, any>): string {
    const conditionalRegex = /\{se_(\w+)\}([\s\S]*?)\{\/se_\1\}/g;
    
    return template.replace(conditionalRegex, (match, condition, content) => {
      return data[condition] ? content : '';
    });
  }

  private async sendWhatsApp(phone: string, message: string): Promise<void> {
    await evolutionApi.sendText({
      number: phone,
      text: message
    });
  }

  private async sendEmail(
    email: string, 
    subject: string, 
    message: string
  ): Promise<void> {
    await resend.emails.send({
      from: 'Garcez Palha <processos@garcezpalha.com>',
      to: email,
      subject: this.getEmailSubject(subject),
      html: this.convertToHTML(message)
    });
  }

  private truncateForSMS(message: string): string {
    const plainText = message.replace(/\*|_|~/g, ''); // Remove formatação
    return plainText.length > 160 
      ? plainText.substring(0, 157) + '...'
      : plainText;
  }
}

export const notificationService = new NotificationService();
```

---

## 6. CONTROLE DE PRAZOS

### 6.1 Sistema de Prazos

```typescript
// src/lib/monitoring/deadline-manager.ts

interface Deadline {
  id: string;
  processId: string;
  type: 'recurso' | 'manifestacao' | 'audiencia' | 'cumprimento';
  dueDate: Date;
  description: string;
  status: 'pending' | 'completed' | 'overdue';
  assignedTo?: string;
}

export class DeadlineManager {
  
  // Calcular prazo considerando dias úteis
  calculateDeadline(startDate: Date, days: number, type: 'calendar' | 'business'): Date {
    if (type === 'calendar') {
      return addDays(startDate, days);
    }
    
    // Dias úteis (excluir finais de semana e feriados)
    let current = new Date(startDate);
    let businessDays = 0;
    
    while (businessDays < days) {
      current = addDays(current, 1);
      if (this.isBusinessDay(current)) {
        businessDays++;
      }
    }
    
    return current;
  }

  private isBusinessDay(date: Date): boolean {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return false;
    
    // Verificar feriados (simplificado)
    const holidays = this.getHolidays(date.getFullYear());
    const dateStr = date.toISOString().split('T')[0];
    return !holidays.includes(dateStr);
  }

  // Verificar prazos próximos
  async checkUpcomingDeadlines(): Promise<Deadline[]> {
    const { data: deadlines } = await supabase
      .from('deadlines')
      .select('*')
      .eq('status', 'pending')
      .lte('due_date', addDays(new Date(), 7).toISOString())
      .order('due_date', { ascending: true });

    return deadlines || [];
  }

  // Enviar alertas de prazo
  async sendDeadlineAlerts(): Promise<void> {
    const deadlines = await this.checkUpcomingDeadlines();
    
    for (const deadline of deadlines) {
      const daysUntil = this.getDaysUntil(deadline.dueDate);
      
      if (daysUntil <= 0) {
        // Prazo vencido
        await this.notifyOverdue(deadline);
        await this.updateDeadlineStatus(deadline.id, 'overdue');
      } else if (daysUntil === 1) {
        // Vence amanhã
        await this.notifyUrgent(deadline, 'Prazo vence AMANHÃ!');
      } else if (daysUntil === 3) {
        // Vence em 3 dias
        await this.notifyWarning(deadline, 'Prazo vence em 3 dias');
      } else if (daysUntil === 7) {
        // Vence em 1 semana
        await this.notifyReminder(deadline);
      }
    }
  }

  private getDaysUntil(date: Date): number {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

// Executar verificação de prazos diariamente
export const deadlineManager = new DeadlineManager();
```

### 6.2 Workflow de Prazo (n8n)

```
TRIGGER: Cron (diário 8h)
    │
    ▼
NODE 1: Buscar prazos próximos
    │
    ▼
NODE 2: Filtrar por urgência
    │
    ├── Vencidos → NODE 3a
    ├── 1 dia → NODE 3b
    ├── 3 dias → NODE 3c
    └── 7 dias → NODE 3d
    │
    ▼
NODE 3: Enviar notificações
    │
    ├── WhatsApp (cliente)
    ├── Email (cliente + advogado)
    └── Telegram (advogado - urgentes)
    │
    ▼
NODE 4: Atualizar status
    │
    ▼
NODE 5: Gerar relatório diário
```

---

## 7. RELATÓRIOS E DASHBOARD

### 7.1 Dashboard de Processos

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DASHBOARD DE ACOMPANHAMENTO                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  VISÃO GERAL                       PRAZOS                          │
│  ├── Processos ativos: 47          ├── Vencendo hoje: 2 🔴         │
│  ├── Aguardando protocolo: 5       ├── Próximos 3 dias: 5 🟡       │
│  ├── Aguardando sentença: 18       ├── Próximos 7 dias: 12 🟢      │
│  └── Encerrados (mês): 12          └── Total pendentes: 19         │
│                                                                     │
│  MOVIMENTAÇÕES HOJE                                                │
│  ├── Total: 23                                                      │
│  ├── Urgentes: 4                                                    │
│  ├── Requer ação: 7                                                 │
│  └── Informativas: 12                                               │
│                                                                     │
│  POR TRIBUNAL                                                       │
│  ├── TJRJ: 28 processos (60%)                                      │
│  ├── JEF: 12 processos (25%)                                       │
│  ├── TRF2: 5 processos (11%)                                       │
│  └── TRT1: 2 processos (4%)                                        │
│                                                                     │
│  TAXA DE SUCESSO                                                   │
│  ├── Favoráveis: 78%                                               │
│  ├── Parcialmente favoráveis: 12%                                  │
│  └── Desfavoráveis: 10%                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Relatório do Cliente

```typescript
// src/lib/reports/client-report.ts

export async function generateClientReport(
  leadId: string
): Promise<ClientReport> {
  const processes = await getClientProcesses(leadId);
  
  return {
    summary: {
      totalProcesses: processes.length,
      active: processes.filter(p => p.status === 'active').length,
      completed: processes.filter(p => p.status === 'completed').length,
      favorable: processes.filter(p => p.result === 'favorable').length
    },
    
    processes: processes.map(p => ({
      number: p.processNumber,
      type: p.type,
      status: p.status,
      lastMovement: p.lastMovement,
      nextDeadline: p.nextDeadline,
      predictedOutcome: p.prediction
    })),
    
    timeline: await getProcessTimeline(processes),
    
    pendingActions: await getPendingActions(leadId),
    
    financialSummary: await getFinancialSummary(leadId)
  };
}

// Gerar PDF do relatório
export async function generateReportPDF(
  report: ClientReport
): Promise<Buffer> {
  // Usar puppeteer ou react-pdf
  const html = await renderReportTemplate(report);
  const pdf = await htmlToPdf(html);
  return pdf;
}
```

---

## 8. BANCO DE DADOS

### 8.1 Estrutura

```sql
-- Processos
CREATE TABLE processes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id),
  package_id UUID REFERENCES protocol_packages(id),
  process_number VARCHAR(30) UNIQUE,
  tribunal VARCHAR(20),
  vara VARCHAR(100),
  tipo_acao VARCHAR(50),
  valor_causa DECIMAL(12,2),
  status VARCHAR(20) DEFAULT 'active',
  protocol_date DATE,
  last_movement_date DATE,
  result VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Movimentações
CREATE TABLE process_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  process_id UUID REFERENCES processes(id),
  movement_date DATE,
  description TEXT,
  classification VARCHAR(30),
  urgency VARCHAR(10),
  requires_action BOOLEAN DEFAULT FALSE,
  deadline DATE,
  action_taken TEXT,
  raw_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Prazos
CREATE TABLE deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  process_id UUID REFERENCES processes(id),
  movement_id UUID REFERENCES process_movements(id),
  type VARCHAR(30),
  due_date DATE,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  completed_at TIMESTAMP,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pacotes de protocolo
CREATE TABLE protocol_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES generated_documents(id),
  tribunal VARCHAR(20),
  status VARCHAR(30) DEFAULT 'preparing',
  fees_total DECIMAL(10,2),
  fees_paid BOOLEAN DEFAULT FALSE,
  checklist JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Log de notificações
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id),
  process_id UUID REFERENCES processes(id),
  type VARCHAR(50),
  channel VARCHAR(20),
  status VARCHAR(20),
  message TEXT,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_processes_lead ON processes(lead_id);
CREATE INDEX idx_processes_number ON processes(process_number);
CREATE INDEX idx_movements_process ON process_movements(process_id);
CREATE INDEX idx_movements_date ON process_movements(movement_date);
CREATE INDEX idx_deadlines_due ON deadlines(due_date) WHERE status = 'pending';
```

---

## 9. AUTOMAÇÕES N8N

### 9.1 Workflow: Protocolo Pronto

```
TRIGGER: Webhook (documento aprovado)
    │
    ▼
NODE 1: Buscar dados do documento
    │
    ▼
NODE 2: Preparar documentos
    ├── Converter para PDF/A
    ├── Unificar anexos
    └── Validar requisitos
    │
    ▼
NODE 3: Calcular custas
    │
    ▼
NODE 4: Criar pacote de protocolo
    │
    ▼
NODE 5: Notificar advogado
    ├── Telegram: "Novo protocolo pronto"
    └── Email: pacote completo
    │
    ▼
NODE 6: Criar tarefa no sistema
```

### 9.2 Workflow: Monitoramento Diário

```
TRIGGER: Cron (6h, 12h, 18h)
    │
    ▼
NODE 1: Buscar processos ativos
    │
    ▼
NODE 2: Para cada processo:
    │
    ├── Consultar Judit.io
    ├── Comparar movimentações
    └── Identificar novas
    │
    ▼
NODE 3: Classificar movimentações
    │
    ▼
NODE 4: Salvar no banco
    │
    ▼
NODE 5: Processar notificações
    │
    ├── Urgentes: imediato
    └── Normais: agrupar
    │
    ▼
NODE 6: Atualizar prazos
```

---

## 10. CHECKLIST DE IMPLEMENTAÇÃO

```
FASE 1: INFRAESTRUTURA
[ ] Configurar conta Judit.io
[ ] Criar tabelas no Supabase
[ ] Configurar webhooks
[ ] Obter certificado digital

FASE 2: PROTOCOLO
[ ] Implementar DocumentPreparation
[ ] Criar sistema de checklist
[ ] Testar conversão PDF/A
[ ] Integrar cálculo de custas

FASE 3: MONITORAMENTO
[ ] Implementar JuditClient
[ ] Criar classificador de movimentações
[ ] Configurar webhook de recebimento
[ ] Testar captura de eventos

FASE 4: NOTIFICAÇÕES
[ ] Criar templates de mensagem
[ ] Implementar NotificationService
[ ] Configurar canais (WhatsApp, Email, SMS)
[ ] Testar envios

FASE 5: PRAZOS
[ ] Implementar DeadlineManager
[ ] Configurar alertas automáticos
[ ] Criar dashboard de prazos
[ ] Testar fluxo completo

FASE 6: RELATÓRIOS
[ ] Criar dashboard de processos
[ ] Implementar relatório do cliente
[ ] Geração de PDF
[ ] Automação de envio periódico
```

---

*Documento: 15-PROTOCOLOS-ACOMPANHAMENTO.md*
*Versão: 1.0*
