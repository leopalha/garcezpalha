/**
 * Message Bubble Component
 * Renderiza bolha de mensagem com avatar, timestamp e conteúdo
 */

'use client'

import { Bot, User, AlertCircle } from 'lucide-react'
import { parseMarkdown, formatTimestamp } from '@/lib/chat'
import { VoicePlayer } from '../VoicePlayer'
import type { Message, ChatSettings } from '@/types/chat'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: Message
  settings?: ChatSettings
  showTimestamp?: boolean
  className?: string
}

export function MessageBubble({
  message,
  settings,
  showTimestamp = true,
  className,
}: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'
  const isAssistant = message.role === 'assistant'

  return (
    <div
      className={cn(
        'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser && 'flex-row-reverse',
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser && 'bg-gradient-to-br from-blue-500 to-blue-600',
          isAssistant && 'bg-gradient-to-br from-gray-600 to-gray-700',
          isSystem && 'bg-gradient-to-br from-orange-500 to-orange-600'
        )}
      >
        {isUser && <User className="w-4 h-4 text-white" />}
        {isAssistant && <Bot className="w-4 h-4 text-white" />}
        {isSystem && <AlertCircle className="w-4 h-4 text-white" />}
      </div>

      {/* Message Content */}
      <div className={cn('flex-1 space-y-1', isUser && 'items-end')}>
        {/* Bubble */}
        <div
          className={cn(
            'inline-block px-4 py-2 rounded-2xl max-w-[85%]',
            isUser && 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm',
            isAssistant && 'bg-muted text-foreground rounded-bl-sm',
            isSystem && 'bg-orange-50 dark:bg-orange-900/20 text-orange-900 dark:text-orange-100 border border-orange-200 dark:border-orange-800 rounded-bl-sm'
          )}
        >
          {/* Typing Indicator */}
          {message.isTyping ? (
            <div className="flex gap-1 py-1">
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap break-words">
              {parseMarkdown(message.content)}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {showTimestamp && !message.isTyping && (
          <div
            className={cn(
              'text-xs text-muted-foreground px-1',
              isUser && 'text-right'
            )}
          >
            {formatTimestamp(message.timestamp)}
          </div>
        )}

        {/* Voice Player (apenas para assistant) */}
        {isAssistant && settings?.ttsEnabled && !message.isTyping && (
          <div className="mt-2">
            <VoicePlayer
              text={message.content}
              voice={settings.ttsVoice}
              speed={settings.ttsSpeed}
              autoPlay={settings.ttsAutoPlay}
            />
          </div>
        )}
      </div>
    </div>
  )
}
