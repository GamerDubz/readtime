import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f4ecdd',
        }}
      >
        <svg width="120" height="120" viewBox="0 0 48 48">
          <path d="M 9 27 A 15 15 0 1 1 39 27" fill="none" stroke="#2a2118" strokeWidth="3" strokeLinecap="round" />
          <path d="M 24 18 L 30.5 14.5" fill="none" stroke="#2a2118" strokeWidth="3" strokeLinecap="round" />
          <path d="M 24 10.5 L 24 33" fill="none" stroke="#7a2430" strokeWidth="3" strokeLinecap="round" />
          <path d="M 24 33 C 20 28.5, 13.5 28, 7.5 30.5" fill="none" stroke="#2a2118" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 24 33 C 28 28.5, 34.5 28, 40.5 30.5" fill="none" stroke="#2a2118" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
