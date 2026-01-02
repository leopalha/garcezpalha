'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Erro Fatal</h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Algo deu muito errado. Por favor, recarregue a página.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Recarregar Página
          </button>
        </div>
      </body>
    </html>
  )
}
