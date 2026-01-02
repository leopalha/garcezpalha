'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Notification = {
  id: string
  type: string
  title: string
  description: string | null
  link: string | null
  read: boolean
  created_at: string
}

export function NotificationBell() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      loadNotifications()
      subscribeToNotifications()
    }
  }, [session?.user?.id])

  async function loadNotifications() {
    try {
      const response = await fetch('/api/notifications?unread_only=true&limit=5')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.total || 0)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  function subscribeToNotifications() {
    if (!session?.user?.id) return

    const supabase = createClient()

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${session.user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications(prev => [newNotification, ...prev].slice(0, 5))
          setUnreadCount(prev => prev + 1)

          // Show browser notification if permitted
          if (Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.description || undefined,
              icon: '/icons/icon-192x192.png',
              badge: '/icons/icon-192x192.png',
            })
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${session.user.id}`
        },
        (payload) => {
          const updatedNotification = payload.new as Notification
          setNotifications(prev =>
            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
          )

          // Recalculate unread count
          if (updatedNotification.read) {
            setUnreadCount(prev => Math.max(0, prev - 1))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  function handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    setIsOpen(false)
  }

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notificações</h4>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} novas</Badge>
          )}
        </div>

        <div className="h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link || '/cliente/notificacoes'}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    'block p-4 hover:bg-muted/50 transition-colors',
                    !notification.read && 'bg-muted/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight">
                        {notification.title}
                      </p>
                      {notification.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Link href="/cliente/notificacoes">
              <Button variant="ghost" size="sm" className="w-full">
                Ver todas as notificações
              </Button>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
