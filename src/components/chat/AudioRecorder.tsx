'use client'

/**
 * AudioRecorder Component
 * Records audio from user microphone and sends for transcription
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AudioRecorderProps {
  onTranscription: (text: string) => void
  onError?: (error: string) => void
  disabled?: boolean
  className?: string
}

export function AudioRecorder({
  onTranscription,
  onError,
  disabled = false,
  className,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Reset timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setPermissionDenied(false)

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      })

      // Create MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      // Collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType })

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())

        // Send for transcription
        await transcribeAudio(audioBlob)
      }

      // Start recording
      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (err) {
      console.error('[AudioRecorder] Error starting recording:', err)

      if (err instanceof Error && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
        setPermissionDenied(true)
        setError('Permissão de microfone negada. Habilite nas configurações do navegador.')
        onError?.('Permissão de microfone negada')
      } else {
        setError('Erro ao iniciar gravação. Verifique se seu microfone está conectado.')
        onError?.(err instanceof Error ? err.message : String(err))
      }
    }
  }, [onError])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/chat/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Transcription failed')
      }

      const { text } = await response.json()

      if (text) {
        onTranscription(text)
      } else {
        throw new Error('No transcription text received')
      }

    } catch (err) {
      console.error('[AudioRecorder] Transcription error:', err)
      setError('Erro ao transcrever áudio. Tente novamente.')
      onError?.(err instanceof Error ? err.message : String(err))
    } finally {
      setIsTranscribing(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {!isRecording && !isTranscribing && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={startRecording}
          disabled={disabled || permissionDenied}
          title="Gravar áudio"
          className="h-10 w-10"
        >
          <Mic className="h-5 w-5" />
        </Button>
      )}

      {isRecording && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={stopRecording}
            title="Parar gravação"
            className="h-10 w-10 animate-pulse"
          >
            <MicOff className="h-5 w-5" />
          </Button>
          <span className="text-sm font-mono text-red-600 dark:text-red-400">
            {formatTime(recordingTime)}
          </span>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs text-muted-foreground">Gravando...</span>
          </div>
        </div>
      )}

      {isTranscribing && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Transcrevendo...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
