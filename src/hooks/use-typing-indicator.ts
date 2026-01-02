import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

type TypingIndicatorOptions = {
  conversationId: string
  userId: string
  enabled?: boolean
}

export function useTypingIndicator({ conversationId, userId, enabled = true }: TypingIndicatorOptions) {
  const supabase = createClient()
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (!enabled || !conversationId || !userId) return

    // Create channel for typing indicators
    const channel = supabase.channel(`typing:${conversationId}`)

    // Subscribe to typing events
    channel.on('presence', { event: 'sync' }, () => {
      // State updated, handled by parent component
    })

    channel.subscribe()
    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [conversationId, userId, enabled])

  const startTyping = () => {
    if (!channelRef.current) return

    // Track presence
    channelRef.current.track({
      user_id: userId,
      typing: true,
      timestamp: Date.now(),
    })

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Auto-stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 3000)
  }

  const stopTyping = () => {
    if (!channelRef.current) return

    channelRef.current.untrack()

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }

  const getTypingUsers = (): string[] => {
    if (!channelRef.current) return []

    const state = channelRef.current.presenceState()
    const typingUsers: string[] = []

    Object.values(state).forEach((presences: any) => {
      presences.forEach((presence: any) => {
        if (presence.typing && presence.user_id !== userId) {
          typingUsers.push(presence.user_id)
        }
      })
    })

    return typingUsers
  }

  return {
    startTyping,
    stopTyping,
    getTypingUsers,
  }
}
