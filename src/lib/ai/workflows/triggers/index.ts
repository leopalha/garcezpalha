/**
 * Trigger Workflows Module
 * Exports all trigger-based workflow implementations
 */

export {
  NEW_LEAD_WORKFLOW_CONFIG,
  NEW_LEAD_TRIGGER_CONFIG,
  NewLeadWorkflow,
  createNewLeadWorkflow,
  processNewLead,
} from './new-lead'

export {
  PAYMENT_RECEIVED_WORKFLOW_CONFIG,
  PAYMENT_RECEIVED_TRIGGER_CONFIG,
  PaymentReceivedWorkflow,
  createPaymentReceivedWorkflow,
  processPaymentReceived,
} from './payment-received'

export {
  PROCESS_MOVEMENT_WORKFLOW_CONFIG,
  PROCESS_MOVEMENT_TRIGGER_CONFIG,
  ProcessMovementWorkflow,
  createProcessMovementWorkflow,
  processProcessMovement,
} from './process-movement'
