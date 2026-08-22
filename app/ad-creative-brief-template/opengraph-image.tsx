import { ImageResponse } from 'next/og';

export const alt = 'Ad creative brief template for Meta ads - free, copy-paste, from Loopy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Page-specific OG card: same white-paper / ink / one-blue system as the root
// card, but the headline is the resource, not the product pitch.
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, color: '#1c42e6', letterSpacing: '-0.03em' }}>
            loopy
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              fontWeight: 600,
              color: '#1c42e6',
              background: '#eaeeff',
              border: '1px solid #cfd9ff',
              borderRadius: 999,
              padding: '8px 18px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            free template
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 76,
              fontWeight: 600,
              color: '#0e1116',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            <div>The ad creative brief template</div>
            <div style={{ color: '#1c42e6' }}>agencies actually use.</div>
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: '#3c414c', maxWidth: 980, lineHeight: 1.35 }}>
            Brand header, ranked concept blocks, KEEP/SWAP visual notes and three copy variants. Built for Meta ads.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 26, color: '#6b7280' }}>
          tryloopy.io/ad-creative-brief-template - copy-paste or download
        </div>
      </div>
    ),
    { ...size },
  );
}
