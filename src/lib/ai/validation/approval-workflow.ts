/**
 * Approval Workflow - Gerencia workflow de aprovação de documentos
 * Orquestra todo o processo de geração → validação → revisão → aprovação → envio
 */

import { oabComplianceChecker } from '../tools/oab-compliance-checker'
import { legalReviewQueue } from './legal-review-queue'

export interface WorkflowStep {
  step: number
  nome: string
  status: 'pendente' | 'em-andamento' | 'concluido' | 'falhou'
  dataInicio?: string
  dataFim?: string
  resultado?: any
  erro?: string
}

export interface DocumentWorkflow {
  id: string
  documentoId: string
  tipo: 'peticao' | 'contrato' | 'parecer' | 'procuracao' | 'outro'
  steps: WorkflowStep[]
  statusGeral: 'iniciado' | 'validacao' | 'revisao' | 'aprovado' | 'enviado' | 'falhou'
  requerRevisaoHumana: boolean
  dataInicio: string
  dataFim?: string
  tempoTotal?: number // minutos
}

export class ApprovalWorkflow {
  /**
   * Inicia workflow completo de aprovação de documento
   */
  async startWorkflow(params: {
    documentoId: string
    tipo: DocumentWorkflow['tipo']
    conteudo: string
    leadId: string
    agenteCriador: string
    autoApproveThreshold?: number // Score mínimo para auto-aprovação (padrão: 90)
  }): Promise<DocumentWorkflow> {
    const workflowId = this.generateWorkflowId()

    const workflow: DocumentWorkflow = {
      id: workflowId,
      documentoId: params.documentoId,
      tipo: params.tipo,
      steps: this.initializeSteps(),
      statusGeral: 'iniciado',
      requerRevisaoHumana: false,
      dataInicio: new Date().toISOString(),
    }

    // Step 1: Validação OAB Compliance
    await this.executeStep(workflow, 0, async () => {
      const complianceResult = await oabComplianceChecker.checkCompliance({
        tipoPeca: params.tipo,
        conteudo: params.conteudo,
        destinatario: 'cliente',
      })

      return complianceResult
    })

    const complianceResult = workflow.steps[0].resultado

    // Determinar se precisa revisão humana
    const autoApproveThreshold = params.autoApproveThreshold || 90
    workflow.requerRevisaoHumana =
      complianceResult.score < autoApproveThreshold ||
      complianceResult.requerRevisaoHumana

    if (workflow.requerRevisaoHumana) {
      // Step 2: Adicionar à fila de revisão
      workflow.statusGeral = 'revisao'

      await this.executeStep(workflow, 1, async () => {
        const reviewItem = await legalReviewQueue.addToQueue({
          tipo: params.tipo,
          titulo: `Documento ${params.documentoId}`,
          conteudo: params.conteudo,
          leadId: params.leadId,
          agenteCriador: params.agenteCriador,
          complianceCheck: {
            score: complianceResult.score,
            violacoes: complianceResult.violacoes.length,
            requerRevisao: complianceResult.requerRevisaoHumana,
          },
        })

        return {
          reviewQueueId: reviewItem.id,
          prioridade: reviewItem.prioridade,
          mensagem: 'Documento adicionado à fila de revisão humana',
        }
      })

      // Workflow aguarda revisão humana - será retomado após aprovação
      return workflow
    } else {
      // Auto-aprovação (score >= threshold)
      workflow.statusGeral = 'aprovado'

      await this.executeStep(workflow, 2, async () => {
        return {
          tipo: 'auto-aprovacao',
          motivo: `Score ${complianceResult.score}/100 >= threshold ${autoApproveThreshold}`,
          aprovadoPor: 'Sistema (validação automática)',
        }
      })

      // Step 3: Enviar ao cliente
      await this.executeStep(workflow, 3, async () => {
        return await this.sendToClient(params.documentoId, params.leadId)
      })

      workflow.statusGeral = 'enviado'
      workflow.dataFim = new Date().toISOString()
      workflow.tempoTotal = this.calculateDuration(workflow.dataInicio, workflow.dataFim)

      return workflow
    }
  }

