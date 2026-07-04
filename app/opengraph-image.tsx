import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'loopy · done-for-you Meta ads for brands that sell online';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// On-brand OG card: off-white paper, ink type, one electric-blue accent.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#faf8f3',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 700, color: '#1a3df0', letterSpacing: '-0.03em' }}>
          loopy
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 88, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Meta ads, <span style={{ color: '#1a3df0' }}>run for you</span>.
          </div>
          <div style={{ marginTop: 28, fontSize: 34, color: '#3a3a38', maxWidth: 920, lineHeight: 1.35 }}>
            Done-for-you Meta advertising that brings your business more paying customers.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 26, color: '#7a7771' }}>
          first month free · 30 ads on us · no card required
        </div>
      </div>
    ),
    { ...size },
  );
}
