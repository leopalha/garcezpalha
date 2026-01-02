'use client'

import { useState, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'

type MessageInputProps = {
  onSend: (message: string) => Promise<void>
  disabled?: boolean
  placeholder?: string
}

export function MessageInput({ onSend, disabled, placeholder = 'Digite sua mensagem...' }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim() || sending || disabled) return

    setSending(true)
    try {
      await onSend(message.trim())
      setMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
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
    <div className="border-t p-4 bg-background">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || sending}
          className="min-h-[60px] max-h-[120px] resize-none"
          rows={2}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || sending}
          size="icon"
          className="h-[60px] w-[60px]"
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Pressione Enter para enviar, Shift+Enter para quebra de linha
      </p>
    </div>
  )
}
