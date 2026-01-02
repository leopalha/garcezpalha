'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, CheckCheck, Filter, Loader2, MessageSquare, FileText, AlertCircle, Calendar, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ErrorAlert } from '@/components/ui/error-alert'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type NotificationType = 'message' | 'document' | 'case_update' | 'deadline' | 'payment'

type Notification = {
  id: string
  type: NotificationType
  title: string
  description: string | null
  link: string | null
  read: boolean
  created_at: string
  read_at: string | null
}

const typeConfig: Record<NotificationType, { icon: any; label: string; color: string }> = {
  message: {
    icon: MessageSquare,
    label: 'Mensagem',
    color: 'text-blue-600 bg-blue-50'
  },
  document: {
    icon: FileText,
    label: 'Documento',
    color: 'text-green-600 bg-green-50'
  },
  case_update: {
    icon: AlertCircle,
    label: 'Atualização de Caso',
    color: 'text-purple-600 bg-purple-50'
  },
  deadline: {
    icon: Calendar,
    label: 'Prazo',
    color: 'text-orange-600 bg-orange-50'
  },
  payment: {
    icon: CreditCard,
    label: 'Pagamento',
    color: 'text-pink-600 bg-pink-50'
  }
}

export default function NotificacoesPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [markingAllRead, setMarkingAllRead] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [filter])

  async function loadNotifications() {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filter === 'unread') {
        params.append('unread_only', 'true')
      }

      const response = await fetch(`/api/notifications?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Erro ao carregar notificações')
      }

      const data = await response.json()
      setNotifications(data.notifications)
    } catch (err) {
      console.error('Error loading notifications:', err)
      setError(err instanceof Error ? err : new Error('Erro desconhecido'))
    } finally {
      setIsLoading(false)
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Erro ao marcar como lida')
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, read: true, read_at: new Date().toISOString() }
            : notif
        )
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  async function markAllAsRead() {
    try {
      setMarkingAllRead(true)

      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Erro ao marcar todas como lidas')
      }

      // Reload notifications
      await loadNotifications()
    } catch (err) {
      console.error('Error marking all as read:', err)
      setError(err instanceof Error ? err : new Error('Erro ao marcar todas como lidas'))
    } finally {
      setMarkingAllRead(false)
    }
  }

  function handleNotificationClick(notification: Notification) {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id)
    }

    // Navigate to link if exists
    if (notification.link) {
      window.location.href = notification.link
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
          <p className="text-muted-foreground mt-1">
            Fique por dentro de todas as atualizações
          </p>
        </div>

        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
          <p className="text-muted-foreground mt-1">
            Fique por dentro de todas as atualizações
          </p>
        </div>

        <ErrorAlert error={error} retry={loadNotifications} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
          <p className="text-muted-foreground mt-1">
            Fique por dentro de todas as atualizações
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
              </Badge>
            )}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={markingAllRead}
          >
            {markingAllRead ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Marcando...
              </>
            ) : (
              <>
                <CheckCheck className="h-4 w-4 mr-2" />
                Marcar todas como lidas
              </>
            )}
          </Button>
        )}
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
        <TabsList>
          <TabsTrigger value="all">
            Todas ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Não lidas ({unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6 space-y-3">
          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title={filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
              description={
                filter === 'unread'
                  ? 'Você está em dia com todas as notificações!'
                  : 'Quando houver atualizações nos seus casos, você verá aqui.'
              }
            />
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => {
                const config = typeConfig[notification.type]
                const Icon = config.icon

                return (
                  <Card
                    key={notification.id}
                    className={cn(
                      'p-4 cursor-pointer transition-colors hover:bg-muted/50',
                      !notification.read && 'border-l-4 border-l-primary bg-muted/30'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={cn('p-2 rounded-lg', config.color)}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className={cn(
                                'font-semibold text-sm',
                                !notification.read && 'text-foreground',
                                notification.read && 'text-muted-foreground'
                              )}>
                                {notification.title}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {config.label}
                              </Badge>
                            </div>

                            {notification.description && (
                              <p className={cn(
                                'text-sm mt-1',
                                !notification.read && 'text-foreground',
                                notification.read && 'text-muted-foreground'
                              )}>
                                {notification.description}
                              </p>
                            )}

                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </p>
                          </div>

                          {/* Read indicator */}
                          {!notification.read && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
