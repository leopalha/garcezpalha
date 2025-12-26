import { useState, useCallback, useRef } from 'react'

export function useDIDAvatar() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sessionIdRef = useRef<string | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  const connect = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      setIsConnecting(true)
      setError(null)

      // Create D-ID session
      const response = await fetch('/api/did/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_url: 'https://create-images-results.d-id.com/google-oauth2%7C111749261755268084846/upl_xF7eJLGPqDRXFQVUB-lH-/image.jpeg'
        })
      })

      if (!response.ok) {
        throw new Error('Falha ao criar sessão D-ID')
      }

      const data = await response.json()
      sessionIdRef.current = data.id

      // Set up WebRTC
      const pc = new RTCPeerConnection({
        iceServers: data.ice_servers || []
      })
      peerConnectionRef.current = pc

      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          videoElement.srcObject = event.streams[0]
        }
      }

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'connected') {
          setIsConnected(true)
          setIsConnecting(false)
        }
      }

      // Start stream
      const streamResponse = await fetch('/api/did/start-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: data.id,
          sdp: data.offer
        })
      })

      if (!streamResponse.ok) {
        throw new Error('Falha ao iniciar stream')
      }

      setIsConnected(true)
      setIsConnecting(false)
    } catch (err: any) {
      console.error('[D-ID] Connection error:', err)
      setError(err.message)
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    if (sessionIdRef.current) {
      try {
        await fetch('/api/did/delete-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionIdRef.current })
        })
      } catch (err) {
        console.error('[D-ID] Delete session error:', err)
      }
      sessionIdRef.current = null
    }

    setIsConnected(false)
  }, [])

  const speakText = useCallback(async (text: string) => {
    if (!sessionIdRef.current) return

    try {
      await fetch('/api/did/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          script: {
            type: 'text',
            input: text
          }
        })
      })
    } catch (err) {
      console.error('[D-ID] Speak error:', err)
    }
  }, [])

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    speakText
  }
}
