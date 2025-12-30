/**
 * Chat Input Component
 * Área de input com anexos, gravação de áudio e envio
 */

'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Paperclip, Send, X, FileText, Image as ImageIcon } from 'lucide-react'
import type { ChatFeatures } from '@/types/chat'
import { cn } from '@/lib/utils'
import { getFileType, formatFileSize } from '@/lib/chat'

// Lazy load AudioRecorder (code splitting)
const AudioRecorder = dynamic(
  () => import('../AudioRecorder').then((mod) => ({ default: mod.AudioRecorder })),
  { ssr: false }
)

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean

  // File upload
  selectedFiles: File[]
  onFilesSelect: (files: File[]) => void
  onFileRemove: (index: number) => void
  maxFiles?: number

  // Features
  features: ChatFeatures

  // Audio recording
  onTranscription?: (text: string) => void

  className?: string
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  selectedFiles,
  onFilesSelect,
  onFileRemove,
  maxFiles = 20,
  features,
  onTranscription,
  className,
}: ChatInputProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos`)
      return
    }
    onFilesSelect([...selectedFiles, ...files])
    e.target.value = '' // Reset input
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos`)
      return
    }
    onFilesSelect([...selectedFiles, ...files])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <div className={cn('border-t bg-background', className)}>
      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <div className="p-3 border-b bg-muted/50">
          <div className="grid grid-cols-2 gap-2">
            {selectedFiles.map((file, index) => {
              const fileType = getFileType(file.name)
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded bg-background border group hover:border-primary/50 transition-colors"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded bg-muted flex items-center justify-center">
                    {fileType === 'image' ? (
                      file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      )
                    ) : (
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onFileRemove(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div
        className={cn(
          'p-3 flex items-end gap-2',
          isDragging && 'bg-primary/5 border-2 border-dashed border-primary'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* File Upload Button */}
        {features.fileUpload && (
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isLoading || selectedFiles.length >= maxFiles}
              title="Anexar arquivo"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Audio Recorder */}
        {features.audioRecording && onTranscription && (
          <AudioRecorder
            onTranscription={onTranscription}
            disabled={isLoading}
          />
        )}

        {/* Text Input */}
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isDragging
                ? 'Solte os arquivos aqui...'
                : 'Digite sua mensagem...'
            }
            disabled={isLoading}
            className="resize-none"
          />
        </div>

        {/* Send Button */}
        <Button
          type="button"
          size="icon"
          className="h-10 w-10 flex-shrink-0"
          onClick={onSubmit}
          disabled={isLoading || (!value.trim() && selectedFiles.length === 0)}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {/* Drag & Drop Hint */}
      {isDragging && features.fileUpload && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm pointer-events-none">
          <div className="text-center">
            <Paperclip className="h-12 w-12 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium text-primary">
              Solte os arquivos aqui
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
