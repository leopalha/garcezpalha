'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
          Algo deu errado
        </h2>

        <p style={{ color: '#666', marginBottom: '24px' }}>
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>

        {error.digest && (
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>
            Código do erro: {error.digest}
          </p>
        )}

        <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '8px', textAlign: 'left', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          {error.message}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              padding: '12px 24px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Tentar Novamente
          </button>

          <a
            href="/"
            style={{
              padding: '12px 24px',
              background: '#fff',
              color: '#000',
              border: '1px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Voltar para Página Inicial
          </a>
        </div>

        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #eee' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Se o problema persistir, entre em contato pelo telefone{' '}
            <a href="tel:+5521995354010" style={{ color: '#0066cc', textDecoration: 'underline' }}>
              (21) 99535-4010
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
