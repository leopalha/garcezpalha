'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRealtimeAPI } from '@/hooks/useRealtimeAPI'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, X, Loader2, MicOff, Volume2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Simple markdown parser for chat messages
function parseMarkdown(text: string): React.ReactNode {
  if (!text) return text

  let parts: React.ReactNode[] = [text]
  let key = 0

  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, component: (match: string) => <strong key={key++}>{match}</strong> },
    { regex: /\*(.+?)\*/g, component: (match: string) => <em key={key++}>{match}</em> },
    { regex: /`(.+?)`/g, component: (match: string) => <code key={key++} className="bg-gray-800 px-1 rounded text-xs">{match}</code> },
  ]

  for (const { regex, component } of patterns) {
    const newParts: React.ReactNode[] = []

    for (const part of parts) {
      if (typeof part !== 'string') {
        newParts.push(part)
        continue
      }

      const matches = [...part.matchAll(regex)]
      if (matches.length === 0) {
        newParts.push(part)
        continue
      }

      let lastIndex = 0
      for (const match of matches) {
        if (match.index! > lastIndex) {
          newParts.push(part.substring(lastIndex, match.index))
        }
        newParts.push(component(match[1]))
        lastIndex = match.index! + match[0].length
      }
      if (lastIndex < part.length) {
        newParts.push(part.substring(lastIndex))
      }
    }

    parts = newParts
  }

  return <>{parts}</>
}

interface RealtimeVoiceAssistantProps {
  productId: string
  productName: string
  onClose?: () => void
}

export function RealtimeVoiceAssistant({
  productId,
  productName,
  onClose
}: RealtimeVoiceAssistantProps) {
  const [isActive, setIsActive] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const realtime = useRealtimeAPI(productId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [realtime.messages])

  const startConversation = useCallback(async () => {
    try {
      setIsActive(true)
      await realtime.connect()
      await realtime.startMicrophone()
    } catch (error) {
      console.error('Failed to start conversation:', error)
      setIsActive(false)
    }
  }, [realtime])

  const stopConversation = useCallback(async () => {
    try {
      await realtime.disconnect()
      setIsActive(false)
    } catch (error) {
      console.error('Failed to stop conversation:', error)
    }
  }, [realtime])

  useEffect(() => {
    return () => {
      if (isActive) {
        stopConversation()
      }
    }
  }, [isActive, stopConversation])

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl h-[85vh] flex flex-col"
      >
        <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 overflow-hidden flex flex-col h-full">
          <div className="bg-black/50 border-b border-gray-800 p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isActive && realtime.isConnected ? "bg-green-500 animate-pulse" : "bg-gray-500"
              )} />
              <div>
                <h2 className="text-xl font-bold text-white">Chat com IA por Voz</h2>
                <p className="text-sm text-gray-400">{productName}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <AnimatePresence>
            {!isActive && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
                <div className="text-center mb-4">
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6">
                    <Mic className="w-16 h-16 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Converse por Voz com a IA</h3>
                  <p className="text-gray-400 max-w-md">Fale naturalmente e receba respostas em tempo real. Nossa IA entende suas dúvidas jurídicas e te ajuda imediatamente.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                  {[
                    { icon: Mic, label: "Fale Naturalmente", desc: "Sem digitação" },
                    { icon: Volume2, label: "Ouça Respostas", desc: "Voz humana" },
                    { icon: Loader2, label: "Tempo Real", desc: "Resposta imediata" },
                    { icon: MicOff, label: "Privacidade", desc: "Conversa segura" }
                  ].map((feature, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center">
                      <feature.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-white">{feature.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <Button onClick={startConversation} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                  <Mic className="w-6 h-6 mr-2" />
                  Iniciar Conversa
                </Button>
                <p className="text-xs text-gray-500 text-center">Ao iniciar, você permitirá o acesso ao seu microfone</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isActive && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {realtime.messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <motion.div animate={{ scale: realtime.isSpeaking ? [1, 1.1, 1] : 1 }} transition={{ duration: 1, repeat: realtime.isSpeaking ? Infinity : 0 }} className={cn("w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4", realtime.isSpeaking ? "bg-blue-600" : "bg-gray-700")}>
                          {realtime.isConnecting ? <Loader2 className="w-12 h-12 text-white animate-spin" /> : <Mic className="w-12 h-12 text-white" />}
                        </motion.div>
                        <p className="text-gray-400">
                          {realtime.isConnecting && "Conectando..."}
                          {realtime.isConnected && !realtime.isSpeaking && "Estou ouvindo... Pode falar!"}
                          {realtime.isSpeaking && "Processando sua mensagem..."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {realtime.messages.map((msg, index) => (
                        <motion.div key={msg.id || index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                          <div className={cn("max-w-[75%] rounded-2xl px-4 py-3 shadow-lg", msg.role === 'user' ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white" : "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-gray-700")}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium opacity-70">{msg.role === 'user' ? 'Você' : 'Advogado IA'}</span>
                              {msg.role === 'assistant' && <Volume2 className="w-3 h-3 opacity-70" />}
                            </div>
                            <div className="text-sm leading-relaxed">{parseMarkdown(msg.content)}</div>
                            <span className="text-xs opacity-50 mt-1 block">{new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </motion.div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                <div className="border-t border-gray-800 bg-black/30 px-6 py-3 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <motion.div animate={{ scale: realtime.isSpeaking ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.5, repeat: realtime.isSpeaking ? Infinity : 0 }} className={cn("w-3 h-3 rounded-full", realtime.isSpeaking ? "bg-blue-500" : "bg-green-500")} />
                    <span className="text-sm text-gray-400">
                      {realtime.isConnecting && "Conectando..."}
                      {realtime.isConnected && !realtime.isSpeaking && "Ouvindo..."}
                      {realtime.isSpeaking && "Processando..."}
                    </span>
                  </div>
                  {realtime.error && <span className="text-sm text-red-400">{realtime.error}</span>}
                  <Button onClick={stopConversation} variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                    <X className="w-4 h-4 mr-2" />
                    Encerrar
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}
