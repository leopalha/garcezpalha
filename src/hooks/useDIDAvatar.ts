import { useState, useCallback, useRef } from 'react'

export function useDIDAvatar() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sessionIdRef = useRef<string | null>(null)
  const streamIdRef = useRef<string | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  const connect = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      setIsConnecting(true)
      setError(null)

      console.log('[D-ID] Creating session...')

      // Step 1: Create D-ID streaming session
      const createResponse = await fetch('/api/did/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_url: 'https://create-images-results.d-id.com/google-oauth2%7C111749261755268084846/upl_xF7eJLGPqDRXFQVUB-lH-/image.jpeg'
        })
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        throw new Error(errorData.error || 'Falha ao criar sessão D-ID')
      }

      const sessionData = await createResponse.json()
      sessionIdRef.current = sessionData.id
      streamIdRef.current = sessionData.stream_id || sessionData.id

      console.log('[D-ID] Session created:', sessionIdRef.current)

      // Step 2: Set up WebRTC Peer Connection
      const pc = new RTCPeerConnection({
        iceServers: sessionData.ice_servers || [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      })
      peerConnectionRef.current = pc

      // Handle incoming tracks (video from D-ID)
      pc.ontrack = (event) => {
        console.log('[D-ID] Received track:', event.track.kind)
        if (event.streams && event.streams[0]) {
          videoElement.srcObject = event.streams[0]
          videoElement.play().catch(err => {
            console.error('[D-ID] Video play error:', err)
          })
        }
      }

      // Handle ICE connection state
      pc.oniceconnectionstatechange = () => {
        console.log('[D-ID] ICE state:', pc.iceConnectionState)
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          setIsConnected(true)
          setIsConnecting(false)
        } else if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          setError('Falha na conexão WebRTC')
          setIsConnecting(false)
        }
      }

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('[D-ID] ICE candidate:', event.candidate.type)
        } else {
          console.log('[D-ID] ICE gathering complete')
        }
      }

      // Step 3: Parse SDP offer from D-ID
      const sessionDescription = parseSDP(sessionData.offer)

      // Step 4: Set remote description (D-ID's offer)
      await pc.setRemoteDescription(
        new RTCSessionDescription({
          type: 'offer',
          sdp: sessionDescription
        })
      )

      console.log('[D-ID] Remote description set')

      // Step 5: Create answer
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      console.log('[D-ID] Local description set (answer)')

      // Step 6: Send SDP answer to D-ID
      const sdpResponse = await fetch('/api/did/start-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          sdp: answer.sdp
        })
      })

      if (!sdpResponse.ok) {
        const errorData = await sdpResponse.json()
        throw new Error(errorData.error || 'Falha ao iniciar stream')
      }

      const streamData = await sdpResponse.json()
      console.log('[D-ID] Stream started:', streamData)

      // Wait for ICE to connect (with timeout)
      await waitForICEConnection(pc)

      console.log('[D-ID] WebRTC connection established')

    } catch (err: any) {
      console.error('[D-ID] Connection error:', err)
      setError(err.message)
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    // Delete D-ID session
    if (sessionIdRef.current) {
      try {
        await fetch('/api/did/delete-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionIdRef.current })
        })
        console.log('[D-ID] Session deleted')
      } catch (err) {
        console.error('[D-ID] Delete session error:', err)
      }
      sessionIdRef.current = null
      streamIdRef.current = null
    }

    setIsConnected(false)
  }, [])

  const speakText = useCallback(async (text: string) => {
    if (!sessionIdRef.current || !streamIdRef.current) {
      console.warn('[D-ID] No active session')
      return
    }

    try {
      console.log('[D-ID] Speaking:', text.substring(0, 50) + '...')

      const response = await fetch('/api/did/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          stream_id: streamIdRef.current,
          script: {
            type: 'text',
            input: text,
            provider: {
              type: 'microsoft',
              voice_id: 'pt-BR-FranciscaNeural' // Voz feminina brasileira
            }
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[D-ID] Speak error:', errorData)
      } else {
        console.log('[D-ID] Speech request sent successfully')
      }
    } catch (err) {
      console.error('[D-ID] Speak error:', err)
    }
  }, [])

  // Helper: Parse SDP from D-ID (may come as object or string)
  function parseSDP(offer: any): string {
    if (typeof offer === 'string') {
      return offer
    }
    if (offer.sdp) {
      return offer.sdp
    }
    if (offer.type === 'offer' && offer.sdp) {
      return offer.sdp
    }
    throw new Error('Invalid SDP format from D-ID')
  }

  // Helper: Wait for ICE connection with timeout
  function waitForICEConnection(pc: RTCPeerConnection): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('ICE connection timeout'))
      }, 15000) // 15 seconds

      const checkState = () => {
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          clearTimeout(timeout)
          pc.removeEventListener('iceconnectionstatechange', checkState)
          resolve()
        } else if (pc.iceConnectionState === 'failed') {
          clearTimeout(timeout)
          pc.removeEventListener('iceconnectionstatechange', checkState)
          reject(new Error('ICE connection failed'))
        }
      }

      pc.addEventListener('iceconnectionstatechange', checkState)
      checkState() // Check immediately in case already connected
    })
  }

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    speakText
  }
}
