'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoAssistantProps {
  isOpen: boolean
  onClose: () => void
  productName: string
}

export function VideoAssistant({
  isOpen,
  onClose,
  productName,
}: VideoAssistantProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  // Iniciar chamada
  const startCall = async () => {
    setIsConnecting(true)

    try {
      // Solicitar câmera e microfone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      mediaStreamRef.current = stream

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Simular conexão (aqui você conectaria ao WebRTC)
      setTimeout(() => {
        setIsConnecting(false)
        setIsConnected(true)

        // Simular IA falando
        setTimeout(() => {
          setIsSpeaking(true)
          setTimeout(() => setIsSpeaking(false), 3000)
        }, 1000)
      }, 2000)
    } catch (error) {
      console.error('Erro ao acessar mídia:', error)
      setIsConnecting(false)
    }
  }

  // Finalizar chamada
  const endCall = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    setIsConnected(false)
    onClose()
  }

  // Toggle mute
  const toggleMute = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  // Toggle vídeo
  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsVideoOn(!isVideoOn)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          'fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4',
          isFullscreen && 'p-0'
        )}
      >
        <Card
          className={cn(
            'w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden',
            isFullscreen && 'max-w-full h-full rounded-none'
          )}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between text-white">
            <div>
              <h3 className="font-semibold">Vídeo Chamada com IA</h3>
              <p className="text-xs opacity-90">{productName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Video Area */}
          <div className="flex-1 bg-gray-900 relative">
            {!isConnected ? (
              // Tela de conexão
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                {!isConnecting ? (
                  <>
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 animate-pulse">
                      <Video className="h-16 w-16" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      Pronto para conversar ao vivo?
                    </h3>
                    <p className="text-gray-400 mb-8 text-center max-w-md">
                      Nosso assistente IA vai conversar com você por vídeo e
                      responder todas suas dúvidas sobre {productName}
                    </p>
                    <Button
                      size="lg"
                      onClick={startCall}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Iniciar Chamada
                    </Button>
                  </>
                ) : (
                  // Animação de conexão (Apple Watch style)
                  <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute inset-0 border-4 border-blue-500 rounded-full"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{
                            scale: [0.5, 1.5, 2],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
                      </div>
                    </div>
                    <p className="text-xl">Conectando...</p>
                  </div>
                )}
              </div>
            ) : (
              // Vídeos conectados
              <div className="relative w-full h-full">
                {/* Vídeo do assistente (grande) */}
                <div className="absolute inset-0">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%231e3a8a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='120' font-family='Arial'%3EIA%3C/text%3E%3C/svg%3E"
                  />

                  {/* Indicador de fala */}
                  {isSpeaking && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full">
                      <div className="flex gap-1">
                        <motion.div
                          className="w-1 h-4 bg-white rounded-full"
                          animate={{ scaleY: [1, 1.5, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                        <motion.div
                          className="w-1 h-4 bg-white rounded-full"
                          animate={{ scaleY: [1, 1.5, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                        />
                        <motion.div
                          className="w-1 h-4 bg-white rounded-full"
                          animate={{ scaleY: [1, 1.5, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                        />
                      </div>
                      <span className="text-sm font-medium">Falando...</span>
                    </div>
                  )}
                </div>

                {/* Vídeo do cliente (pequeno) */}
                <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-2xl border-2 border-white">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!isVideoOn && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <VideoOff className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Controles */}
          {isConnected && (
            <div className="bg-white dark:bg-gray-800 p-6 flex items-center justify-center gap-4">
              <Button
                variant={isMuted ? 'destructive' : 'outline'}
                size="lg"
                onClick={toggleMute}
                className="rounded-full w-14 h-14"
              >
                {isMuted ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant={isVideoOn ? 'outline' : 'destructive'}
                size="lg"
                onClick={toggleVideo}
                className="rounded-full w-14 h-14"
              >
                {isVideoOn ? (
                  <Video className="h-6 w-6" />
                ) : (
                  <VideoOff className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={endCall}
                className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
