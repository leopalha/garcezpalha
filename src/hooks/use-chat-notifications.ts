import { useEffect, useState } from 'react'

type NotificationPermission = 'granted' | 'denied' | 'default'

export function useChatNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!supported) {
      console.warn('Notifications not supported')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!supported || permission !== 'granted') {
      return
    }

    try {
      const notification = new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        ...options,
      })

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000)

      return notification
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  const notifyNewMessage = (senderName: string, message: string, conversationId?: string) => {
    return sendNotification(`Nova mensagem de ${senderName}`, {
      body: message.length > 100 ? message.substring(0, 100) + '...' : message,
      tag: conversationId || 'new-message',
      requireInteraction: false,
      data: { conversationId },
    })
  }

  return {
    permission,
    supported,
    requestPermission,
    sendNotification,
    notifyNewMessage,
  }
}
