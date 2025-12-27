'use client'

/**
 * VoicePlayer Component
 * Plays AI responses as speech using Text-to-Speech API
 */

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Loader2, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoicePlayerProps {
  text: string
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  speed?: number
  autoPlay?: boolean
  className?: string
  onPlaybackStart?: () => void
  onPlaybackEnd?: () => void
  onError?: (error: string) => void
}

export function VoicePlayer({
  text,
  voice = 'shimmer',
  speed = 1.0,
  autoPlay = false,
  className,
  onPlaybackStart,
  onPlaybackEnd,
  onError,
}: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
      }
    }
  }, [])

  // Auto-play if requested
  useEffect(() => {
    if (autoPlay && text) {
      playAudio()
    }
  }, [autoPlay, text])

  const generateSpeech = async (): Promise<Blob> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice,
          speed,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'TTS generation failed')
      }

      const audioBlob = await response.blob()
      return audioBlob

    } catch (err: any) {
      console.error('[VoicePlayer] TTS error:', err)
      setError('Erro ao gerar áudio')
      onError?.(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const playAudio = async () => {
    try {
      // Generate speech if not already done
      const audioBlob = await generateSpeech()

      // Create object URL
      const audioUrl = URL.createObjectURL(audioBlob)
      audioUrlRef.current = audioUrl

      // Create and play audio
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => {
        setIsPlaying(true)
        onPlaybackStart?.()
      }

      audio.onended = () => {
        setIsPlaying(false)
        onPlaybackEnd?.()
      }

      audio.onerror = (err) => {
        console.error('[VoicePlayer] Audio playback error:', err)
        setError('Erro ao reproduzir áudio')
        setIsPlaying(false)
        onError?.('Audio playback error')
      }

      await audio.play()

    } catch (err) {
      // Error already handled in generateSpeech
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const togglePlayback = () => {
    if (isPlaying) {
      pauseAudio()
    } else {
      playAudio()
    }
  }

  if (!text) return null

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={togglePlayback}
        disabled={isLoading || !!error}
        title={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
        className="h-8 w-8"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      {isPlaying && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          title={isMuted ? 'Ativar som' : 'Mutar'}
          className="h-8 w-8"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      )}

      {isPlaying && (
        <div className="flex items-center gap-1">
          <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse animation-delay-150" />
          <div className="h-1 w-1 rounded-full bg-primary animate-pulse animation-delay-300" />
        </div>
      )}

      {error && (
        <span className="text-xs text-destructive">{error}</span>
      )}
    </div>
  )
}
