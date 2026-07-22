import { ImageResponse } from 'next/og';

export const alt = 'Loopy · AI Meta ad generator from your URL';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// On-brand OG card: white paper, ink type, one electric-blue accent.
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
          background: '#ffffff',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 700, color: '#1c42e6', letterSpacing: '-0.03em' }}>
          loopy
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 80,
              fontWeight: 600,
              color: '#0e1116',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            <div>Paste your URL. Get Meta ads</div>
            <div style={{ color: '#1c42e6' }}>that actually look like your brand.</div>
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: '#3c414c', maxWidth: 960, lineHeight: 1.35 }}>
            Your colors, your fonts, your real product. No designer, no prompting.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 26, color: '#6b7280' }}>
          first 5 ads free on your real brand · no card
        </div>
      </div>
    ),
    { ...size },
  );
}
