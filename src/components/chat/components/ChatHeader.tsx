/**
 * Chat Header Component
 * Header configurável para diferentes modos de chat
 */

'use client'

import { X, Trash2, Settings, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getStateLabel, getStateIcon, getStateColor } from '@/constants/chat-states'
import type { ChatMode, AgentState } from '@/types/chat'
import { cn } from '@/lib/utils'

interface ChatHeaderProps {
  productName: string
  mode: ChatMode

  // Agent-flow specific
  currentState?: AgentState

  // Realtime-voice specific
  isConnected?: boolean
  isSpeaking?: boolean

  // Features
  showSettingsButton?: boolean
  showClearButton?: boolean
  showVideoButton?: boolean

  // Callbacks
  onClose: () => void
  onClearHistory?: () => void
  onOpenSettings?: () => void
  onOpenVideo?: () => void

  className?: string
}

export function ChatHeader({
  productName,
  mode,
  currentState,
  isConnected,
  isSpeaking,
  showSettingsButton = false,
  showClearButton = true,
  showVideoButton = true,
  onClose,
  onClearHistory,
  onOpenSettings,
  onOpenVideo,
  className,
}: ChatHeaderProps) {
  const StateIcon = currentState ? getStateIcon(currentState) : null

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 border-b',
        mode === 'chat' && 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
        mode === 'agent-flow' && 'bg-gradient-to-r from-purple-500 to-blue-500 text-white',
        mode === 'realtime-voice' && 'bg-gradient-to-r from-gray-700 to-gray-800 text-white',
        className
      )}
    >
      {/* Left side - Title & State */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold truncate">{productName}</h3>

          {/* Realtime Voice Status */}
          {mode === 'realtime-voice' && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                )}
              />
              <span className="text-xs opacity-90">
                {isConnected ? (isSpeaking ? 'Falando...' : 'Conectado') : 'Desconectado'}
              </span>
            </div>
          )}
        </div>

        {/* Agent-flow State */}
        {mode === 'agent-flow' && currentState && (
          <div className="flex items-center gap-1.5 mt-1">
            {StateIcon && (
              <StateIcon className={cn('w-3.5 h-3.5', getStateColor(currentState))} />
            )}
            <span className="text-xs opacity-90">
              Estado: {getStateLabel(currentState)}
            </span>
          </div>
        )}

        {/* Chat Mode Badge */}
        {mode === 'chat' && (
          <span className="text-xs opacity-75">Assistente IA • Voz & Texto</span>
        )}
      </div>

      {/* Right side - Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Settings Button */}
        {showSettingsButton && onOpenSettings && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={onOpenSettings}
            title="Configurações"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}

        {/* Clear History Button */}
        {showClearButton && onClearHistory && mode !== 'realtime-voice' && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={onClearHistory}
            title="Limpar histórico"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}

        {/* Video Mode Button */}
        {showVideoButton && onOpenVideo && mode === 'chat' && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={onOpenVideo}
            title="Modo vídeo"
          >
            <Video className="h-4 w-4" />
          </Button>
        )}

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10"
          onClick={onClose}
          title="Fechar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