  /**
   * Retoma workflow após revisão humana
   */
  async resumeAfterReview(params: {
    workflowId: string
    aprovado: boolean
    revisorId: string
    revisorNome: string
    observacoes?: string
  }): Promise<DocumentWorkflow> {
    const workflow = await this.getWorkflow(params.workflowId)

    if (params.aprovado) {
      // Step 2: Marcar como aprovado por revisor
      workflow.statusGeral = 'aprovado'

      await this.executeStep(workflow, 2, async () => {
        return {
          tipo: 'revisao-humana',
          aprovadoPor: `${params.revisorNome} (${params.revisorId})`,
          observacoes: params.observacoes,
        }
      })

      // Step 3: Enviar ao cliente
      await this.executeStep(workflow, 3, async () => {
        return await this.sendToClient(workflow.documentoId, 'lead_id')
      })

      workflow.statusGeral = 'enviado'
    } else {
      // Documento rejeitado
      workflow.statusGeral = 'falhou'

      await this.executeStep(workflow, 2, async () => {
        throw new Error(`Documento rejeitado por ${params.revisorNome}: ${params.observacoes}`)
      })
    }

    workflow.dataFim = new Date().toISOString()
    workflow.tempoTotal = this.calculateDuration(workflow.dataInicio, workflow.dataFim)

    return workflow
  }

  /**
   * Consulta status do workflow
   */
  async getWorkflowStatus(workflowId: string): Promise<{
    workflow: DocumentWorkflow
    proximoPasso: string
    tempoDecorrido: number // minutos
    statusDetalhado: string
  }> {
    const workflow = await this.getWorkflow(workflowId)
    const tempoDecorrido = this.calculateDuration(
      workflow.dataInicio,
      workflow.dataFim || new Date().toISOString()
    )

    let proximoPasso = ''
    let statusDetalhado = ''

    switch (workflow.statusGeral) {
      case 'iniciado':
        proximoPasso = 'Validação OAB Compliance'
        statusDetalhado = 'Workflow iniciado, executando validações'
        break
      case 'validacao':
        proximoPasso = 'Análise de conformidade em andamento'
        statusDetalhado = 'Verificando conformidade com Código de Ética OAB'
        break
      case 'revisao':
        proximoPasso = 'Aguardando revisão humana por advogado OAB'
        statusDetalhado = 'Documento na fila de revisão - aguardando aprovação'
        break
      case 'aprovado':
        proximoPasso = 'Envio ao cliente'
        statusDetalhado = 'Documento aprovado, preparando envio'
        break
      case 'enviado':
        proximoPasso = 'Concluído'
        statusDetalhado = 'Documento enviado ao cliente com sucesso'
        break
      case 'falhou':
        proximoPasso = 'Workflow finalizado com erro'
        statusDetalhado = 'Documento rejeitado ou erro no processamento'
        break
    }

    return {
      workflow,
      proximoPasso,
      tempoDecorrido,
      statusDetalhado,
    }
  }

  // Métodos auxiliares privados

  private initializeSteps(): WorkflowStep[] {
    return [
      {
        step: 1,
        nome: 'Validação OAB Compliance',
        status: 'pendente',
      },
      {
        step: 2,
        nome: 'Fila de Revisão Humana',
        status: 'pendente',
      },
      {
        step: 3,
        nome: 'Aprovação Final',
        status: 'pendente',
      },
      {
        step: 4,
        nome: 'Envio ao Cliente',
        status: 'pendente',
      },
    ]
  }

  private async executeStep(
    workflow: DocumentWorkflow,
    stepIndex: number,
    action: () => Promise<any>
  ): Promise<void> {
    const step = workflow.steps[stepIndex]
    step.status = 'em-andamento'
    step.dataInicio = new Date().toISOString()

    try {
      const resultado = await action()
      step.resultado = resultado
      step.status = 'concluido'
      step.dataFim = new Date().toISOString()
    } catch (error: any) {
      step.status = 'falhou'
      step.erro = error.message
      step.dataFim = new Date().toISOString()
      throw error
    }
  }

  private async sendToClient(documentoId: string, leadId: string): Promise<any> {
    // Em produção, integrar com sistema de envio (email, WhatsApp, etc)
    console.log(`[ApprovalWorkflow] Enviando documento ${documentoId} para lead ${leadId}`)

    return {
      enviado: true,
      canal: 'email',
      dataEnvio: new Date().toISOString(),
    }
  }

  private generateWorkflowId(): string {
    return `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async getWorkflow(id: string): Promise<DocumentWorkflow> {
    // Em produção, buscar do banco de dados
    // Simulação:
    return {
      id,
      documentoId: 'doc_123',
      tipo: 'peticao',
      steps: this.initializeSteps(),
      statusGeral: 'revisao',
      requerRevisaoHumana: true,
      dataInicio: new Date().toISOString(),
    }
  }

  private calculateDuration(inicio: string, fim: string): number {
    const diff = new Date(fim).getTime() - new Date(inicio).getTime()
    return Math.round(diff / 1000 / 60) // minutos
  }
}

// Singleton instance
export const approvalWorkflow = new ApprovalWorkflow()
