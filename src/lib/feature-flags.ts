/**
 * Feature Flags System
 * Simple feature flag implementation for gradual rollout
 */

export type FeatureFlag =
  | 'beta-testing'
  | 'new-chat-ui'
  | 'advanced-analytics'
  | 'payment-gateway-v2'
  | 'ai-suggestions'
  | 'realtime-voice'

interface FeatureFlagConfig {
  enabled: boolean
  rolloutPercentage?: number // 0-100
  allowedRoles?: string[] // ['admin', 'beta', 'lawyer']
}

const featureFlags: Record<FeatureFlag, FeatureFlagConfig> = {
  'beta-testing': {
    enabled: true,
    allowedRoles: ['admin', 'beta'],
  },
  'new-chat-ui': {
    enabled: false,
    rolloutPercentage: 10, // 10% of users
  },
  'advanced-analytics': {
    enabled: true,
    allowedRoles: ['admin'],
  },
  'payment-gateway-v2': {
    enabled: false,
  },
  'ai-suggestions': {
    enabled: true,
    rolloutPercentage: 50,
  },
  'realtime-voice': {
    enabled: true,
    allowedRoles: ['admin', 'beta', 'lawyer'],
  },
}

/**
 * Check if feature is enabled for user
 */
export function isFeatureEnabled(
  flag: FeatureFlag,
  userRole?: string,
  userId?: string
): boolean {
  const config = featureFlags[flag]

  if (!config.enabled) return false

  // Check role-based access
  if (config.allowedRoles && userRole) {
    if (!config.allowedRoles.includes(userRole)) {
      return false
    }
  }

  // Check rollout percentage
  if (config.rolloutPercentage !== undefined && userId) {
    const hash = hashString(userId)
    const bucket = hash % 100
    return bucket < config.rolloutPercentage
  }

  return true
}

/**
 * Get all enabled features for user
 */
export function getEnabledFeatures(
  userRole?: string,
  userId?: string
): FeatureFlag[] {
  return (Object.keys(featureFlags) as FeatureFlag[]).filter((flag) =>
    isFeatureEnabled(flag, userRole, userId)
  )
}

/**
 * Simple string hash function
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Environment-based feature flags
 */
export function isBetaEnvironment(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_BETA_FEATURES === 'true'
}
