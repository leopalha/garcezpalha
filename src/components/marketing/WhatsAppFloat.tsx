'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import Link from 'next/link'

interface WhatsAppFloatProps {
  phoneNumber?: string
  message?: string
  position?: 'bottom-right' | 'bottom-left'
  showTooltip?: boolean
}

export function WhatsAppFloat({
  phoneNumber = '5521995354010',
  message = 'Olá! Preciso de ajuda jurídica.',
  position = 'bottom-right',
  showTooltip: showTooltipProp = true
}: WhatsAppFloatProps = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const whatsappMessage = encodeURIComponent(message)
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`

  const positionClasses = position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6'

  // Show button after scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Show tooltip after delay (only once)
  useEffect(() => {
    if (isVisible && !hasInteracted && showTooltipProp) {
      const timer = setTimeout(() => {
        setShowTooltip(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, hasInteracted, showTooltipProp])

  // Auto-hide tooltip after 5 seconds
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false)
        setHasInteracted(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showTooltip])

  const handleClick = () => {
    setShowTooltip(false)
    setHasInteracted(true)
    // Track click event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'whatsapp_click', {
        event_category: 'conversion',
        event_label: 'floating_button',
      })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`fixed ${positionClasses} z-50`}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute bottom-full right-0 mb-3"
              >
                <div className="relative bg-white rounded-lg shadow-xl p-4 pr-8 max-w-[240px]">
                  <button
                    onClick={() => {
                      setShowTooltip(false)
                      setHasInteracted(true)
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-sm text-gray-800 font-medium mb-1">
                    Precisa de ajuda?
                  </p>
                  <p className="text-xs text-gray-600">
                    Fale agora com nosso time jurídico pelo WhatsApp!
                  </p>
                  {/* Arrow */}
                  <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 shadow-lg" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WhatsApp Button */}
          <Link
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="group"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              {/* Pulse Animation */}
              <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />

              {/* Main Button */}
              <div className="relative flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-5 py-4 shadow-lg transition-all">
                <MessageCircle className="w-6 h-6" />
                <span className="font-medium hidden sm:inline">Fale Conosco</span>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
