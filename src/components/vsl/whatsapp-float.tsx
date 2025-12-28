'use client'

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WhatsAppFloatProps {
  phoneNumber: string
  message?: string
  position?: 'bottom-right' | 'bottom-left'
  showTooltip?: boolean
}

export function WhatsAppFloat({
  phoneNumber,
  message = 'Olá! Gostaria de mais informações sobre os serviços.',
  position = 'bottom-right',
  showTooltip: showTooltipProp = true,
}: WhatsAppFloatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showTooltip, setShowTooltip] = useState(showTooltipProp)

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const positionClasses =
    position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6'

  return (
    <>
      {/* Floating Button */}
      <div className={`fixed ${positionClasses} z-40`}>
        {/* Tooltip */}
        {showTooltip && !showChat && (
          <div
            className={`absolute bottom-full mb-4 ${
              position === 'bottom-right' ? 'right-0' : 'left-0'
            } animate-bounce`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-xs border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowTooltip(false)}
                className="absolute -top-2 -right-2 bg-gray-200 dark:bg-gray-700 rounded-full p-1 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Precisa de ajuda?</p>
                  <p className="text-xs text-muted-foreground">
                    Fale conosco pelo WhatsApp agora!
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`absolute top-full ${
                position === 'bottom-right' ? 'right-6' : 'left-6'
              } w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800`}
            />
          </div>
        )}

        {/* Chat Window */}
        {showChat && (
          <div
            className={`absolute bottom-full mb-4 ${
              position === 'bottom-right' ? 'right-0' : 'left-0'
            } w-80 sm:w-96`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Garcez Palha</p>
                    <p className="text-xs opacity-90">Online agora</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-[200px] max-h-[400px] overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm max-w-[80%]">
                      <p className="text-sm">
                        Olá! 👋 Como posso ajudar você hoje?
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Agora
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleWhatsAppClick}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Iniciar Conversa no WhatsApp
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => {
            if (showChat) {
              handleWhatsAppClick()
            } else {
              setShowChat(true)
            }
          }}
          className="group relative w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 animate-pulse hover:animate-none"
          aria-label="Abrir WhatsApp"
        >
          <MessageCircle className="h-8 w-8 text-white" />

          {/* Online Indicator */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </div>
    </>
  )
}
