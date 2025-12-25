import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          background: '#1E3A8A',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F8FAFC',
          fontFamily: 'serif',
          fontWeight: 700,
          borderRadius: '20%',
        }}
      >
        GP
      </div>
    ),
    {
      ...size,
    }
  )
}
