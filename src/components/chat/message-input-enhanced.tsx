'use client'

import { useState, KeyboardEvent, useRef, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2, Paperclip, X, Smile, FileText, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

// Dynamic import para emoji picker (evita SSR issues)
const EmojiPicker = dynamic(() => import('@emoji-mart/react'), { ssr: false })

type Attachment = {
  file: File
  preview?: string
  type: 'image' | 'document'
}

type MessageInputEnhancedProps = {
  onSend: (message: string, attachments?: File[]) => Promise<void>
  disabled?: boolean
  placeholder?: string
  onTyping?: (isTyping: boolean) => void
  allowAttachments?: boolean
  maxAttachments?: number
  maxFileSize?: number // in MB
}

export function MessageInputEnhanced({
  onSend,
  disabled,
  placeholder = 'Digite sua mensagem...',
  onTyping,
  allowAttachments = true,
  maxAttachments = 5,
  maxFileSize = 10,
}: MessageInputEnhancedProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleTextChange = (value: string) => {
    setMessage(value)
    setError(null)

    // Typing indicator
    if (onTyping) {
      onTyping(true)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false)
      }, 1000)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (attachments.length + files.length > maxAttachments) {
      setError(`Máximo de ${maxAttachments} anexos permitidos`)
      return
    }

    const validFiles: Attachment[] = []

    for (const file of files) {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        setError(`Arquivo "${file.name}" excede o tamanho máximo de ${maxFileSize}MB`)
        continue
      }

      // Check file type
      const isImage = file.type.startsWith('image/')
      const isPDF = file.type === 'application/pdf'
      const isDoc = file.type.includes('document') || file.type.includes('word')

      if (!isImage && !isPDF && !isDoc) {
        setError(`Tipo de arquivo "${file.name}" não suportado`)
        continue
      }

      const attachment: Attachment = {
        file,
        type: isImage ? 'image' : 'document',
      }

      // Create preview for images
      if (isImage) {
        const reader = new FileReader()
        reader.onload = (e) => {
          attachment.preview = e.target?.result as string
          setAttachments((prev) => [...prev, attachment])
        }
        reader.readAsDataURL(file)
      } else {
        validFiles.push(attachment)
      }
    }

    if (validFiles.length > 0) {
      setAttachments((prev) => [...prev, ...validFiles])
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
    setError(null)
  }

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native)
    setShowEmojiPicker(false)
  }

  const handleSend = async () => {
    if ((!message.trim() && attachments.length === 0) || sending || disabled) return

    setSending(true)
    setError(null)

    try {
      const files = attachments.map((a) => a.file)
      await onSend(message.trim(), files.length > 0 ? files : undefined)
      setMessage('')
      setAttachments([])
      setShowEmojiPicker(false)

      if (onTyping) {
        onTyping(false)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t bg-background">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="border-b p-3 bg-muted/30">
          <div className="flex gap-2 flex-wrap">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="relative group bg-background border rounded-lg p-2 flex items-center gap-2 max-w-[200px]"
              >
                {attachment.type === 'image' && attachment.preview ? (
                  <img
                    src={attachment.preview}
                    alt={attachment.file.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                ) : (
                  <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{attachment.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(attachment.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm border-b">
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4">
        <div className="flex gap-2">
          {/* Attachment Button */}
          {allowAttachments && (
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || sending}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || sending || attachments.length >= maxAttachments}
                className="shrink-0"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Emoji Picker Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={disabled || sending}
              className="shrink-0"
            >
              <Smile className="h-5 w-5" />
            </Button>
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-50">
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  theme="auto"
                  locale="pt"
                  previewPosition="none"
                />
              </div>
            )}
          </div>

          {/* Text Input */}
          <Textarea
            value={message}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || sending}
            className="min-h-[60px] max-h-[120px] resize-none flex-1"
            rows={2}
          />

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={(!message.trim() && attachments.length === 0) || disabled || sending}
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            Pressione Enter para enviar, Shift+Enter para quebra de linha
          </p>
          {allowAttachments && (
            <p className="text-xs text-muted-foreground">
              {attachments.length}/{maxAttachments} anexos
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
