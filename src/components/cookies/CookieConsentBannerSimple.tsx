'use client'

import { useState, useEffect } from 'react'

export default function CookieConsentBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setTimeout(() => setShow(true), 2000)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        zIndex: 9999
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0 }}>
          🍪 Usamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa Política de Privacidade.
        </p>
        <button
          onClick={accept}
          style={{
            backgroundColor: '#000',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '20px'
          }}
        >
          Aceitar
        </button>
      </div>
    </div>
  )
}
