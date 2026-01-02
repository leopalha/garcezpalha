/**
 * Alerting System
 * Sends notifications for critical errors and system issues
 */

interface Alert {
  level: 'critical' | 'error' | 'warning' | 'info'
  title: string
  message: string
  context?: Record<string, any>
  timestamp: string
}

interface AlertConfig {
  email?: {
    enabled: boolean
    recipients: string[]
  }
  slack?: {
    enabled: boolean
    webhookUrl: string
  }
  discord?: {
    enabled: boolean
    webhookUrl: string
  }
}

class AlertingSystem {
  private config: AlertConfig
  private alertQueue: Alert[] = []
  private isProcessing = false

  constructor() {
    this.config = {
      email: {
        enabled: process.env.ALERTS_EMAIL_ENABLED === 'true',
        recipients: (process.env.ALERTS_EMAIL_RECIPIENTS || '').split(',').filter(Boolean),
      },
      slack: {
        enabled: process.env.ALERTS_SLACK_ENABLED === 'true',
        webhookUrl: process.env.ALERTS_SLACK_WEBHOOK_URL || '',
      },
      discord: {
        enabled: process.env.ALERTS_DISCORD_ENABLED === 'true',
        webhookUrl: process.env.ALERTS_DISCORD_WEBHOOK_URL || '',
      },
    }
  }

  async sendAlert(alert: Omit<Alert, 'timestamp'>) {
    const fullAlert: Alert = {
      ...alert,
      timestamp: new Date().toISOString(),
    }

    // Add to queue
    this.alertQueue.push(fullAlert)

    // Log alert
    this.logAlert(fullAlert)

    // Process queue
    if (!this.isProcessing) {
      this.processAlertQueue()
    }
  }

  private logAlert(alert: Alert) {
    const emoji = this.getEmoji(alert.level)
    console.log(
      `${emoji} [ALERT ${alert.level.toUpperCase()}] ${alert.title}`,
      alert.message,
      alert.context || ''
    )
  }

  private getEmoji(level: Alert['level']): string {
    const emojis = {
      critical: '🚨',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    }
    return emojis[level]
  }

  private async processAlertQueue() {
    if (this.isProcessing || this.alertQueue.length === 0) {
      return
    }

    this.isProcessing = true

    while (this.alertQueue.length > 0) {
      const alert = this.alertQueue.shift()
      if (!alert) continue

      try {
        await this.deliverAlert(alert)
      } catch (error) {
        console.error('Failed to deliver alert:', error)
      }
    }

    this.isProcessing = false
  }

  private async deliverAlert(alert: Alert) {
    const promises: Promise<any>[] = []

    // Send to Slack
    if (this.config.slack?.enabled && this.config.slack.webhookUrl) {
      promises.push(this.sendToSlack(alert))
    }

    // Send to Discord
    if (this.config.discord?.enabled && this.config.discord.webhookUrl) {
      promises.push(this.sendToDiscord(alert))
    }

    // Send email (would need email service integration)
    if (this.config.email?.enabled && this.config.email.recipients.length > 0) {
      promises.push(this.sendEmail(alert))
    }

    await Promise.allSettled(promises)
  }

  private async sendToSlack(alert: Alert) {
    if (!this.config.slack?.webhookUrl) return

    const color = this.getSlackColor(alert.level)
    const payload = {
      attachments: [
        {
          color,
          title: `${this.getEmoji(alert.level)} ${alert.title}`,
          text: alert.message,
          fields: alert.context
            ? Object.entries(alert.context).map(([key, value]) => ({
                title: key,
                value: String(value),
                short: true,
              }))
            : [],
          footer: 'Garcez Palha Monitoring',
          ts: Math.floor(new Date(alert.timestamp).getTime() / 1000),
        },
      ],
    }

    try {
      const response = await fetch(this.config.slack.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Slack webhook failed: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to send Slack alert:', error)
    }
  }

  private async sendToDiscord(alert: Alert) {
    if (!this.config.discord?.webhookUrl) return

    const color = this.getDiscordColor(alert.level)
    const payload = {
      embeds: [
        {
          title: `${this.getEmoji(alert.level)} ${alert.title}`,
          description: alert.message,
          color,
          fields: alert.context
            ? Object.entries(alert.context).map(([name, value]) => ({
                name,
                value: String(value),
                inline: true,
              }))
            : [],
          footer: {
            text: 'Garcez Palha Monitoring',
          },
          timestamp: alert.timestamp,
        },
      ],
    }

    try {
      const response = await fetch(this.config.discord.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Discord webhook failed: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to send Discord alert:', error)
    }
  }

  private async sendEmail(alert: Alert) {
    // Email integration would go here
    // Using Resend, SendGrid, or similar
    console.log('Email alert (not implemented):', alert.title)

    // Example with Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'alerts@garcezpalha.com',
      to: this.config.email!.recipients,
      subject: `[${alert.level.toUpperCase()}] ${alert.title}`,
      html: `
        <h2>${alert.title}</h2>
        <p>${alert.message}</p>
        ${alert.context ? `<pre>${JSON.stringify(alert.context, null, 2)}</pre>` : ''}
      `,
    })
    */
  }

  private getSlackColor(level: Alert['level']): string {
    const colors = {
      critical: 'danger',
      error: 'danger',
      warning: 'warning',
      info: 'good',
    }
    return colors[level]
  }

  private getDiscordColor(level: Alert['level']): number {
    const colors = {
      critical: 0xff0000, // Red
      error: 0xff4444, // Light red
      warning: 0xffaa00, // Orange
      info: 0x00aaff, // Blue
    }
    return colors[level]
  }
}

// Singleton instance
export const alerting = new AlertingSystem()

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export function sendCriticalAlert(title: string, message: string, context?: Record<string, any>) {
  return alerting.sendAlert({
    level: 'critical',
    title,
    message,
    context,
  })
}

export function sendErrorAlert(title: string, message: string, context?: Record<string, any>) {
  return alerting.sendAlert({
    level: 'error',
    title,
    message,
    context,
  })
}

export function sendWarningAlert(title: string, message: string, context?: Record<string, any>) {
  return alerting.sendAlert({
    level: 'warning',
    title,
    message,
    context,
  })
}

export function sendInfoAlert(title: string, message: string, context?: Record<string, any>) {
  return alerting.sendAlert({
    level: 'info',
    title,
    message,
    context,
  })
}

// ============================================================================
// AUTO-ALERTING FOR CRITICAL ERRORS
// ============================================================================

let errorCount = 0
let lastErrorReset = Date.now()
const ERROR_THRESHOLD = 10 // Alert after 10 errors
const ERROR_WINDOW = 5 * 60 * 1000 // 5 minutes

export function trackErrorWithAlerting(error: Error, context?: any) {
  // Reset counter every 5 minutes
  if (Date.now() - lastErrorReset > ERROR_WINDOW) {
    errorCount = 0
    lastErrorReset = Date.now()
  }

  errorCount++

  // Send alert if threshold reached
  if (errorCount >= ERROR_THRESHOLD) {
    sendCriticalAlert(
      'High Error Rate Detected',
      `${errorCount} errors in the last 5 minutes`,
      {
        latestError: error.message,
        errorCount,
        ...context,
      }
    )
    errorCount = 0 // Reset after alerting
  }
}
