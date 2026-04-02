import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Tight Knit - Creative Visual Research'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1b0f1b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: '-0.02em' }}>
          TIGHT KNIT
        </div>
        <div style={{ fontSize: 24, marginTop: 20, opacity: 0.8 }}>
          Creative Visual Research
        </div>
      </div>
    ),
    { ...size }
  )
}
