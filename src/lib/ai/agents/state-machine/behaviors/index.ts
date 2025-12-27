/**
 * State Behaviors Registry
 * Manages all state-specific behaviors for the agent state machine
 */

import { StateType, StateBehavior } from '../types'
import { GreetingBehavior } from './greeting'
import { IdentifyingBehavior } from './identifying'
import { ClassifyingBehavior } from './classifying'
import { QualifyingBehavior } from './qualifying'
import {
  QualifiedBehavior,
  RejectedBehavior,
  ProposingBehavior,
  ObjectionHandlingBehavior,
  ClosingBehavior,
  PaymentPendingBehavior,
  PaidBehavior,
  ContractPendingBehavior,
  OnboardingBehavior,
  ActiveCaseBehavior,
  CompletedBehavior,
  EscalatedBehavior,
  AbandonedBehavior,
} from './remaining-states'

export class StateBehaviorRegistry {
  private behaviors: Map<StateType, StateBehavior>

  constructor() {
    this.behaviors = new Map()
    this.registerAll()
  }

  private registerAll() {
    // Register all state behaviors
    this.register(new GreetingBehavior())
    this.register(new IdentifyingBehavior())
    this.register(new ClassifyingBehavior())
    this.register(new QualifyingBehavior())
    this.register(new QualifiedBehavior())
    this.register(new RejectedBehavior())
    this.register(new ProposingBehavior())
    this.register(new ObjectionHandlingBehavior())
    this.register(new ClosingBehavior())
    this.register(new PaymentPendingBehavior())
    this.register(new PaidBehavior())
    this.register(new ContractPendingBehavior())
    this.register(new OnboardingBehavior())
    this.register(new ActiveCaseBehavior())
    this.register(new CompletedBehavior())
    this.register(new EscalatedBehavior())
    this.register(new AbandonedBehavior())
  }

  private register(behavior: StateBehavior) {
    this.behaviors.set(behavior.state, behavior)
  }

  getBehavior(state: StateType): StateBehavior | undefined {
    return this.behaviors.get(state)
  }

  getAllBehaviors(): Map<StateType, StateBehavior> {
    return this.behaviors
  }
}

export * from './greeting'
export * from './identifying'
export * from './classifying'
export * from './qualifying'
export * from './remaining-states'
