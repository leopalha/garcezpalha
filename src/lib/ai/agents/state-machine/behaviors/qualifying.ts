/**
 * Qualifying State Behavior
 * Runs qualification questions to assess case viability and score
 */

import { StateBehavior, ConversationData } from '../types'
import { ChatQualificationManager } from '../../../chat-qualification-integration'

export class QualifyingBehavior implements StateBehavior {
  state = 'qualifying' as const
  private qualificationManager: ChatQualificationManager

  constructor() {
    this.qualificationManager = new ChatQualificationManager()
  }

  async onEnter(data: ConversationData): Promise<ConversationData> {
    // Initialize qualification session
    data.qualification = {
      ...data.qualification,
      status: 'in_progress',
      questions_answered: 0,
    }
    return data
  }

  async handleMessage(
    message: string,
    data: ConversationData
  ): Promise<{
    response: string
    nextState?: 'qualified' | 'rejected' | 'escalated' | 'abandoned'
    data: ConversationData
  }> {
    try {
      // TODO: Integrate with existing qualification system
      // The qualification API needs to be aligned with state machine expectations
      // Expected method: continueQualification
      // Available methods: startQualification, submitAnswer

      throw new Error('Qualification integration pending - see P0 blocker in tasks.md')

      /* PENDING IMPLEMENTATION
      const qualificationResponse = await this.qualificationManager.continueQualification({
        sessionId: data.conversation_id,
        userId: data.client.email,
        message,
        source: data.channel as any,
        clientInfo: {
          name: data.client.name,
          phone: data.client.phone || data.phone_number,
          email: data.client.email || data.email,
        },
      })

      // Update qualification data
      if (qualificationResponse.progress) {
        data.qualification.questions_answered = qualificationResponse.progress.answered
        data.qualification.total_questions = qualificationResponse.progress.total
      }

      // Check if qualification is complete
      if (qualificationResponse.type === 'completion' && qualificationResponse.result) {
        data.qualification.status = 'complete'
        data.qualification.score = qualificationResponse.result.score

        // Add flags based on category
        if (qualificationResponse.result.category === 'hot') {
          data.qualification.flags.push('high_priority')
        }

        // Determine next state based on score
        const nextState = this.determineNextState(qualificationResponse.result.score)

        return {
          response: qualificationResponse.message,
          nextState,
          data,
        }
      }

      // Continue qualification
      return {
        response: qualificationResponse.message,
        data,
      }
      */

    } catch (error) {
      console.error('[Qualifying] Error:', error)

      return {
        response: 'Desculpe, ocorreu um erro ao processar suas informações. Pode tentar novamente?',
        data,
      }
    }
  }

  private determineNextState(score: number): 'qualified' | 'rejected' {
    // Threshold for qualification
    return score >= 25 ? 'qualified' : 'rejected'
  }
}
